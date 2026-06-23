import { useEffect, useMemo, useRef, useState } from "react";
import { SCENARIOS, DIFFICULTY, EVAL_ITEMS, RECOMMENDED_SCENARIO } from "@/data/seed";
import { Card, PageTitle, SectionTitle, ErrorState, PageLoading } from "@/components/ui";
import { isBackendEnabled } from "@/lib/supabase";
import { GRADE_LEGEND } from "@/lib/progress";
import { getRoleplayProvider } from "@/lib/ai";
import type { ChatMessage, Evaluation } from "@/lib/ai";
import { Mic, Keyboard, Sparkles, Send, RotateCcw, ArrowLeft } from "lucide-react";

type Phase = "setup" | "chat" | "result";
const STROKE = 1.75;

const RANK_TONE: Record<string, string> = {
  S: "bg-pass-soft text-pass-deep",
  A: "bg-pass-soft text-pass-deep",
  B: "bg-caution-soft text-caution-deep",
  C: "bg-caution-soft text-caution-deep",
  D: "bg-fail-soft text-fail-deep",
};

export function Roleplay() {
  const [scenarioId, setScenarioId] = useState(RECOMMENDED_SCENARIO.id);
  const [difficulty, setDifficulty] = useState(RECOMMENDED_SCENARIO.difficulty);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? RECOMMENDED_SCENARIO;
  const diff = DIFFICULTY.find((d) => d.level === difficulty);

  const [phase, setPhase] = useState<Phase>("setup");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const provider = useMemo(() => getRoleplayProvider(), []);
  const logEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  // 評価画面に切り替わったら要約見出しへフォーカスを移し、支援技術に結果を告知する
  useEffect(() => {
    if (phase === "result") resultRef.current?.focus();
  }, [phase]);

  const helperTurns = messages.filter((m) => m.role === "helper").length;

  useEffect(() => {
    const el = logEndRef.current;
    // jsdom など scrollIntoView 非実装の環境でも落とさない
    if (phase === "chat" && typeof el?.scrollIntoView === "function") {
      el.scrollIntoView({ block: "end" });
    }
  }, [messages, phase]);

  async function startChat() {
    if (pending) return;
    setPhase("chat");
    setMessages([]);
    setEvaluation(null);
    setError(null);
    setPending(true);
    try {
      const text = await provider.opening({ scenario, difficulty });
      setMessages([{ role: "customer", content: text }]);
    } catch {
      setError("顧客の応答を取得できませんでした。通信状況を確認してもう一度お試しください。");
    } finally {
      setPending(false);
    }
  }

  async function send() {
    const content = input.trim();
    if (!content || pending || evaluating) return;
    const next: ChatMessage[] = [...messages, { role: "helper", content }];
    setMessages(next);
    setInput("");
    setError(null);
    setPending(true);
    try {
      const text = await provider.reply({
        scenario,
        difficulty,
        history: next,
        message: content,
      });
      setMessages((m) => [...m, { role: "customer", content: text }]);
    } catch {
      setError("顧客の応答を取得できませんでした。もう一度送信してください。");
    } finally {
      setPending(false);
      inputRef.current?.focus();
    }
  }

  async function finish() {
    setEvaluating(true);
    setError(null);
    try {
      const result = await provider.evaluate({ scenario, difficulty, transcript: messages });
      setEvaluation(result);
      setPhase("result");
    } catch {
      setError("評価の生成に失敗しました。もう一度お試しください。");
    } finally {
      setEvaluating(false);
    }
  }

  function reset() {
    setPhase("setup");
    setMessages([]);
    setInput("");
    setEvaluation(null);
    setError(null);
  }

  // ===== 結果 =====
  if (phase === "result") {
    // 評価生成直後の中間レンダ（評価未確定）でも空画面にしない
    if (!evaluation) return <PageLoading />;
    return (
      <div className="space-y-6">
        <h2 ref={resultRef} tabIndex={-1} className="sr-only">
          ロープレ評価 総合ランク{evaluation.rank}、{evaluation.score}点
        </h2>
        <PageTitle
          eyebrow="Result"
          title="ロープレ評価"
          description="会話の振る舞いを12項目で採点しました。数値の正しさは別途、公式情報でご確認ください。"
          action={
            <button
              type="button"
              onClick={reset}
              className="flex min-h-[44px] items-center gap-2 rounded-lg border border-paper-line bg-paper px-4 text-sm font-medium text-ink hover:bg-paper-soft"
            >
              <RotateCcw size={16} strokeWidth={STROKE} /> もう一度
            </button>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="flex flex-col items-center justify-center gap-2 p-6 text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
              総合評価
            </div>
            <div
              className={`font-num inline-flex h-20 w-20 items-center justify-center rounded-full text-4xl font-bold ${RANK_TONE[evaluation.rank]}`}
            >
              {evaluation.rank}
            </div>
            <div className="font-num text-2xl font-bold text-ink tabular-nums">
              {evaluation.score}
              <span className="text-sm text-ink-muted"> / 100</span>
            </div>
            <p className="text-xs text-ink-muted">{GRADE_LEGEND}</p>
          </Card>

          <Card className="p-5 md:col-span-2">
            <SectionTitle eyebrow="Breakdown" title="項目別スコア" />
            <ul className="space-y-2.5">
              {evaluation.items.map((it) => (
                <li key={it.key} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 text-sm text-ink-soft">{it.label}</span>
                  <span
                    className="h-2 flex-1 overflow-hidden rounded-full bg-paper-soft"
                    role="img"
                    aria-label={`${it.label} ${it.score}点`}
                  >
                    <span
                      className={`block h-full rounded-full transition-[width] duration-200 ${it.score >= 80 ? "bg-pass" : it.score >= 60 ? "bg-caution" : "bg-fail"}`}
                      style={{ width: `${it.score}%` }}
                    />
                  </span>
                  <span className="font-num w-10 shrink-0 text-right text-sm font-semibold text-ink tabular-nums">
                    {it.score}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="p-5">
          <SectionTitle eyebrow="Next" title="次に伸ばすポイント" />
          <ul className="space-y-2">
            {evaluation.feedback.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-ink-soft">
                <Sparkles size={16} strokeWidth={STROKE} className="mt-0.5 shrink-0 text-accent" />
                {f}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    );
  }

  // ===== 会話 =====
  if (phase === "chat") {
    return (
      <div className="space-y-4">
        <PageTitle
          eyebrow="Roleplay"
          title={`#${scenario.no} ${scenario.title}`}
          description={`${scenario.carrier}・${scenario.familyType}・難易度${difficulty}`}
          action={
            <button
              type="button"
              onClick={reset}
              className="flex min-h-[44px] items-center gap-2 rounded-lg border border-paper-line bg-paper px-4 text-sm font-medium text-ink hover:bg-paper-soft"
            >
              <ArrowLeft size={16} strokeWidth={STROKE} /> 設定に戻る
            </button>
          }
        />

        <Card className="flex flex-col p-0">
          <div
            className="flex max-h-[52vh] min-h-[16rem] flex-col gap-3 overflow-y-auto p-4"
            role="log"
            aria-live="polite"
            aria-label="ロープレ会話"
          >
            {messages.length === 0 && !pending && (
              <p className="m-auto max-w-xs text-center text-sm text-ink-muted">
                顧客が話しかけてきます。ヒアリングから提案・クロージングまで進めましょう。
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "helper" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl2 px-3.5 py-2 text-sm ${
                    m.role === "helper"
                      ? "bg-ink text-paper"
                      : "border border-paper-line bg-paper-soft text-ink"
                  }`}
                >
                  <span
                    className={`mb-0.5 block text-[11px] font-semibold ${m.role === "helper" ? "text-paper" : "text-ink-muted"}`}
                  >
                    {m.role === "helper" ? "あなた" : "お客様"}
                  </span>
                  {m.content}
                </div>
              </div>
            ))}
            {pending && (
              <div className="flex justify-start">
                <div className="rounded-xl2 border border-paper-line bg-paper-soft px-3.5 py-2 text-sm text-ink-muted">
                  <span className="sr-only">お客様が入力中です</span>
                  <span aria-hidden="true">お客様が考えています…</span>
                </div>
              </div>
            )}
            <div ref={logEndRef} />
          </div>

          {error && (
            <div className="px-4 pb-2">
              <ErrorState description={error} />
            </div>
          )}

          <div className="border-t border-paper-line p-3">
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <label htmlFor="rp-input" className="sr-only">
                お客様への発話
              </label>
              <textarea
                id="rp-input"
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
                className="min-h-[44px] flex-1 resize-none rounded-lg border border-paper-line bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={pending || evaluating || input.trim().length === 0}
                className="flex min-h-[44px] items-center gap-1.5 rounded-lg bg-ink px-4 text-sm font-medium text-paper disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={16} strokeWidth={STROKE} /> 送信
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-ink-muted">
                認証コードやパスワードはお客様ご自身に入力いただきましょう。
              </p>
              <button
                type="button"
                onClick={() => void finish()}
                disabled={helperTurns === 0 || pending || evaluating}
                className="min-h-[44px] rounded-lg border border-ink px-4 text-sm font-medium text-ink hover:bg-paper-soft disabled:cursor-not-allowed disabled:opacity-50"
              >
                {evaluating ? "評価中…" : "終了して評価する"}
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ===== 設定 =====
  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Roleplay"
        title="ロープレ設定"
        description="顧客シナリオと難易度を選び、ヒアリングから提案・反論処理・クロージングまで練習します。"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <Card className="p-5">
            <SectionTitle eyebrow="Customer" title="顧客シナリオ" />
            <div className="grid gap-2 sm:grid-cols-2">
              {SCENARIOS.map((s) => {
                const selected = s.id === scenarioId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setScenarioId(s.id);
                      setDifficulty(s.difficulty);
                    }}
                    className={`rounded-xl2 border px-3 py-2.5 text-left transition-colors ${
                      selected
                        ? "border-ink bg-ink text-paper"
                        : "border-paper-line bg-paper hover:bg-paper-soft"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-num text-xs font-semibold ${selected ? "text-paper/70" : "text-ink-muted"}`}
                      >
                        #{s.no}
                      </span>
                      <span className="text-sm font-medium">{s.title}</span>
                    </div>
                    <div
                      className={`mt-0.5 text-xs ${selected ? "text-paper/70" : "text-ink-muted"}`}
                    >
                      {s.carrier}・{s.familyType}・難易度{s.difficulty}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle eyebrow="Difficulty" title={`難易度 ${difficulty}`} />
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="h-11 w-full cursor-pointer accent-ink"
              aria-label="難易度（1〜10）"
              aria-valuetext={`難易度 ${difficulty}：${diff?.desc ?? ""}`}
            />
            <div className="font-num mt-1 flex justify-between text-xs text-ink-muted">
              <span>易しい 1</span>
              <span>10 手強い</span>
            </div>
            {diff && <p className="mt-2 text-sm text-ink-soft">{diff.desc}</p>}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <SectionTitle eyebrow="Setup" title="この設定で開始" />
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">シナリオ</dt>
                <dd className="font-medium text-ink">#{scenario.no}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">キャリア</dt>
                <dd className="text-ink">{scenario.carrier}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">光回線</dt>
                <dd className="text-ink">{scenario.internetLine}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">関心度</dt>
                <dd className="text-ink">{scenario.interest}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">警戒心</dt>
                <dd className="text-ink">{scenario.resistance}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">目的</dt>
                <dd className="text-ink">{scenario.goal}</dd>
              </div>
            </dl>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => void startChat()}
                disabled={pending}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Keyboard size={16} strokeWidth={STROKE} /> テキストロープレを開始
              </button>
              <button
                type="button"
                disabled={!isBackendEnabled}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-paper-line bg-paper px-4 py-2.5 text-sm font-medium text-ink disabled:cursor-not-allowed disabled:opacity-50"
                title={isBackendEnabled ? "" : "音声ロープレは AI API 設定後に有効化されます"}
              >
                <Mic size={16} strokeWidth={STROKE} /> 音声ロープレを開始
              </button>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-muted">
              <Sparkles size={12} strokeWidth={STROKE} className="shrink-0" />
              {isBackendEnabled
                ? "テキスト・音声・AI評価が利用できます。"
                : "テキストロープレとAI評価はこの場で体験できます。音声は AI API 設定後に有効化されます。"}
            </p>
          </Card>

          <Card className="p-5">
            <h3 className="mb-2 text-sm font-bold text-ink-soft">評価項目（100点満点）</h3>
            <div className="flex flex-wrap gap-1.5">
              {EVAL_ITEMS.map((e) => (
                <span
                  key={e.key}
                  className="rounded bg-paper-soft px-2 py-0.5 text-xs text-ink-soft"
                >
                  {e.label}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-muted">{GRADE_LEGEND}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
