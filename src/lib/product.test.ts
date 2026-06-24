import { describe, it, expect } from "vitest";
import { freshnessOf, needsReview } from "@/lib/product";
import type { Product } from "@/lib/types";

function makeProduct(overrides: Partial<Product>): Product {
  return {
    id: "p",
    name: "テスト商材",
    category: "料金プラン",
    oneLiner: "",
    target: "",
    benefits: [],
    warnings: [],
    timing: "",
    hearing: [],
    pitch: [],
    objections: [],
    closing: "",
    officialUrl: "https://example.com",
    officialCheckedAt: "2026-01-01",
    version: 1,
    ...overrides,
  };
}

describe("freshnessOf（鮮度判定・境界値）", () => {
  const today = "2026-04-01"; // 2026-01-01 から 90日

  it("明示的な freshnessStatus を最優先する", () => {
    const p = makeProduct({ officialCheckedAt: today, freshnessStatus: "needs_review" });
    expect(freshnessOf(p, today)).toBe("needs_review");
  });

  it("89日（しきい値未満）は verified", () => {
    // 2026-01-01 + 89日 = 2026-03-31
    expect(freshnessOf(makeProduct({}), "2026-03-31")).toBe("verified");
  });

  it("90日ちょうどは verified（90日超で要確認）", () => {
    expect(freshnessOf(makeProduct({}), "2026-04-01")).toBe("verified");
  });

  it("91日（しきい値超）は needs_review", () => {
    expect(freshnessOf(makeProduct({}), "2026-04-02")).toBe("needs_review");
  });

  it("不正な日付は needs_review（安全側に倒す）", () => {
    expect(freshnessOf(makeProduct({ officialCheckedAt: "不明" }), today)).toBe("needs_review");
  });

  it("needsReview は needs_review のとき true", () => {
    expect(needsReview(makeProduct({}), "2026-04-02")).toBe(true);
    expect(needsReview(makeProduct({}), "2026-03-31")).toBe(false);
  });
});
