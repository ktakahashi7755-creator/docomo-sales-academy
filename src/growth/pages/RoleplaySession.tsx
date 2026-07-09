import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Send, RotateCcw, AlertCircle, SearchX } from "lucide-react";
import { SCENARIOS, EVAL_ITEMS } from "@/data/seed";
import { getRoleplayProvider } from "@/lib/ai";
import type { ChatMessage, Evaluation } from "@/lib/ai/types";
import { GRADE_LEGEND } from "@/lib/progress";
import { useProvide } from "@/growth/context/ProvideContext";
import { Card, PageHeader, SectionTitle, PrimaryButton, GhostButton } from "@/growth/components/ui";

const STROKE = 1.75;

type Phase = "chat" | "result";

const RANK_CLASSES: Record<string, { badge: string; ring: string }> = {
  S: {
    badge: "bg-emerald-50 text-emerald-700",
    ring: "ring-emerald-400",
  },
  A: {
    badge: "bg-emerald-50 text-emerald-700",
    ring: "ring-emerald-400",
  },
  B: {
    badge: "bg-amber-50 text-amber-700",
    ring: "ring-amber-400",
  },
  C: {
    badge: "bg-orange-50 text-orange-700",
    ring: "ring-orange-400",
  },
  D: {
    badge: "bg-red-50 text-red-700",
    ring: "ring-red-400",
  },
};

function scoreBarColor(score: number): string {
  if (score >= 80) return "bg-gradient-to-r from-emerald-400 to-emerald-500";
  if (score >= 60) return "bg-gradient-to-r from-amber-400 to-amber-500";
  return "bg-gradient-to-r from-red-400 to-red-500";
}

/** Not-found fallback when scenarioId doesn't match any SCENARIOS entry. */
function ScenarioNotFound() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Role-play" title="ロープレ" />
      <Card className="p-8 text-center">
        <SearchX size={32} strokeWidth={2} className="mx-auto text-slate-300" aria-hidden="true" />
        <p className="mt-3 text-sm font-semibold text-slate-700">シナリオが見つかりません</p>
        <p className="mt-1 text-xs text-slate-500">URLが正しいかご確認ください。</p>
        <div className="mt-6">
          <Link
            to="/roleplay"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
          >
            <ArrowLeft size={16} strokeWidth={STROKE} aria-hidden="true" />
            ロープレ一覧に戻る
          </Link>
        </div>
      </Card>
    </div>
  );
}

