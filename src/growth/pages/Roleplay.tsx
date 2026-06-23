import { Link } from "react-router-dom";
import { MessagesSquare, ChevronRight, Trophy } from "lucide-react";
import { SCENARIOS } from "@/data/seed";
import { useProvide } from "@/growth/context/ProvideContext";
import { Card, PageHeader, SectionTitle, StatusBadge, GIcon } from "@/growth/components/ui";

const STROKE = 1.75;

// Difficulty-level badge colour mapping — lower numbers friendlier, higher numbers harder.
function difficultyTone(level: number): "done" | "active" | "todo" | "caution" | "locked" {
  if (level <= 3) return "done";
  if (level <= 5) return "active";
  if (level <= 7) return "caution";
  return "locked"; // 8+
}

function difficultyLabel(level: number): string {
  if (level <= 3) return `難易度 ${level} — やさしい`;
  if (level <= 5) return `難易度 ${level} — 普通`;
  if (level <= 7) return `難易度 ${level} — 難しい`;
  return `難易度 ${level} — 超難`;
}

export function Roleplay() {
  const { roleplayResults } = useProvide();
  const recent = roleplayResults.slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Role-play"
        title="実践・ロープレ"
        description="AIが演じるお客様と対話し、ヒアリングから提案・クロージングまでを練習できます。会話終了後にAIが12項目で採点します。"
      />

      {/* Scenario grid -------------------------------------------------- */}
      <section aria-labelledby="scenarios-heading">
        <SectionTitle
          icon={<GIcon name="roleplay" size={18} strokeWidth={STROKE} className="text-blue-500" />}
          title="シナリオを選ぶ"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SCENARIOS.map((s) => (
            <Link
              key={s.id}
              to={`/roleplay/${s.id}`}
              className="group block rounded-2xl border border-slate-100 bg-white shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
              aria-label={`シナリオ ${s.no}：${s.title}、${s.carrier}・${s.familyType}・難易度${s.difficulty}`}
            >
              <div className="p-5">
                {/* Scenario number + title */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-display text-xs font-semibold tabular-nums text-blue-400">
                      #{s.no}
                    </span>
                    <h3 className="mt-0.5 text-sm font-bold text-slate-800 leading-snug">
                      {s.title}
                    </h3>
                  </div>
                  <ChevronRight
                    size={16}
                    strokeWidth={STROKE}
                    className="mt-0.5 shrink-0 text-slate-300 transition group-hover:text-blue-500"
                    aria-hidden="true"
                  />
                </div>

                {/* Meta */}
                <p className="mt-2 text-xs text-slate-500">
                  {s.carrier}・{s.familyType}
                </p>

                {/* Difficulty badge */}
                <div className="mt-3">
                  <StatusBadge tone={difficultyTone(s.difficulty)}>
                    {difficultyLabel(s.difficulty)}
                  </StatusBadge>
                </div>

                {/* Goal */}
                <p className="mt-3 text-xs text-slate-500 line-clamp-2">
                  <span className="font-medium text-slate-600">目標：</span>
                  {s.goal}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent results -------------------------------------------------- */}
      {recent.length > 0 && (
        <section aria-labelledby="recent-heading">
          <SectionTitle
            icon={
              <Trophy
                size={18}
                strokeWidth={STROKE}
                className="text-orange-400"
                aria-hidden="true"
              />
            }
            title="最近の結果"
          />
          <Card className="divide-y divide-slate-50">
            {recent.map((r) => {
              const isGood = r.rank === "S" || r.rank === "A";
              const isMid = r.rank === "B" || r.rank === "C";
              const rankColor = isGood
                ? "text-emerald-600 bg-emerald-50"
                : isMid
                  ? "text-orange-600 bg-orange-50"
                  : "text-red-600 bg-red-50";
              return (
                <div key={r.id} className="flex items-center gap-4 px-5 py-4">
                  <span
                    className={`font-display inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base font-bold tabular-nums ${rankColor}`}
                    aria-label={`ランク ${r.rank}`}
                  >
                    {r.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {r.scenarioTitle}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">{r.date}</p>
                  </div>
                  <span className="font-display shrink-0 text-sm font-bold tabular-nums text-slate-700">
                    {r.score}
                    <span className="ml-0.5 text-xs font-normal text-slate-400">/100</span>
                  </span>
                </div>
              );
            })}
          </Card>
        </section>
      )}

      {/* Empty state for results (shown only when no results yet) */}
      {recent.length === 0 && (
        <section aria-live="polite">
          <Card className="flex flex-col items-center gap-3 py-10 text-center">
            <MessagesSquare
              size={32}
              strokeWidth={STROKE}
              className="text-slate-300"
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-slate-500">まだロープレ結果がありません。</p>
            <p className="text-xs text-slate-400">
              シナリオを選んで、最初のロープレを始めましょう。
            </p>
          </Card>
        </section>
      )}
    </div>
  );
}
