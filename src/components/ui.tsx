import type { ReactNode } from "react";
import { isPassed } from "@/lib/progress";

/** ページ見出し（eyebrow + 大見出し + 補足）。全画面で余白・字間を統一する。 */
export function PageTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <div className="font-num text-xs font-semibold uppercase tracking-widest text-ink-muted">
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/** loading 状態：トークン準拠のスケルトン。reduced-motion は index.css で無効化される。 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-paper-soft ${className}`} aria-hidden="true" />
  );
}

/** loading 状態のカード（複数行のスケルトン）。`PageLoading` の構成部品かつ単体でも利用可。 */
export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <Card className="space-y-3 p-5" aria-busy="true" aria-label="読み込み中">
      <Skeleton className="h-5 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </Card>
  );
}

/** ページ全体の loading 状態（見出し＋カード群のスケルトン）。 */
export function PageLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="読み込み中">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 md:grid-cols-3">
        <SkeletonCard lines={3} />
        <SkeletonCard lines={3} />
        <SkeletonCard lines={3} />
      </div>
    </div>
  );
}

/** empty 状態：謝罪でなく「次の行動」を示す。 */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl2 border border-dashed border-paper-line bg-paper-soft px-6 py-10 text-center">
      {icon && <div className="text-ink-muted">{icon}</div>}
      <div className="font-medium text-ink">{title}</div>
      {description && <p className="max-w-sm text-sm text-ink-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/** error 状態：何が起き・どう直すかを示し、再試行の導線を置く。 */
export function ErrorState({
  title = "読み込みに失敗しました",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-2 rounded-xl2 border border-fail-soft bg-fail-soft px-6 py-10 text-center"
    >
      <div className="font-semibold text-fail">{title}</div>
      {description && <p className="max-w-sm text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function Card({
  children,
  className = "",
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "fieldset";
}) {
  return (
    <As className={`rounded-xl2 bg-paper border border-paper-line shadow-card ${className}`}>
      {children}
    </As>
  );
}

export function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="mb-4">
      {eyebrow && (
        <div className="font-num text-xs font-semibold tracking-widest text-ink-muted uppercase">
          {eyebrow}
        </div>
      )}
      <h2 className="text-lg font-bold text-ink">{title}</h2>
    </div>
  );
}

export function ProgressBar({
  value,
  tone = "ink",
}: {
  value: number;
  tone?: "ink" | "pass" | "caution";
}) {
  const bar = tone === "pass" ? "bg-pass" : tone === "caution" ? "bg-caution" : "bg-ink";
  return (
    <div
      className="h-2 w-full rounded-full bg-paper-soft overflow-hidden"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full ${bar} transition-[width] duration-200`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function RankPill({ level, label }: { level: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-paper">
      <span className="font-num text-xs font-semibold tabular-nums">Lv.{level}</span>
      <span className="text-xs font-medium">{label}</span>
    </span>
  );
}

export function TierBadge({ tier }: { tier?: "regular" | "gold" | "platinum" }) {
  if (!tier) return null;
  const map = {
    regular: { bg: "bg-paper-soft", text: "text-ink-soft", label: "REGULAR" },
    gold: { bg: "bg-gold-soft", text: "text-gold-deep", label: "GOLD" },
    platinum: { bg: "bg-platinum-soft", text: "text-platinum-deep", label: "PLATINUM" },
  } as const;
  const s = map[tier];
  return (
    <span
      className={`font-num inline-block rounded px-2 py-0.5 text-[11px] font-semibold tracking-wider ${s.bg} ${s.text}`}
    >
      {s.label}
    </span>
  );
}

export function ScoreChip({ score, passing }: { score?: number; passing: number }) {
  if (score == null) return <span className="text-xs text-ink-muted">未受講</span>;
  const passed = isPassed(score, passing);
  return (
    <span
      className={`font-num inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${passed ? "bg-pass-soft text-pass-deep" : "bg-caution-soft text-caution-deep"}`}
    >
      {score}点 {passed ? "合格" : "未達"}
    </span>
  );
}
