import { supabase } from "@/lib/supabase";
import type { Profile, Role } from "@/lib/types";

/**
 * Supabase 認証アダプタ。
 * - メール OTP（6桁コード）でのサインインに統一（本人がコードを入力＝コンプラ準拠）。
 * - これらは backend モード（env 設定済み）でのみ呼ばれる。client() は未設定なら投げる。
 * - 秘密はフロントに無い（anon キーのみ）。service_role/AIキーはサーバー側。
 */
function client() {
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
}

/** メールに 6 桁の OTP コードを送る（メール未登録なら自動作成）。 */
export async function sendOtp(email: string): Promise<void> {
  const { error } = await client().auth.signInWithOtp({ email });
  if (error) throw error;
}

/** OTP コードを検証してセッションを確立する。 */
export async function verifyOtp(email: string, token: string): Promise<void> {
  const { error } = await client().auth.verifyOtp({ email, token, type: "email" });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const { error } = await client().auth.signOut();
  if (error) throw error;
}

/** 現在のセッションのユーザーID（無ければ null）。 */
export async function getCurrentUserId(): Promise<string | null> {
  const { data } = await client().auth.getSession();
  return data.session?.user.id ?? null;
}

/** 認証状態の変化を購読し、解除関数を返す。 */
export function onAuthChange(cb: (userId: string | null) => void): () => void {
  const { data } = client().auth.onAuthStateChange((_event, session) => {
    cb(session?.user.id ?? null);
  });
  return () => data.subscription.unsubscribe();
}

interface ProfileRow {
  id: string;
  display_name: string;
  role: string;
  store_name: string | null;
  team_name: string | null;
  level: number;
  is_active: boolean;
}

/** profiles から本人のプロフィール（role/level 等）を取得。RLS で本人/権限者のみ可。 */
export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await client()
    .from("profiles")
    .select("id, display_name, role, store_name, team_name, level, is_active")
    .eq("id", userId)
    .single();
  if (error) throw error;
  if (!data) return null;
  const row = data as ProfileRow;
  return {
    id: row.id,
    display_name: row.display_name,
    role: row.role as Role,
    store_name: row.store_name ?? undefined,
    team_name: row.team_name ?? undefined,
    level: row.level,
    is_active: row.is_active,
  };
}
