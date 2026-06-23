import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PHASES, RANKS } from "@/data/seed";
import { Card, ProgressBar, RankPill, ScoreChip, SectionTitle } from "@/components/ui";
import { LevelLadder } from "@/components/LevelLadder";
import { ChevronRight } from "lucide-react";

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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-sm text-ink-muted">こんにちは、{profile.display_name} さん</div>
          <h1 className="text-2xl font-bold text-ink">ダッシュボード</h1>
        </div>
        <RankPill level={rank.level} label={rank.label} />
      </div>

      {/* 上段：進捗サマリ */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5 md:col-span-2">
          <SectionTitle eyebrow="Progress" title="研修進捗" />
          <div className="flex items-end justify-between">
            <div className="font-num text-4xl font-bold text-ink">
              {completionRate}
              <span className="text-lg text-ink-muted">%</span>
            </div>
            <div className="text-sm text-ink-muted">
              合格 <span className="font-num font-semibold text-ink">{passedCount}</span> / {allModules.length} モジュール
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar value={completionRate} tone={completionRate >= 80 ? "pass" : "ink"} />
          </div>

          {nextModule && (
            <Link
              to="/roadmap"
              className="mt-5 flex items-center justify-between rounded-xl2 bg-paper-soft px-4 py-3 transition-colors hover:bg-paper-line/60"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">次にやるべき研修</div>
                <div className="font-medium text-ink">{nextModule.title}</div>
                <div className="text-xs text-ink-muted">
                  Phase {nextModule.phase.no}・{nextModule.phase.title}・合格{nextModule.passing_score}点
                </div>
              </div>
              <ChevronRight size={20} className="text-ink-muted" />
            </Link>
          )}
        </Card>

        <Card className="p-5">
          <SectionTitle eyebrow="Today" title="おすすめロープレ" />
          <p className="text-sm text-ink-soft">
            ドコモ既存・GOLD利用のお客様へ、PLATINUM提案（難易度7）。
          </p>
          <Link
            to="/roleplay"
            className="mt-4 inline-flex items-center gap-1 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper"
          >
            ロープレを始める <ChevronRight size={16} />
          </Link>
        </Card>
      </div>

      {/* 中段：苦手分野＋育成ラダー */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5 md:col-span-1">
          <SectionTitle eyebrow="Focus" title="苦手分野" />
          {weak.length === 0 ? (
            <p className="text-sm text-ink-muted">未達のモジュールはありません。次の研修へ進みましょう。</p>
          ) : (
            <ul className="space-y-3">
              {weak.map((m) => (
                <li key={m.id} className="flex items-center justify-between">
                  <span className="text-sm text-ink">{m.title}</span>
                  <ScoreChip score={progress[m.id]} passing={m.passing_score} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5 md:col-span-2">
          <SectionTitle eyebrow="Journey" title="認定クローザーまでの道のり" />
          <LevelLadder current={profile.level} />
        </Card>
      </div>
    </div>
  );
}
