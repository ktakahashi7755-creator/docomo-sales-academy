import { isBackendEnabled } from "@/lib/supabase";
import { createMockProvider } from "@/lib/ai/mockProvider";
import { createEdgeProvider } from "@/lib/ai/edgeProvider";
import type { RoleplayProvider } from "@/lib/ai/types";

export type { RoleplayProvider } from "@/lib/ai/types";
export type {
  ChatMessage,
  Evaluation,
  EvalItemScore,
  ReplyInput,
  SessionInput,
} from "@/lib/ai/types";

let cached: RoleplayProvider | null = null;

/**
 * ロープレプロバイダの唯一の切替点。
 * バックエンド未設定（デモ）ではモック、設定済みなら Edge Function 経由。
 * AI キーはサーバー側にのみ存在し、ここでもフロントには出さない。
 */
export function getRoleplayProvider(): RoleplayProvider {
  if (cached) return cached;
  cached = isBackendEnabled ? createEdgeProvider() : createMockProvider();
  return cached;
}

/** テスト専用：プロバイダのキャッシュを破棄する（env 切替を反映させたい場合に使う）。 */
export function resetRoleplayProvider(): void {
  cached = null;
}
