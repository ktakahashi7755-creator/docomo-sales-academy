import { NavLink } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import { NAV_ITEMS } from "@/growth/data/curriculum";
import { useProvide } from "@/growth/context/ProvideContext";
import { GIcon } from "@/growth/components/ui";

export function Sidebar() {
  const { openBot } = useProvide();
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-gradient-to-b from-[#16305a] to-[#0a1830] lg:flex">
      {/* ロゴ */}
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-900/40">
          <BarChart3 size={20} strokeWidth={2.5} className="text-white" />
        </span>
        <div className="leading-tight">
          <div className="text-[11px] font-medium uppercase tracking-widest text-blue-300/80">
            Online Center
          </div>
          <div className="font-display text-sm font-bold text-white">Provide Growth Academy</div>
        </div>
      </div>

      {/* メニュー */}
      <nav className="flex-1 space-y-1 px-3 py-2" aria-label="メインメニュー">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
                  : "text-slate-300/90 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <GIcon name={item.icon} size={18} strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* AIサポート */}
      <div className="p-3">
        <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-500">
              <GIcon name="bot" size={18} className="text-white" />
            </span>
            <div className="text-sm font-semibold text-white">困ったときは</div>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            AIサポートBotがあなたの質問にいつでもお答えします。
          </p>
          <button
            type="button"
            onClick={openBot}
            className="mt-3 w-full rounded-lg bg-white py-2 text-sm font-semibold text-blue-700 transition duration-200 hover:bg-blue-50"
          >
            相談する
          </button>
        </div>
      </div>
    </aside>
  );
}
