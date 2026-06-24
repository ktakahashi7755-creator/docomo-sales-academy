import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, GraduationCap, ClipboardCheck, CheckCircle2 } from "lucide-react";
import { stepOfLesson, CURRICULUM, quizModuleMeta } from "@/growth/data/curriculum";
import { useProvide } from "@/growth/context/ProvideContext";
import { isPassed } from "@/lib/progress";
import { Card, ProgressRing, SectionTitle, PrimaryButton, GIcon } from "@/growth/components/ui";

function HeaderTitle() {
  return (
    <SectionTitle
      title="現在のカリキュラム"
      icon={
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <GIcon name="book" size={16} />
        </span>
      }
    />
  );
}

export function CurrentCurriculumCard() {
  const navigate = useNavigate();
  const { currentLesson, stepProgress, lessonStatus, quizScores } = useProvide();

  // 全カリキュラム修了（学習対象が残っていない）= empty/完了状態。
  if (!currentLesson) {
    return (
      <Card className="p-6" hover>
        <HeaderTitle />
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-md shadow-emerald-200">
            <CheckCircle2 size={28} strokeWidth={2} />
          </span>
          <h3 className="text-xl font-bold text-slate-800">全カリキュラム修了</h3>
          <p className="max-w-sm text-sm leading-relaxed text-slate-600">
            5つのステップをすべて完了しました。現場ガイドや確認テストで、いつでも復習できます。
          </p>
          <PrimaryButton onClick={() => navigate("/curriculum")}>
            カリキュラムを見る <ArrowRight size={16} strokeWidth={2.5} />
          </PrimaryButton>
        </div>
      </Card>
    );
  }

  const step = stepOfLesson(currentLesson.id) ?? CURRICULUM[CURRICULUM.length - 1];
  if (!step) return null;

  const pct = stepProgress(step.id);
  const doneLessons = step.lessons.filter((l) => lessonStatus(l.id) === "completed").length;
  // このステップの確認テスト（同一モジュールを参照する複数レッスンは1つに集約）と、その合格数。
  const testModules = [
    ...new Set(step.lessons.map((l) => l.quizModuleId).filter((id): id is string => Boolean(id))),
  ];
  const passedTests = testModules.filter((id) =>
    isPassed(quizScores[id], quizModuleMeta(id)?.passing ?? 80),
  ).length;
  const hasTests = testModules.length > 0;

  const tiles = [
    {
      icon: <Clock size={15} strokeWidth={2} />,
      label: "期間の目安",
      value: step.duration,
      unit: "",
    },
    {
      icon: <GraduationCap size={15} strokeWidth={2} />,
      label: "学習コンテンツ",
      value: `${doneLessons} / ${step.lessons.length}`,
      unit: "項目",
    },
    {
      icon: <ClipboardCheck size={15} strokeWidth={2} />,
      label: "確認テスト",
      value: hasTests ? `${passedTests} / ${testModules.length}` : "—",
      unit: hasTests ? "合格" : "テストなし",
    },
  ];

  return (
    <Card className="p-6" hover>
      <HeaderTitle />

      <div className="flex items-start gap-5">
        <div className="min-w-0 flex-1">
          <span className="font-display inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1 text-xs font-bold tracking-wider text-white shadow-sm">
            STEP {String(step.no).padStart(2, "0")}
          </span>
          <h3 className="mt-3 text-xl font-bold text-slate-800">{step.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.goalDescription}</p>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">進捗</span>
              {/* % は desktop のリング中央に表示。モバイル（リング非表示）でのみここに出す。 */}
              <span className="font-display text-sm font-bold text-blue-600 tabular-nums sm:hidden">
                {pct}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400 transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="hidden shrink-0 sm:block">
          <ProgressRing
            value={pct}
            size={104}
            stroke={9}
            label={<span className="text-base">{pct}%</span>}
            color="text-blue-600"
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl bg-slate-50 p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              {t.icon}
              {t.label}
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-display text-base font-bold text-slate-800 tabular-nums">
                {t.value}
              </span>
              {t.unit && <span className="text-xs font-medium text-slate-500">{t.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      <PrimaryButton
        className="mt-5 w-full sm:w-auto"
        onClick={() => navigate(`/content/${currentLesson.id}`)}
      >
        続きから学習する
        <ArrowRight size={16} strokeWidth={2.5} />
      </PrimaryButton>
    </Card>
  );
}
