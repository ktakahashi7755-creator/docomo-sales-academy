import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useCertification } from "@/context/CertificationContext";
import { CERT_CONDITIONS, PHASES } from "@/data/seed";
import { Card, PageTitle, ProgressBar, EmptyState, PageLoading } from "@/components/ui";
import { flattenModules, summarizeProgress } from "@/lib/progress";
import { certificationReadiness } from "@/lib/certification";
import type { SvTrainee } from "@/lib/types";
import { Award, ChevronRight, Users, BadgeCheck, Sprout } from "lucide-react";

const ALL_MODULES = flattenModules(PHASES);

type Status = "approved" | "eligible" | "growing";

function statusOf(t: SvTrainee): Status {
  const r = certificationReadiness(CERT_CONDITIONS, {
    modules: ALL_MODULES,
    progress: t.progress,
    level: t.level,
  });
  if (r.approved) return "approved";
  if (r.eligible) return "eligible";
  return "growing";
}

// 「承認可能」は SV のアクション待ちのため caution（注意喚起）色。pass(緑=達成済み)は
// 「認定済み」と誤読されるため使わない。
const STATUS_META: Record<Status, { label: string; cls: string }> = {
  approved: { label: "認定済み", cls: "bg-gold-soft text-gold-deep" },
  eligible: { label: "承認可能", cls: "bg-caution-soft text-caution-deep" },
  growing: { label: "育成中", cls: "bg-paper-soft text-ink-soft" },
};

export function SvDashboard() {
  const { loading, trainees } = useCertification();
  if (loading) return <PageLoading />;

  const rows = trainees.map((t) => ({
    trainee: t,
    status: statusOf(t),
    rate: summarizeProgress(ALL_MODULES, t.progress).completionRate,
  }));
  const count = (s: Status) => rows.filter((r) => r.status === s).length;

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Supervisor"
        title="SVダッシュボード"
        description="担当メンバーの進捗と認定状況を確認し、条件を満たした研修生をクローザーに承認します。"
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          icon={<Users size={18} strokeWidth={1.75} />}
          label="メンバー"
          value={rows.length}
        />
        <StatCard
          icon={<BadgeCheck size={18} strokeWidth={1.75} />}
          label="承認可能"
          value={count("eligible")}
          tone="caution"
        />
        <StatCard
          icon={<Award size={18} strokeWidth={1.75} />}
          label="認定済み"
          value={count("approved")}
          tone="gold"
        />
        <StatCard
          icon={<Sprout size={18} strokeWidth={1.75} />}
          label="育成中"
          value={count("growing")}
        />
      </div>

      <Card as="section" className="p-5">
        <h2 className="mb-3 text-sm font-bold text-ink-soft">メンバー一覧</h2>
        {rows.length === 0 ? (
          <EmptyState
            title="担当メンバーがいません"
            description="メンバーが割り当てられると、ここに進捗と認定状況が表示されます。"
          />
        ) : (
          <ul className="space-y-2">
            {rows.map(({ trainee: t, status, rate }) => {
              const meta = STATUS_META[status];
              return (
                <li key={t.id}>
                  <Link
                    to={`/sv/${t.id}`}
                    aria-label={`${t.display_name}さんの詳細（${meta.label}・進捗${rate}%）`}
                    className="flex items-center gap-3 rounded-xl2 border border-paper-line px-3 py-3 transition-colors hover:bg-paper-soft"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-ink">
                          {t.display_name}
                        </span>
                        <span
                          className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold ${meta.cls}`}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-ink-muted">
                        {t.store_name}
                        {t.team_name ? `・${t.team_name}` : ""}・Lv.{t.level}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <ProgressBar value={rate} tone={rate >= 100 ? "pass" : "ink"} />
                        <span className="font-num w-10 shrink-0 text-right text-xs font-semibold text-ink tabular-nums">
                          {rate}%
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="shrink-0 text-ink-muted" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone = "ink",
}: {
  icon: ReactNode;
  label: string;
  value: number;
  tone?: "ink" | "caution" | "gold";
}) {
  // 0 件は強調しない（達成ありと誤認させない）。
  const effective = value === 0 ? "ink" : tone;
  const valueCls =
    effective === "caution"
      ? "text-caution-deep"
      : effective === "gold"
        ? "text-gold-deep"
        : "text-ink";
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-ink-muted" aria-hidden="true">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div
        className={`font-num mt-1 text-2xl font-bold tabular-nums ${valueCls}`}
        aria-label={`${label} ${value}人`}
      >
        {value}
      </div>
    </Card>
  );
}
