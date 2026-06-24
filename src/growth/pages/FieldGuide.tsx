import { useState, type ReactNode } from "react";
import { Check, X, ArrowRight, Lightbulb, MessageCircle } from "lucide-react";
import type { TalkLine } from "@/growth/data/curriculum";
import { SALES_PROCESS } from "@/growth/data/salesProcess";
import { SCENES } from "@/growth/data/scenes";
import { HEARING_ITEMS } from "@/growth/data/hearingItems";
import { OBJECTIONS, OBJECTION_BASIC_FLOW } from "@/growth/data/objections";
import { Card, PageHeader } from "@/growth/components/ui";

const TABS = [
  { id: "process", label: "販売プロセス" },
  { id: "scenes", label: "場面別トーク" },
  { id: "hearing", label: "ヒアリング" },
  { id: "objections", label: "反論処理" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function FieldGuide() {
  const [tab, setTab] = useState<TabId>("process");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Field Guide"
        title="現場ガイド"
        description="店頭・イベント・外販・軒先で使う、標準販売プロセスと実戦トーク。レッスンで学んだことを現場で引ける形にまとめています。"
      />

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={`min-h-[40px] rounded-full px-4 text-sm font-semibold transition ${
              tab === t.id
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "process" && <ProcessView />}
      {tab === "scenes" && <ScenesView />}
      {tab === "hearing" && <HearingView />}
      {tab === "objections" && <ObjectionsView />}
    </div>
  );
}

function Chip({ children, tone }: { children: ReactNode; tone: "ng" | "good" | "info" }) {
  const cls =
    tone === "ng"
      ? "bg-orange-50 text-orange-700"
      : tone === "good"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-slate-100 text-slate-600";
  return (
    <span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${cls}`}>{children}</span>
  );
}

function ProcessView() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">
        未経験者が「今どの工程か」を掴むための共通言語です。ドコモ公式の工程名ではありません。
      </p>
      {SALES_PROCESS.map((s) => (
        <Card key={s.no} className="p-5">
          <div className="flex items-start gap-3">
            <span className="font-display flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white tabular-nums">
              {s.no}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-slate-800">{s.name}</h3>
              <p className="mt-0.5 text-sm text-slate-600">{s.purpose}</p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-[11px] font-bold text-slate-400">お客様心理</div>
                  <p className="mt-0.5 text-sm text-slate-700">{s.customerMindset}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-[11px] font-bold text-slate-400">スタッフの動き</div>
                  <p className="mt-0.5 text-sm text-slate-700">{s.staffAction}</p>
                </div>
              </div>
              <ul className="mt-3 space-y-1.5">
                {s.talkExamples.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check size={15} strokeWidth={2} className="mt-0.5 shrink-0 text-emerald-600" />
                    「{t}」
                  </li>
                ))}
                {s.ngExamples.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-slate-500">
                    <X size={15} strokeWidth={2} className="mt-0.5 shrink-0 text-orange-600" />「{t}
                    」
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400">SV評価:</span>
                {s.svEvaluationPoints.map((p) => (
                  <Chip key={p} tone="info">
                    {p}
                  </Chip>
                ))}
              </div>
              {s.rookieMistakes.length > 0 && (
                <p className="mt-2 text-xs text-slate-500">
                  新人の失敗：{s.rookieMistakes.join(" / ")}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function Bubble({ line }: { line: TalkLine }) {
  const isStaff = line.role === "staff";
  return (
    <div className={`flex flex-col ${isStaff ? "items-end" : "items-start"}`}>
      <div className="flex max-w-[88%] flex-col">
        <span
          className={`mb-1 text-[11px] font-semibold ${isStaff ? "text-right text-blue-600" : "text-slate-500"}`}
        >
          {isStaff ? "あなた（スタッフ）" : "お客様"}
        </span>
        <p
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isStaff
              ? "rounded-tr-sm bg-blue-600 text-white"
              : "rounded-tl-sm bg-slate-100 text-slate-700"
          }`}
        >
          {line.text}
        </p>
        {line.note && (
          <span className="mt-1 flex items-start gap-1 text-xs leading-relaxed text-slate-600">
            <Lightbulb size={12} strokeWidth={2} className="mt-0.5 shrink-0 text-amber-600" />
            {line.note}
          </span>
        )}
      </div>
    </div>
  );
}

function ScenesView() {
  return (
    <div className="space-y-3">
      {SCENES.map((s) => (
        <Card key={s.id} className="p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <MessageCircle size={16} strokeWidth={2} />
            </span>
            <h3 className="text-base font-bold text-slate-800">{s.scene}</h3>
          </div>
          <p className="mt-1 text-sm text-slate-500">目的：{s.objective}</p>
          <div className="mt-3 space-y-3">
            {s.script.map((line, i) => (
              <Bubble key={`${s.id}-${i}`} line={line} />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              <span className="font-bold text-slate-500">営業技術：</span>
              {s.salesTechnique}
            </div>
            <div className="rounded-xl bg-orange-50 p-3 text-xs text-orange-700">
              <span className="font-bold">NG表現：</span>
              {s.ngExpression}
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">新人向け：{s.rookieExplanation}</p>
          <p className="mt-1 text-xs text-slate-500">上級者の工夫：{s.advancedTip}</p>
        </Card>
      ))}
    </div>
  );
}

function HearingView() {
  return (
    <div className="space-y-3">
      <Card className="bg-blue-50/60 p-4">
        <p className="text-sm text-slate-700">
          質問は量でなく順番が大事です。本人確認情報・認証情報・不要な個人情報は、販売初期に取得しません。
        </p>
      </Card>
      {HEARING_ITEMS.map((h) => (
        <Card key={h.id} className="p-5">
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="text-base font-bold text-slate-800">{h.item}</h3>
            <span className="text-xs text-slate-500">{h.purpose}</span>
          </div>
          <div className="mt-2 space-y-1.5 text-sm">
            <p className="text-slate-700">
              <Chip tone="good">聞き方</Chip> 「{h.naturalQuestion}」
            </p>
            <p className="text-slate-600">
              <Chip tone="info">深掘り</Chip> 「{h.deepDiveQuestion}」
            </p>
            <p className="text-slate-600">
              <Chip tone="info">提案方向</Chip> {h.proposalDirection}
            </p>
            <p className="text-slate-600">
              <Chip tone="ng">NGな聞き方</Chip> {h.prohibitedQuestion}
            </p>
          </div>
          <p className="mt-2 rounded-lg bg-orange-50 p-2.5 text-xs text-orange-700">
            コンプラ：{h.complianceNote}
          </p>
        </Card>
      ))}
    </div>
  );
}

function ObjectionsView() {
  return (
    <div className="space-y-3">
      <Card className="p-5">
        <h3 className="text-sm font-bold text-slate-800">反論処理の基本型</h3>
        <ol className="mt-2 flex flex-wrap items-center gap-2">
          {OBJECTION_BASIC_FLOW.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {i + 1}. {step}
              </span>
              {i < OBJECTION_BASIC_FLOW.length - 1 && (
                <ArrowRight size={14} className="text-slate-300" />
              )}
            </li>
          ))}
        </ol>
      </Card>
      {OBJECTIONS.map((o) => (
        <Card key={o.id} className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-slate-800">「{o.objection}」</h3>
            <span className="text-xs text-slate-500">本音：{o.customerRealIntent}</span>
          </div>
          <p className="mt-2 text-sm text-slate-700">
            <Chip tone="info">受け止め</Chip> 「{o.acceptancePhrase}」
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-orange-200 p-3">
              <div className="flex items-center gap-1 text-xs font-bold text-orange-600">
                <X size={13} strokeWidth={2.5} /> NG切り返し
              </div>
              <p className="mt-1 text-sm text-slate-700">「{o.ngResponse}」</p>
            </div>
            <div className="rounded-xl border border-emerald-200 p-3">
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <Check size={13} strokeWidth={2.5} /> Good切り返し
              </div>
              <p className="mt-1 text-sm text-slate-700">「{o.goodResponse}」</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            <Chip tone="info">深掘り</Chip> 「{o.deepDiveQuestion}」
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <ArrowRight size={13} className="shrink-0 text-blue-500" />
            {o.closeConnection}
          </p>
        </Card>
      ))}
    </div>
  );
}
