import { SUPPORT_CARDS } from "@/growth/data/curriculum";
import { Card, ACCENT, GIcon } from "@/growth/components/ui";

export function SupportCards() {
  return (
    <div>
      <h2 className="mb-3 px-1 text-base font-bold text-slate-800">学習サポート</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SUPPORT_CARDS.map((s) => {
          const a = ACCENT[s.accent];
          return (
            <Card key={s.id} className="cursor-pointer p-4" hover>
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm bg-gradient-to-br ${a.from} ${a.to}`}
              >
                <GIcon name={s.icon} size={20} strokeWidth={2} />
              </span>
              <div className="mt-3 text-sm font-bold text-slate-800">{s.title}</div>
              <div className="mt-0.5 text-xs leading-relaxed text-slate-500">{s.description}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
