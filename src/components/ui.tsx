import type { ReactNode } from "react";
import type { FlowPhase } from "@/lib/types";

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

/** ページ先頭の見出しブロック（全ページ共通の型） */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 animate-fade-up">
      <div>
        <div className="font-num flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
          {eyebrow}
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink md:text-[1.7rem]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-muted">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

const PHASE_STYLE: Record<FlowPhase, string> = {
  興味付け: "bg-accent-soft text-accent-deep",
  着座: "bg-gold-soft text-gold-deep",
  提案: "bg-ink text-paper",
  クロージング: "bg-pass-soft text-pass",
  引継ぎ: "bg-platinum-soft text-platinum-deep",
};

/** キャッチ5フェーズのチップ */
export function PhaseChip({ phase, size = "sm" }: { phase: FlowPhase; size?: "sm" | "md" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${PHASE_STYLE[phase]} ${
        size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[11px]"
      }`}
    >
      {phase}
    </span>
  );
}

/** 難易度 1..10 のドットメーター */
export function DifficultyMeter({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`難易度 ${value} / 10`}>
      <span className="flex items-center gap-[3px]">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={`h-2.5 w-[5px] rounded-full ${
              i < value ? (value >= 7 ? "bg-accent" : value >= 4 ? "bg-caution" : "bg-pass") : "bg-paper-line"
            }`}
          />
        ))}
      </span>
      <span className="font-num text-xs font-semibold text-ink-soft">{value}</span>
    </span>
  );
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
