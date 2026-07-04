import { CERT_CONDITIONS, BADGES } from "@/data/seed";
import { Card, PageHeader, ProgressBar } from "@/components/ui";
import { CheckCircle2, Circle, Award, Medal } from "lucide-react";

export function Certification() {
  const done = CERT_CONDITIONS.filter((c) => c.done).length;
  const rate = Math.round((done / CERT_CONDITIONS.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Certification"
        title="クローザー認定"
        description="全条件を満たし、SV承認を得ると「認定クローザー（Lv.10）」になります。"
      />

      {/* 達成状況ヒーロー */}
      <section className="surface-hero relative overflow-hidden rounded-xl2 p-6 text-paper shadow-hero animate-fade-up">
        <div className="relative z-10 flex flex-wrap items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-gold/40 bg-gold/20 text-gold">
            <Award size={30} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm text-paper/70">達成状況</div>
            <div className="font-num mt-0.5 text-3xl font-bold leading-none">
              {done}
              <span className="text-lg text-paper/60"> / {CERT_CONDITIONS.length} 条件</span>
            </div>
            <div className="mt-3 max-w-md">
              <div className="h-2 w-full overflow-hidden rounded-full bg-paper/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold to-[#E3B96A] transition-[width] duration-700"
                  style={{ width: `${rate}%` }}
                />
              </div>
            </div>
          </div>
          <div className="font-num text-4xl font-bold">
            {rate}
            <span className="text-lg text-paper/60">%</span>
          </div>
        </div>
      </section>

      <Card className="p-5">
        <h2 className="mb-3.5 flex items-center gap-2 text-sm font-bold text-ink-soft">
          <span className="inline-block h-3.5 w-1 rounded-full bg-accent" aria-hidden />
          認定条件
        </h2>
        <ul className="stagger space-y-1">
          {CERT_CONDITIONS.map((c, i) => (
            <li
              key={c.id}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${c.done ? "bg-pass-soft/50" : ""}`}
            >
              <span className="font-num w-6 shrink-0 text-xs font-semibold text-ink-muted">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              {c.done ? (
                <CheckCircle2 size={18} className="shrink-0 text-pass" />
              ) : (
                <Circle size={18} className="shrink-0 text-paper-line" />
              )}
              <span className={`text-sm ${c.done ? "font-medium text-ink" : "text-ink-soft"}`}>{c.label}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <ProgressBar value={rate} tone={rate >= 80 ? "pass" : "ink"} />
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-3.5 flex items-center gap-2 text-sm font-bold text-ink-soft">
          <span className="inline-block h-3.5 w-1 rounded-full bg-accent" aria-hidden />
          獲得バッジ
        </h2>
        <div className="stagger grid gap-2 sm:grid-cols-2">
          {BADGES.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-3 rounded-xl2 border border-paper-line bg-paper-soft/60 px-3.5 py-3 transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-soft text-gold-deep">
                <Medal size={18} />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-ink">{b.name}</div>
                <div className="truncate text-xs text-ink-muted">{b.description}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
