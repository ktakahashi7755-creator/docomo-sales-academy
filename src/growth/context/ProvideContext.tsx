import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  CURRICULUM,
  ALL_LESSONS,
  type CurriculumStep,
  type Lesson,
} from "@/growth/data/curriculum";

/**
 * Provide Growth Academy のフロント状態（デモ＝ブラウザ内メモリ保持）。
 * レッスン進捗・確認テスト・ロープレ結果・学習時間・AIボットの開閉を集約する。
 * 後から Supabase に置き換えやすいよう、状態は素朴な Record/配列で持つ。
 */

export type LessonStatus = "completed" | "in-progress" | "not-started";

export interface RoleplayResult {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  score: number;
  rank: string;
  date: string;
}

interface ProvideState {
  user: { name: string; role: string };
  /** 入室済みか（デモの簡易エントリー。役割選択はしない）。 */
  entered: boolean;
  lessonProgress: Record<string, number>; // 0..100
  quizScores: Record<string, number>; // moduleId -> best score
  roleplayResults: RoleplayResult[];
  studyMinutes: number;
  botOpen: boolean;

  // actions
  enter: (name?: string) => void;
  logout: () => void;
  startLesson: (id: string) => void;
  completeLesson: (id: string) => void;
  recordQuiz: (moduleId: string, score: number) => void;
  recordRoleplay: (r: Omit<RoleplayResult, "id" | "date">) => void;
  openBot: () => void;
  closeBot: () => void;

  // selectors
  lessonStatus: (id: string) => LessonStatus;
  stepProgress: (stepId: string) => number;
  overallProgress: number;
  currentLesson: Lesson | null;
  quizAverage: number | null;
}

const ProvideContext = createContext<ProvideState | null>(null);

// 入室状態の永続化キー（この端末のみ。Supabase 導入時に置き換え）。
const STORAGE_ENTERED = "provide.entered";
const STORAGE_NAME = "provide.userName";
const DEFAULT_NAME = "山田 花子";

// localStorage はプライベートモード等で例外になりうるため安全に読む。
function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // 保存できない環境ではメモリ内のみで動作（デモとして許容）
  }
}

// デモの初期状態（参照デザインに合わせ STEP1 完了・STEP2 学習中）。
const INITIAL_PROGRESS: Record<string, number> = {
  "l1-1": 100,
  "l1-2": 100,
  "l1-3": 100,
  "l1-4": 100,
  "l2-1": 100,
  "l2-2": 70,
};
const INITIAL_QUIZ: Record<string, number> = {
  p1m4: 100,
  p1m5: 88,
};
const INITIAL_STUDY_MINUTES = 510; // 8時間30分

function statusOf(pct: number | undefined): LessonStatus {
  if (pct == null || pct === 0) return "not-started";
  if (pct >= 100) return "completed";
  return "in-progress";
}

