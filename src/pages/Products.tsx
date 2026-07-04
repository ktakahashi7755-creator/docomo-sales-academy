import { Link } from "react-router-dom";
import { PRODUCTS } from "@/data/seed";
import { Card, PageHeader, TierBadge } from "@/components/ui";
import { ExternalLink, AlertTriangle, ChevronRight } from "lucide-react";
import type { ProductCategory } from "@/lib/types";

const ORDER: ProductCategory[] = ["dカード", "料金プラン", "ドコモ光", "ドコモでんき", "ドコモガス", "他社比較"];

function isStale(dateStr: string) {
  const checked = new Date(dateStr).getTime();
  const days = (Date.now() - checked) / (1000 * 60 * 60 * 24);
  return days > 90; // 90日超で「公式情報確認」を促す
}

export function Products() {
  const byCat = ORDER.map((cat) => ({ cat, items: PRODUCTS.filter((p) => p.category === cat) })).filter(
    (g) => g.items.length,
  );

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Products"
        title="商材ナレッジ"
        description="公式サイトの内容を正とし、料金・条件は管理画面から更新します。確認日が90日を超えた商材は警告が表示されます。"
      />

      {byCat.map(({ cat, items }) => (
        <section key={cat}>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-soft">
            <span className="inline-block h-3.5 w-1 rounded-full bg-accent" aria-hidden />
            {cat}
          </h2>
          <div className="stagger grid gap-3 md:grid-cols-2">
            {items.map((p) => (
              <Card key={p.id} className="flex flex-col p-5 transition-shadow hover:shadow-lift">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-ink">{p.name}</h3>
                  <TierBadge tier={p.tier} />
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{p.oneLiner}</p>
                <div className="mt-auto flex items-center justify-between pt-3.5">
                  <div className="flex items-center gap-2 text-xs">
                    <a
                      href={p.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-ink-muted transition-colors hover:text-ink"
                    >
                      公式ページ <ExternalLink size={12} />
                    </a>
                    <span className="text-ink-muted">·</span>
                    <span
                      className={
                        isStale(p.officialCheckedAt)
                          ? "inline-flex items-center gap-1 font-medium text-caution"
                          : "text-ink-muted"
                      }
                    >
                      {isStale(p.officialCheckedAt) && <AlertTriangle size={12} />}
                      確認日 {p.officialCheckedAt}
                    </span>
                  </div>
                  <Link
                    to={`/products/${p.id}`}
                    className="group inline-flex items-center gap-0.5 text-sm font-semibold text-ink"
                  >
                    詳細 <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
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
