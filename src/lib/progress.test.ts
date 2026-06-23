import { describe, it, expect } from "vitest";
import {
  isPassed,
  gradeOf,
  flattenModules,
  summarizeProgress,
  weakModules,
  phaseProgress,
  isStale,
  isCertConditionDone,
  evaluateCertConditions,
  type ScoreMap,
} from "@/lib/progress";
import type { ModuleItem, Phase, CertCondition } from "@/lib/types";

const mod = (id: string, passing: number, required = true): ModuleItem => ({
  id,
  title: id,
  passing_score: passing,
  required,
  estimated_minutes: 10,
});

describe("isPassed — 境界値", () => {
  // 通常80
  it("79は不合格、80は合格", () => {
    expect(isPassed(79, 80)).toBe(false);
    expect(isPassed(80, 80)).toBe(true);
  });
  // 重要90
  it("89は不合格、90は合格", () => {
    expect(isPassed(89, 90)).toBe(false);
    expect(isPassed(90, 90)).toBe(true);
  });
  // コンプラ100
  it("99は不合格、100は合格", () => {
    expect(isPassed(99, 100)).toBe(false);
    expect(isPassed(100, 100)).toBe(true);
  });
  it("未受講(undefined)は不合格", () => {
    expect(isPassed(undefined, 80)).toBe(false);
  });
  it("0点でも合格点0なら合格", () => {
    expect(isPassed(0, 0)).toBe(true);
  });
  it("負数スコアは不合格（異常系）", () => {
    expect(isPassed(-1, 0)).toBe(false);
  });
});

describe("gradeOf — 評価ランク境界", () => {
  it.each([
    [100, "S"],
    [90, "S"],
    [89, "A"],
    [80, "A"],
    [79, "B"],
    [70, "B"],
    [69, "C"],
    [60, "C"],
    [59, "D"],
    [0, "D"],
  ])("score %i → %s", (score, grade) => {
    expect(gradeOf(score)).toBe(grade);
  });
});

describe("summarizeProgress", () => {
  const phases: Phase[] = [
    { id: "p1", no: 1, title: "P1", summary: "", modules: [mod("a", 80), mod("b", 90)] },
    { id: "p2", no: 2, title: "P2", summary: "", modules: [mod("c", 100)] },
  ];
  const modules = flattenModules(phases);

  it("全未受講なら 0% / next は先頭", () => {
    const s = summarizeProgress(modules, {});
    expect(s.passedCount).toBe(0);
    expect(s.completionRate).toBe(0);
    expect(s.nextModule?.id).toBe("a");
  });

  it("一部合格で四捨五入され、next は最初の未合格", () => {
    const progress: ScoreMap = { a: 80, b: 89 }; // a合格, b未達(90), c未受講
    const s = summarizeProgress(modules, progress);
    expect(s.passedCount).toBe(1);
    expect(s.completionRate).toBe(33); // 1/3 = 33.33 → 33
    expect(s.nextModule?.id).toBe("b");
  });

  it("全合格なら 100% / next は null", () => {
    const s = summarizeProgress(modules, { a: 80, b: 90, c: 100 });
    expect(s.completionRate).toBe(100);
    expect(s.nextModule).toBeNull();
  });

  it("モジュール0件でも落ちない", () => {
    expect(summarizeProgress([], {})).toEqual({
      passedCount: 0,
      total: 0,
      completionRate: 0,
      nextModule: null,
    });
  });
});

describe("weakModules", () => {
  const phases: Phase[] = [
    {
      id: "p1",
      no: 1,
      title: "P1",
      summary: "",
      modules: [mod("a", 80), mod("b", 80), mod("c", 80), mod("d", 80)],
    },
  ];
  const modules = flattenModules(phases);

  it("受講済みかつ未達のみを低スコア順に最大3件", () => {
    const progress: ScoreMap = { a: 70, b: 50, c: 60, d: 95 }; // d合格, 未受講なし
    const weak = weakModules(modules, progress);
    expect(weak.map((m) => m.id)).toEqual(["b", "c", "a"]);
  });

  it("未受講(undefined)は苦手に含めない", () => {
    const weak = weakModules(modules, { a: 70 });
    expect(weak.map((m) => m.id)).toEqual(["a"]);
  });

  it("limit=0 は空配列（境界）", () => {
    expect(weakModules(modules, { a: 70, b: 50 }, 0)).toEqual([]);
  });
});

