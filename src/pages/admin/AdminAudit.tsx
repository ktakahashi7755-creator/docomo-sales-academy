import { useContent } from "@/context/ContentContext";
import { Card, EmptyState, PageTitle } from "@/components/ui";
import type { AuditAction } from "@/lib/types";
import { ScrollText, Package, Megaphone, Users, Award } from "lucide-react";

const ICON: Record<AuditAction, typeof Package> = {
  "product.update": Package,
  "announcement.create": Megaphone,
  "announcement.update": Megaphone,
  "announcement.delete": Megaphone,
  "user.role": Users,
  "user.active": Users,
  "certification.approve": Award,
};

export function AdminAudit() {
  const { audit } = useContent();

  return (
    <div className="space-y-6">
      <PageTitle title="監査ログ" description="商材・お知らせ・ユーザーへの変更操作の記録です。" />

      {audit.length === 0 ? (
        <EmptyState
          icon={<ScrollText size={28} strokeWidth={1.5} />}
          title="まだ操作記録はありません"
          description="商材やお知らせを編集すると、ここに記録されます。"
        />
      ) : (
        <Card>
          <ul className="divide-y divide-paper-line">
            {audit.map((e) => {
              const Icon = ICON[e.action] ?? ScrollText;
              return (
                <li key={e.id} className="flex items-start gap-3 px-4 py-3">
                  <Icon size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-ink-muted" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-ink">{e.summary}</div>
                    <div className="text-xs text-ink-muted">
                      {e.actor}・{e.createdAt}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
