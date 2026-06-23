import { describe, it, expect } from "vitest";
import {
  certificationReadiness,
  canApprove,
  isAutoTracked,
  isPendingEvaluation,
  REQUIRED_AUTO_CONDITION_IDS,
} from "@/lib/certification";
import { flattenModules } from "@/lib/progress";
import { CERT_CONDITIONS, PHASES } from "@/data/seed";
import type { ScoreMap } from "@/lib/progress";

const MODULES = flattenModules(PHASES);

/** 必須モジュールを全合格にした進捗（c1/c3 を満たす）。 */
function allRequiredPassed(): ScoreMap {
  const m: ScoreMap = {};
  for (const mod of MODULES) if (mod.required) m[mod.id] = mod.passing_score;
  return m;
}

describe("certificationReadiness", () => {
  it("全必須合格・コンプラ100で eligible（未認定なら承認可能）", () => {
    const r = certificationReadiness(CERT_CONDITIONS, {
      modules: MODULES,
      progress: allRequiredPassed(),
      level: 9,
    });
    expect(r.eligible).toBe(true);
    expect(r.approved).toBe(false);
    expect(canApprove(r)).toBe(true);
  });

  it("進捗が空なら eligible=false・承認不可", () => {
    const r = certificationReadiness(CERT_CONDITIONS, {
      modules: MODULES,
      progress: {},
      level: 1,
    });
    expect(r.eligible).toBe(false);
    expect(canApprove(r)).toBe(false);
  });

  it("コンプラ未達（p1m4 が99点）だと eligible=false（境界 99/100）", () => {
    const progress = allRequiredPassed();
    progress.p1m4 = 99; // 合格点100に1点足りない
    const r = certificationReadiness(CERT_CONDITIONS, {
      modules: MODULES,
      progress,
      level: 9,
    });
    expect(r.eligible).toBe(false);
  });

  it("コンプラ以外の必須が1つでも未達なら eligible=false（c1 が必須）", () => {
    const progress = allRequiredPassed();
    delete progress.p2m1; // コンプラ(p1m4)は満点のまま、別の必須を1つ落とす
    const r = certificationReadiness(CERT_CONDITIONS, {
      modules: MODULES,
      progress,
      level: 9,
    });
    expect(r.eligible).toBe(false);
  });

  it("Lv.10 は approved=true・承認不可（二重承認しない）", () => {
    const r = certificationReadiness(CERT_CONDITIONS, {
      modules: MODULES,
      progress: allRequiredPassed(),
      level: 10,
    });
    expect(r.approved).toBe(true);
    expect(canApprove(r)).toBe(false);
  });

  it("自動判定カウントは c10（SV承認）を除外する", () => {
    const r = certificationReadiness(CERT_CONDITIONS, {
      modules: MODULES,
      progress: allRequiredPassed(),
      level: 9,
    });
    expect(r.autoTotal).toBe(CERT_CONDITIONS.length - 1);
    expect(r.autoDone).toBeGreaterThanOrEqual(REQUIRED_AUTO_CONDITION_IDS.length);
  });
});

describe("isAutoTracked / isPendingEvaluation", () => {
  it("自動判定は c1/c3 のみ。c10（SV承認）は自動判定でない", () => {
    expect(isAutoTracked("c1")).toBe(true);
    expect(isAutoTracked("c3")).toBe(true);
    expect(isAutoTracked("c10")).toBe(false);
    expect(isAutoTracked("c4")).toBe(false);
  });
  it("評価蓄積待ちはロープレ系（c2/c4..c9）。c1/c3/c10 は対象外", () => {
    expect(isPendingEvaluation("c4")).toBe(true);
    expect(isPendingEvaluation("c7")).toBe(true);
    expect(isPendingEvaluation("c2")).toBe(true);
    expect(isPendingEvaluation("c1")).toBe(false);
    expect(isPendingEvaluation("c3")).toBe(false);
    expect(isPendingEvaluation("c10")).toBe(false);
  });
});
