import { requireClient as client } from "@/lib/supabase";
import type { ScoreMap } from "@/lib/progress";

/**
 * 学習進捗の永続化（module_progress 表）。
 * フロントの seed モジュールキー（例 p1m1）をそのまま module_key に保存する。
 * RLS により本人の行のみ読み書き可。backend モードでのみ呼ばれる。
 */

interface ProgressRow {
  module_key: string;
  score: number;
}

/** 本人の進捗をすべて取得し ScoreMap に変換する。 */
export async function fetchProgress(userId: string): Promise<ScoreMap> {
  const { data, error } = await client()
    .from("module_progress")
    .select("module_key, score")
    .eq("user_id", userId);
  if (error) throw error;
  const map: ScoreMap = {};
  for (const row of (data ?? []) as ProgressRow[]) {
    map[row.module_key] = row.score;
  }
  return map;
}

/** 1 モジュールのスコアを upsert（本人のみ・(user_id, module_key) で一意）。 */
export async function saveModuleScore(
  userId: string,
  moduleKey: string,
  score: number,
): Promise<void> {
  // updated_at は INSERT は default now()、UPDATE は trg_module_progress_updated が設定する。
  const { error } = await client()
    .from("module_progress")
    .upsert(
      { user_id: userId, module_key: moduleKey, score },
      { onConflict: "user_id,module_key" },
    );
  if (error) throw error;
}
