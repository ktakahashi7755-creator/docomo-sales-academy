import { useAuth } from "@/context/AuthContext";
import { useContent } from "@/context/ContentContext";
import { Card, PageTitle } from "@/components/ui";
import { ROLE_LABEL, type Role } from "@/lib/types";

const ROLES: Role[] = ["trainee", "helper", "closer", "sv", "admin"];

export function AdminUsers() {
  const { profile } = useAuth();
  const { users, setUserRole, setUserActive } = useContent();
  const actor = profile?.display_name ?? "管理者";

  return (
    <div className="space-y-6">
      <PageTitle
        title="ユーザーと権限"
        description="役割の変更と有効・無効を管理します。個人データは本人と権限者のみ参照できます。"
      />

      <Card>
        <ul className="divide-y divide-paper-line">
          {users.map((u) => (
            <li key={u.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ink">{u.display_name}</span>
                  {!u.is_active && (
                    <span className="rounded bg-paper-soft px-1.5 py-0.5 text-[11px] font-semibold text-ink-muted">
                      無効
                    </span>
                  )}
                </div>
                <div className="text-xs text-ink-muted">{u.store_name ?? "—"}</div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <span className="sr-only">{u.display_name} の権限</span>
                <select
                  value={u.role}
                  onChange={(e) => setUserRole(u.id, e.target.value as Role, actor)}
                  className="min-h-[44px] rounded-lg border border-paper-line bg-paper px-3 text-sm text-ink shadow-card"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABEL[r]}
                    </option>
                  ))}
                </select>
              </label>

              <button
                onClick={() => setUserActive(u.id, !u.is_active, actor)}
                aria-pressed={u.is_active}
                className={`min-h-[44px] rounded-lg px-3 text-sm font-medium ${
                  u.is_active
                    ? "border border-paper-line text-ink-soft hover:bg-paper-soft"
                    : "bg-ink text-paper"
                }`}
              >
                {u.is_active ? "無効にする" : "有効にする"}
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
