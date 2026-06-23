import { Link } from "react-router-dom";
import { useProvide } from "@/growth/context/ProvideContext";
import { QUIZ_MODULES } from "@/growth/data/curriculum";
import { isPassed } from "@/lib/progress";
import { Card, PageHeader, StatusBadge, GIcon, ACCENT } from "@/growth/components/ui";

export function Quiz() {
  const { quizScores } = useProvide();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Quiz & Test"
        title="クイズ・テスト"
        description="各レッスンの理解度を確認テストで確かめましょう。合格点に達すると次のステップに進めます。"
      />

      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="テスト一覧">
        {QUIZ_MODULES.map((meta) => {
          const score = quizScores[meta.moduleId];
          const a = ACCENT[meta.accent];

          let badgeTone: "done" | "caution" | "todo";
          let badgeLabel: string;
          if (score === undefined) {
            badgeTone = "todo";
            badgeLabel = "未受験";
          } else if (isPassed(score, meta.passing)) {
            badgeTone = "done";
            badgeLabel = `${score}点 合格`;
          } else {
            badgeTone = "caution";
            badgeLabel = `${score}点 未達`;
          }

          return (
            <li key={meta.moduleId}>
              <Link
                to={`/quiz/${meta.moduleId}`}
                className="block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                aria-label={`${meta.title}の確認テストを受ける`}
              >
                <Card hover className="flex h-full flex-col gap-4 p-5 transition duration-200">
                  {/* アクセントアイコンバッジ */}
                  <div
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${a.from} ${a.to} text-white shadow-sm`}
                    aria-hidden="true"
                  >
                    <GIcon name={meta.icon} size={22} strokeWidth={1.75} />
                  </div>

                  {/* タイトル・説明 */}
                  <div className="flex-1 space-y-1">
                    <h2 className="text-base font-bold text-slate-800">{meta.title}</h2>
                    <p className="text-sm text-slate-500">{meta.description}</p>
                  </div>

                  {/* フッター：合格点＋ステータス */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400">
                      合格点{" "}
                      <span className="font-display tabular-nums font-semibold text-slate-600">
                        {meta.passing}
                      </span>
                      点
                    </span>
                    <StatusBadge tone={badgeTone}>{badgeLabel}</StatusBadge>
                  </div>
                </Card>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
