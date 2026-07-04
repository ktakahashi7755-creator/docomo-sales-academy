// ===== 権限・ランク =====
export type Role = "trainee" | "helper" | "closer" | "sv" | "admin";

export const ROLE_LABEL: Record<Role, string> = {
  trainee: "研修生",
  helper: "現場ヘルパー",
  closer: "クローザー",
  sv: "SV",
  admin: "管理者",
};

export interface Profile {
  id: string;
  display_name: string;
  role: Role;
  store_name?: string;
  team_name?: string;
  level: number; // 0..10
  is_active: boolean;
}

export interface RankDef {
  level: number;
  label: string;
}

// ===== 研修ロードマップ =====
export interface Phase {
  id: string;
  no: number;
  title: string;
  summary: string;
  modules: ModuleItem[];
}

export interface ModuleItem {
  id: string;
  title: string;
  passing_score: number; // 通常80 / 重要90 / コンプラ100
  required: boolean;
  estimated_minutes: number;
}

// ===== 商材ナレッジ =====
export type ProductCategory =
  | "料金プラン"
  | "dカード"
  | "ドコモ光"
  | "ドコモでんき"
  | "ドコモガス"
  | "他社比較";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  tier?: "regular" | "gold" | "platinum";
  oneLiner: string;
  target: string;
  benefits: string[];
  warnings: string[];
  timing: string;
  hearing: string[];
  pitch: string[];
  objections: { q: string; a: string }[];
  closing: string;
  officialUrl: string;
  officialCheckedAt: string; // YYYY-MM-DD
  version: number;
}

// ===== トークスクリプト =====

/** キャッチ〜引継ぎの5フェーズ */
export type FlowPhase = "興味付け" | "着座" | "提案" | "クロージング" | "引継ぎ";

export const FLOW_PHASES: FlowPhase[] = ["興味付け", "着座", "提案", "クロージング", "引継ぎ"];

/** 掛け合い1ターン。noteはそのセリフの狙い・技術ポイント */
export interface DialogueTurn {
  speaker: "staff" | "customer";
  text: string;
  note?: string;
}

export interface TalkSection {
  heading: string;
  /** このステップが属するフェーズ（キャッチ系トークで使用） */
  phase?: FlowPhase;
  /** このステップの狙い（何を達成したら次へ進むか） */
  goal?: string;
  /** 一方向の説明トーク（既存形式） */
  lines?: string[];
  /** 掛け合い形式のトーク（お客様の返答込み） */
  dialogue?: DialogueTurn[];
  note?: string;
}

export interface TalkScript {
  id: string;
  title: string;
  category: string;
  /** キャッチ系トークかどうか（一覧のタブ分けに使用） */
  kind?: "catch" | "product";
  productId?: string;
  target: string;
  difficulty: number; // 1..10
  timing: string;
  /** このスクリプトがカバーするフェーズ範囲 */
  phases?: FlowPhase[];
  sections: TalkSection[];
  ngExamples: string[];
  goodExamples: string[];
  note?: string;
}

// ===== 反論処理 =====
export interface ObjectionHandler {
  id: string;
  objection: string;
  background: string;
  ng: string;
  good: string;
  reframe: string;
  closing: string;
}

// ===== ロープレ =====
export type Carrier =
  | "au"
  | "ソフトバンク"
  | "楽天モバイル"
  | "ワイモバイル"
  | "UQモバイル"
  | "ahamo"
  | "povo"
  | "LINEMO"
  | "ドコモ既存";

export interface Scenario {
  id: string;
  no: number;
  title: string;
  carrier: Carrier;
  familyType: string;
  internetLine: string;
  interest: "低い" | "普通" | "高い";
  resistance: "低い" | "普通" | "高い";
  difficulty: number; // 1..10
  goal: string;
}

export interface EvalItem {
  key: string;
  label: string;
}

export interface DifficultyDef {
  level: number;
  desc: string;
}

// ===== バッジ・認定 =====
export interface Badge {
  id: string;
  name: string;
  description: string;
}

export interface CertCondition {
  id: string;
  label: string;
  done: boolean;
}
