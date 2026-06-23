import { Link } from "react-router-dom";
import { Check, Lock, Circle, ChevronRight } from "lucide-react";
import { CURRICULUM } from "@/growth/data/curriculum";
import { useProvide, stepStatus } from "@/growth/context/ProvideContext";
import { Card, PageHeader, ProgressBar, StatusBadge, GIcon, ACCENT } from "@/growth/components/ui";

export function Curriculum() {
  const { stepProgress, lessonStatus } = useProvide();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Curriculum"
        title="カリキュラム一覧"
        description="販売の基本から実践・自立まで、5つのステップで段階的に学びます。各ステップを完了すると次に進めます。"
      />

      {CURRICULUM.map((step) => {
        const a = ACCENT[step.accent];
        const status = stepStatus(step, stepProgress);
        const pct = stepProgress(step.id);
        const locked = status === "locked";
        return (
          <Card key={step.id} className="overflow-hidden">
            <div className="flex items-center gap-4 border-b border-slate-100 p-5">
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm ${
                  locked ? "bg-slate-200 text-slate-400" : `bg-gradient-to-br ${a.from} ${a.to}`
                }`}
              >
                <GIcon name={step.icon} size={22} strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-display text-xs font-bold tracking-wider ${a.softText}`}>
                    STEP {String(step.no).padStart(2, "0")}
                  </span>
                  <StatusBadge
                    tone={
                      status === "completed"
                        ? "done"
                        : status === "in-progress"
                          ? "active"
                          : "locked"
                    }
                  >
                    {status === "completed"
                      ? "完了"
                      : status === "in-progress"
                        ? "学習中"
                        : "ロック"}
                  </StatusBadge>
                </div>
                <h2 className="mt-0.5 text-lg font-bold text-slate-800">{step.title}</h2>
                <p className="text-sm text-slate-500">
                  {step.subtitle}・目安 {step.duration}
                </p>
              </div>
              <div className="hidden w-40 shrink-0 sm:block">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-slate-500">進捗</span>
                  <span className="font-display font-bold text-blue-600 tabular-nums">{pct}%</span>
                </div>
                <ProgressBar value={pct} />
              </div>
            </div>

            <ul className="divide-y divide-slate-100">
              {step.lessons.map((lesson) => {
                const st = lessonStatus(lesson.id);
                return (
                  <li key={lesson.id}>
                    <Link
                      to={`/content/${lesson.id}`}
                      className="group flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50"
                    >
                      {st === "completed" ? (
                        <Check size={18} className="shrink-0 text-emerald-500" strokeWidth={2.5} />
                      ) : st === "in-progress" ? (
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
                      ) : (
                        <Circle size={16} className="shrink-0 text-slate-300" strokeWidth={2} />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-slate-800">
                          {lesson.no}. {lesson.title}
                        </div>
                        <div className="truncate text-xs text-slate-500">{lesson.summary}</div>
                      </div>
                      {lesson.quizModuleId && (
                        <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500 sm:inline">
                          テストあり
                        </span>
                      )}
                      <span className="hidden w-12 text-right text-xs text-slate-400 sm:inline">
                        {lesson.minutes}分
                      </span>
                      <ChevronRight
                        size={18}
                        className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                章末まとめ
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.recap}</p>
            </div>

            {locked && (
              <div className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 text-xs text-slate-400">
                <Lock size={13} strokeWidth={2} />
                前のステップを完了すると解放されます
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
