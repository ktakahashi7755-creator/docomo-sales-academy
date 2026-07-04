import { useNavigate } from "react-router-dom";
import { ArrowRight, Award, GraduationCap, Headset, ShieldCheck, UserCog } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABEL, type Role } from "@/lib/types";

const ROLES: { role: Role; icon: typeof GraduationCap; desc: string }[] = [
  { role: "trainee", icon: GraduationCap, desc: "研修ロードマップからスタート" },
  { role: "helper", icon: Headset, desc: "現場で使うトーク・商材を確認" },
  { role: "closer", icon: Award, desc: "認定条件・高難度ロープレへ" },
  { role: "sv", icon: ShieldCheck, desc: "研修生の進捗・承認（今後拡張）" },
  { role: "admin", icon: UserCog, desc: "コンテンツ管理（今後拡張）" },
];

const FLOW = ["興味付け", "着座", "提案", "クロージング", "引継ぎ"];

export function Login() {
  const { signInDemo } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="grid min-h-dvh md:grid-cols-2">
      {/* 左：ブランド面 */}
      <div className="surface-hero relative hidden flex-col justify-between overflow-hidden p-10 text-paper md:flex">
        <div className="relative z-10 flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-paper/10 backdrop-blur">
            <span className="font-num text-sm font-bold">d</span>
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <div className="font-display text-sm font-semibold tracking-widest text-paper/80">
            DOCOMO SALES ACADEMY
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight">
            未経験から、
            <br />
            認定クローザーへ。
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/70">
            キャッチ・座学・理解度テスト・トークスクリプト・音声ロープレ・AI評価を一本の道筋に。Lv.0からLv.10まで、迷わず進める実践型トレーニング。
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-y-2">
            {FLOW.map((step, i) => (
              <span key={step} className="flex items-center">
                <span className="rounded-full border border-paper/20 bg-paper/10 px-3 py-1 text-xs font-semibold backdrop-blur">
                  {step}
                </span>
                {i < FLOW.length - 1 && <ArrowRight size={12} className="mx-1 text-paper/40" aria-hidden />}
              </span>
            ))}
          </div>
        </div>

        <div className="font-num relative z-10 flex items-center gap-3 text-xs text-paper/50">
          <span>Level 0</span>
          <span className="h-px w-16 bg-gradient-to-r from-paper/30 to-accent/60" aria-hidden />
          <span className="font-semibold text-paper/80">Level 10 — 認定クローザー</span>
        </div>
      </div>

      {/* 右：ログイン */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-up">
          <h2 className="text-xl font-bold tracking-tight text-ink">ログイン</h2>
          <p className="mt-1 text-sm text-ink-muted">
            デモとして役割を選んで入れます（Supabase接続後は実アカウントに切替）。
          </p>
          <div className="stagger mt-6 space-y-2">
            {ROLES.map(({ role, icon: Icon, desc }) => (
              <button
                key={role}
                onClick={() => {
                  signInDemo(role);
                  navigate("/");
                }}
                className="group flex w-full items-center gap-3.5 rounded-xl2 border border-paper-line bg-paper px-4 py-3 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-lift"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper-soft text-ink transition-colors group-hover:bg-ink group-hover:text-paper">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink">{ROLE_LABEL[role]}として入る</span>
                  <span className="block truncate text-xs text-ink-muted">{desc}</span>
                </span>
                <ArrowRight
                  size={16}
                  className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
