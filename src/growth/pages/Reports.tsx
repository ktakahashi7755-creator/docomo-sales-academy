import { Clock, Target, BookOpen, MessagesSquare, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CURRICULUM, ALL_LESSONS, QUIZ_MODULES } from "@/growth/data/curriculum";
import { useProvide } from "@/growth/context/ProvideContext";
import { isPassed } from "@/lib/progress";
import {
  Card,
  PageHeader,
  ProgressRing,
  ProgressBar,
  StatusBadge,
  ACCENT,
  GIcon,
} from "@/growth/components/ui";

export function Reports() {
  const {
    overallProgress,
    studyMinutes,
    quizScores,
    quizAverage,
    roleplayResults,
    stepProgress,
    lessonStatus,
  } = useProvide();
  const doneLessons = ALL_LESSONS.filter((l) => lessonStatus(l.id) === "completed").length;
  const h = Math.floor(studyMinutes / 60);
  const m = studyMinutes % 60;

  const summary = [
    {
      icon: <BookOpen size={18} strokeWidth={2} />,
      label: "完了レッスン",
      value: `${doneLessons} / ${ALL_LESSONS.length}`,
      grad: "from-blue-500 to-blue-600",
    },
    {
      icon: <Clock size={18} strokeWidth={2} />,
      label: "学習時間",
      value: h > 0 ? `${h}時間${m}分` : `${m}分`,
      grad: "from-teal-400 to-teal-500",
    },
    {
      icon: <Target size={18} strokeWidth={2} />,
      label: "テスト正答率",
      value: quizAverage == null ? "—" : `${quizAverage}%`,
      grad: "from-emerald-400 to-emerald-500",
    },
    {
      icon: <MessagesSquare size={18} strokeWidth={2} />,
      label: "ロープレ回数",
      value: `${roleplayResults.length}回`,
      grad: "from-orange-400 to-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reports"
        title="進捗レポート"
        description="これまでの学習状況をまとめて確認できます。弱いところを見つけて、次の一歩に活かしましょう。"
      />

      {/* 概要 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-2 p-6 text-center">
          <ProgressRing
            value={overallProgress}
            size={120}
            stroke={11}
            label={<span className="text-2xl">{overallProgress}%</span>}
          />
          <div className="mt-1 text-sm font-bold text-slate-800">全体の進捗</div>
          <div className="text-xs text-slate-500">カリキュラム全体の完了率</div>
        </Card>

        <div className="grid grid-cols-2 gap-3 lg:col-span-2">
          {summary.map((s) => (
            <Card key={s.label} className="p-4" hover>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${s.grad}`}
              >
                {s.icon}
              </span>
              <div className="font-display mt-2.5 text-xl font-bold text-slate-800">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* ステップ別 */}
      <Card className="p-6">
        <h2 className="mb-4 text-sm font-bold text-slate-800">ステップ別の進捗</h2>
        <div className="space-y-3.5">
          {CURRICULUM.map((step) => {
            const a = ACCENT[step.accent];
            const pct = stepProgress(step.id);
            return (
              <div key={step.id} className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white bg-gradient-to-br ${a.from} ${a.to}`}
                >
                  <GIcon name={step.icon} size={15} strokeWidth={2} />
                </span>
                <div className="w-28 shrink-0 text-sm font-medium leading-tight text-slate-700">
                  {step.title}
                </div>
                <ProgressBar value={pct} />
                <span className="font-display w-10 shrink-0 text-right text-sm font-bold text-slate-700 tabular-nums">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* テスト結果 */}
      <Card className="p-6">
        <h2 className="mb-4 text-sm font-bold text-slate-800">確認テストの結果</h2>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {QUIZ_MODULES.map((q) => {
            const score = quizScores[q.moduleId];
            return (
              <div
                key={q.moduleId}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
              >
                <span className="text-sm font-medium text-slate-700">{q.title}</span>
                {score == null ? (
                  <StatusBadge tone="todo">未受験</StatusBadge>
                ) : isPassed(score, q.passing) ? (
                  <StatusBadge tone="done">
                    <Check size={12} strokeWidth={3} /> {score}点 合格
                  </StatusBadge>
                ) : (
                  <StatusBadge tone="caution">{score}点 未達</StatusBadge>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* ロープレ結果 */}
      <Card className="p-6">
        <h2 className="mb-4 text-sm font-bold text-slate-800">ロープレの評価</h2>
        {roleplayResults.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
            まだロープレの記録がありません。「実践・ロープレ」から挑戦してみましょう。
          </div>
        ) : (
          <ul className="space-y-2">
            {roleplayResults.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-800">
                    {r.scenarioTitle}
                  </div>
                  <div className="font-display text-xs text-slate-400 tabular-nums">{r.date}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm font-bold text-slate-700 tabular-nums">
                    {r.score}点
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 font-display text-sm font-bold text-blue-700">
                    {r.rank}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* 育成ロードマップ・評価基準への導線 */}
      <Link to="/field-guide?tab=rubric">
        <Card className="flex items-center gap-3 p-5" hover>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 text-white">
            <Target size={20} strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-slate-800">育成ロードマップと評価基準</div>
            <div className="text-xs text-slate-500">
              現場投入の判断基準と、ロープレ評価の12観点を確認できます
            </div>
          </div>
          <ArrowRight size={18} className="shrink-0 text-slate-300" />
        </Card>
      </Link>
    </div>
  );
}
