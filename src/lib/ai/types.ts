import type { Scenario } from "@/lib/types";
import type { Grade } from "@/lib/progress";

/** ロープレ会話の1発話。customer=顧客AI / helper=研修生。 */
export interface ChatMessage {
  role: "customer" | "helper";
  content: string;
}

/** AI評価：EVAL_ITEMS の12項目を各100点満点で採点し、総合点とランクを出す。 */
export interface EvalItemScore {
  key: string;
  label: string;
  score: number; // 0–100
}

export interface Evaluation {
  items: EvalItemScore[];
  score: number; // 0–100（12項目の平均）
  rank: Grade; // S/A/B/C/D
  feedback: string[]; // 改善の要点（低得点項目から）
}

export interface ReplyInput {
  scenario: Scenario;
  difficulty: number; // 1–10
  history: ChatMessage[];
  message: string;
}

export interface SessionInput {
  scenario: Scenario;
  difficulty: number;
  transcript: ChatMessage[];
}

/**
 * ロープレのプロバイダ。デモはローカルのモック、本番は Edge Function 経由（キーはサーバー側）。
 * 実装は lib/ai/index.ts の getRoleplayProvider() の1箇所で切り替える。
 */
export interface RoleplayProvider {
  /** 会話の最初の顧客発話。 */
  opening(input: { scenario: Scenario; difficulty: number }): Promise<string>;
  /** 研修生の発話に対する顧客の返答。 */
  reply(input: ReplyInput): Promise<string>;
  /** 会話全体を評価する。 */
  evaluate(input: SessionInput): Promise<Evaluation>;
}
