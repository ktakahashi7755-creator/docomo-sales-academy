import { NavLink, Outlet } from "react-router-dom";
import { Bot } from "lucide-react";
import { NAV_ITEMS } from "@/growth/data/curriculum";
import { useProvide } from "@/growth/context/ProvideContext";
import { Sidebar } from "@/growth/components/Sidebar";
import { Header } from "@/growth/components/Header";
import { AIBot } from "@/growth/components/AIBot";
import { GIcon } from "@/growth/components/ui";

const MOBILE_IDS = ["dashboard", "curriculum", "content", "roleplay", "quiz"];
const MOBILE_NAV = NAV_ITEMS.filter((n) => MOBILE_IDS.includes(n.id));

export function GrowthLayout() {
  const { openBot } = useProvide();
  return (
    <div className="font-sans flex min-h-dvh bg-slate-50 text-slate-800">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-6 pb-24 md:px-7 md:py-8 lg:pb-10">
          <Outlet />
        </main>
      </div>

      {/* モバイル：ボトムナビ */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-slate-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        aria-label="メインナビゲーション"
      >
        {MOBILE_NAV.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex min-h-[56px] flex-col items-center justify-center gap-1 text-[11px] font-medium ${
                isActive ? "text-blue-600" : "text-slate-400"
              }`
            }
          >
            <GIcon name={item.icon} size={20} strokeWidth={2} />
            <span className="leading-none">{item.label.replace("・", "")}</span>
          </NavLink>
        ))}
      </nav>

      {/* モバイル：AIボット起動ボタン */}
      <button
        type="button"
        onClick={openBot}
        aria-label="AIサポートBotを開く"
        className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lift transition hover:-translate-y-0.5 lg:hidden"
      >
        <Bot size={24} />
      </button>

      <AIBot />
    </div>
  );
}
