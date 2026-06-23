import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABEL, type Role } from "@/lib/types";

const ROLES: Role[] = ["trainee", "helper", "closer", "sv", "admin"];

export function Login() {
  const { signInDemo } = useAuth();
  const navigate = useNavigate();
  // 二重遷移ガード＋本認証(Supabase)移行に備えた pending/error の置き場。
  const [pending, setPending] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn(role: Role) {
    if (pending) return; // 連打による二重遷移を防ぐ
    setPending(role);
    setError(null);
    try {
      signInDemo(role);
      navigate("/");
    } catch {
      setError("入室に失敗しました。時間をおいて、もう一度お試しください。");
      setPending(null);
    }
  }

  return (
    <div className="grid min-h-dvh md:grid-cols-2">
      {/* 左：ブランド面 */}
      <div className="relative hidden flex-col justify-between bg-ink p-10 text-paper md:flex">
        <div>
          <div className="font-display text-sm font-semibold tracking-widest text-paper/70">
            DOCOMO SALES ACADEMY
          </div>
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold leading-tight">
            未経験から、
            <br />
            認定クローザーへ。
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
          {error && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-fail-soft bg-fail-soft px-3 py-2 text-sm text-fail-deep"
            >
              {error}
            </div>
          )}
          <div className="mt-6 space-y-2">
            {ROLES.map((role) => {
              const isPending = pending === role;
              return (
                <button
                  key={role}
                  onClick={() => handleSignIn(role)}
                  disabled={pending !== null}
                  aria-busy={isPending}
                  className="flex min-h-[52px] w-full items-center justify-between rounded-xl2 border border-paper-line bg-paper px-4 py-3 text-left shadow-card transition-colors hover:bg-paper-soft disabled:opacity-60"
                >
                  <span className="flex items-center gap-2 font-medium text-ink">
                    {isPending && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
                    {ROLE_LABEL[role]}として入る
                  </span>
                  <span className="font-num text-xs uppercase tracking-wider text-ink-muted">
                    {role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