describe("phaseProgress", () => {
  const phase: Phase = {
    id: "p1",
    no: 1,
    title: "P1",
    summary: "",
    modules: [mod("a", 80), mod("b", 90)],
  };
  it("全合格で complete=true", () => {
    expect(phaseProgress(phase, { a: 80, b: 90 })).toEqual({ passed: 2, total: 2, complete: true });
  });
  it("一部のみで complete=false", () => {
    expect(phaseProgress(phase, { a: 80 })).toEqual({ passed: 1, total: 2, complete: false });
  });
  it("モジュール0件のフェーズは complete=false（境界）", () => {
    const empty: Phase = { id: "p0", no: 0, title: "P0", summary: "", modules: [] };
    expect(phaseProgress(empty, {})).toEqual({ passed: 0, total: 0, complete: false });
  });
});

describe("isStale — 鮮度", () => {
  const asOf = new Date("2026-06-23").getTime();
  it("90日ちょうどは stale でない", () => {
    const d = new Date("2026-03-25").getTime(); // 90日前
    expect(isStale(new Date(d).toISOString(), asOf)).toBe(false);
  });
  it("91日前は stale", () => {
    const d = new Date("2026-03-24").getTime();
    expect(isStale(new Date(d).toISOString(), asOf)).toBe(true);
  });
  it("無効な日付は安全側に倒して stale", () => {
    expect(isStale("not-a-date", asOf)).toBe(true);
  });
});

describe("認定条件の導出", () => {
  const modules: ModuleItem[] = [
    mod("r1", 80, true),
    mod("r2", 90, true),
    mod("opt", 80, false),
    mod("compliance", 100, true),
  ];

  it("c1: 必須が全合格なら done（任意の未達は無関係）", () => {
    const progress: ScoreMap = { r1: 80, r2: 90, compliance: 100 };
    expect(isCertConditionDone("c1", { modules, progress, level: 3 })).toBe(true);
  });
  it("c1: 必須に1つでも未達があれば false", () => {
    expect(isCertConditionDone("c1", { modules, progress: { r1: 80 }, level: 3 })).toBe(false);
  });
  it("c1: 必須モジュールが0件なら false（空配列境界・安全側）", () => {
    const noRequired: ModuleItem[] = [mod("opt", 80, false)];
    expect(
      isCertConditionDone("c1", { modules: noRequired, progress: { opt: 80 }, level: 3 }),
    ).toBe(false);
  });
  it("c3: 合格点100のモジュールが0件なら false（空配列境界・安全側）", () => {
    const noCompliance: ModuleItem[] = [mod("r1", 80, true)];
    expect(
      isCertConditionDone("c3", { modules: noCompliance, progress: { r1: 80 }, level: 3 }),
    ).toBe(false);
  });
  it("c3: 合格点100のモジュールが合格なら done", () => {
    expect(isCertConditionDone("c3", { modules, progress: { compliance: 100 }, level: 0 })).toBe(
      true,
    );
    expect(isCertConditionDone("c3", { modules, progress: { compliance: 99 }, level: 0 })).toBe(
      false,
    );
  });
  it("c10: Lv.10で done", () => {
    expect(isCertConditionDone("c10", { modules, progress: {}, level: 10 })).toBe(true);
    expect(isCertConditionDone("c10", { modules, progress: {}, level: 9 })).toBe(false);
  });
  it("ロープレ評価系(c4)は未追跡なので推測で達成にしない", () => {
    expect(isCertConditionDone("c4", { modules, progress: {}, level: 10 })).toBe(false);
  });

  it("evaluateCertConditions: 集計と率", () => {
    const conditions: CertCondition[] = [
      { id: "c1", label: "必須" },
      { id: "c10", label: "SV承認" },
      { id: "c4", label: "ロープレ" },
    ];
    const summary = evaluateCertConditions(conditions, {
      modules,
      progress: { r1: 80, r2: 90, compliance: 100 },
      level: 10,
    });
    expect(summary.doneCount).toBe(2); // c1, c10
    expect(summary.total).toBe(3);
    expect(summary.rate).toBe(67); // 2/3 = 66.6 → 67
    expect(summary.conditions.find((c) => c.id === "c4")?.done).toBe(false);
  });
});
