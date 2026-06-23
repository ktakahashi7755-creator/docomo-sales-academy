// Provide Growth Academy — ダッシュボードのダミーデータ（配列管理・拡張前提）。
// 「初期設定カリキュラム」を後から追加できるよう、ステップ／レッスンは配列で定義する。
// アイコンは文字列キーで持ち、表示側（components/ui.tsx）で Lucide にマップする。

export type GrowthIcon =
  | "dashboard"
  | "curriculum"
  | "content"
  | "roleplay"
  | "quiz"
  | "report"
  | "announce"
  | "help"
  | "bot"
  | "book"
  | "smile"
  | "ear"
  | "lightbulb"
  | "target"
  | "rocket"
  | "clock"
  | "award"
  | "calendar"
  | "video"
  | "manual"
  | "users"
  | "message";

/** ステップの配色キー（青→水色→ティール→緑→オレンジ）。 */
export type Accent = "navy" | "blue" | "teal" | "green" | "orange";
export type StepStatus = "completed" | "in-progress" | "locked";
export type LessonStatus = "completed" | "in-progress" | "not-started";

export interface NavItem {
  id: string;
  label: string;
  icon: GrowthIcon;
}

export interface CurriculumStep {
  id: string;
  no: number;
  title: string;
  duration: string;
  icon: GrowthIcon;
  accent: Accent;
  status: StepStatus;
}

export interface Lesson {
  no: number;
  title: string;
  description: string;
  status: LessonStatus;
  progress?: number;
  lastStudied?: string;
}

export interface CurrentCurriculum {
  stepNo: number;
  title: string;
  description: string;
  progress: number;
  duration: string;
  contentCount: number;
  testCount: number;
}

export interface StepGoal {
  heading: string;
  description: string;
  checklist: string[];
}

export interface PerformanceStat {
  id: string;
  label: string;
  value: string;
  icon: GrowthIcon;
  accent: Accent;
}

export interface ScheduleItem {
  id: string;
  date: string;
  time: string;
  title: string;
  reserved: boolean;
}

export interface SupportCard {
  id: string;
  title: string;
  description: string;
  icon: GrowthIcon;
  accent: Accent;
}

export interface VideoContent {
  id: string;
  title: string;
  duration: string;
  accent: Accent;
}

export interface CurrentUser {
  name: string;
  role: string;
  stepLabel: string;
  progress: number;
}

// ===== サイドバー =====
export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "ダッシュボード", icon: "dashboard" },
  { id: "curriculum", label: "カリキュラム一覧", icon: "curriculum" },
  { id: "content", label: "学習コンテンツ", icon: "content" },
  { id: "roleplay", label: "実践・ロープレ", icon: "roleplay" },
  { id: "quiz", label: "クイズ・テスト", icon: "quiz" },
  { id: "report", label: "進捗レポート", icon: "report" },
  { id: "announce", label: "お知らせ", icon: "announce" },
  { id: "help", label: "ヘルプ・FAQ", icon: "help" },
];
export const ACTIVE_NAV_ID = "dashboard";

// ===== 現在のユーザー =====
export const CURRENT_USER: CurrentUser = {
  name: "山田 花子",
  role: "研修生",
  stepLabel: "STEP 02 学習中",
  progress: 42,
};

// ===== 5ステップ（販売育成カリキュラム） =====
export const STEPS: CurriculumStep[] = [
  {
    id: "step-1",
    no: 1,
    title: "販売の基本を学ぶ",
    duration: "目安 1〜2週間",
    icon: "book",
    accent: "navy",
    status: "completed",
  },
  {
    id: "step-2",
    no: 2,
    title: "接客・ヒアリングを学ぶ",
    duration: "目安 2〜3週間",
    icon: "ear",
    accent: "blue",
    status: "in-progress",
  },
  {
    id: "step-3",
    no: 3,
    title: "提案力を高める",
    duration: "目安 2〜3週間",
    icon: "lightbulb",
    accent: "teal",
    status: "locked",
  },
  {
    id: "step-4",
    no: 4,
    title: "クロージングを学ぶ",
    duration: "目安 2週間",
    icon: "target",
    accent: "green",
    status: "locked",
  },
  {
    id: "step-5",
    no: 5,
    title: "実践・自立",
    duration: "目安 3週間",
    icon: "rocket",
    accent: "orange",
    status: "locked",
  },
];

