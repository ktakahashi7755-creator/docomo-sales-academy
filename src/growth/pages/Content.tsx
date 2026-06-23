import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, Clock, ChevronRight } from "lucide-react";
import { CURRICULUM, ALL_LESSONS, stepById } from "@/growth/data/curriculum";
import { useProvide } from "@/growth/context/ProvideContext";
import { Card, PageHeader, StatusBadge, GIcon, ACCENT } from "@/growth/components/ui";

export function Content() {
  const { lessonStatus } = useProvide();
  const [filter, setFilter] = useState<string>("all");

  const lessons = filter === "all" ? ALL_LESSONS : ALL_LESSONS.filter((l) => l.stepId === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content"
        title="学習コンテンツ"
        description="レッスンを選んで学べます。ステップで絞り込み、続きから読み進めましょう。"
      />

      {/* フィルタ */}
      <div className="flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          すべて
        </FilterChip>
        {CURRICULUM.map((s) => (
          <FilterChip key={s.id} active={filter === s.id} onClick={() => setFilter(s.id)}>
            STEP {s.no}
          </FilterChip>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => {
          const step = stepById(lesson.stepId);
          const a = step ? ACCENT[step.accent] : ACCENT.blue;
          const st = lessonStatus(lesson.id);
          return (
            <Card key={lesson.id} className="group flex flex-col p-0" hover>
              <Link to={`/content/${lesson.id}`} className="flex h-full flex-col p-5">
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm bg-gradient-to-br ${a.from} ${a.to}`}
                  >
                    <GIcon name={step?.icon ?? "book"} size={18} strokeWidth={2} />
                  </span>
                  <StatusBadge
                    tone={st === "completed" ? "done" : st === "in-progress" ? "active" : "todo"}
                  >
                    {st === "completed" ? (
                      <>
                        <Check size={12} strokeWidth={3} /> 完了
                      </>
                    ) : st === "in-progress" ? (
                      "進行中"
                    ) : (
                      "未開始"
                    )}
                  </StatusBadge>
                </div>
                <div className={`mt-3 text-[11px] font-bold tracking-wider ${a.softText}`}>
                  STEP {step?.no} ・ {step?.title}
                </div>
                <h3 className="mt-0.5 text-sm font-bold text-slate-800">{lesson.title}</h3>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-500">
                  {lesson.summary}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={13} strokeWidth={2} /> {lesson.minutes}分
                  </span>
                  <span className="inline-flex items-center gap-0.5 font-medium text-blue-600">
                    学ぶ{" "}
                    <ChevronRight size={14} className="transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[40px] rounded-full px-4 text-sm font-semibold transition ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}
