import { Check, Lock } from "lucide-react";
import { STEPS, type StepStatus } from "@/growth/data/curriculum";
import { ACCENT, GIcon } from "@/growth/components/ui";

const STATUS_META: Record<StepStatus, { label: string; cls: string }> = {
  completed: { label: "完了", cls: "bg-emerald-50 text-emerald-700" },
  "in-progress": { label: "学習中", cls: "bg-blue-50 text-blue-700" },
  locked: { label: "ロック", cls: "bg-slate-100 text-slate-400" },
};

export function StepNavigation() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {STEPS.map((step) => {
        const a = ACCENT[step.accent];
        const locked = step.status === "locked";
        const active = step.status === "in-progress";
        const meta = STATUS_META[step.status];
        return (
          <div
            key={step.id}
            className={`group relative overflow-hidden rounded-2xl border bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-lift ${
              active
                ? "border-blue-300 shadow-lift ring-1 ring-blue-400/50"
                : "border-slate-100 shadow-card"
            }`}
          >
            {/* 上部の細いアクセント帯 */}
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
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.cls}`}
              >
                {step.status === "completed" && <Check size={12} strokeWidth={3} />}
                {locked && <Lock size={11} strokeWidth={2.5} />}
                {meta.label}
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
            <div className="mt-1 text-xs text-slate-400">{step.duration}</div>
          </div>
        );
      })}
    </div>
  );
}
