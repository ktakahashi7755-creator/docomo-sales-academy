import { describe, it, expect } from "vitest";
import { ALL_LESSONS, QUIZ_MODULES, quizModuleMeta } from "@/growth/data/curriculum";
import { quizForModule } from "@/data/quiz";

describe("カリキュラムとテストのカバレッジ", () => {
  it("全レッスンに確認テスト(quizModuleId)が紐づく", () => {
    const missing = ALL_LESSONS.filter((l) => !l.quizModuleId).map((l) => l.id);
    expect(missing).toEqual([]);
  });

  it("各レッスンの quizModuleId は実在モジュールで、3問以上ある", () => {
    for (const l of ALL_LESSONS) {
      if (!l.quizModuleId) continue;
      const meta = quizModuleMeta(l.quizModuleId);
      expect(meta, `${l.id} の ${l.quizModuleId} はモジュール定義が必要`).toBeDefined();
      const qs = quizForModule(l.quizModuleId);
      expect(qs.length, `${l.quizModuleId} は3問以上`).toBeGreaterThanOrEqual(3);
    }
  });

  it("全 QUIZ_MODULES に設問が存在する", () => {
    for (const m of QUIZ_MODULES) {
      expect(quizForModule(m.moduleId).length, `${m.moduleId} に設問が必要`).toBeGreaterThan(0);
    }
  });

  it("コンプライアンスモジュール(p1m4)は合格点100", () => {
    expect(quizModuleMeta("p1m4")?.passing).toBe(100);
  });
});
