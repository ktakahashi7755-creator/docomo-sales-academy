import type { ModuleItem, Phase, CertCondition } from "@/lib/types";

/**
 * 進捗・合否・鮮度の純粋ロジック。
 * UI から切り離し、境界値（79/80/89/90/99/100）を Vitest で検証する。
 * 採点・認定の事実判定はここに集約し、画面は結果を表示するだけにする。
 */

export type ScoreMap = Record<string, number>;

/** モジュール合否。未受講(undefined)は不合格扱い。境界は「合格点以上」で合格。 */
export function isPassed(score: number | undefined, passing: number): boolean {
  if (score == null) return false;
  return score >= passing;
}

/** ロープレ評価ランク。S:90+ / A:80+ / B:70+ / C:60+ / D:60未満。 */
export type Grade = "S" | "A" | "B" | "C" | "D";
export function gradeOf(score: number): Grade {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}

export interface ModuleWithPhase extends ModuleItem {
  phase: Phase;
}

/** 全フェーズのモジュールを phase 情報付きで平坦化。 */
export function flattenModules(phases: readonly Phase[]): ModuleWithPhase[] {
  return phases.flatMap((p) => p.modules.map((m) => ({ ...m, phase: p })));
}

export interface ProgressSummary {
  passedCount: number;
  total: number;
  /** 0–100 の整数。total=0 のときは 0。 */
  completionRate: number;
  /** 未合格で最初に出てくるモジュール（次にやるべき研修）。無ければ null。 */
  nextModule: ModuleWithPhase | null;
}

export function summarizeProgress(
  modules: readonly ModuleWithPhase[],
  progress: ScoreMap,
): ProgressSummary {
  const total = modules.length;
  const passedCount = modules.filter((m) => isPassed(progress[m.id], m.passing_score)).length;
  const completionRate = total === 0 ? 0 : Math.round((passedCount / total) * 100);
  const nextModule = modules.find((m) => !isPassed(progress[m.id], m.passing_score)) ?? null;
  return { passedCount, total, completionRate, nextModule };
}

/** 受講済みだが未達のモジュールを、低スコア順に最大 limit 件。 */
export function weakModules(
  modules: readonly ModuleWithPhase[],
  progress: ScoreMap,
  limit = 3,
): ModuleWithPhase[] {
  return modules
    .filter((m) => progress[m.id] != null && !isPassed(progress[m.id], m.passing_score))
    .sort((a, b) => (progress[a.id] ?? 0) - (progress[b.id] ?? 0))
    .slice(0, limit);
}

export interface PhaseProgress {
  passed: number;
  total: number;
  complete: boolean;
}

export function phaseProgress(phase: Phase, progress: ScoreMap): PhaseProgress {
  const total = phase.modules.length;
  const passed = phase.modules.filter((m) => isPassed(progress[m.id], m.passing_score)).length;
  return { passed, total, complete: total > 0 && passed === total };
}

/**
 * 公式情報の鮮度。確認日から threshold 日（既定90）を超えたら true（要確認）。
 * 無効な日付は安全側に倒して true（要確認）を返す。
 */
export function isStale(dateStr: string, asOf: number = Date.now(), thresholdDays = 90): boolean {
  const checked = new Date(dateStr).getTime();
  if (Number.isNaN(checked)) return true;
  const days = (asOf - checked) / (1000 * 60 * 60 * 24);
  return days > thresholdDays;
}

/**
 * 認定条件の達成判定（純粋関数）。
 * デモ段階で確実に導出できる条件のみ判定し、ロープレ評価系（c2,c4–c9）は
 * Phase 4/5 で評価が蓄積されるまで未達(false)とする。事実を捏造しない。
 */
export interface CertContext {
  modules: readonly ModuleItem[];
  progress: ScoreMap;
  level: number;
}

export function isCertConditionDone(id: string, ctx: CertContext): boolean {
  const { modules, progress, level } = ctx;
  switch (id) {
    case "c1": {
      // 全必須モジュール合格
      const required = modules.filter((m) => m.required);
      return (
        required.length > 0 && required.every((m) => isPassed(progress[m.id], m.passing_score))
      );
    }
    case "c3": {
      // コンプライアンステスト100点（合格点100のモジュール全合格）
      const compliance = modules.filter((m) => m.passing_score === 100);
      return (
        compliance.length > 0 && compliance.every((m) => isPassed(progress[m.id], m.passing_score))
      );
    }
    case "c10":
      // SV承認 = 認定クローザー(Lv.10)到達
      return level >= 10;
    default:
      // ロープレ評価系は未追跡（Phase 4/5）。推測で達成にしない。
      return false;
  }
}

export interface CertConditionStatus extends CertCondition {
  done: boolean;
}

export interface CertSummary {
  conditions: CertConditionStatus[];
  doneCount: number;
  total: number;
  /** 0–100 の整数。 */
  rate: number;
}

export function evaluateCertConditions(
  conditions: readonly CertCondition[],
  ctx: CertContext,
): CertSummary {
  const evaluated = conditions.map((c) => ({ ...c, done: isCertConditionDone(c.id, ctx) }));
  const doneCount = evaluated.filter((c) => c.done).length;
  const total = evaluated.length;
  const rate = total === 0 ? 0 : Math.round((doneCount / total) * 100);
  return { conditions: evaluated, doneCount, total, rate };
}

/**
 * バッジ獲得判定。デモで確実に導出できるもののみ点灯し、ロープレ評価系は
 * Phase 4/5 で評価が蓄積されるまで未獲得（捏造しない）。
 */
export function isBadgeEarned(id: string, ctx: Pick<CertContext, "modules" | "progress">): boolean {
  switch (id) {
    case "b-first":
      // 最初のモジュール合格
      return ctx.modules.some((m) => isPassed(ctx.progress[m.id], m.passing_score));
    default:
      return false;
  }
}
