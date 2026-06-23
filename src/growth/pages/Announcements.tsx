import { Megaphone, Calendar, Info, AlertTriangle } from "lucide-react";
import { ANNOUNCEMENTS, type Announcement } from "@/growth/data/curriculum";
import { Card, PageHeader } from "@/growth/components/ui";

const TONE: Record<Announcement["tone"], { cls: string; icon: typeof Info; label: string }> = {
  info: { cls: "bg-blue-50 text-blue-600", icon: Info, label: "お知らせ" },
  event: { cls: "bg-emerald-50 text-emerald-600", icon: Calendar, label: "イベント" },
  caution: { cls: "bg-orange-50 text-orange-600", icon: AlertTriangle, label: "重要" },
};

export function Announcements() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="News"
        title="お知らせ"
        description="新しいカリキュラムや、運営からの大切な連絡をお届けします。"
      />

      <div className="space-y-3">
        {ANNOUNCEMENTS.map((an) => {
          const t = TONE[an.tone];
          const Icon = t.icon;
          return (
            <Card key={an.id} className="flex gap-4 p-5" hover>
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${t.cls}`}
              >
                <Icon size={20} strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${t.cls}`}>
                    {t.label}
                  </span>
                  <span className="font-display text-xs text-slate-400 tabular-nums">
                    {an.date}
                  </span>
                </div>
                <h2 className="mt-1.5 text-sm font-bold text-slate-800">{an.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{an.body}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <Megaphone size={14} /> 以上がすべてのお知らせです
      </div>
    </div>
  );
}