export function ProvideProvider({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState<boolean>(() => readStorage(STORAGE_ENTERED) === "1");
  const [userName, setUserName] = useState<string>(() => readStorage(STORAGE_NAME) ?? DEFAULT_NAME);
  const [lessonProgress, setLessonProgress] = useState<Record<string, number>>(INITIAL_PROGRESS);
  const [quizScores, setQuizScores] = useState<Record<string, number>>(INITIAL_QUIZ);
  const [roleplayResults, setRoleplayResults] = useState<RoleplayResult[]>([]);
  const [studyMinutes, setStudyMinutes] = useState<number>(INITIAL_STUDY_MINUTES);
  const [botOpen, setBotOpen] = useState(false);

  const enter = useCallback((name?: string) => {
    const trimmed = name?.trim();
    const finalName = trimmed && trimmed.length > 0 ? trimmed : DEFAULT_NAME;
    setUserName(finalName);
    setEntered(true);
    writeStorage(STORAGE_NAME, finalName);
    writeStorage(STORAGE_ENTERED, "1");
  }, []);

  const logout = useCallback(() => {
    setEntered(false);
    setBotOpen(false);
    writeStorage(STORAGE_ENTERED, null);
  }, []);

  const startLesson = useCallback((id: string) => {
    setLessonProgress((prev) => (prev[id] ? prev : { ...prev, [id]: 10 }));
  }, []);

  const completeLesson = useCallback((id: string) => {
    setLessonProgress((prev) => {
      if (prev[id] === 100) return prev;
      const lesson = ALL_LESSONS.find((l) => l.id === id);
      if (lesson) setStudyMinutes((m) => m + lesson.minutes);
      return { ...prev, [id]: 100 };
    });
  }, []);

  const recordQuiz = useCallback((moduleId: string, score: number) => {
    setQuizScores((prev) => ({ ...prev, [moduleId]: Math.max(prev[moduleId] ?? 0, score) }));
  }, []);

  const recordRoleplay = useCallback((r: Omit<RoleplayResult, "id" | "date">) => {
    const now = new Date();
    const p = (n: number) => String(n).padStart(2, "0");
    const date = `${now.getFullYear()}/${p(now.getMonth() + 1)}/${p(now.getDate())}`;
    setRoleplayResults((prev) => [{ ...r, id: `rp-${Date.now().toString(36)}`, date }, ...prev]);
  }, []);

  const openBot = useCallback(() => setBotOpen(true), []);
  const closeBot = useCallback(() => setBotOpen(false), []);

  const value = useMemo<ProvideState>(() => {
    const lessonStatus = (id: string) => statusOf(lessonProgress[id]);

    const stepProgress = (stepId: string) => {
      const step = CURRICULUM.find((s) => s.id === stepId);
      if (!step || step.lessons.length === 0) return 0;
      const done = step.lessons.filter((l) => lessonProgress[l.id] === 100).length;
      return Math.round((done / step.lessons.length) * 100);
    };

    const totalDone = ALL_LESSONS.filter((l) => lessonProgress[l.id] === 100).length;
    const overallProgress = Math.round((totalDone / ALL_LESSONS.length) * 100);

    const currentLesson = ALL_LESSONS.find((l) => lessonProgress[l.id] !== 100) ?? null;

    const quizValues = Object.values(quizScores);
    const quizAverage =
      quizValues.length === 0
        ? null
        : Math.round(quizValues.reduce((a, b) => a + b, 0) / quizValues.length);

    return {
      user: { name: userName, role: "研修生" },
      entered,
      lessonProgress,
      quizScores,
      roleplayResults,
      studyMinutes,
      botOpen,
      enter,
      logout,
      startLesson,
      completeLesson,
      recordQuiz,
      recordRoleplay,
      openBot,
      closeBot,
      lessonStatus,
      stepProgress,
      overallProgress,
      currentLesson,
      quizAverage,
    };
  }, [
    userName,
    entered,
    lessonProgress,
    quizScores,
    roleplayResults,
    studyMinutes,
    botOpen,
    enter,
    logout,
    startLesson,
    completeLesson,
    recordQuiz,
    recordRoleplay,
    openBot,
    closeBot,
  ]);

  return <ProvideContext.Provider value={value}>{children}</ProvideContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProvide() {
  const ctx = useContext(ProvideContext);
  if (!ctx) throw new Error("useProvide must be used within ProvideProvider");
  return ctx;
}

/** ステップ全体の状態（ロック判定込み）。前ステップが未完了なら locked。 */
// eslint-disable-next-line react-refresh/only-export-components
export function stepStatus(
  step: CurriculumStep,
  stepProgress: (stepId: string) => number,
): "completed" | "in-progress" | "locked" {
  const pct = stepProgress(step.id);
  if (pct === 100) return "completed";
  const idx = CURRICULUM.findIndex((s) => s.id === step.id);
  if (idx === 0) return pct > 0 ? "in-progress" : "in-progress";
  const prevDone = stepProgress(CURRICULUM[idx - 1].id) === 100;
  if (!prevDone && pct === 0) return "locked";
  return "in-progress";
}
