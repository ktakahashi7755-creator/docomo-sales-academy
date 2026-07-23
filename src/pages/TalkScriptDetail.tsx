import { Link, useParams } from "react-router-dom";
import { TALK_SCRIPTS } from "@/data/seed";
import { Card } from "@/components/ui";
import { ArrowLeft, Mic, AlertCircle, CheckCircle2 } from "lucide-react";

export function TalkScriptDetail() {
  const { id } = useParams();
  const s = TALK_SCRIPTS.find((x) => x.id === id);

  if (!s) {
    return (
      <div className="py-12 text-center">
        <p className="text-ink-muted">スクリプトが見つかりませんでした。</p>
        <Link to="/scripts" className="mt-3 inline-block text-sm font-medium text-ink underline">トーク一覧へ戻る</Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link to="/scripts" className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft size={16} /> トーク一覧
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-ink">{s.title}</h1>
        <p className="mt-1 text-xs text-ink-muted">{s.category}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          <span className="font-num rounded bg-paper-soft px-2 py-0.5">難易度 {s.difficulty}</span>
          <span>対象：{s.target}</span>
          <span>·</span>
          <span>{s.timing}</span>
        </div>
      </div>

      {/* 本文：ステップ */}
      <div className="space-y-3">
        {s.sections.map((sec, i) => (
          <Card key={i} className="p-5">
            <h2 className="mb-2 font-bold text-ink">{sec.heading}</h2>
            <div className="space-y-2">
              {sec.lines.map((line, j) => (
                <p key={j} className="text-sm leading-relaxed text-ink">{line}</p>
              ))}
            </div>
            {sec.note && (
              <div className="font-num mt-3 inline-block rounded-lg bg-paper-soft px-3 py-1.5 text-sm font-medium text-ink-soft">
                {sec.note}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* NG / 良い例 */}
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-fail">
            <AlertCircle size={16} /> NG例
          </h3>
          <ul className="space-y-1.5">
            {s.ngExamples.map((t, i) => (
              <li key={i} className="text-sm text-ink-soft">{t}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-pass">
            <CheckCircle2 size={16} /> 良い例
          </h3>
          <ul className="space-y-1.5">
            {s.goodExamples.map((t, i) => (
              <li key={i} className="text-sm text-ink-soft">{t}</li>
            ))}
          </ul>
        </Card>
      </div>

      {s.note && (
        <div className="rounded-lg bg-caution-soft px-4 py-3 text-sm text-caution">
          {s.note}
        </div>
      )}

      <Link
        to="/roleplay"
        className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper"
      >
        <Mic size={14} /> このトークでロープレを始める
      </Link>
    </div>
  );
}
