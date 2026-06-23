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

## ADR-0004: 検証は「実機ビルド＋ビジュアル」で担保

- **日付:** 2026-06-23
- **Context:** 「実機確認できる成果物」が要件。口頭の「動くはず」を排する。
- **Decision:** Playwright で production preview を起動し、9画面を mobile/desktop でスクリーンショット取得。`dist/` を実行可能成果物とする。検証は typecheck/lint/unit/build を1周として複数周回す。
- **Consequences:** 退行を視覚・機械の両面で検出。成果物はビルド＋スクショ＋（任意で）デプロイ。
