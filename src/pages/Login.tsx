import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABEL, type Role } from "@/lib/types";

const ROLES: Role[] = ["trainee", "helper", "closer", "sv", "admin"];

function BrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between bg-ink p-10 text-paper md:flex">
      <div className="font-display text-sm font-semibold tracking-widest text-paper/70">
        DOCOMO SALES ACADEMY
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
  );
}

/** デモモード：役割を選んで入る（Supabase 未設定時）。 */
function DemoLogin() {
  const { signInDemo } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSignIn(role: Role) {
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
  );
}

/** 本番モード：メール OTP（6桁コード）でログイン。 */
function OtpLogin() {
  const { sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      await sendOtp(email.trim());
      setStep("code");
      setInfo(`${email.trim()} に確認コードを送りました。メールをご確認ください。`);
    } catch {
      setError("コードの送信に失敗しました。メールアドレスをご確認ください。");
    } finally {
      setPending(false);
    }
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      await verifyOtp(email.trim(), code.trim());
      navigate("/");
    } catch {
      setError("コードが正しくないか、期限切れです。もう一度お試しください。");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-xl font-bold text-ink">ログイン</h2>
      <p className="mt-1 text-sm text-ink-muted">
        ご自身のメールアドレスに届く確認コードで入ります。
      </p>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-fail-soft bg-fail-soft px-3 py-2 text-sm text-fail-deep"
        >
          {error}
        </div>
      )}
      {info && (
        <div
          aria-live="polite"
          className="mt-4 rounded-lg border border-pass-soft bg-pass-soft px-3 py-2 text-sm text-pass-deep"
        >
          {info}
        </div>
      )}

      {step === "email" ? (
        <form className="mt-6 space-y-3" onSubmit={handleSendOtp}>
          <label htmlFor="email" className="block text-sm font-medium text-ink-soft">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl2 border border-paper-line bg-paper px-4 py-3 text-ink shadow-card placeholder:text-ink-muted"
          />
          <button
            type="submit"
            disabled={pending || email.trim() === ""}
            aria-busy={pending}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl2 bg-ink px-4 py-3 font-medium text-paper transition-opacity disabled:opacity-60"
          >
            {pending ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <Mail size={16} aria-hidden="true" />
            )}
            確認コードを送る
          </button>
        </form>
      ) : (
        <form className="mt-6 space-y-3" onSubmit={handleVerify}>
          <label htmlFor="code" className="block text-sm font-medium text-ink-soft">
            確認コード（6桁）
          </label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            className="font-num w-full rounded-xl2 border border-paper-line bg-paper px-4 py-3 text-lg tracking-[0.3em] text-ink shadow-card placeholder:text-ink-muted"
          />
          <button
            type="submit"
            disabled={pending || code.length < 6}
            aria-busy={pending}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl2 bg-ink px-4 py-3 font-medium text-paper transition-opacity disabled:opacity-60"
          >
            {pending && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
            ログイン
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setCode("");
              setError(null);
              setInfo(null);
            }}
            className="flex min-h-[44px] w-full items-center justify-center gap-1 text-sm text-ink-soft hover:text-ink"
          >
            <ArrowLeft size={14} /> メールアドレスを変更
          </button>
        </form>
      )}
    </div>
  );
}

export function Login() {
  const { mode } = useAuth();
  return (
    <div className="grid min-h-dvh md:grid-cols-2">
      <BrandPanel />
      <div className="flex items-center justify-center p-6">
        {mode === "backend" ? <OtpLogin /> : <DemoLogin />}
      </div>
    </div>
  );
}
