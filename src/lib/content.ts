import type { Product, ProductVersion, Announcement } from "@/lib/types";

/**
 * 管理画面のコンテンツ編集ロジック（純粋関数）。
 * 商材編集時に差分を取り、版（product_version）を作る。事実値は管理者が入力した値を
 * そのまま保存し、捏造しない。official_checked_at は「確認した日」として保存時に更新する。
 */

export const EDITABLE_PRODUCT_FIELDS = [
  "name",
  "oneLiner",
  "target",
  "timing",
  "closing",
  "officialUrl",
  "benefits",
  "warnings",
  "hearing",
  "pitch",
] as const;
export type EditableProductField = (typeof EDITABLE_PRODUCT_FIELDS)[number];

export const FIELD_LABELS: Record<EditableProductField, string> = {
  name: "商材名",
  oneLiner: "ひとこと説明",
  target: "対象顧客",
  timing: "提案タイミング",
  closing: "クロージング例",
  officialUrl: "公式URL",
  benefits: "メリット",
  warnings: "注意点",
  hearing: "ヒアリング",
  pitch: "訴求ポイント",
};

function valuesEqual(x: unknown, y: unknown): boolean {
  if (Array.isArray(x) && Array.isArray(y)) {
    return x.length === y.length && x.every((v, i) => v === y[i]);
  }
  return x === y;
}

function copyField<K extends EditableProductField>(
  src: Product,
  dst: Partial<Product>,
  f: K,
): void {
  dst[f] = src[f];
}

export interface ProductDiff {
  before: Partial<Product>;
  after: Partial<Product>;
  fields: EditableProductField[];
}

/** 編集可能フィールドの差分のみを抽出する（配列は要素比較）。 */
export function diffProduct(before: Product, after: Product): ProductDiff {
  const b: Partial<Product> = {};
  const a: Partial<Product> = {};
  const fields: EditableProductField[] = [];
  for (const f of EDITABLE_PRODUCT_FIELDS) {
    if (!valuesEqual(before[f], after[f])) {
      copyField(before, b, f);
      copyField(after, a, f);
      fields.push(f);
    }
  }
  return { before: b, after: a, fields };
}

/** 変更フィールドを日本語ラベルの一覧文にする。 */
export function summarizeChange(fields: EditableProductField[]): string {
  return fields.map((f) => FIELD_LABELS[f]).join("・");
}

export interface EditContext {
  changedBy: string;
  reason: string;
  now: string; // "YYYY-MM-DD HH:mm"
  versionId: string;
}

export interface ProductEditResult {
  product: Product;
  version: ProductVersion;
  fields: EditableProductField[];
}

/**
 * 商材編集を適用する。差分が無ければ null（版を作らない）。
 * version をインクリメントし、official_checked_at を「確認日」として now の日付に更新する。
 */
export function applyProductEdit(
  before: Product,
  after: Product,
  ctx: EditContext,
): ProductEditResult | null {
  const diff = diffProduct(before, after);
  if (diff.fields.length === 0) return null;
  const version = before.version + 1;
  const product: Product = {
    ...after,
    version,
    officialCheckedAt: ctx.now.slice(0, 10),
  };
  const pv: ProductVersion = {
    id: ctx.versionId,
    productId: before.id,
    version,
    before: diff.before,
    after: diff.after,
    changedBy: ctx.changedBy,
    reason: ctx.reason,
    createdAt: ctx.now,
  };
  return { product, version: pv, fields: diff.fields };
}

/** お知らせの追加/更新（id 一致で置換、無ければ先頭に追加）。非破壊。 */
export function upsertAnnouncement(list: Announcement[], item: Announcement): Announcement[] {
  const exists = list.some((a) => a.id === item.id);
  return exists ? list.map((a) => (a.id === item.id ? item : a)) : [item, ...list];
}

export function removeAnnouncement(list: Announcement[], id: string): Announcement[] {
  return list.filter((a) => a.id !== id);
}

/** 学習者に出す「現在有効な最新のお知らせ」。無ければ null。 */
export function activeAnnouncement(list: Announcement[]): Announcement | null {
  return list.find((a) => a.isActive) ?? null;
}
