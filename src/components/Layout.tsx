import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Map, Package, MessageSquareText, Mic, Award, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABEL } from "@/lib/types";
import { isBackendEnabled } from "@/lib/supabase";

const NAV = [
  { to: "/", label: "ダッシュボード", short: "ホーム", icon: LayoutDashboard, end: true },
  { to: "/roadmap", label: "ロードマップ", short: "研修", icon: Map },
  { to: "/products", label: "商材", short: "商材", icon: Package },
  { to: "/scripts", label: "トーク", short: "トーク", icon: MessageSquareText },
  { to: "/roleplay", label: "ロープレ", short: "ロープレ", icon: Mic },
  { to: "/certification", label: "認定", short: "認定", icon: Award },
];

export function Layout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  if (!profile) return null;

  return (
    <div className="min-h-dvh md:flex">
      {/* デスクトップ：サイドバー */}
      <aside className="hidden md:flex md:w-64 md:shrink-0 md:flex-col border-r border-paper-line bg-paper">
        <div className="px-5 py-5">
          <div className="font-display text-base font-bold leading-tight text-ink">
            Sales Academy
          </div>
          <div className="text-xs text-ink-muted">ドコモ販売ヘルパー育成</div>
        </div>
        <nav className="flex-1 px-3">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper-soft"
                }`
              }
            >
              <Icon size={18} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-paper-line p-3">
          <div className="px-2 pb-2">
            <div className="text-sm font-semibold text-ink">{profile.display_name}</div>
            <div className="text-xs text-ink-muted">
              {ROLE_LABEL[profile.role]}
              {profile.store_name ? `・${profile.store_name}` : ""}
            </div>
          </div>
          <button
            onClick={() => {
              signOut();
              navigate("/login");
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-paper-soft"
          >
            <LogOut size={16} strokeWidth={1.75} /> ログアウト
          </button>
        </div>
      </aside>

      {/* メイン */}
      <div className="flex-1 pb-20 md:pb-0">
        {!isBackendEnabled && (
          <div className="bg-caution-soft px-4 py-2 text-center text-xs text-caution-deep">
            デモモード：Supabase未接続のためローカルseedで動作中（進捗は保存されません）
          </div>
        )}
        <main className="mx-auto w-full max-w-content px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>

      {/* モバイル：ボトムナビ（最小タップ高 56px ≥ 44px の床） */}
      <nav
        className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-6 border-t border-paper-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="メインナビゲーション"
      >
        {NAV.map(({ to, short, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex min-h-[56px] flex-col items-center justify-center gap-1 px-0.5 text-[11px] font-medium ${
                isActive ? "text-accent" : "text-ink-soft"
              }`
            }
          >
            <Icon size={20} strokeWidth={1.75} />
            <span className="leading-none whitespace-nowrap">{short}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
