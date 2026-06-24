import type { Product, FreshnessStatus } from "@/lib/types";

/** 公式情報の鮮度を判定する日数しきい値（これを超えると要確認）。 */
export const FRESHNESS_THRESHOLD_DAYS = 90;

/**
 * 商材の公式情報の鮮度を返す純粋関数。
 * 明示的な freshnessStatus があればそれを優先し、無ければ officialCheckedAt が
 * しきい値（既定90日）より古いかで判定する。事実値の鮮度管理に用いる。
 */
export function freshnessOf(product: Product, todayISO: string): FreshnessStatus {
  if (product.freshnessStatus) return product.freshnessStatus;
  const checked = Date.parse(product.officialCheckedAt);
  const today = Date.parse(todayISO);
  if (Number.isNaN(checked) || Number.isNaN(today)) return "needs_review";
  const days = (today - checked) / (1000 * 60 * 60 * 24);
  return days > FRESHNESS_THRESHOLD_DAYS ? "needs_review" : "verified";
}

/** 要確認（needs_review）かどうか。 */
export function needsReview(product: Product, todayISO: string): boolean {
  return freshnessOf(product, todayISO) === "needs_review";
}
