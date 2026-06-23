import { PERFORMANCE } from "@/growth/data/curriculum";
import { Card, ACCENT, GIcon } from "@/growth/components/ui";

export function PerformanceCards() {
  return (
    <div>
      <h2 className="mb-3 px-1 text-sm font-bold text-slate-700">パフォーマンス</h2>
      <div className="grid grid-cols-3 gap-3">
        {PERFORMANCE.map((p) => {
          const a = ACCENT[p.accent];
          return (
            <Card key={p.id} className="p-3.5 text-center sm:text-left" hover>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm bg-gradient-to-br ${a.from} ${a.to} mx-auto sm:mx-0`}
              >
                <GIcon name={p.icon} size={17} strokeWidth={2} />
              </span>
              <div className="font-display mt-2 text-base font-bold leading-tight text-slate-800">
                {p.value}
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500">{p.label}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
