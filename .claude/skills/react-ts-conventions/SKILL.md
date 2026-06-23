---
name: react-ts-conventions
description: React/TypeScript の実装・レビュー時に使用。ディレクトリ構成、any禁止、状態管理、loading/empty/error/success、lucide線画、楽観的更新の規約を提供する。
---
# React / TypeScript Conventions

`CLAUDE.md` §2・§5 を正典に要約。既存コードの質感（`pages/`・`components/ui.tsx`）に合わせる。

## ディレクトリ構成
- `src/pages/` 画面 / `src/components/` 再利用UI（`ui.tsx` の Card/SectionTitle/ProgressBar/RankPill/TierBadge/ScoreChip を再利用）
- `src/lib/` 型・supabase・純粋ロジック / `src/context/` 横断状態 / `src/data/seed.ts` ローカル seed
- 新規の共有UIは `components/`、純粋ロジックは `lib/` に切り出す（テスト可能に）。

## 型安全
- **`any` 禁止**（やむを得ない場合は理由をコメント）。`npm run typecheck` 0 エラー必須。
- ドメイン型は `src/lib/types.ts` を単一の出所にする。`import type` を使う。
- 列挙はユニオン型（`Role`, `ProductCategory` 等）を踏襲。マジック文字列を散らさない。

## 状態管理
- ローカル状態は useState/useReducer。横断状態は Context（`AuthContext` パターン）。外部状態ライブラリを安易に足さない。
- バックエンド有無は `isBackendEnabled` で分岐し、デモモードを壊さない。

## 4状態を必ず実装
- loading（スケルトン）/ empty（次の行動）/ error（原因と直し方）/ success。データ取得は4分岐を意識。

## UI 規律
- lucide-react を線画 strokeWidth 1.75 で使用。色/余白/角丸/影はトークン由来（design-system スキル参照）。
- 副作用は useEffect に閉じ、依存配列を正確に。クリーンアップを忘れない。

## 楽観的更新
- 進捗・チェック等は即時反映 → 失敗時にロールバック＋明示エラー表示。
