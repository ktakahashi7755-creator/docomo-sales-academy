import { Link } from "react-router-dom";
import { Check, Lock } from "lucide-react";
import { CURRICULUM, stepOfLesson } from "@/growth/data/curriculum";
import { useProvide, stepStatus } from "@/growth/context/ProvideContext";
import { ACCENT, GIcon } from "@/growth/components/ui";

export function StepNavigation() {
  const { stepProgress, currentLesson } = useProvide();
  const activeStepId = currentLesson ? stepOfLesson(currentLesson.id)?.id : undefined;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {CURRICULUM.map((step) => {
        const a = ACCENT[step.accent];
        const status = stepStatus(step, stepProgress);
        const locked = status === "locked";
        const active = step.id === activeStepId;
        const pct = stepProgress(step.id);
        return (
          <Link
            key={step.id}
            to="/curriculum"
            className={`group relative overflow-hidden rounded-2xl border bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-lift ${
              active
                ? "border-blue-300 shadow-lift ring-1 ring-blue-400/50"
                : "border-slate-100 shadow-card"
            }`}
          >
            <span
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${a.from} ${a.to} ${
                locked ? "opacity-30" : ""
              }`}
            />
            <div className="flex items-start justify-between">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm ${
                  locked ? "bg-slate-200 text-slate-400" : `bg-gradient-to-br ${a.from} ${a.to}`
                }`}
              >
                <GIcon name={step.icon} size={20} strokeWidth={2} />
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  status === "completed"
                    ? "bg-emerald-50 text-emerald-700"
                    : status === "in-progress"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {status === "completed" && <Check size={12} strokeWidth={3} />}
                {locked && <Lock size={11} strokeWidth={2.5} />}
                {status === "completed" ? "完了" : status === "in-progress" ? "学習中" : "ロック"}
              </span>
            </div>
            <div
              className={`font-display mt-3 text-xs font-bold tracking-wider ${
                locked ? "text-slate-400" : a.softText
              }`}
            >
              STEP {String(step.no).padStart(2, "0")}
            </div>
            <div
              className={`mt-0.5 text-sm font-bold leading-snug ${
                locked ? "text-slate-400" : "text-slate-800"
              }`}
            >
              {step.title}
            </div>
            <div className="mt-1 text-xs text-slate-500 tabular-nums">
              {locked ? `目安 ${step.duration}` : `${pct}% ・ 目安 ${step.duration}`}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