// ===== 現在のカリキュラム（STEP 02） =====
export const CURRENT_CURRICULUM: CurrentCurriculum = {
  stepNo: 2,
  title: "接客・ヒアリングを学ぶ",
  description: "お客様との会話を通じて、ニーズを正しく引き出す力を身につけます。",
  progress: 42,
  duration: "2〜3週間",
  contentCount: 12,
  testCount: 3,
};

// ===== STEP 02 の学習ステップ一覧 =====
export const LESSONS: Lesson[] = [
  {
    no: 1,
    title: "第一印象と基本マナー",
    description: "挨拶・身だしなみ・声のトーンを学ぶ",
    status: "completed",
    lastStudied: "2026/06/12",
  },
  {
    no: 2,
    title: "お客様への声かけ",
    description: "自然なアプローチと会話開始を学ぶ",
    status: "in-progress",
    progress: 70,
    lastStudied: "2026/06/16",
  },
  {
    no: 3,
    title: "ヒアリングの基本",
    description: "お客様の状況・悩み・希望を聞き出す",
    status: "not-started",
  },
  {
    no: 4,
    title: "ニーズ整理",
    description: "聞いた内容を整理し、提案につなげる",
    status: "not-started",
  },
  {
    no: 5,
    title: "確認・共感トーク",
    description: "お客様に安心感を与える伝え方を学ぶ",
    status: "not-started",
  },
];

// ===== このステップのゴール =====
export const STEP_GOAL: StepGoal = {
  heading: "お客様のニーズを正しく引き出せる",
  description: "お客様との会話から課題や希望を整理し、最適な提案につなげる基礎力を身につけます。",
  checklist: [
    "自然な声かけができる",
    "お客様の話を最後まで聞ける",
    "質問を使ってニーズを深掘りできる",
    "聞いた内容を整理して共有できる",
  ],
};

// ===== パフォーマンス =====
export const PERFORMANCE: PerformanceStat[] = [
  { id: "time", label: "学習時間", value: "8時間30分", icon: "clock", accent: "blue" },
  { id: "score", label: "テスト正答率", value: "78%", icon: "target", accent: "teal" },
  { id: "rank", label: "総合評価", value: "B", icon: "award", accent: "orange" },
];

// ===== 今後のスケジュール =====
export const SCHEDULE: ScheduleItem[] = [
  {
    id: "s1",
    date: "6/18（水）",
    time: "10:00〜11:00",
    title: "ロープレ練習：声かけ",
    reserved: true,
  },
  {
    id: "s2",
    date: "6/20（金）",
    time: "15:00〜16:00",
    title: "確認テスト（Step02）",
    reserved: true,
  },
  {
    id: "s3",
    date: "6/25（水）",
    time: "10:00〜11:00",
    title: "フィードバック面談",
    reserved: false,
  },
];

// ===== 学習サポート =====
export const SUPPORT_CARDS: SupportCard[] = [
  {
    id: "bot",
    title: "AIサポートBot",
    description: "わからないことをいつでも質問",
    icon: "bot",
    accent: "blue",
  },
  {
    id: "senior",
    title: "先輩に相談する",
    description: "現場の先輩がアドバイス",
    icon: "users",
    accent: "teal",
  },
  {
    id: "manual",
    title: "マニュアル・動画",
    description: "いつでも見返せる教材集",
    icon: "manual",
    accent: "green",
  },
  {
    id: "faq",
    title: "よくある質問",
    description: "つまずきやすいポイントを解決",
    icon: "help",
    accent: "orange",
  },
];

// ===== おすすめコンテンツ =====
export const RECOMMENDED: VideoContent[] = [
  { id: "v1", title: "接客の基本マナー", duration: "6:24", accent: "blue" },
  { id: "v2", title: "効果的なヒアリング方法", duration: "8:10", accent: "teal" },
  { id: "v3", title: "断られた時の対応方法", duration: "5:47", accent: "orange" },
];

// ===== 成功事例 =====
export const SUCCESS_CASE = {
  title: "成功事例を見る",
  description: "先輩スタッフの対応事例から、現場で効くコツを学べます。",
  members: ["佐藤 健", "鈴木 美咲", "田中 太郎"],
};
