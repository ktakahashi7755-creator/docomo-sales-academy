import { PHASES } from "@/data/seed";
import { flattenModules } from "@/lib/progress";
import type { SvTrainee } from "@/lib/types";

/**
 * SV ダッシュボードのデモ用名簿。各研修生の進捗を持ち、認定条件を決定的に評価できるようにする。
 * これは「研修の進捗」のデモデータであり、料金・還元などの事実値ではない（捏造禁止の対象外）。
 * バックエンド接続時は profiles / progress / certifications を SV 権限（RLS）で読む。
 */

const MODULES = flattenModules(PHASES);

/** 全必須モジュールを合格点ちょうどで満たした進捗（c1=全必須合格・c3=コンプラ100 を満たす）。 */
function allRequiredPassed(): Record<string, number> {
  const m: Record<string, number> = {};
  for (const mod of MODULES) if (mod.required) m[mod.id] = mod.passing_score;
  return m;
}

/** 先頭から phaseNo までの必須モジュールのみ合格にした進捗（途中段階）。 */
function passedThroughPhase(phaseNo: number): Record<string, number> {
  const m: Record<string, number> = {};
  for (const mod of MODULES) {
    if (mod.required && mod.phase.no <= phaseNo) m[mod.id] = mod.passing_score;
  }
  return m;
}

export const SV_TRAINEES: SvTrainee[] = [
  {
    id: "t-1",
    display_name: "田中 太郎",
    store_name: "府中店",
    team_name: "Aチーム",
    level: 9,
    progress: allRequiredPassed(),
  },
  {
    id: "t-2",
    display_name: "鈴木 花子",
    store_name: "新宿店",
    team_name: "Aチーム",
    level: 6,
    progress: passedThroughPhase(6),
  },
  {
    id: "t-3",
    display_name: "佐藤 健",
    store_name: "渋谷店",
    team_name: "Bチーム",
    level: 2,
    progress: passedThroughPhase(2),
  },
  {
    id: "t-4",
    display_name: "山本 結衣",
    store_name: "府中店",
    team_name: "Bチーム",
    level: 10,
    progress: allRequiredPassed(),
    certifiedAt: "2026-06-20 10:30",
    certifiedBy: "SV デモ",
  },
];
