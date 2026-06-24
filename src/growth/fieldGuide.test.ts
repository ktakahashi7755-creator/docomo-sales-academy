import { describe, it, expect } from "vitest";
import { SALES_PROCESS } from "@/growth/data/salesProcess";
import { SCENES } from "@/growth/data/scenes";
import { HEARING_ITEMS } from "@/growth/data/hearingItems";
import { OBJECTIONS } from "@/growth/data/objections";
import { EVALUATION_RUBRIC, GROWTH_STAGES } from "@/growth/data/rubric";

function unique<T>(arr: T[]): boolean {
  return new Set(arr).size === arr.length;
}

describe("現場ガイドのデータ整合", () => {
  it("販売プロセスは15工程・no が1..15で一意・連番", () => {
    expect(SALES_PROCESS).toHaveLength(15);
    expect(unique(SALES_PROCESS.map((s) => s.no))).toBe(true);
    SALES_PROCESS.forEach((s, i) => expect(s.no).toBe(i + 1));
  });

  it("各データの id が一意", () => {
    expect(unique(SCENES.map((s) => s.id))).toBe(true);
    expect(unique(HEARING_ITEMS.map((h) => h.id))).toBe(true);
    expect(unique(OBJECTIONS.map((o) => o.id))).toBe(true);
  });

  it("件数が想定どおり", () => {
    expect(SCENES).toHaveLength(15);
    expect(HEARING_ITEMS).toHaveLength(19);
    expect(OBJECTIONS).toHaveLength(17);
    expect(EVALUATION_RUBRIC).toHaveLength(12);
    expect(GROWTH_STAGES).toHaveLength(10);
  });

  it("ルーブリック・育成段階の必須フィールドが空でない", () => {
    EVALUATION_RUBRIC.forEach((r) => {
      expect(r.criterion).not.toBe("");
      expect(r.lookFor).not.toBe("");
      expect(r.redFlag).not.toBe("");
    });
    GROWTH_STAGES.forEach((g) => {
      expect(g.stage).not.toBe("");
      expect(g.passCondition).not.toBe("");
    });
  });

  it("必須フィールドが空でない", () => {
    SALES_PROCESS.forEach((s) => {
      expect(s.name).not.toBe("");
      expect(s.purpose).not.toBe("");
      expect(s.staffAction).not.toBe("");
    });
    SCENES.forEach((s) => {
      expect(s.scene).not.toBe("");
      expect(s.script.length).toBeGreaterThan(0);
    });
    OBJECTIONS.forEach((o) => {
      expect(o.objection).not.toBe("");
      expect(o.goodResponse).not.toBe("");
    });
  });

  it("反論カードの id は seed と衝突しない名前空間（fg-obj-）", () => {
    OBJECTIONS.forEach((o) => expect(o.id.startsWith("fg-obj-")).toBe(true));
  });
});