export function RoleplaySession() {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const scenario = SCENARIOS.find((s) => s.id === scenarioId);

  const { recordRoleplay } = useProvide();

  // Memoised provider — swap point is getRoleplayProvider() only.
  const provider = useMemo(() => getRoleplayProvider(), []);

  const [phase, setPhase] = useState<Phase>("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const logEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  // On mount, fetch the opening customer message.
  useEffect(() => {
    if (!scenario) return;
    let cancelled = false;
    setPending(true);
    provider
      .opening({ scenario, difficulty: scenario.difficulty })
      .then((text) => {
        if (!cancelled) setMessages([{ role: "customer", content: text }]);
      })
      .catch(() => {
        if (!cancelled)
          setError("お客様の最初の一言を取得できませんでした。ページを再読み込みしてください。");
      })
      .finally(() => {
        if (!cancelled) setPending(false);
      });
    return () => {
      cancelled = true;
    };
    // scenario is stable (found by id); provider is memoised. Run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll chat to bottom.
  useEffect(() => {
    const el = logEndRef.current;
    if (phase === "chat" && typeof el?.scrollIntoView === "function") {
      el.scrollIntoView({ block: "end" });
    }
  }, [messages, phase]);

  // Focus result heading when phase switches to "result".
  useEffect(() => {
    if (phase === "result") {
      const el = resultRef.current;
      if (typeof el?.focus === "function") el.focus();
    }
  }, [phase]);

  const helperTurns = messages.filter((m) => m.role === "helper").length;

  async function send() {
    const content = input.trim();
    if (!content || pending || evaluating || !scenario) return;
    const next: ChatMessage[] = [...messages, { role: "helper", content }];
    setMessages(next);
    setInput("");
    setError(null);
    setPending(true);
    try {
      const text = await provider.reply({
        scenario,
        difficulty: scenario.difficulty,
        history: next,
        message: content,
      });
      setMessages((m) => [...m, { role: "customer", content: text }]);
    } catch {
      setError("お客様の応答を取得できませんでした。もう一度送信してください。");
    } finally {
      setPending(false);
      inputRef.current?.focus();
    }
  }

  async function finish() {
    if (!scenario) return;
    setEvaluating(true);
    setError(null);
    try {
      const result = await provider.evaluate({
        scenario,
        difficulty: scenario.difficulty,
        transcript: messages,
      });
      setEvaluation(result);
      recordRoleplay({
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        score: result.score,
        rank: result.rank,
      });
      setPhase("result");
    } catch {
      setError("評価の生成に失敗しました。もう一度お試しください。");
    } finally {
      setEvaluating(false);
    }
  }

  function reset() {
    setPhase("chat");
    setMessages([]);
    setInput("");
    setEvaluation(null);
    setError(null);
    // Re-fetch opening
    if (!scenario) return;
    setPending(true);
    provider
      .opening({ scenario, difficulty: scenario.difficulty })
      .then((text) => setMessages([{ role: "customer", content: text }]))
      .catch(() =>
        setError("お客様の最初の一言を取得できませんでした。ページを再読み込みしてください。"),
      )
      .finally(() => setPending(false));
  }

  // ===== Not found =====
  if (!scenario) return <ScenarioNotFound />;

  // ===== Result phase =====
  if (phase === "result") {
    if (!evaluation) {
      // Shouldn't happen — evaluation is set before phase flips — but guard.
      return (
        <div className="space-y-4">
          <PageHeader eyebrow="Role-play" title="評価を準備中…" />
          <Card className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-500" />
          </Card>
        </div>
      );
    }

    const rankCls = RANK_CLASSES[evaluation.rank] ?? RANK_CLASSES["D"];
    const isGood = evaluation.rank === "S" || evaluation.rank === "A";
    const isMid = evaluation.rank === "B" || evaluation.rank === "C";

    return (
      <div className="space-y-6">
        {/* Screen-reader announcement */}
        <h2 ref={resultRef} tabIndex={-1} className="sr-only" aria-live="assertive">
          ロープレ評価完了。総合ランク{evaluation.rank}、{evaluation.score}点です。
        </h2>

        <PageHeader
          eyebrow="Role-play Result"
          title="ロープレ評価"
          description="会話の振る舞いを12項目で採点しました。数値の正しさは公式情報でご確認ください。"
          action={
            <div className="flex items-center gap-2">
              <Link
                to="/roleplay"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
              >
                <ArrowLeft size={16} strokeWidth={STROKE} aria-hidden="true" />
                ロープレ一覧
              </Link>
              <GhostButton onClick={reset}>
                <RotateCcw size={16} strokeWidth={STROKE} aria-hidden="true" />
                もう一度
              </GhostButton>
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          {/* Overall rank */}
          <Card className="flex flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              総合評価
            </span>
            <div
              className={`font-display ring-4 inline-flex h-20 w-20 items-center justify-center rounded-full text-4xl font-bold tabular-nums ${rankCls.badge} ${rankCls.ring}`}
              role="img"
              aria-label={`総合ランク ${evaluation.rank}`}
            >
              {evaluation.rank}
            </div>
            <div className="font-display text-2xl font-bold tabular-nums text-slate-800">
              {evaluation.score}
              <span className="ml-1 text-sm font-normal text-slate-400">/ 100</span>
            </div>
            <p className="text-xs text-slate-400">{GRADE_LEGEND}</p>
            {isGood && <p className="text-xs font-medium text-emerald-600">すばらしい成果です。</p>}
            {isMid && <p className="text-xs font-medium text-amber-600">着実に成長しています。</p>}
            {!isGood && !isMid && (
              <p className="text-xs font-medium text-red-500">
                フィードバックを参考に再挑戦しましょう。
              </p>
            )}
          </Card>

          {/* Item breakdown */}
          <Card className="p-5 md:col-span-2">
            <SectionTitle title="項目別スコア" />
            <ul className="space-y-2.5" aria-label="12項目の採点結果">
              {evaluation.items.map((it) => (
                <li key={it.key} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-xs text-slate-500">{it.label}</span>
                  <div
                    className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-valuenow={it.score}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${it.label} ${it.score}点`}
                  >
                    <div
                      className={`h-full rounded-full transition-[width] duration-500 ${scoreBarColor(it.score)}`}
                      style={{ width: `${it.score}%` }}
                    />
                  </div>
                  <span className="font-display w-10 shrink-0 text-right text-sm font-bold tabular-nums text-slate-700">
                    {it.score}
                  </span>
                </li>
              ))}
            </ul>
            {/* eval item legend from EVAL_ITEMS (for screen readers) */}
            <p className="sr-only">
              評価項目：
              {EVAL_ITEMS.map((e) => e.label).join("、")}
            </p>
          </Card>
        </div>

        {/* Feedback */}
        {evaluation.feedback.length > 0 && (
          <Card className="p-5">
            <SectionTitle title="次に伸ばすポイント" />
            <ul className="space-y-2" aria-label="改善フィードバック">
              {evaluation.feedback.map((f, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 rounded-xl bg-blue-50 px-4 py-3 text-sm text-slate-700"
                >
                  <span
                    className="font-display mt-0.5 shrink-0 text-xs font-bold tabular-nums text-blue-500"
                    aria-hidden="true"
                  >
                    {i + 1}.
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    );
  }

  // ===== Chat phase =====
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Role-play"
        title={`#${scenario.no} ${scenario.title}`}
        description={`${scenario.carrier}・${scenario.familyType}・難易度${scenario.difficulty}`}
        action={
          <Link
            to="/roleplay"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
          >
            <ArrowLeft size={16} strokeWidth={STROKE} aria-hidden="true" />
            ロープレ一覧
          </Link>
        }
      />

      <Card className="flex flex-col p-0 overflow-hidden">
        {/* Chat log */}
        <div
          className="flex max-h-[52vh] min-h-[16rem] flex-col gap-3 overflow-y-auto p-4"
          role="log"
          aria-live="polite"
          aria-label="ロープレ会話"
          aria-atomic="false"
        >
          {messages.length === 0 && !pending && (
            <p className="m-auto max-w-xs text-center text-sm text-slate-400">
              顧客が話しかけてきます。ヒアリングから提案・クロージングまで進めましょう。
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "helper" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "helper"
                    ? "bg-blue-600 text-white"
                    : "border border-slate-100 bg-slate-50 text-slate-800"
                }`}
              >
                <span
                  className={`mb-1 block text-[11px] font-semibold ${
                    m.role === "helper" ? "text-blue-200" : "text-slate-400"
                  }`}
                  aria-hidden="true"
                >
                  {m.role === "helper" ? "あなた" : "お客様"}
                </span>
                {m.content}
              </div>
            </div>
          ))}
          {pending && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-400">
                <span className="sr-only">お客様が入力中です</span>
                <span aria-hidden="true">お客様が考えています…</span>
              </div>
            </div>
          )}
          <div ref={logEndRef} aria-hidden="true" />
        </div>

        {/* Error notice */}
        {error && (
          <div
            role="alert"
            className="mx-4 mb-2 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle
              size={16}
              strokeWidth={STROKE}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <p>{error}</p>
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-slate-100 p-3">
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <label htmlFor="rp-session-input" className="sr-only">
              お客様への発話
            </label>
            <textarea
              id="rp-session-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  void send();
                }
              }}
              rows={2}
              disabled={pending || evaluating}
              placeholder="お客様への一言を入力（Cmd/Ctrl + Enter で送信）"
              className="min-h-[44px] flex-1 resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:border-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <PrimaryButton
              type="submit"
              disabled={pending || evaluating || input.trim().length === 0}
            >
              <Send size={16} strokeWidth={STROKE} aria-hidden="true" />
              送信
            </PrimaryButton>
          </form>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-slate-500">
              認証コードやパスワードはお客様ご自身に入力いただきましょう。
            </p>
            <button
              type="button"
              onClick={() => void finish()}
              disabled={helperTurns === 0 || pending || evaluating}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              aria-busy={evaluating}
            >
              {evaluating ? "評価中…" : "終了して評価する"}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
