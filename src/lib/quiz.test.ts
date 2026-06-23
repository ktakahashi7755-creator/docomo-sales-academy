import { describe, it, expect } from "vitest";
import { gradeQuiz, isAnswerCorrect, allAnswered, type AnswerMap } from "@/lib/quiz";
import { isPassed } from "@/lib/progress";
import type { QuizQuestion } from "@/lib/types";

const q = (id: string, correct: number[]): QuizQuestion => ({
  id,
  moduleId: "m",
  prompt: id,
  choices: ["A", "B", "C", "D"],
  correct,
  explanation: "",
});

// N問の単一選択問題（正解は index 0）を作る。
function makeQuestions(n: number): QuizQuestion[] {
  return Array.from({ length: n }, (_, i) => q(`q${i}`, [0]));
}
// 最初の k 問を正解、残りを不正解（index 1）にした解答。
function answerFirst(n: number, k: number): AnswerMap {
  const a: AnswerMap = {};
  for (let i = 0; i < n; i++) a[`q${i}`] = [i < k ? 0 : 1];
  return a;
}

describe("isAnswerCorrect", () => {
  it("単一選択：一致で正解", () => {
    expect(isAnswerCorrect(q("a", [2]), [2])).toBe(true);
    expect(isAnswerCorrect(q("a", [2]), [1])).toBe(false);
  });
  it("未解答は不正解", () => {
    expect(isAnswerCorrect(q("a", [0]), undefined)).toBe(false);
    expect(isAnswerCorrect(q("a", [0]), [])).toBe(false);
  });
  it("複数選択：集合一致のみ正解（順不同・重複無視）", () => {
    expect(isAnswerCorrect(q("a", [0, 2]), [2, 0])).toBe(true);
    expect(isAnswerCorrect(q("a", [0, 2]), [0, 2, 2])).toBe(true);
    expect(isAnswerCorrect(q("a", [0, 2]), [0])).toBe(false);
    expect(isAnswerCorrect(q("a", [0, 2]), [0, 1])).toBe(false);
  });
  it("正解なし設問(correct:[])：未解答は不正解、何か選べば不正解", () => {
    expect(isAnswerCorrect(q("a", []), [])).toBe(false);
    expect(isAnswerCorrect(q("a", []), [0])).toBe(false);
  });
});

describe("gradeQuiz", () => {
  it("空クイズは score 0", () => {
    expect(gradeQuiz([], {})).toEqual({ total: 0, correctCount: 0, score: 0, results: [] });
  });
  it("全問正解で100、全問不正解で0", () => {
    const qs = makeQuestions(5);
    expect(gradeQuiz(qs, answerFirst(5, 5)).score).toBe(100);
    expect(gradeQuiz(qs, answerFirst(5, 0)).score).toBe(0);
  });
  it("正答率は四捨五入（3/8=37.5→38）", () => {
    expect(gradeQuiz(makeQuestions(8), answerFirst(8, 3)).score).toBe(38);
  });
});

// 合格点ロジックの境界値（79/80・89/90・99/100）を採点パイプライン経由で検証。
describe("gradeQuiz → isPassed の境界値", () => {
  const qs = makeQuestions(100);
  it.each([
    [79, 80, false],
    [80, 80, true],
    [89, 90, false],
    [90, 90, true],
    [99, 100, false],
    [100, 100, true],
  ])("正解%i問 / 合格点%i → 合格=%s", (correctCount, passing, expected) => {
    const { score } = gradeQuiz(qs, answerFirst(100, correctCount));
    expect(score).toBe(correctCount);
    expect(isPassed(score, passing)).toBe(expected);
  });
});

describe("allAnswered", () => {
  it("全問解答済みで true、未解答が残れば false", () => {
    const qs = makeQuestions(3);
    expect(allAnswered(qs, { q0: [0], q1: [1], q2: [2] })).toBe(true);
    expect(allAnswered(qs, { q0: [0], q1: [], q2: [2] })).toBe(false);
    expect(allAnswered(qs, { q0: [0] })).toBe(false);
  });
  it("設問が空なら vacuously true（呼び出し側は別途 length>0 を確認する）", () => {
    expect(allAnswered([], {})).toBe(true);
  });
});
