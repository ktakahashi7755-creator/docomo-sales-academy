import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { CERT_CONDITIONS, BADGES, PHASES } from "@/data/seed";
import { Card, PageLoading, PageTitle, ProgressBar } from "@/components/ui";
import { evaluateCertConditions, flattenModules, isBadgeEarned } from "@/lib/progress";
import { certificationReadiness } from "@/lib/certification";
import { CheckCircle2, Circle, Award, Lock, ChevronRight } from "lucide-react";

// PHASES は定数なので一度だけ平坦化する。
const ALL_MODULES = flattenModules(PHASES);

// 未達条件から「次の一段」へ誘導するルート。c10 は SV 承認待ちのためリンク無し。
const CONDITION_LINK: Record<string, { to: string; label: string } | undefined> = {
  c1: { to: "/roadmap", label: "ロードマップへ" },
  c2: { to: "/roadmap", label: "ロードマップへ" },
  c3: { to: "/roadmap", label: "ロードマップへ" },
  c4: { to: "/roleplay", label: "ロープレへ" },
  c5: { to: "/roleplay", label: "ロープレへ" },
  c6: { to: "/roleplay", label: "ロープレへ" },
  c7: { to: "/roleplay", label: "ロープレへ" },
  c8: { to: "/roleplay", label: "ロープレへ" },
  c9: { to: "/roleplay", label: "ロープレへ" },
  c10: undefined,
};

export function Certification() {
  const { profile, progress } = useAuth();
  // loading：認証解決前（Phase 1 で非同期化したときの受け皿）。
  if (!profile) return <PageLoading />;

  const ctx = { modules: ALL_MODULES, progress, level: profile.level };
  const { conditions, doneCount, total, rate } = evaluateCertConditions(CERT_CONDITIONS, ctx);
  const { eligible, approved } = certificationReadiness(CERT_CONDITIONS, ctx);
  const earnedBadges = BADGES.filter((b) => isBadgeEarned(b.id, ctx));

  // c10（SV承認）の現在地：承認可能になったら「SV承認待ち」を出す。
  const c10Badge = approved ? null : eligible ? "SV承認待ち" : null;

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Certification"
        title="クローザー認定"
        description="全条件を満たし、SV承認を得ると「認定クローザー（Lv.10）」になります。"
      />

      <Card className="p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl2 bg-gold-soft text-gold-deep">
            <Award size={26} strokeWidth={1.75} />
          </div>
          <div className="flex-1">
            <div className="text-sm text-ink-muted">達成状況</div>
            <div className="font-num text-2xl font-bold text-ink">
              {doneCount}
              <span className="text-base text-ink-muted"> / {total}</span>
            </div>
          </div>
          <div className="font-num text-3xl font-bold text-ink">
            {rate}
            <span className="text-base text-ink-muted">%</span>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={rate} tone={rate >= 100 ? "pass" : "ink"} />
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-bold text-ink-soft">認定条件</h2>
        <ul className="space-y-2.5">
          {conditions.map((c) => {
            const link = !c.done ? CONDITION_LINK[c.id] : undefined;
            return (
              <li key={c.id} className="flex items-center gap-3">
                {c.done ? (
                  <CheckCircle2 size={18} strokeWidth={1.75} className="shrink-0 text-pass-deep" />
                ) : (
                  <Circle size={18} strokeWidth={1.75} className="shrink-0 text-paper-line" />
                )}
                <span className={`flex-1 text-sm ${c.done ? "text-ink" : "text-ink-soft"}`}>
                  {c.label}
                  {c.id === "c10" && c10Badge && (
                    <span className="ml-2 rounded bg-caution-soft px-1.5 py-0.5 text-[11px] font-semibold text-caution-deep">
                      {c10Badge}
                    </span>
                  )}
                </span>
                {link && (
                  <Link
                    to={link.to}
                    className="inline-flex shrink-0 items-center gap-0.5 rounded-lg px-2 py-1 text-xs font-medium text-ink hover:bg-paper-soft"
                  >
                    {link.label} <ChevronRight size={14} />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-bold text-ink-soft">
          獲得バッジ
          <span className="font-num ml-2 text-ink-muted">
            {earnedBadges.length} / {BADGES.length}
          </span>
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {BADGES.map((b) => {
            const earned = earnedBadges.some((e) => e.id === b.id);
            return (
              <div
                key={b.id}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  earned ? "bg-gold-soft" : "bg-paper-soft"
                }`}
              >
                {earned ? (
                  <Award size={18} strokeWidth={1.75} className="shrink-0 text-gold-deep" />
                ) : (
                  <Lock size={18} strokeWidth={1.75} className="shrink-0 text-ink-muted" />
                )}
                <div>
                  <div className={`text-sm font-medium ${earned ? "text-gold-deep" : "text-ink"}`}>
                    {b.name}
                  </div>
                  <div className="text-xs text-ink-muted">{b.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
