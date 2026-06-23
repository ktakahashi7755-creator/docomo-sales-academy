import { describe, it, expect } from "vitest";
import {
  diffProduct,
  applyProductEdit,
  summarizeChange,
  upsertAnnouncement,
  removeAnnouncement,
  activeAnnouncement,
} from "@/lib/content";
import type { Product, Announcement } from "@/lib/types";

const base: Product = {
  id: "p1",
  name: "dカード GOLD",
  category: "dカード",
  tier: "gold",
  oneLiner: "年間約18,600円相当の還元",
  target: "ドコモ利用者",
  benefits: ["割引約6,600円", "ポイント約12,000P"],
  warnings: ["年会費11,000円"],
  timing: "料金確認後",
  hearing: ["毎月のドコモ料金は？"],
  pitch: ["割引とポイントで実質プラス"],
  objections: [{ q: "年会費が高い", a: "実質プラスになります" }],
  closing: "本日お作りできます",
  officialUrl: "https://example.com/gold",
  officialCheckedAt: "2024-06-01",
  version: 1,
};

const ctx = {
  changedBy: "管理者 デモ",
  reason: "料金改定",
  now: "2026-06-23 10:00",
  versionId: "v-1",
};

describe("diffProduct", () => {
  it("変更が無ければ fields は空", () => {
    expect(diffProduct(base, base).fields).toEqual([]);
  });
  it("スカラ変更を検出", () => {
    const after = { ...base, oneLiner: "新しい説明" };
    const d = diffProduct(base, after);
    expect(d.fields).toEqual(["oneLiner"]);
    expect(d.before.oneLiner).toBe(base.oneLiner);
    expect(d.after.oneLiner).toBe("新しい説明");
  });
  it("配列は要素比較（同内容は差分なし、内容変更は検出）", () => {
    expect(diffProduct(base, { ...base, benefits: [...base.benefits] }).fields).toEqual([]);
    const d = diffProduct(base, { ...base, benefits: ["割引約6,600円", "ポイント約15,000P"] });
    expect(d.fields).toEqual(["benefits"]);
  });
  it("非編集フィールド（objections/version）は差分対象外", () => {
    const after = { ...base, version: 9, objections: [] };
    expect(diffProduct(base, after).fields).toEqual([]);
  });
});

describe("applyProductEdit", () => {
  it("差分が無ければ null（版を作らない）", () => {
    expect(applyProductEdit(base, base, ctx)).toBeNull();
  });
  it("version をインクリメントし確認日を更新、版を記録", () => {
    const after = { ...base, oneLiner: "改定後の説明" };
    const res = applyProductEdit(base, after, ctx);
    expect(res).not.toBeNull();
    expect(res!.product.version).toBe(2);
    expect(res!.product.officialCheckedAt).toBe("2026-06-23");
    expect(res!.product.oneLiner).toBe("改定後の説明");
    expect(res!.version.before.oneLiner).toBe(base.oneLiner);
    expect(res!.version.after.oneLiner).toBe("改定後の説明");
    expect(res!.version.changedBy).toBe("管理者 デモ");
    expect(res!.version.reason).toBe("料金改定");
  });
  it("正典値を勝手に変えない（管理者入力をそのまま保存）", () => {
    const after = { ...base, benefits: ["割引約6,600円", "ポイント約12,000P", "追加特典"] };
    const res = applyProductEdit(base, after, ctx);
    expect(res!.product.benefits).toEqual(["割引約6,600円", "ポイント約12,000P", "追加特典"]);
  });
});

describe("summarizeChange", () => {
  it("ラベルを中黒で連結", () => {
    expect(summarizeChange(["name", "benefits"])).toBe("商材名・メリット");
  });
});

describe("announcements helpers", () => {
  const a1: Announcement = {
    id: "a1",
    title: "T1",
    body: "B1",
    severity: "info",
    isActive: true,
    updatedAt: "2026-06-01",
  };
  it("upsert: 無ければ先頭追加", () => {
    expect(upsertAnnouncement([], a1)).toEqual([a1]);
  });
  it("upsert: あれば置換（順序維持）", () => {
    const updated = { ...a1, title: "T1改" };
    expect(upsertAnnouncement([a1], updated)).toEqual([updated]);
  });
  it("remove: id 一致を除去", () => {
    expect(removeAnnouncement([a1], "a1")).toEqual([]);
  });
  it("activeAnnouncement: 有効な最初の1件、無ければ null", () => {
    expect(activeAnnouncement([{ ...a1, isActive: false }])).toBeNull();
    expect(activeAnnouncement([a1])).toEqual(a1);
  });
  it("activeAnnouncement: 複数有効でも先頭の1件のみ返す", () => {
    const a2: Announcement = { ...a1, id: "a2", title: "T2" };
    expect(activeAnnouncement([a1, a2])).toEqual(a1);
    expect(activeAnnouncement([{ ...a1, isActive: false }, a2])).toEqual(a2);
  });
});
