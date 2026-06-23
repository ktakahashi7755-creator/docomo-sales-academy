import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * 環境変数が未設定の場合は null を返す。
 * MVP（AI/バックエンド未接続）ではローカルseedで動作させ、
 * Supabase設定後に自由会話ロープレや進捗永続化を有効化する。
 */
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;

export const isBackendEnabled = Boolean(supabase);

/** backend モードで Supabase クライアントを必須として取得（未設定なら投げる）。 */
export function requireClient(): SupabaseClient {
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
}
