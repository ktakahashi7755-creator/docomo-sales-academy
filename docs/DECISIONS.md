# DECISIONS — 設計判断ログ（ADR 形式）

> 設計判断を時系列で記録。各エントリは Context / Decision / Consequences。
> 「なぜそうしたか」を将来の自分とチームに残す。

---

## ADR-0001: プロジェクトを zip 展開しリポジトリ直下に配置

- **日付:** 2026-06-23
- **Context:** リポジトリは `docomo-sales-academy.zip` のみで seed されており、スキル/エージェント/CI が参照する実ファイルが存在しなかった。
- **Decision:** zip を展開してソース・設定・supabase・public を直下に配置。ブレース展開で生じた壊れフォルダと zip 本体は除去。
- **Consequences:** 以降のツール・レビュー・ビルドが実体に対して動作可能に。履歴は「展開」と「正典/チーム整備」を別コミットに分離。

## ADR-0002: チーム3層構成（スキル＝能力 / サブエージェント＝人材 / メイン＝デリバリーリード）

- **日付:** 2026-06-23
- **Context:** 品質のブレを消し、レビューゲートを規律化する必要。
- **Decision:** `.claude/skills/`（8）に基準を集約し、`.claude/agents/`（8）が `skills:` で明示プリロード（継承されないため）。レビュー/監査系は read-only（Read/Glob/Grep[+WebSearch/WebFetch]）。
- **Consequences:** 実装→レビュー→監査のゲートを通すまでマージしない運用を確立。🔴ゼロが必須。

## ADR-0003: ツールチェーン選定（ESLint flat / Prettier / Vitest / Playwright）

- **日付:** 2026-06-23
- **Context:** Phase 0 で品質を機械的に enforce する必要。ESLint 9 系が flat config 標準。
- **Decision:** ESLint 9 flat config（typescript-eslint + react-hooks + react-refresh、`no-explicit-any: error`、`consistent-type-imports`）。Prettier は eslint-config-prettier で競合無効化。単体は Vitest(jsdom)、E2E/ビジュアルは Playwright（mobile=Pixel7 / desktop=Chrome、preview ビルドに対して実行）。
- **Consequences:** `npm run lint/format:check/test/e2e` で再現可能。CI が typecheck+lint+format+unit+build と e2e を緑にしてマージ条件化。

## ADR-0005: 状態色に deep 変種を追加（アクセシビリティ駆動のトークン拡張）

- **日付:** 2026-06-23
- **Context:** `pass`/`caution`/`fail` の DEFAULT 色を soft 背景上の小さめテキストに使うと WCAG AA（4.5:1）を満たさない（caution は約2.6:1）。アクセシビリティは Non-Negotiable の床。
- **Decision:** `gold`/`platinum` が既に持つ `deep` 規約に揃え、`pass.deep #14633B` / `caution.deep #8A5E00` / `fail.deep #8E2A1F` を追加。**色相は変えず輝度のみ深める**（新色相の持ち込みではない）。ScoreChip・鮮度警告・デモバナー等の soft 背景テキストに適用。
- **Consequences:** AA を満たしつつトークン規律内に収まる。design-reviewer も「一貫拡張として許容」と確認。新トークンは `tailwind.config.js` に集約。

## ADR-0006: 認定条件・バッジは「未追跡＝未達」で導出（捏造しない）

- **日付:** 2026-06-23
- **Context:** 認定条件 `CertCondition` が seed に `done` をハードコードしており、定義と状態が混在。ロープレ評価系の条件はデモ段階で追跡データが無い。
- **Decision:** 型から `done` を除去し、`lib/progress.ts` の純粋関数で進捗から導出。確実に導出できる条件（必須モジュール全合格 c1 / コンプラ100 c3 / Lv.10 c10、バッジ b-first）のみ判定し、追跡できない条件は **false（未達）** とする。推測で達成にしない（data-integrity 準拠）。
- **Consequences:** 表示が事実に一致。Phase 4/5 で評価が蓄積されたら導出条件を拡張。境界値は Vitest で固定。`CERT_CONDITIONS` は `readonly` 化。

## ADR-0007: 本認証はメール OTP（6桁コード）

- **日付:** 2026-06-23（Phase 1）
- **Context:** ブリーフは「メール+OTP もしくはマジックリンク」を許容。モバイルファースト。
- **Decision:** Supabase `signInWithOtp` ＋ `verifyOtp(type:"email")` の **OTP コード方式**。メールクライアントへ離脱せず在アプリで完結し、モバイル UX が良い。トレーニーが**自分の**メール/コードを入力するためコンプラ原則（本人入力）と矛盾しない（顧客のパスワード代理入力とは無関係）。
- **Consequences:** `lib/auth.ts` に集約。env 設定時のみ有効、未設定はデモモード継続。マジックリンクが必要なら同アダプタで切替可能。

## ADR-0008: 進捗は追加テーブル module_progress（テキストキー）に永続化

- **日付:** 2026-06-23（Phase 1）
- **Context:** 既存 `progress` 表は `module_id uuid`（modules FK＝DB駆動コンテンツ用、Phase 2）。一方フロントのコンテンツは `src/data/seed.ts` のテキストキー（例 `p1m1`）で、両者は未整合。
- **Decision:** 既存 `progress` を変更せず、`module_progress(user_id, module_key text, score)` を**追加**（migration 0003）。RLS は本人読み書き＋SV/admin 閲覧。フロントの ScoreMap をそのまま保存。
- **Consequences:** Phase 1 で進捗永続化が成立。Phase 2 でコンテンツを DB 駆動化する際に `progress`(uuid) と整合・移行する（AUDIT に記録）。RLS は `supabase/tests/rls_module_progress.sql` で検証（サービスロール実行）。

## ADR-0004: 検証は「実機ビルド＋ビジュアル」で担保

- **日付:** 2026-06-23
- **Context:** 「実機確認できる成果物」が要件。口頭の「動くはず」を排する。
- **Decision:** Playwright で production preview を起動し、9画面を mobile/desktop でスクリーンショット取得。`dist/` を実行可能成果物とする。検証は typecheck/lint/unit/build を1周として複数周回す。
- **Consequences:** 退行を視覚・機械の両面で検出。成果物はビルド＋スクショ＋（任意で）デプロイ。
