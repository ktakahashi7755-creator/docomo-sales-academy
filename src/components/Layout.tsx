import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Megaphone,
  Package,
  MessageSquareText,
  Mic,
  Award,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABEL } from "@/lib/types";
import { isBackendEnabled } from "@/lib/supabase";

const NAV = [
  { to: "/", label: "ダッシュボード", short: "ホーム", icon: LayoutDashboard, end: true },
  { to: "/roadmap", label: "ロードマップ", short: "研修", icon: Map },
  { to: "/catch", label: "キャッチ", short: "キャッチ", icon: Megaphone },
  { to: "/products", label: "商材", short: "商材", icon: Package },
  { to: "/scripts", label: "トーク", short: "トーク", icon: MessageSquareText },
  { to: "/roleplay", label: "ロープレ", short: "ロープレ", icon: Mic },
  { to: "/certification", label: "認定", short: "認定", icon: Award },
];

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-ink shadow-card" aria-hidden>
        <span className="font-num text-sm font-bold text-paper">d</span>
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-paper bg-accent" />
      </span>
      <div>
        <div className="font-display text-[15px] font-bold leading-tight tracking-tight text-ink">Sales Academy</div>
        <div className="text-[11px] leading-tight text-ink-muted">ドコモ販売ヘルパー育成</div>
      </div>
    </div>
  );
}

export function Layout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  if (!profile) return null;

  return (
    <div className="min-h-dvh md:flex">
      {/* デスクトップ：サイドバー */}
      <aside className="hidden md:sticky md:top-0 md:flex md:h-dvh md:w-64 md:shrink-0 md:flex-col border-r border-paper-line bg-paper">
        <div className="px-5 py-5">
          <BrandMark />
        </div>
        <nav className="flex-1 overflow-y-auto px-3">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `group relative mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-ink text-paper shadow-card" : "text-ink-soft hover:bg-paper-soft hover:text-ink"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute -left-3 h-5 w-1 rounded-r-full bg-accent" aria-hidden />
                  )}
                  <Icon size={18} strokeWidth={1.75} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-paper-line p-3">
          <div className="flex items-center gap-2.5 px-2 pb-2.5">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper-soft font-num text-xs font-bold text-ink"
              aria-hidden
            >
              {profile.display_name.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-ink">{profile.display_name}</div>
              <div className="truncate text-xs text-ink-muted">
                {ROLE_LABEL[profile.role]}
                {profile.store_name ? `・${profile.store_name}` : ""}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              signOut();
              navigate("/login");
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-paper-soft hover:text-ink"
          >
            <LogOut size={16} strokeWidth={1.75} /> ログアウト
          </button>
        </div>
      </aside>

      {/* メイン */}
      <div className="min-w-0 flex-1 pb-24 md:pb-0">
        {!isBackendEnabled && (
          <div className="bg-caution-soft px-4 py-1.5 text-center text-xs font-medium text-caution">
            デモモード：Supabase未接続のためローカルseedで動作中（進捗は保存されません）
          </div>
        )}
        <main className="mx-auto w-full max-w-content px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>

      {/* モバイル：ボトムナビ */}
      <nav className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-7 border-t border-paper-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {NAV.map(({ to, short, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                isActive ? "text-accent" : "text-ink-muted"
              }`
            }
          >
            <Icon size={19} strokeWidth={1.75} />
            {short}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
