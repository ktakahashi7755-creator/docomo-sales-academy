import { BarChart3, Bell, LogOut } from "lucide-react";
import { useProvide } from "@/growth/context/ProvideContext";
import { stepOfLesson } from "@/growth/data/curriculum";
import { ProgressRing } from "@/growth/components/ui";

export function Header() {
  const { user, overallProgress, currentLesson } = useProvide();
  const step = currentLesson ? stepOfLesson(currentLesson.id) : undefined;
  const stepLabel = step ? `STEP ${String(step.no).padStart(2, "0")} 学習中` : "全カリキュラム修了";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/85 px-5 py-3.5 backdrop-blur md:px-7">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-200 lg:hidden">
            <BarChart3 size={20} strokeWidth={2.5} className="text-white" />
          </span>
          <h1 className="font-display text-xl font-bold tracking-tight text-slate-800 md:text-2xl">
            Provide Growth Academy
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-1.5 md:flex">
            <ProgressRing
              value={overallProgress}
              size={40}
              stroke={4}
              label={`${overallProgress}%`}
            />
            <div className="leading-tight">
              <div className="text-[11px] text-slate-500">現在の進捗</div>
              <div className="text-sm font-semibold text-slate-800">{stepLabel}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-500 font-display text-sm font-bold text-white">
              {user.name.slice(0, 1)}
            </span>
            <div className="hidden leading-tight sm:block">
              <div className="text-sm font-semibold text-slate-800">{user.name} さん</div>
              <span className="mt-0.5 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                {user.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="通知"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <Bell size={18} strokeWidth={2} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
            </button>
            <button
              type="button"
              aria-label="ログアウト"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LogOut size={18} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
