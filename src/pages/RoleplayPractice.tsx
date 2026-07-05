import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TALK_SCRIPTS } from "@/data/seed";
import { Card, PhaseChip } from "@/components/ui";
import { DialogueBubble } from "@/components/DialogueBubble";
import type { DialogueTurn, FlowPhase } from "@/lib/types";
import {
  ArrowLeft,
  BookOpenText,
  CheckCircle2,
  ChevronRight,
  Eye,
  PartyPopper,
  RotateCcw,
  Target,
} from "lucide-react";

// ===== 台本をステップ列に展開 =====

interface SectionMeta {
  heading: string;
  phase?: FlowPhase;
  goal?: string;
}

type Step =
  | { kind: "section"; section: SectionMeta }
  | { kind: "turn"; turn: DialogueTurn; section: SectionMeta };

/** 表示済みステップ（自分の番は入力した言い方を添えられる） */
type Shown = Step & { attempt?: string };

const SELF_CHECK = [
  "台本を見ずに、流れを再現できた",
  "数字（料金・差額・年額）を正しく言えた",
  "断り文句への切り返しが口から出た",
  "次のフェーズへの「つなぎ」の一言が言えた",
];

function usePracticeCount(scriptId: string | undefined) {
  const key = `dsa.practice.${scriptId ?? ""}`;
  const read = () => {
    try {
      return Number(localStorage.getItem(key) ?? 0) || 0;
    } catch {
      return 0;
    }
  };
  const [count, setCount] = useState(read);
  const increment = () => {
    const next = read() + 1;
    try {
      localStorage.setItem(key, String(next));
    } catch {
      // 保存不可でも練習は継続
    }
    setCount(next);
  };
  return { count, increment };
}

