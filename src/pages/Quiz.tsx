import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PHASES } from "@/data/seed";
import { quizForModule } from "@/data/quiz";
import { ErrorState, PageLoading, PageTitle, ProgressBar } from "@/components/ui";
import { flattenModules, isPassed } from "@/lib/progress";
import { gradeQuiz, allAnswered, type AnswerMap, type QuizResult } from "@/lib/quiz";
import { ArrowLeft, Check, X, RotateCw, ChevronRight } from "lucide-react";

const ALL_MODULES = flattenModules(PHASES);

export function Quiz() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { profile, setModuleScore } = useAuth();
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // 採点後は結果へフォーカス＆スクロールし、結果が主役になるようにする。
  useEffect(() => {
    if (result) {
      resultRef.current?.focus();
      resultRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  if (!profile) return <PageLoading />;

  const module = ALL_MODULES.find((m) => m.id === moduleId);
  const questions = moduleId ? quizForModule(moduleId) : [];

  if (!module) {
    return (
      <ErrorState
        title="モジュールが見つかりませんでした"
        description="URL が変わったか、削除された可能性があります。ロードマップから選び直してください。"
        action={
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-1 rounded-lg bg-ink px-3 py-2 text-sm font-medium text-paper"
          >
            <ArrowLeft size={16} /> ロードマップへ
          </Link>
        }
      />
    );
  }

  if (questions.length === 0) {
    return (
      <ErrorState
        title="このモジュールのテストは準備中です"
        description="設問が用意でき次第、ここで受験できます。別のモジュールを選んでください。"
        action={
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-1 rounded-lg bg-ink px-3 py-2 text-sm font-medium text-paper"
          >
            <ArrowLeft size={16} /> ロードマップへ
          </Link>
        }
      />
    );
  }

  const passing = module.passing_score;
  const passed = result ? isPassed(result.score, passing) : false;

  function toggle(qId: string, index: number, multi: boolean) {
    if (result) return; // 採点後は変更しない
    setAnswers((prev) => {
      const current = prev[qId] ?? [];
      if (multi) {
        const next = current.includes(index)
          ? current.filter((i) => i !== index)
          : [...current, index];
        return { ...prev, [qId]: next };
      }
      return { ...prev, [qId]: [index] };
    });
  }

  function handleSubmit() {
    if (!module) return; // 型ナローイング＋安全側
    const graded = gradeQuiz(questions, answers);
    setResult(graded);
    // 進捗に記録。setModuleScore は best score を保持するため、再受験で低スコアでも巻き戻らない。
    // 合格なら b-first バッジは進捗から自動導出（ADR-0006）。
    setModuleScore(module.id, graded.score);
  }

  function retake() {
    setAnswers({});
    setResult(null);
  }

  return (
    <div className="space-y-6">
      {/* 常設のライブリージョン（採点結果をスクリーンリーダーへ確実に通知） */}
      <div role="status" aria-live="polite" className="sr-only">
        {result ? `${passed ? "合格" : "不合格"}。${result.score}点。合格点${passing}点。` : ""}
      </div>

      <Link
        to="/roadmap"
        className="-ml-2 inline-flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={16} /> ロードマップ
      </Link>

      <PageTitle
        eyebrow={`Phase ${module.phase.no}・${module.phase.title}`}
        title={module.title}
        description={`理解度テスト・全${questions.length}問／合格点 ${passing} 点`}
      />

      {result && (
        <section
          ref={resultRef}
          tabIndex={-1}
          className={`rounded-xl2 border border-paper-line p-5 shadow-card ${passed ? "bg-pass-soft" : "bg-caution-soft"}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div
                className={`text-sm font-semibold ${passed ? "text-pass-deep" : "text-caution-deep"}`}
              >
                {passed ? "合格しました" : "もう一歩。再受験できます"}
              </div>
              <div className="text-sm text-ink-soft">
                正答 <span className="font-num">{result.correctCount}</span> / {result.total}
                ・合格点 {passing} 点
              </div>
            </div>
            <div className="font-num text-3xl font-bold text-ink">
              {result.score}
              <span className="text-base text-ink-muted">点</span>
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar value={result.score} tone={passed ? "pass" : "caution"} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {passed ? (
              <Link
                to="/roadmap"
                className="inline-flex min-h-[44px] items-center gap-1 rounded-lg bg-ink px-4 text-sm font-medium text-paper"
              >
                ロードマップで次へ <ChevronRight size={16} />
              </Link>
            ) : (
              <button
                onClick={retake}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-ink px-4 text-sm font-medium text-paper"
              >
                <RotateCw size={16} /> もう一度受ける
              </button>
            )}
            <span className="text-xs text-ink-muted">
              結果はロードマップとダッシュボードに反映されます。
            </span>
          </div>
        </section>
      )}

      <ol className="space-y-4">
        {questions.map((q, qi) => {
          const multi = q.correct.length > 1;
          const selected = answers[q.id] ?? [];
          const isCorrect = result?.results.find((r) => r.id === q.id)?.correct ?? false;
          return (
            <li key={q.id}>
              <div
                role="group"
                aria-labelledby={`${q.id}-label`}
                className="rounded-xl2 border border-paper-line bg-paper p-5 shadow-card"
              >
                <div
                  id={`${q.id}-label`}
                  className="mb-3 flex items-start gap-2 text-sm font-semibold text-ink"
                >
                  <span className="font-num text-ink-muted">Q{qi + 1}.</span>
                  <span>
                    {q.prompt}
                    {multi && <span className="ml-1 text-xs text-ink-muted">（複数選択）</span>}
                  </span>
                </div>
                <div className="space-y-2">
                  {q.choices.map((choice, ci) => {
                    const checked = selected.includes(ci);
                    const correctChoice = q.correct.includes(ci);
                    const showState = result != null;
                    return (
                      <label
                        key={ci}
                        className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm ${
                          showState && correctChoice
                            ? "border-pass bg-pass-soft"
                            : showState && checked && !correctChoice
                              ? "border-fail bg-fail-soft"
                              : checked
                                ? "border-ink bg-paper-soft"
                                : "border-paper-line bg-paper hover:bg-paper-soft"
                        }`}
                      >
                        <input
                          type={multi ? "checkbox" : "radio"}
                          name={q.id}
                          className="h-4 w-4 accent-ink"
                          checked={checked}
                          disabled={result != null}
                          onChange={() => toggle(q.id, ci, multi)}
                        />
                        <span className="flex-1 text-ink">{choice}</span>
                        {showState && correctChoice && (
                          <Check size={16} className="shrink-0 text-pass-deep" />
                        )}
                        {showState && checked && !correctChoice && (
                          <X size={16} className="shrink-0 text-fail-deep" />
                        )}
                      </label>
                    );
                  })}
                </div>
                {result && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-paper-soft px-3 py-2 text-sm">
                    <span
                      className={`mt-0.5 shrink-0 font-semibold ${isCorrect ? "text-pass-deep" : "text-caution-deep"}`}
                    >
                      {isCorrect ? "正解" : "不正解"}
                    </span>
                    <span className="text-ink-soft">{q.explanation}</span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {!result && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered(questions, answers)}
            className="inline-flex min-h-[48px] items-center gap-1.5 rounded-xl2 bg-ink px-5 text-sm font-medium text-paper disabled:opacity-50"
          >
            <Check size={16} /> 採点する
          </button>
          {!allAnswered(questions, answers) && (
            <span className="text-xs text-ink-muted">すべての設問に回答すると採点できます。</span>
          )}
        </div>
      )}
    </div>
  );
}
