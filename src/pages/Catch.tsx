import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Flame,
  MessageSquareText,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import {
  CATCH_DEFINITION,
  CATCH_FUNNEL,
  CATCH_MINDSET,
  CATCH_NG_RULES,
  CATCH_PHASE_GUIDES,
  CATCH_SCRIPTS,
} from "@/data/catchScripts";
import { Card, DifficultyMeter, PageHeader, PhaseChip, SectionTitle } from "@/components/ui";

export function Catch() {
  const maxFunnel = CATCH_FUNNEL[0].value;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catch"
        title="キャッチ"
        description="外販・イベントの入口を制する技術。声かけから店舗スタッフへの引継ぎまでを、一本の流れとして学びます。"
      />

      {/* ヒーロー：キャッチとは */}
      <section className="surface-hero relative overflow-hidden rounded-xl2 p-6 text-paper shadow-hero animate-fade-up md:p-8">
        <div className="relative z-10 max-w-3xl">
          <div className="font-num text-xs font-semibold uppercase tracking-[0.25em] text-paper/60">
            What is “Catch”
          </div>
          <h2 className="mt-2 text-xl font-bold leading-snug md:text-2xl">{CATCH_DEFINITION.heading}</h2>
          <p className="mt-3 text-sm leading-relaxed text-paper/80 md:text-[15px]">{CATCH_DEFINITION.lead}</p>

          {/* 5フェーズフロー */}
          <ol className="mt-6 flex flex-wrap items-center gap-y-3">
            {CATCH_DEFINITION.flow.map((step, i) => (
              <li key={step} className="flex items-center">
                <span className="flex items-center gap-2 rounded-full border border-paper/20 bg-paper/10 px-3.5 py-1.5 backdrop-blur">
                  <span className="font-num text-[11px] font-bold text-accent">{`0${i + 1}`}</span>
                  <span className="text-xs font-semibold md:text-sm">{step}</span>
                </span>
                {i < CATCH_DEFINITION.flow.length - 1 && (
                  <ArrowRight size={14} className="mx-1.5 shrink-0 text-paper/40" aria-hidden />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* フェーズ別ガイド */}
      <section>
        <SectionTitle eyebrow="Flow" title="5フェーズの設計図" />
        <div className="stagger space-y-3">
          {CATCH_PHASE_GUIDES.map((g, i) => (
            <Card key={g.phase} className="p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-num flex h-10 w-10 shrink-0 items-center justify-center rounded-xl2 bg-paper-soft text-sm font-bold text-ink">
                  {`0${i + 1}`}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-ink">{g.title}</h3>
                    <PhaseChip phase={g.phase} />
                  </div>
                  <p className="mt-0.5 text-sm text-ink-muted">{g.mission}</p>
                </div>
              </div>
              <ul className="mt-3 grid gap-1.5 md:grid-cols-3 md:gap-3">
                {g.points.map((pt, j) => (
                  <li key={j} className="flex gap-2 rounded-lg bg-paper-soft px-3 py-2 text-[13px] leading-relaxed text-ink-soft">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    {pt}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* 心構え + ファネル */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle eyebrow="Mindset" title="キャッチの心構え" />
          <ul className="space-y-3">
            {CATCH_MINDSET.map((m) => (
              <li key={m.title} className="flex gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Flame size={14} />
                </span>
                <div>
                  <div className="text-sm font-bold text-ink">{m.title}</div>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-ink-soft">{m.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <SectionTitle eyebrow="Funnel" title="1日の目安ファネル" />
          <div className="space-y-2.5">
            {CATCH_FUNNEL.map((f) => (
              <div key={f.label}>
                <div className="mb-1 flex items-baseline justify-between text-xs">
                  <span className="font-semibold text-ink">{f.label}</span>
                  <span className="text-ink-muted">{f.desc}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 flex-1 overflow-hidden rounded-md bg-paper-soft">
                    <div
                      className="flex h-full items-center rounded-md bg-ink pl-2 transition-[width] duration-700"
                      style={{ width: `${Math.max((f.value / maxFunnel) * 100, 9)}%` }}
                    >
                      <span className="font-num text-[11px] font-bold text-paper">{f.value}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-ink-muted">
            <Sparkles size={13} className="mt-0.5 shrink-0" />
            声かけ100回で着座3件・引継ぎ1件が現場の標準感覚。断られた数ではなく、会話になった数・着座数を毎日数える。
          </p>
        </Card>
      </div>

      {/* NGルール */}
      <Card className="border-fail/20 p-5">
        <SectionTitle eyebrow="Compliance" title="やってはいけないこと" />
        <ul className="grid gap-2 md:grid-cols-2">
          {CATCH_NG_RULES.map((rule, i) => (
            <li key={i} className="flex items-start gap-2.5 rounded-lg bg-fail-soft/60 px-3 py-2.5 text-[13px] leading-relaxed text-ink">
              <ShieldAlert size={15} className="mt-0.5 shrink-0 text-fail" />
              {rule}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-muted">
          1件の強引なキャッチは、店舗とブランドの信頼を失わせます。迷ったら引く。コンプライアンステストは100点が合格ラインです。
        </p>
      </Card>

      {/* 実践スクリプト */}
      <section>
        <SectionTitle eyebrow="Scripts" title="キャッチ実践トークスクリプト" />
        <div className="stagger grid gap-3 md:grid-cols-2">
          {CATCH_SCRIPTS.map((s) => (
            <Link key={s.id} to={`/scripts/${s.id}`} className="group">
              <Card className="flex h-full flex-col p-5 transition-all group-hover:-translate-y-0.5 group-hover:shadow-lift">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-accent">
                    <MessageSquareText size={16} />
                    <span className="font-num text-[11px] font-semibold uppercase tracking-widest">Catch Talk</span>
                  </div>
                  <ChevronRight size={17} className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5" />
                </div>
                <h3 className="mt-2 font-bold leading-snug text-ink">{s.title}</h3>
                <p className="mt-1 text-[13px] text-ink-muted">{s.target}</p>
                <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
                  {s.phases?.map((p) => <PhaseChip key={p} phase={p} />)}
                  <span className="ml-auto">
                    <DifficultyMeter value={s.difficulty} />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
