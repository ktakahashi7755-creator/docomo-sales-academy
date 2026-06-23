import { Link } from "react-router-dom";
import { useContent } from "@/context/ContentContext";
import { Card, PageTitle, TierBadge } from "@/components/ui";
import { isStale } from "@/lib/progress";
import { AlertTriangle, Pencil } from "lucide-react";

export function AdminProducts() {
  const { products } = useContent();

  return (
    <div className="space-y-6">
      <PageTitle
        title="商材の管理"
        description="料金・還元・補償は公式ページを正として更新し、確認日を記録します。"
      />

      <Card>
        <ul className="divide-y divide-paper-line">
          {products.map((p) => {
            const stale = isStale(p.officialCheckedAt);
            return (
              <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-ink">{p.name}</span>
                    <TierBadge tier={p.tier} />
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-muted">
                    <span>{p.category}</span>
                    <span>・</span>
                    <span className="font-num">v{p.version}</span>
                    <span>・</span>
                    {stale ? (
                      <span className="inline-flex items-center gap-1 text-caution-deep">
                        <AlertTriangle size={12} /> 確認日 {p.officialCheckedAt}（要確認）
                      </span>
                    ) : (
                      <span>確認日 {p.officialCheckedAt}</span>
                    )}
                  </div>
                </div>
                <Link
                  to={`/admin/products/${p.id}`}
                  className="inline-flex min-h-[44px] shrink-0 items-center gap-1 rounded-lg border border-paper-line px-3 text-sm font-medium text-ink hover:bg-paper-soft"
                >
                  <Pencil size={14} /> 編集
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
