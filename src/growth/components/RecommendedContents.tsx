import { Play } from "lucide-react";
import { RECOMMENDED } from "@/growth/data/curriculum";
import { Card, ACCENT } from "@/growth/components/ui";

export function RecommendedContents() {
  return (
    <div>
      <h2 className="mb-3 px-1 text-base font-bold text-slate-800">おすすめコンテンツ</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {RECOMMENDED.map((v) => {
          const a = ACCENT[v.accent];
          return (
            <Card key={v.id} className="group cursor-pointer overflow-hidden" hover>
              {/* サムネイル（プレースホルダ） */}
              <div
                className={`relative flex aspect-video items-center justify-center bg-gradient-to-br ${a.from} ${a.to}`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg transition duration-200 group-hover:scale-110">
                  <Play size={20} strokeWidth={2} className="ml-0.5 fill-current" />
                </span>
                <span className="font-display absolute bottom-2 right-2 rounded-md bg-black/55 px-1.5 py-0.5 text-[11px] font-semibold text-white tabular-nums">
                  {v.duration}
                </span>
              </div>
              <div className="p-3.5">
                <div className="text-sm font-bold text-slate-800">{v.title}</div>
                <div className="mt-0.5 text-xs text-slate-500">動画で学ぶ</div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
