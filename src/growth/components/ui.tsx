import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Layers,
  GraduationCap,
  MessagesSquare,
  ClipboardCheck,
  BarChart3,
  Megaphone,
  HelpCircle,
  Bot,
  BookOpen,
  Smile,
  Ear,
  Lightbulb,
  Target,
  Rocket,
  Clock,
  Award,
  CalendarDays,
  Video,
  BookMarked,
  Users,
  MessageSquare,
} from "lucide-react";
import type { Accent, GrowthIcon } from "@/growth/data/curriculum";

// ===== アイコン（文字列キー → Lucide） =====
const ICON_MAP: Record<GrowthIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  curriculum: Layers,
  content: GraduationCap,
  roleplay: MessagesSquare,
  quiz: ClipboardCheck,
  report: BarChart3,
  announce: Megaphone,
  help: HelpCircle,
  bot: Bot,
  book: BookOpen,
  smile: Smile,
  ear: Ear,
  lightbulb: Lightbulb,
  target: Target,
  rocket: Rocket,
  clock: Clock,
  award: Award,
  calendar: CalendarDays,
  video: Video,
  manual: BookMarked,
  users: Users,
  message: MessageSquare,
};

export function GIcon({
  name,
  size = 20,
  className = "",
  strokeWidth = 2,
}: {
  name: GrowthIcon;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = ICON_MAP[name];
  return <Cmp size={size} strokeWidth={strokeWidth} className={className} />;
}

// ===== ステップ配色（青→水色→ティール→緑→オレンジ） =====
// 完全なクラス文字列で持ち、Tailwind JIT が確実に拾えるようにする。
export interface AccentClasses {
  from: string;
  to: string;
  solid: string;
  soft: string;
  softText: string;
  ring: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ACCENT: Record<Accent, AccentClasses> = {
  navy: {
    from: "from-slate-600",
    to: "to-slate-800",
    solid: "bg-slate-700",
    soft: "bg-slate-100",
    softText: "text-slate-700",
    ring: "text-slate-600",
  },
  blue: {
    from: "from-blue-500",
    to: "to-blue-600",
    solid: "bg-blue-600",
    soft: "bg-blue-50",
    softText: "text-blue-700",
    ring: "text-blue-600",
  },
  teal: {
    from: "from-teal-400",
    to: "to-teal-500",
    solid: "bg-teal-500",
    soft: "bg-teal-50",
    softText: "text-teal-700",
    ring: "text-teal-500",
  },
  green: {
    from: "from-emerald-400",
    to: "to-emerald-500",
    solid: "bg-emerald-500",
    soft: "bg-emerald-50",
    softText: "text-emerald-700",
    ring: "text-emerald-600",
  },
  orange: {
    from: "from-orange-400",
    to: "to-orange-500",
    solid: "bg-orange-500",
    soft: "bg-orange-50",
    softText: "text-orange-700",
    ring: "text-orange-600",
  },
};

// ===== カード =====
export function Card({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white shadow-card ${
        hover ? "transition duration-200 hover:-translate-y-0.5 hover:shadow-lift" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  icon,
  title,
  action,
}: {
  icon?: ReactNode;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
      </div>
      {action}
    </div>
  );
}

// ===== 円形プログレス =====
export function ProgressRing({
  value,
  size = 44,
  stroke = 4,
  color = "text-blue-600",
  track = "text-slate-200",
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  label?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, value));
  const offset = c * (1 - pct / 100);
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`進捗 ${pct}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          stroke="currentColor"
          className={track}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke="currentColor"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className={`${color} transition-[stroke-dashoffset] duration-500`}
        />
      </svg>
      {label != null && (
        <span className="font-display absolute text-[11px] font-semibold tabular-nums text-slate-700">
          {label}
        </span>
      )}
    </div>
  );
}

// ===== プライマリボタン =====
export function PrimaryButton({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </button>
  );
}
