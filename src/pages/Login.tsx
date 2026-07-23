import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABEL, type Role } from "@/lib/types";

const ROLES: Role[] = ["trainee", "helper", "closer", "sv", "admin"];

export function Login() {
  const { signInDemo } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="grid min-h-dvh md:grid-cols-2">
      {/* 左：ブランド面 */}
      <div className="relative hidden flex-col justify-between bg-ink p-10 text-paper md:flex">
        <div>
          <div className="font-display text-sm font-semibold tracking-widest text-paper/70">DOCOMO SALES ACADEMY</div>
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold leading-tight">
            未経験から、<br />認定クローザーへ。
          </h1>
          <p className="mt-3 max-w-sm text-sm text-paper/70">
            座学・理解度テスト・トークスクリプト・音声ロープレ・AI評価を一本の道筋に。Lv.0からLv.10まで、迷わず進める実践型トレーニング。
          </p>
        </div>
        <div className="font-num text-xs text-paper/50">Level 0 → Level 10</div>
      </div>

      {/* 右：ログイン */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-bold text-ink">ログイン</h2>
          <p className="mt-1 text-sm text-ink-muted">
            デモとして役割を選んで入れます（Supabase接続後は実アカウントに切替）。
          </p>
          <div className="mt-6 space-y-2">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => {
                  signInDemo(role);
                  navigate("/");
                }}
                className="flex w-full items-center justify-between rounded-xl2 border border-paper-line bg-paper px-4 py-3 text-left shadow-card transition-colors hover:bg-paper-soft"
              >
                <span className="font-medium text-ink">{ROLE_LABEL[role]}として入る</span>
                <span className="font-num text-xs uppercase tracking-wider text-ink-muted">{role}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
