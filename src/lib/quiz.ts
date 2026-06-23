import type { QuizQuestion } from "@/lib/types";

/**
 * クイズ採点の純粋ロジック。UI から切り離し、境界値を Vitest で検証する。
 * 合否判定は lib/progress.ts の isPassed（モジュールの合格点）を使う。
 */

export type AnswerMap = Record<string, number[]>;

/** 設問の正誤。選択集合が正解集合と完全一致したときのみ正解（複数選択対応）。 */
export function isAnswerCorrect(q: QuizQuestion, selected: number[] | undefined): boolean {
  if (!selected || selected.length === 0) return false;
  const a = [...q.correct].sort((x, y) => x - y);
  const b = [...new Set(selected)].sort((x, y) => x - y);
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export interface QuizResult {
  total: number;
  correctCount: number;
  /** 0–100 の整数（正答率の四捨五入）。 */
  score: number;
  results: { id: string; correct: boolean }[];
}

export function gradeQuiz(questions: readonly QuizQuestion[], answers: AnswerMap): QuizResult {
  const results = questions.map((q) => ({ id: q.id, correct: isAnswerCorrect(q, answers[q.id]) }));
  const correctCount = results.filter((r) => r.correct).length;
  const total = questions.length;
  const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  return { total, correctCount, score, results };
}

/** 全設問に解答済みか（未解答を残して提出させないため）。 */
export function allAnswered(questions: readonly QuizQuestion[], answers: AnswerMap): boolean {
  return questions.every((q) => (answers[q.id]?.length ?? 0) > 0);
}
