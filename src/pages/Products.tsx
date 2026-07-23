import { Link } from "react-router-dom";
import { PRODUCTS } from "@/data/seed";
import { Card, TierBadge } from "@/components/ui";
import { ExternalLink, AlertTriangle, ChevronRight } from "lucide-react";
import type { ProductCategory } from "@/lib/types";

const ORDER: ProductCategory[] = ["dカード", "料金プラン", "ドコモ光", "ドコモでんき", "ドコモガス", "他社比較"];

function isStale(dateStr: string) {
  const checked = new Date(dateStr).getTime();
  const days = (Date.now() - checked) / (1000 * 60 * 60 * 24);
  return days > 90; // 90日超で「公式情報確認」を促す
}

export function Products() {
  const byCat = ORDER.map((cat) => ({ cat, items: PRODUCTS.filter((p) => p.category === cat) })).filter((g) => g.items.length);

  return (
    <div className="space-y-6">
      <div>
        <div className="font-num text-xs font-semibold uppercase tracking-widest text-ink-muted">Products</div>
        <h1 className="text-2xl font-bold text-ink">商材ナレッジ</h1>
        <p className="mt-1 text-sm text-ink-muted">公式サイトの内容を正とし、料金・条件は管理画面から更新します。</p>
      </div>

      {byCat.map(({ cat, items }) => (
        <section key={cat}>
          <h2 className="mb-3 text-sm font-bold text-ink-soft">{cat}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((p) => (
              <Card key={p.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-ink">{p.name}</h3>
                      <TierBadge tier={p.tier} />
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">{p.oneLiner}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <a
                      href={p.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-ink-muted hover:text-ink"
                    >
                      公式ページ <ExternalLink size={12} />
                    </a>
                    <span className="text-ink-muted">·</span>
                    <span className={isStale(p.officialCheckedAt) ? "inline-flex items-center gap-1 text-caution" : "text-ink-muted"}>
                      {isStale(p.officialCheckedAt) && <AlertTriangle size={12} />}
                      確認日 {p.officialCheckedAt}
                    </span>
                  </div>
                  <Link to={`/products/${p.id}`} className="inline-flex items-center gap-0.5 text-sm font-medium text-ink">
                    詳細 <ChevronRight size={16} />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
