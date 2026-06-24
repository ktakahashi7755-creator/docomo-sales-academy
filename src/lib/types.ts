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
  | "ホームルーター"
  | "ドコモでんき"
  | "ドコモガス"
  | "端末購入プログラム"
  | "他社比較";

/** 公式情報の鮮度。needs_review は90日超または未照合で、提案前に要再確認。 */
export type FreshnessStatus = "verified" | "needs_review";

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
  /** 公式情報の鮮度。未指定は officialCheckedAt から判定（90日超で要確認）。 */
  freshnessStatus?: FreshnessStatus;
  /** キャンペーン（期間・条件付き施策）か。true は恒常制度と分けて扱う。 */
  isCampaign?: boolean;
  /** この商材で言ってはいけない断定・誤認表現（教育・コンプラ用）。 */
  prohibitedClaims?: string[];
  /** この商材を扱う際のコンプラ注意（本人入力・条件省略禁止など）。 */
  complianceNotes?: string[];
}

// ===== トークスクリプト =====
export interface TalkSection {
  heading: string;
  lines: string[];
  note?: string;
}

export interface TalkScript {
  id: string;
  title: string;
  category: string;
  productId?: string;
  target: string;
  difficulty: number; // 1..10
  timing: string;
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

/** 認定条件の「定義」。達成状態(done)は進捗から導出する（lib/progress.ts）。 */
export interface CertCondition {
  id: string;
  label: string;
}

// ===== SV ダッシュボード・認定 =====
export interface SvTrainee {
  id: string;
  display_name: string;
  store_name: string;
  team_name?: string;
  level: number; // 0..10（10=認定クローザー）
  /** モジュールキー -> スコア（各研修生の進捗）。 */
  progress: Record<string, number>;
  /** 認定済みのとき、承認日時と承認者（表示名）。 */
  certifiedAt?: string;
  certifiedBy?: string;
}

// ===== クイズ（理解度テスト） =====
export interface QuizQuestion {
  id: string;
  moduleId: string; // seed のモジュールキー（例 p1m1）
  prompt: string;
  choices: string[];
  /** 正解の選択肢インデックス。複数なら複数選択問題。 */
  correct: number[];
  explanation: string;
}

// ===== 管理：ユーザー =====
export interface ManagedUser {
  id: string;
  display_name: string;
  role: Role;
  store_name?: string;
  is_active: boolean;
}

// ===== お知らせ =====
export type AnnouncementSeverity = "info" | "caution";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  severity: AnnouncementSeverity;
  isActive: boolean;
  updatedAt: string; // YYYY-MM-DD
}

// ===== 変更履歴・監査（管理画面） =====
export interface ProductVersion {
  id: string;
  productId: string;
  version: number;
  before: Partial<Product>;
  after: Partial<Product>;
  changedBy: string; // display_name
  reason: string;
  createdAt: string; // YYYY-MM-DD HH:mm
}

export type AuditAction =
  | "product.update"
  | "announcement.create"
  | "announcement.update"
  | "announcement.delete"
  | "user.role"
  | "user.active"
  | "certification.approve";

export interface AuditEntry {
  id: string;
  actor: string; // display_name
  action: AuditAction;
  targetType: "product" | "announcement" | "user" | "certification";
  targetId: string;
  summary: string;
  createdAt: string; // YYYY-MM-DD HH:mm
}
