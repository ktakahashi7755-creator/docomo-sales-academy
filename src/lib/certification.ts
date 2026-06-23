import type { CertCondition } from "@/lib/types";
import { evaluateCertConditions, type CertConditionStatus, type CertContext } from "@/lib/progress";

/**
 * クローザー認定の判定（純粋ロジック）。
 *
 * 方針：進捗から客観的に導出できる条件は自動判定し、ロープレ評価の蓄積が前提の条件は
 * 推測で達成にしない（ADR-0006）。最終的な Lv.10 認定は **SV 承認（人手）** で確定する。
 * 自動判定は SV の意思決定を支える材料であり、承認可否のゲートは下記の必須条件に限る。
 */

/** SV 承認の前提となる、進捗から客観的に導出できる必須条件（全必須合格・コンプラ100）。 */
export const REQUIRED_AUTO_CONDITION_IDS = ["c1", "c3"] as const;

/** 進捗から自動で達成判定できる条件。c10（SV承認）は人手のため含めない。 */
export const AUTO_TRACKED_CONDITION_IDS = ["c1", "c3"] as const;

export interface CertReadiness {
  conditions: CertConditionStatus[];
  /** 自動判定で達成済みの条件数（c10=SV承認は人手のため除外）。 */
  autoDone: number;
  autoTotal: number;
  /** 必須条件（c1/c3）を満たし、SV が承認できる状態か。 */
  eligible: boolean;
  /** 既に認定（Lv.10）済みか。 */
  approved: boolean;
}

export function certificationReadiness(
  conditions: readonly CertCondition[],
  ctx: CertContext,
): CertReadiness {
  const { conditions: evaluated } = evaluateCertConditions(conditions, ctx);
  const auto = evaluated.filter((c) => c.id !== "c10");
  const autoDone = auto.filter((c) => c.done).length;
  const required = evaluated.filter((c) =>
    (REQUIRED_AUTO_CONDITION_IDS as readonly string[]).includes(c.id),
  );
  const eligible = required.length > 0 && required.every((c) => c.done);
  const approved = ctx.level >= 10;
  return { conditions: evaluated, autoDone, autoTotal: auto.length, eligible, approved };
}

/** SV が承認できるか（必須条件を満たし、まだ未認定）。 */
export function canApprove(readiness: CertReadiness): boolean {
  return readiness.eligible && !readiness.approved;
}

/** その条件が進捗から自動判定される対象か（c1/c3）。 */
export function isAutoTracked(conditionId: string): boolean {
  return (AUTO_TRACKED_CONDITION_IDS as readonly string[]).includes(conditionId);
}

/** ロープレ評価の蓄積待ちで、現状は SV の判断に委ねる条件か（自動判定でも SV承認 c10 でもない）。 */
export function isPendingEvaluation(conditionId: string): boolean {
  return !isAutoTracked(conditionId) && conditionId !== "c10";
}
