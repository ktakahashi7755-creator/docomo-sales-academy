import { Link, useParams } from "react-router-dom";
import { TALK_SCRIPTS } from "@/data/seed";
import { Card, DifficultyMeter, PhaseChip } from "@/components/ui";
import { DialogueBubble } from "@/components/DialogueBubble";
import type { TalkSection } from "@/lib/types";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Crosshair,
  Mic,
  Target,
} from "lucide-react";

function Section({ section, index }: { section: TalkSection; index: number }) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-paper-line bg-paper-soft/60 px-5 py-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-num flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink text-xs font-bold text-paper">
            {index + 1}
          </span>
          <h2 className="font-bold text-ink">{section.heading}</h2>
          {section.phase && <PhaseChip phase={section.phase} />}
        </div>
        {section.goal && (
          <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-ink-muted">
            <Target size={13} className="mt-0.5 shrink-0 text-accent" />
            <span>
              <span className="font-semibold text-ink-soft">このステップの狙い：</span>
              {section.goal}
            </span>
          </p>
        )}
      </div>

      <div className="space-y-3.5 p-5">
        {section.dialogue?.map((turn, i) => <DialogueBubble key={i} turn={turn} />)}
        {section.lines?.map((line, i) => (
          <p key={i} className="text-sm leading-relaxed text-ink">
            {line}
          </p>
        ))}
        {section.note && (
          <div className="font-num inline-block rounded-lg bg-paper-soft px-3 py-1.5 text-sm font-medium text-ink-soft">
            {section.note}
          </div>
        )}
      </div>
    </Card>
  );
}

export function TalkScriptDetail() {
  const { id } = useParams();
  const s = TALK_SCRIPTS.find((x) => x.id === id);

  if (!s) {
    return (
      <div className="py-12 text-center">
        <p className="text-ink-muted">スクリプトが見つかりませんでした。</p>
        <Link to="/scripts" className="mt-3 inline-block text-sm font-medium text-ink underline">
          トーク一覧へ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link to="/scripts" className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-ink">
        <ArrowLeft size={16} /> トーク一覧
      </Link>

      {/* ヘッダー */}
      <Card className="p-5 animate-fade-up md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              s.kind === "catch" ? "bg-accent-soft text-accent-deep" : "bg-paper-soft text-ink-soft"
            }`}
          >
            {s.kind === "catch" ? "キャッチ" : "商材提案"}
          </span>
          {s.phases?.map((p) => <PhaseChip key={p} phase={p} />)}
        </div>
        <h1 className="mt-2.5 text-xl font-bold leading-snug tracking-tight text-ink md:text-2xl">{s.title}</h1>
        <p className="mt-1 text-xs text-ink-muted">{s.category}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-lg bg-paper-soft px-3 py-2.5">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">対象</dt>
            <dd className="mt-0.5 text-[13px] leading-relaxed text-ink">{s.target}</dd>
          </div>
          <div className="rounded-lg bg-paper-soft px-3 py-2.5">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">タイミング</dt>
            <dd className="mt-0.5 text-[13px] leading-relaxed text-ink">{s.timing}</dd>
          </div>
          <div className="rounded-lg bg-paper-soft px-3 py-2.5">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">難易度</dt>
            <dd className="mt-1.5">
              <DifficultyMeter value={s.difficulty} />
            </dd>
          </div>
        </dl>
      </Card>

      {/* 本文：ステップ */}
      <div className="stagger space-y-4">
        {s.sections.map((sec, i) => (
          <Section key={i} section={sec} index={i} />
        ))}
      </div>

      {/* NG / 良い例 */}
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-fail">
            <AlertCircle size={16} /> NG例
          </h3>
          <ul className="space-y-2">
            {s.ngExamples.map((t, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fail" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-pass">
            <CheckCircle2 size={16} /> 良い例
          </h3>
          <ul className="space-y-2">
            {s.goodExamples.map((t, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pass" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {s.note && (
        <div className="flex items-start gap-2 rounded-xl2 bg-caution-soft px-4 py-3 text-sm leading-relaxed text-caution">
          <Crosshair size={15} className="mt-0.5 shrink-0" />
          {s.note}
        </div>
      )}

      <Link
        to={`/roleplay/practice/${s.id}`}
        className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-paper shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
      >
        <Mic size={14} /> このトークで練習を始める
      </Link>
    </div>
  );
}
