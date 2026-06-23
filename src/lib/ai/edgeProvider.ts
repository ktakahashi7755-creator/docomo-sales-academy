import { requireClient } from "@/lib/supabase";
import type { Evaluation, ReplyInput, RoleplayProvider, SessionInput } from "@/lib/ai/types";
import type { Scenario } from "@/lib/types";

/**
 * 本番プロバイダ。AI プロバイダの API キーは絶対にフロントに置かず、
 * Supabase Edge Function（supabase/functions/roleplay）側のサーバー環境変数で扱う。
 * フロントは anon キーで関数を呼ぶだけ。差し替えはこのアダプタ1箇所で完結する。
 */

type Action = "opening" | "reply" | "evaluate";

async function invoke<T>(action: Action, payload: unknown): Promise<T> {
  const client = requireClient();
  const { data, error } = await client.functions.invoke<T>("roleplay", {
    body: { action, payload },
  });
  if (error) throw error;
  if (data == null) throw new Error("roleplay function returned no data");
  return data;
}

export function createEdgeProvider(): RoleplayProvider {
  return {
    async opening(input: { scenario: Scenario; difficulty: number }): Promise<string> {
      const { text } = await invoke<{ text: string }>("opening", input);
      return text;
    },
    async reply(input: ReplyInput): Promise<string> {
      const { text } = await invoke<{ text: string }>("reply", input);
      return text;
    },
    async evaluate(input: SessionInput): Promise<Evaluation> {
      return invoke<Evaluation>("evaluate", input);
    },
  };
}
