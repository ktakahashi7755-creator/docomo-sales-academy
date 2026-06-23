import { CalendarDays } from "lucide-react";
import { SCHEDULE } from "@/growth/data/curriculum";
import { Card, SectionTitle } from "@/growth/components/ui";

export function ScheduleCard() {
  return (
    <Card className="p-6" hover>
      <SectionTitle
        title="今後のスケジュール"
        icon={
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
            <CalendarDays size={16} strokeWidth={2} />
          </span>
        }
      />
      <ul className="space-y-2.5">
        {SCHEDULE.map((s) => (
          <li
            key={s.id}
            className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays size={18} strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-slate-800">{s.title}</div>
              <div className="font-display mt-0.5 text-xs text-slate-500 tabular-nums">
                {s.date} {s.time}
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                s.reserved ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700"
              }`}
            >
              {s.reserved ? "予約済み" : "未予約"}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
