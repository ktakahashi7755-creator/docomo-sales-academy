import { Smartphone, CheckCircle2, Circle, Target } from "lucide-react";
import { stepOfLesson, CURRICULUM } from "@/growth/data/curriculum";
import { useProvide } from "@/growth/context/ProvideContext";
import { Card, SectionTitle } from "@/growth/components/ui";

export function GoalCard() {
  const { currentLesson, lessonStatus } = useProvide();
  const step = currentLesson ? stepOfLesson(currentLesson.id) : CURRICULUM[CURRICULUM.length - 1];
  if (!step) return null;

  const isDone = (lessonId?: string) =>
    Boolean(lessonId) && lessonStatus(lessonId!) === "completed";
  const doneCount = step.checklist.filter((c) => isDone(c.lessonId)).length;

  return (
    <Card className="p-6" hover>
      <SectionTitle
        title="このステップのゴール"
        icon={
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
            <Target size={16} strokeWidth={2} />
          </span>
        }
        action={
          <span className="font-display text-xs font-semibold text-slate-600 tabular-nums">
            {doneCount} / {step.checklist.length}
          </span>
        }
      />

      <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 p-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-snug text-slate-800">{step.goalHeading}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.goalDescription}</p>
        </div>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-md shadow-blue-200">
          <Smartphone size={26} strokeWidth={1.75} />
        </span>
      </div>

      <ul className="mt-4 space-y-2.5">
        {step.checklist.map((item) => {
          const done = isDone(item.lessonId);
          return (
            <li key={item.text} className="flex items-start gap-2.5">
              {done ? (
                <CheckCircle2
                  size={18}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0 text-emerald-500"
                />
              ) : (
                <Circle size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-slate-300" />
              )}
              <span className={`text-sm ${done ? "text-slate-700" : "text-slate-500"}`}>
                {item.text}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
