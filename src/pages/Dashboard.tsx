import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useContent } from "@/context/ContentContext";
import { PHASES, RANKS, RECOMMENDED_SCENARIO } from "@/data/seed";
import {
  Card,
  EmptyState,
  PageLoading,
  PageTitle,
  ProgressBar,
  RankPill,
  ScoreChip,
  SectionTitle,
} from "@/components/ui";
import { LevelLadder } from "@/components/LevelLadder";
import { QUIZ_MODULE_IDS } from "@/data/quiz";
import { flattenModules, summarizeProgress, weakModules } from "@/lib/progress";
import { activeAnnouncement } from "@/lib/content";
import { ChevronRight, Megaphone } from "lucide-react";

// PHASES は定数なので一度だけ平坦化する。
const ALL_MODULES = flattenModules(PHASES);

export function Dashboard() {
  const { profile, progress } = useAuth();
  const { announcements } = useContent();
  // loading：認証解決前（Phase 1 で非同期化したときの受け皿）。
  if (!profile) return <PageLoading />;

  const { passedCount, completionRate, nextModule } = summarizeProgress(ALL_MODULES, progress);
  const rank = RANKS.find((r) => r.level === profile.level) ?? RANKS[0];
  const weak = weakModules(ALL_MODULES, progress, 3);
  const notice = activeAnnouncement(announcements);

  return (
    <div className="space-y-6">
      <PageTitle
        title="ダッシュボード"
        description={`こんにちは、${profile.display_name} さん`}
        action={<RankPill level={rank.level} label={rank.label} />}
      />

      {notice && (
        <Card
          className={`flex items-start gap-3 p-4 ${notice.severity === "caution" ? "bg-caution-soft" : ""}`}
        >
          <Megaphone
            size={18}
            strokeWidth={1.75}
            className={`mt-0.5 shrink-0 ${notice.severity === "caution" ? "text-caution-deep" : "text-ink-soft"}`}
          />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-ink">{notice.title}</div>
            <p className="mt-0.5 line-clamp-3 text-sm text-ink-soft">{notice.body}</p>
          </div>
        </Card>
      )}

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
              合格 <span className="font-num font-semibold text-ink">{passedCount}</span> /{" "}
              {ALL_MODULES.length} モジュール
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar value={completionRate} tone={completionRate >= 80 ? "pass" : "ink"} />
          </div>

          {nextModule && (
            <Link
              to={QUIZ_MODULE_IDS.has(nextModule.id) ? `/quiz/${nextModule.id}` : "/roadmap"}
              className="mt-5 flex items-center justify-between rounded-xl2 bg-paper-soft px-4 py-3 transition-colors hover:bg-paper-line/60"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  次にやるべき研修
                </div>
                <div className="font-medium text-ink">{nextModule.title}</div>
                <div className="text-xs text-ink-muted">
                  Phase {nextModule.phase.no}・{nextModule.phase.title}・合格
                  {nextModule.passing_score}点
                </div>
              </div>
              <ChevronRight size={20} className="text-ink-muted" />
            </Link>
          )}
        </Card>

        <Card className="p-5">
          <SectionTitle eyebrow="Today" title="おすすめロープレ" />
          <p className="text-sm text-ink-soft">
            {RECOMMENDED_SCENARIO.title}（{RECOMMENDED_SCENARIO.goal}・難易度
            <span className="font-num">{RECOMMENDED_SCENARIO.difficulty}</span>）。
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
            <EmptyState
              title="未達のモジュールはありません"
              description="この調子で、次の研修へ進みましょう。"
              action={
                <Link
                  to="/roadmap"
                  className="inline-flex items-center gap-1 rounded-lg bg-ink px-3 py-2 text-sm font-medium text-paper"
                >
                  ロードマップへ <ChevronRight size={16} />
                </Link>
              }
            />
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