export function RoleplayPractice() {
  const { scriptId } = useParams();
  const script = TALK_SCRIPTS.find((s) => s.id === scriptId);

  const steps = useMemo<Step[]>(() => {
    if (!script) return [];
    const out: Step[] = [];
    for (const sec of script.sections) {
      const meta: SectionMeta = { heading: sec.heading, phase: sec.phase, goal: sec.goal };
      out.push({ kind: "section", section: meta });
      for (const turn of sec.dialogue ?? []) out.push({ kind: "turn", turn, section: meta });
      // 一方向トーク（GOLD/PLATINUM等）は各行を自分のセリフとして練習
      for (const line of sec.lines ?? []) {
        out.push({ kind: "turn", turn: { speaker: "staff", text: line, note: sec.note }, section: meta });
      }
    }
    return out;
  }, [script]);

  const staffTotal = useMemo(
    () => steps.filter((s) => s.kind === "turn" && s.turn.speaker === "staff").length,
    [steps],
  );

  const [shown, setShown] = useState<Shown[]>([]);
  const [pending, setPending] = useState<(Step & { kind: "turn" }) | null>(null);
  const [cursor, setCursor] = useState(0);
  const [attempt, setAttempt] = useState("");
  const [checks, setChecks] = useState<boolean[]>(() => SELF_CHECK.map(() => false));
  const { count, increment } = usePracticeCount(scriptId);
  const countedRef = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);

  /** i以降を、次の「自分の番」直前まで自動で表示する */
  const advanceFrom = (i: number, base: Shown[]) => {
    const next = [...base];
    while (i < steps.length) {
      const st = steps[i];
      if (st.kind === "turn" && st.turn.speaker === "staff") {
        setPending(st);
        setShown(next);
        setCursor(i + 1);
        return;
      }
      next.push(st);
      i++;
    }
    setPending(null);
    setShown(next);
    setCursor(i);
  };

  // 初期表示
  useEffect(() => {
    setShown([]);
    setPending(null);
    setAttempt("");
    setChecks(SELF_CHECK.map(() => false));
    countedRef.current = false;
    if (steps.length) advanceFrom(0, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptId, steps.length]);

  const done = steps.length > 0 && cursor >= steps.length && !pending;
  const staffDone = shown.filter((s) => s.kind === "turn" && s.turn.speaker === "staff").length;

  // 完了時に練習回数を1回だけ加算
  useEffect(() => {
    if (done && !countedRef.current) {
      countedRef.current = true;
      increment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  // 進行に合わせて最下部へスクロール
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [shown, pending, done]);

  if (!script) {
    return (
      <div className="py-12 text-center">
        <p className="text-ink-muted">スクリプトが見つかりませんでした。</p>
        <Link to="/scripts" className="mt-3 inline-block text-sm font-medium text-ink underline">
          トーク一覧へ戻る
        </Link>
      </div>
    );
  }

  const reveal = () => {
    if (!pending) return;
    const revealed: Shown = { ...pending, attempt: attempt.trim() || undefined };
    setAttempt("");
    setPending(null);
    advanceFrom(cursor, [...shown, revealed]);
  };

  const restart = () => {
    setShown([]);
    setPending(null);
    setAttempt("");
    setChecks(SELF_CHECK.map(() => false));
    countedRef.current = false;
    advanceFrom(0, []);
  };

  const progress = staffTotal ? Math.round((staffDone / staffTotal) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Link
          to={`/scripts/${script.id}`}
          className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} /> トークに戻る
        </Link>
        {count > 0 && (
          <span className="font-num rounded-full bg-paper-soft px-2.5 py-1 text-[11px] font-semibold text-ink-soft">
            練習 {count} 回目{done ? "" : "に挑戦中"}
          </span>
        )}
      </div>

      {/* ヘッダー：タイトル + 進捗 */}
      <Card className="p-4 animate-fade-up md:p-5">
        <div className="flex items-center gap-2 text-accent">
          <BookOpenText size={15} />
          <span className="font-num text-[11px] font-semibold uppercase tracking-widest">Script Practice</span>
        </div>
        <h1 className="mt-1.5 text-lg font-bold leading-snug tracking-tight text-ink md:text-xl">{script.title}</h1>
        <p className="mt-1 text-xs leading-relaxed text-ink-muted">
          お客様役はアプリが進めます。「あなたの番」で自分の言い方を声に出し（入力は任意）、模範トークと見比べてください。
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-soft">
            <div
              className="h-full rounded-full bg-ink transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-num shrink-0 text-xs font-semibold text-ink-soft">
            {staffDone}/{staffTotal} セリフ
          </span>
        </div>
      </Card>

      {/* 会話エリア */}
      <div className="space-y-3.5">
        {shown.map((st, i) =>
          st.kind === "section" ? (
            <div key={i} className="flex flex-wrap items-center gap-2 pt-2 animate-fade-up">
              <span className="h-px flex-1 bg-paper-line" aria-hidden />
              <span className="text-xs font-bold text-ink-soft">{st.section.heading}</span>
              {st.section.phase && <PhaseChip phase={st.section.phase} />}
              <span className="h-px flex-1 bg-paper-line" aria-hidden />
            </div>
          ) : (
            <div key={i} className="space-y-1.5">
              {st.attempt && (
                <div className="flex justify-start pl-10">
                  <div className="max-w-[75%] rounded-2xl rounded-tl-md border border-dashed border-ink/30 bg-paper px-4 py-2 text-sm leading-relaxed text-ink-soft">
                    <span className="mb-0.5 block text-[10px] font-semibold text-ink-muted">あなたの言い方</span>
                    {st.attempt}
                  </div>
                </div>
              )}
              <DialogueBubble turn={st.turn} animate />
            </div>
          ),
        )}

        {/* あなたの番 */}
        {pending && (
          <Card className="border-ink/15 p-4 animate-fade-up">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-paper">
                番
              </span>
              <span className="text-sm font-bold text-ink">あなたの番です</span>
              {pending.section.phase && <PhaseChip phase={pending.section.phase} />}
            </div>
            {pending.section.goal && (
              <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-ink-muted">
                <Target size={13} className="mt-0.5 shrink-0 text-accent" />
                <span>
                  <span className="font-semibold text-ink-soft">狙い：</span>
                  {pending.section.goal}
                </span>
              </p>
            )}
            <textarea
              value={attempt}
              onChange={(e) => setAttempt(e.target.value)}
              rows={2}
              placeholder="自分ならこう言う（入力は任意。声に出すだけでもOK）"
              className="mt-3 w-full resize-y rounded-lg border border-paper-line bg-paper-soft px-3 py-2.5 text-sm leading-relaxed text-ink placeholder:text-ink-muted/70 focus:border-ink/30 focus:bg-paper"
            />
            <button
              onClick={reveal}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift sm:w-auto"
            >
              <Eye size={15} /> 模範トークを表示して進む
            </button>
          </Card>
        )}

        {/* 完了 */}
        {done && (
          <Card className="overflow-hidden animate-fade-up">
            <div className="surface-hero p-5 text-paper">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-paper/20 bg-paper/10">
                  <PartyPopper size={20} />
                </span>
                <div>
                  <div className="font-bold">練習おつかれさまでした！</div>
                  <div className="mt-0.5 text-xs text-paper/70">
                    {script.title}・自分のセリフ {staffTotal} 回{count > 0 && `・通算 ${count} 回目`}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="text-sm font-bold text-ink">セルフチェック</div>
              <ul className="mt-2.5 space-y-1.5">
                {SELF_CHECK.map((label, i) => (
                  <li key={i}>
                    <button
                      onClick={() => setChecks((c) => c.map((v, j) => (j === i ? !v : v)))}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        checks[i] ? "bg-pass-soft text-ink" : "bg-paper-soft text-ink-soft"
                      }`}
                    >
                      <CheckCircle2 size={17} className={`shrink-0 ${checks[i] ? "text-pass" : "text-paper-line"}`} />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-2.5 text-xs text-ink-muted">
                チェックが付かなかった項目は、トーク詳細の「狙い」を読み直してもう一周しましょう。
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={restart}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <RotateCcw size={14} /> もう一度練習する
                </button>
                <Link
                  to={`/scripts/${script.id}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-paper-line bg-paper px-4 py-2.5 text-sm font-medium text-ink shadow-card transition-colors hover:bg-paper-soft"
                >
                  トーク全文を見る <ChevronRight size={15} />
                </Link>
                <Link
                  to="/roleplay"
                  className="inline-flex items-center gap-1 rounded-lg border border-paper-line bg-paper px-4 py-2.5 text-sm font-medium text-ink shadow-card transition-colors hover:bg-paper-soft"
                >
                  ロープレ設定へ <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          </Card>
        )}

        <div ref={endRef} aria-hidden />
      </div>
    </div>
  );
}
