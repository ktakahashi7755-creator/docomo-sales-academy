import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
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
        <div className="font-num text-xs font-semibold tracking-widest text-ink-muted uppercase">{eyebrow}</div>
      )}
      <h2 className="text-lg font-bold text-ink">{title}</h2>
    </div>
  );
}

export function ProgressBar({ value, tone = "ink" }: { value: number; tone?: "ink" | "pass" | "caution" }) {
  const bar = tone === "pass" ? "bg-pass" : tone === "caution" ? "bg-caution" : "bg-ink";
  return (
    <div className="h-2 w-full rounded-full bg-paper-soft overflow-hidden" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full ${bar} transition-[width] duration-500`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
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
  return <span className={`font-num inline-block rounded px-2 py-0.5 text-[11px] font-semibold tracking-wider ${s.bg} ${s.text}`}>{s.label}</span>;
}

export function ScoreChip({ score, passing }: { score?: number; passing: number }) {
  if (score == null) return <span className="text-xs text-ink-muted">未受講</span>;
  const passed = score >= passing;
  return (
    <span className={`font-num inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${passed ? "bg-pass-soft text-pass" : "bg-caution-soft text-caution"}`}>
      {score}点 {passed ? "合格" : "未達"}
    </span>
  );
}
