import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, RotateCw, X } from "lucide-react";
import { useProvide } from "@/growth/context/ProvideContext";
import { quizModuleMeta } from "@/growth/data/curriculum";
import { quizForModule } from "@/data/quiz";
import { gradeQuiz, allAnswered } from "@/lib/quiz";
import type { AnswerMap, QuizResult } from "@/lib/quiz";
import { isPassed } from "@/lib/progress";
import {
  Card,
  PageHeader,
  PrimaryButton,
  GhostButton,
  ProgressRing,
  GIcon,
  ACCENT,
} from "@/growth/components/ui";

export function QuizTake() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { recordQuiz } = useProvide();

  const meta = moduleId ? quizModuleMeta(moduleId) : undefined;
  const questions = moduleId ? quizForModule(moduleId) : [];

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  // 採点後は結果にフォーカス＆スクロール
  useEffect(() => {
    if (result) {
      resultRef.current?.focus();
      // jsdom など scrollIntoView 非実装の環境でも落とさない
      if (typeof resultRef.current?.scrollIntoView === "function") {
        resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [result]);

  // --- 空状態（モジュール未定義または設問なし） ---
  if (!meta || questions.length === 0) {
    return (
      <div className="space-y-6">
        <Link
          to="/quiz"
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-2 text-sm text-slate-500 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
          クイズ一覧
        </Link>
        <PageHeader eyebrow="Quiz & Test" title="テストが見つかりません" />
        <Card className="p-6">
          <p className="mb-5 text-sm text-slate-600">
            このテストは準備中か、URLが変わった可能性があります。一覧に戻って別のテストを選んでください。
          </p>
          <Link to="/quiz">
            <GhostButton>クイズ一覧に戻る</GhostButton>
          </Link>
        </Card>
      </div>
    );
  }

  // meta is guaranteed non-undefined after the early return above; capture for nested fn access
  const confirmedMeta = meta;
  const a = ACCENT[confirmedMeta.accent];
  const passed = result ? isPassed(result.score, confirmedMeta.passing) : false;

  function toggle(qId: string, index: number, multi: boolean) {
    if (submitted) return;
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
    const graded = gradeQuiz(questions, answers);
    setResult(graded);
    setSubmitted(true);
    recordQuiz(confirmedMeta.moduleId, graded.score);
  }

  function retake() {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
  }

  const answered = allAnswered(questions, answers);

  return (
    <div className="space-y-6">
      {/* 常設スクリーンリーダー向けライブリージョン */}
      <div ref={liveRef} role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {result
          ? `採点完了。${result.score}点。合格点${confirmedMeta.passing}点。${passed ? "合格しました。" : "不合格です。もう一度受験できます。"}`
          : ""}
      </div>

      {/* 戻りリンク */}
      <Link
        to="/quiz"
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-2 text-sm text-slate-500 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        クイズ一覧
      </Link>

      {/* ページヘッダー */}
      <PageHeader
        eyebrow="Quiz & Test"
        title={confirmedMeta.title}
        description={confirmedMeta.description}
        action={
          <div
            className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${a.from} ${a.to} text-white shadow-sm`}
            aria-hidden="true"
          >
            <GIcon name={confirmedMeta.icon} size={24} strokeWidth={1.75} />
          </div>
        }
      />

      {/* 採点結果バナー */}
      {result && (
        <div
          ref={resultRef}
          tabIndex={-1}
          className={`rounded-2xl border p-6 outline-none ${
            passed ? "border-emerald-100 bg-emerald-50" : "border-orange-100 bg-orange-50"
          }`}
        >
          <div className="flex flex-wrap items-center gap-5">
            {/* スコアリング */}
            <ProgressRing
              value={result.score}
              size={72}
              stroke={6}
              color={passed ? "text-emerald-500" : "text-orange-400"}
              track="text-slate-200"
              label={
                <span className="font-display tabular-nums text-base font-bold text-slate-700">
                  {result.score}
                </span>
              }
            />

            <div className="flex-1 space-y-1">
              <div
                className={`text-lg font-bold ${passed ? "text-emerald-700" : "text-orange-700"}`}
              >
                {passed ? "合格しました" : "もう一歩。再受験できます"}
              </div>
              <div className="text-sm text-slate-500">
                正答{" "}
                <span className="font-display tabular-nums font-semibold text-slate-700">
                  {result.correctCount}
                </span>{" "}
                /{" "}
                <span className="font-display tabular-nums font-semibold text-slate-700">
                  {result.total}
                </span>{" "}
                問・合格点{" "}
                <span className="font-display tabular-nums font-semibold text-slate-700">
                  {confirmedMeta.passing}
                </span>{" "}
                点
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {passed ? (
              <Link to="/quiz">
                <PrimaryButton>クイズ一覧に戻る</PrimaryButton>
              </Link>
            ) : (
              <PrimaryButton onClick={retake}>
                <RotateCw size={16} strokeWidth={1.75} />
                もう一度
              </PrimaryButton>
            )}
            <Link
              to="/quiz"
              className="inline-flex min-h-[44px] items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            >
              クイズ一覧
            </Link>
          </div>
        </div>
      )}

      {/* 設問リスト */}
      <ol className="space-y-4" aria-label="設問">
        {questions.map((q, qi) => {
          const multi = q.correct.length > 1;
          const selected = answers[q.id] ?? [];
          const qResult = result?.results.find((r) => r.id === q.id);
          const isCorrect = qResult?.correct ?? false;

          return (
            <li key={q.id}>
              <Card
                className={`p-5 ${
                  result ? (isCorrect ? "border-emerald-100" : "border-orange-100") : ""
                }`}
              >
                <div role="group" aria-labelledby={`${q.id}-label`}>
                  {/* 設問文 */}
                  <div id={`${q.id}-label`} className="mb-4 flex items-start gap-2">
                    <span
                      className={`font-display tabular-nums shrink-0 text-sm font-bold ${a.softText}`}
                      aria-hidden="true"
                    >
                      Q{qi + 1}.
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {q.prompt}
                      {multi && (
                        <span className="ml-2 text-xs font-normal text-slate-400">
                          （複数選択）
                        </span>
                      )}
                    </span>
                  </div>

                  {/* 選択肢 */}
                  <div className="space-y-2">
                    {q.choices.map((choice, ci) => {
                      const checked = selected.includes(ci);
                      const correctChoice = q.correct.includes(ci);
                      const showState = result != null;

                      let choiceCls = "border-slate-200 bg-white hover:bg-slate-50";
                      if (showState && correctChoice) {
                        choiceCls = "border-emerald-300 bg-emerald-50";
                      } else if (showState && checked && !correctChoice) {
                        choiceCls = "border-orange-300 bg-orange-50";
                      } else if (!showState && checked) {
                        choiceCls = `border-blue-300 ${a.soft}`;
                      }

                      return (
                        <label
                          key={ci}
                          className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition duration-150 ${choiceCls} ${submitted ? "cursor-default" : ""}`}
                        >
                          <input
                            type={multi ? "checkbox" : "radio"}
                            name={q.id}
                            className="h-4 w-4 shrink-0 accent-blue-600 focus-visible:ring-2 focus-visible:ring-blue-400"
                            checked={checked}
                            disabled={submitted}
                            onChange={() => toggle(q.id, ci, multi)}
                            aria-describedby={showState ? `${q.id}-explanation` : undefined}
                          />
                          <span className="flex-1 text-slate-700">{choice}</span>
                          {showState && correctChoice && (
                            <Check
                              size={16}
                              strokeWidth={1.75}
                              className="shrink-0 text-emerald-600"
                              aria-hidden="true"
                            />
                          )}
                          {showState && checked && !correctChoice && (
                            <X
                              size={16}
                              strokeWidth={1.75}
                              className="shrink-0 text-orange-500"
                              aria-hidden="true"
                            />
                          )}
                        </label>
                      );
                    })}
                  </div>

                  {/* 解説（採点後） */}
                  {result && (
                    <div
                      id={`${q.id}-explanation`}
                      className={`mt-3 flex items-start gap-2 rounded-xl px-3 py-2 text-sm ${
                        isCorrect
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-orange-50 text-orange-800"
                      }`}
                    >
                      <span className="shrink-0 font-semibold">
                        {isCorrect ? "正解" : "不正解"}
                      </span>
                      <span className="text-slate-600">{q.explanation}</span>
                    </div>
                  )}
                </div>
              </Card>
            </li>
          );
        })}
      </ol>

      {/* 採点ボタン（未採点時のみ） */}
      {!submitted && (
        <div className="flex flex-wrap items-center gap-3 pb-4">
          <PrimaryButton onClick={handleSubmit} disabled={!answered}>
            <Check size={16} strokeWidth={1.75} />
            採点する
          </PrimaryButton>
          {!answered && (
            <p className="text-xs text-slate-400" aria-live="polite">
              すべての設問に回答すると採点できます。
            </p>
          )}
        </div>
      )}
    </div>
  );
}
