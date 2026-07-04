import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PHASES, RANKS } from "@/data/seed";
import { Card, ProgressBar, ScoreChip, SectionTitle } from "@/components/ui";
import { LevelLadder } from "@/components/LevelLadder";
import { ChevronRight, Megaphone, Mic, TrendingUp } from "lucide-react";

export function Dashboard() {
  const { profile, progress } = useAuth();
  if (!profile) return null;

  const allModules = PHASES.flatMap((p) => p.modules.map((m) => ({ ...m, phase: p })));
  const passedCount = allModules.filter((m) => (progress[m.id] ?? 0) >= m.passing_score).length;
  const completionRate = Math.round((passedCount / allModules.length) * 100);
  const nextModule = allModules.find((m) => (progress[m.id] ?? 0) < m.passing_score);
  const rank = RANKS.find((r) => r.level === profile.level) ?? RANKS[0];

  // 苦手分野＝受講済みだが点が低い順
  const weak = allModules
    .filter((m) => progress[m.id] != null && (progress[m.id] ?? 0) < m.passing_score)
    .sort((a, b) => (progress[a.id] ?? 0) - (progress[b.id] ?? 0))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* ヒーロー：挨拶 + 進捗サマリ */}
      <section className="surface-hero relative overflow-hidden rounded-xl2 p-6 text-paper shadow-hero animate-fade-up md:p-8">
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">
            <div className="font-num text-xs font-semibold uppercase tracking-[0.25em] text-paper/60">Dashboard</div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight md:text-[1.7rem]">
              こんにちは、{profile.display_name} さん
            </h1>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-paper/20 bg-paper/10 px-3.5 py-1.5 backdrop-blur">
              <span className="font-num text-xs font-bold text-accent">Lv.{rank.level}</span>
              <span className="text-xs font-semibold">{rank.label}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-xl2 border border-paper/15 bg-paper/10 px-5 py-3.5 text-center backdrop-blur">
              <div className="font-num text-3xl font-bold leading-none">
                {completionRate}
                <span className="text-base text-paper/60">%</span>
              </div>
              <div className="mt-1.5 text-[11px] font-medium text-paper/70">研修進捗</div>
            </div>
            <div className="rounded-xl2 border border-paper/15 bg-paper/10 px-5 py-3.5 text-center backdrop-blur">
              <div className="font-num text-3xl font-bold leading-none">
                {passedCount}
                <span className="text-base text-paper/60">/{allModules.length}</span>
              </div>
              <div className="mt-1.5 text-[11px] font-medium text-paper/70">合格モジュール</div>
            </div>
          </div>
        </div>
        <div className="relative z-10 mt-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-paper/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-[#FF6B72] transition-[width] duration-700"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </section>

      {/* 上段：次の研修 + 今日のアクション */}
      <div className="stagger grid gap-4 md:grid-cols-3">
        <Card className="p-5 md:col-span-2">
          <SectionTitle eyebrow="Next" title="次にやるべき研修" />
          {nextModule ? (
            <Link
              to="/roadmap"
              className="group flex items-center justify-between rounded-xl2 bg-paper-soft px-4 py-3.5 transition-colors hover:bg-paper-line/60"
            >
              <div>
                <div className="font-semibold text-ink">{nextModule.title}</div>
                <div className="mt-0.5 text-xs text-ink-muted">
                  Phase {nextModule.phase.no}・{nextModule.phase.title}・合格{nextModule.passing_score}点・目安
                  {nextModule.estimated_minutes}分
                </div>
              </div>
              <ChevronRight size={20} className="text-ink-muted transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <p className="text-sm text-ink-muted">すべてのモジュールに合格しています。認定試験へ進みましょう。</p>
          )}

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Link
              to="/catch"
              className="group flex items-center gap-3 rounded-xl2 border border-paper-line px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Megaphone size={17} />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-ink">キャッチを学ぶ</div>
                <div className="truncate text-xs text-ink-muted">興味付け→着座→提案→引継ぎ</div>
              </div>
            </Link>
            <Link
              to="/scripts"
              className="group flex items-center gap-3 rounded-xl2 border border-paper-line px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-paper-soft text-ink">
                <TrendingUp size={17} />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-ink">トークを覚える</div>
                <div className="truncate text-xs text-ink-muted">掛け合い形式で型を身につける</div>
              </div>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col p-5">
          <SectionTitle eyebrow="Today" title="おすすめロープレ" />
          <p className="text-sm leading-relaxed text-ink-soft">
            ドコモ既存・GOLD利用のお客様へ、PLATINUM提案（難易度7）。
          </p>
          <Link
            to="/roleplay"
            className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <Mic size={15} /> ロープレを始める
          </Link>
        </Card>
      </div>

      {/* 中段：苦手分野 + 育成ラダー */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5 md:col-span-1">
          <SectionTitle eyebrow="Focus" title="苦手分野" />
          {weak.length === 0 ? (
            <p className="text-sm text-ink-muted">未達のモジュールはありません。次の研修へ進みましょう。</p>
          ) : (
            <ul className="space-y-3">
              {weak.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-2">
                  <span className="text-sm text-ink">{m.title}</span>
                  <ScoreChip score={progress[m.id]} passing={m.passing_score} />
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4">
            <ProgressBar value={completionRate} tone={completionRate >= 80 ? "pass" : "ink"} />
            <p className="mt-1.5 text-xs text-ink-muted">
              全体進捗 <span className="font-num font-semibold text-ink">{completionRate}%</span>
            </p>
          </div>
        </Card>

        <Card className="p-5 md:col-span-2">
          <SectionTitle eyebrow="Journey" title="認定クローザーまでの道のり" />
          <LevelLadder current={profile.level} />
        </Card>
      </div>
    </div>
  );
}
