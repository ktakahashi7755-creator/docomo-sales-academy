import { Link } from "react-router-dom";
import { ChevronRight, Check } from "lucide-react";
import { stepOfLesson, CURRICULUM } from "@/growth/data/curriculum";
import { useProvide, type LessonStatus } from "@/growth/context/ProvideContext";
import { Card, SectionTitle, ProgressRing, GIcon } from "@/growth/components/ui";

const META: Record<LessonStatus, { label: string; pill: string; badge: string }> = {
  completed: {
    label: "完了",
    pill: "bg-emerald-50 text-emerald-700",
    badge: "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white",
  },
  "in-progress": {
    label: "進行中",
    pill: "bg-blue-50 text-blue-700",
    badge: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
  },
  "not-started": {
    label: "未開始",
    pill: "bg-slate-100 text-slate-500",
    badge: "bg-slate-100 text-slate-400",
  },
};

export function LearningStepTable() {
  const { currentLesson, lessonStatus, lessonProgress } = useProvide();
  const step = currentLesson ? stepOfLesson(currentLesson.id) : CURRICULUM[CURRICULUM.length - 1];
  if (!step) return null;

  return (
    <Card className="p-5 sm:p-6" hover>
      <SectionTitle
        title="学習ステップ"
        icon={
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <GIcon name="content" size={16} />
          </span>
        }
        action={
          <span className="text-xs font-medium text-slate-400">
            STEP {String(step.no).padStart(2, "0")}・全{step.lessons.length}項目
          </span>
        }
      />

      <ul className="divide-y divide-slate-100">
        {step.lessons.map((lesson) => {
          const status = lessonStatus(lesson.id);
          const meta = META[status];
          const pct = lessonProgress[lesson.id] ?? 0;
          return (
            <li key={lesson.id}>
              <Link
                to={`/content/${lesson.id}`}
                className="group flex w-full items-center gap-3 rounded-xl px-1.5 py-3 text-left transition hover:bg-slate-50 sm:gap-4 sm:px-3"
              >
                <span
                  className={`font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${meta.badge}`}
                >
                  {status === "completed" ? (
                    <Check size={18} strokeWidth={3} />
                  ) : (
                    String(lesson.no).padStart(2, "0")
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-800">
                    {lesson.title}
                  </div>
                  <div className="truncate text-xs text-slate-500">{lesson.summary}</div>
                </div>

                {status === "in-progress" && (
                  <ProgressRing value={pct} size={38} stroke={4} label={`${pct}`} />
                )}

                <span
                  className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold sm:inline-flex ${meta.pill}`}
                >
                  {meta.label}
                </span>

                <span className="hidden w-12 shrink-0 text-right text-xs text-slate-400 lg:inline">
                  {lesson.minutes}分
                </span>

                <ChevronRight
                  size={18}
                  className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
