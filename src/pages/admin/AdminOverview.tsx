import { Link } from "react-router-dom";
import { useContent } from "@/context/ContentContext";
import { Card, PageTitle } from "@/components/ui";
import { isStale } from "@/lib/progress";
import { Package, Megaphone, Users, ScrollText, ChevronRight, AlertTriangle } from "lucide-react";

export function AdminOverview() {
  const { products, announcements, users, audit } = useContent();
  const staleCount = products.filter((p) => isStale(p.officialCheckedAt)).length;
  const activeAnnouncements = announcements.filter((a) => a.isActive).length;

  const cards = [
    {
      to: "/admin/products",
      icon: Package,
      label: "商材",
      value: `${products.length}`,
      sub: "登録",
    },
    {
      to: "/admin/announcements",
      icon: Megaphone,
      label: "お知らせ",
      value: `${activeAnnouncements}`,
      sub: "公開中",
    },
    { to: "/admin/users", icon: Users, label: "ユーザー", value: `${users.length}`, sub: "登録" },
    {
      to: "/admin/audit",
      icon: ScrollText,
      label: "監査ログ",
      value: `${audit.length}`,
      sub: "件",
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="概要" description="コンテンツの状態をひと目で確認し、編集に進みます。" />

      {staleCount > 0 && (
        <Card className="flex items-start gap-3 bg-caution-soft p-4">
          <AlertTriangle
            size={18}
            strokeWidth={1.75}
            className="mt-0.5 shrink-0 text-caution-deep"
          />
          <div className="flex-1">
            <div className="text-sm font-semibold text-ink">
              確認日が90日を超えた商材が <span className="font-num">{staleCount}</span> 件あります
            </div>
            <p className="mt-0.5 text-sm text-ink-soft">
              公式ページと照らし合わせ、最新の内容に更新してください。
            </p>
          </div>
          <Link
            to="/admin/products"
            className="inline-flex shrink-0 items-center gap-0.5 self-center rounded-lg bg-ink px-3 py-2 text-sm font-medium text-paper"
          >
            確認する <ChevronRight size={16} />
          </Link>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ to, icon: Icon, label, value, sub }) => (
          <Link key={to} to={to} className="block rounded-xl2 transition-shadow hover:shadow-lift">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <Icon size={20} strokeWidth={1.75} className="text-ink-soft" />
                <ChevronRight size={18} className="text-ink-muted" />
              </div>
              <div className="mt-3 font-num text-3xl font-bold text-ink">{value}</div>
              <div className="text-sm text-ink-muted">
                {label}・{sub}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
