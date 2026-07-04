import { useState } from "react";
import { Link } from "react-router-dom";
import { TALK_SCRIPTS } from "@/data/seed";
import { Card, DifficultyMeter, PageHeader, PhaseChip } from "@/components/ui";
import { ChevronRight, Megaphone, Package } from "lucide-react";

type Filter = "all" | "catch" | "product";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "catch", label: "キャッチ" },
  { key: "product", label: "商材提案" },
];

export function TalkScripts() {
  const [filter, setFilter] = useState<Filter>("all");
  const list = TALK_SCRIPTS.filter((s) => filter === "all" || (s.kind ?? "product") === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Scripts"
        title="トークスクリプト集"
        description="お客様の返答まで含めた掛け合いで「型」を覚え、ロープレで再現します。キャッチ（声かけ〜引継ぎ）と商材提案の2系統。"
      />

      {/* フィルタタブ */}
      <div className="flex gap-1.5 rounded-xl2 border border-paper-line bg-paper p-1.5 shadow-card md:w-fit" role="tablist">
        {FILTERS.map((f) => {
          const count = TALK_SCRIPTS.filter((s) => f.key === "all" || (s.kind ?? "product") === f.key).length;
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors md:flex-none ${
                active ? "bg-ink text-paper shadow-card" : "text-ink-soft hover:bg-paper-soft"
              }`}
            >
              {f.label}
              <span className={`font-num text-[11px] font-semibold ${active ? "text-paper/60" : "text-ink-muted"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="stagger grid gap-3 md:grid-cols-2">
        {list.map((s) => {
          const isCatch = s.kind === "catch";
          return (
            <Link key={s.id} to={`/scripts/${s.id}`} className="group">
              <Card className="flex h-full flex-col p-5 transition-all group-hover:-translate-y-0.5 group-hover:shadow-lift">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      isCatch ? "bg-accent-soft text-accent-deep" : "bg-paper-soft text-ink-soft"
                    }`}
                  >
                    {isCatch ? <Megaphone size={12} /> : <Package size={12} />}
                    {isCatch ? "キャッチ" : "商材提案"}
                  </span>
                  <ChevronRight
                    size={17}
                    className="mt-0.5 shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5"
                  />
                </div>
                <h2 className="mt-2.5 font-bold leading-snug text-ink">{s.title}</h2>
                <p className="mt-1 text-xs text-ink-muted">{s.category}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">対象：{s.target}</p>
                <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
                  {s.phases?.map((p) => <PhaseChip key={p} phase={p} />)}
                  <span className="ml-auto">
                    <DifficultyMeter value={s.difficulty} />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
