import { Suspense } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { LayoutGrid, Package, Megaphone, Users, ScrollText, ArrowLeft } from "lucide-react";
import { PageLoading } from "@/components/ui";

const TABS = [
  { to: "/admin", label: "概要", icon: LayoutGrid, end: true },
  { to: "/admin/products", label: "商材", icon: Package },
  { to: "/admin/announcements", label: "お知らせ", icon: Megaphone },
  { to: "/admin/users", label: "ユーザー", icon: Users },
  { to: "/admin/audit", label: "監査ログ", icon: ScrollText },
];

export function AdminLayout() {
  return (
    <div className="min-h-dvh bg-paper-soft">
      <header className="border-b border-paper-line bg-paper">
        <div className="mx-auto flex max-w-content items-center justify-between px-4 py-3 md:px-8">
          <div>
            <div className="font-num text-xs font-semibold uppercase tracking-widest text-ink-muted">
              Admin
            </div>
            <div className="font-display text-base font-bold text-ink">管理画面</div>
          </div>
          <Link
            to="/"
            className="inline-flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-sm text-ink-soft hover:text-ink"
          >
            <ArrowLeft size={16} /> 学習画面へ
          </Link>
        </div>
        <nav
          className="mx-auto max-w-content overflow-x-auto px-2 md:px-6"
          aria-label="管理メニュー"
        >
          <div className="flex gap-1">
            {TABS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex min-h-[44px] items-center gap-1.5 whitespace-nowrap border-b-2 px-3 text-sm font-medium ${
                    isActive
                      ? "border-ink text-ink"
                      : "border-transparent text-ink-muted hover:text-ink"
                  }`
                }
              >
                <Icon size={16} strokeWidth={1.75} />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-content px-4 py-6 md:px-8 md:py-8">
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
