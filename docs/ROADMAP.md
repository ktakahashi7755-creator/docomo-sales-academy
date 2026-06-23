# ROADMAP — DOCOMO Sales Academy

> フェーズ計画と状態。各フェーズ完了時にここを更新し、ボードミーティング議事を残す。
> 詳細な受け入れ基準は `docs/CLAUDE_CODE_BRIEF.md` §6 を参照。

## 状態凡例

`✅ Done` / `🚧 In progress` / `⏳ Planned` / `🅿️ 承認待ち`

## フェーズ一覧

| Phase | 内容                                                            | 主担当            | 状態           |
| ----- | --------------------------------------------------------------- | ----------------- | -------------- |
| 0     | ガバナンス整備（docs 4種・Lint/Prettier/Vitest/Playwright・CI） | qa+全レビュー     | 🚧 In progress |
| 1     | Supabase 接続と本認証（progress を DB 永続化）                  | supabase          | ⏳ Planned     |
| 2     | 管理画面 CRUD（product_versions 履歴・90日鮮度・audit_logs）    | frontend+supabase | ⏳ Planned     |
| 3     | クイズエンジン（採点純粋関数＋境界値テスト）                    | frontend+qa       | ⏳ Planned     |
| 4     | ロープレ会話＋AI評価（Edge Function・アダプタ）                 | ai-edge+frontend  | ⏳ Planned     |
| 5     | SV ダッシュボード・認定フロー                                   | supabase+frontend | ⏳ Planned     |
| 6     | 仕上げ（PWA・性能・E2E・Lighthouse 90+）                        | qa+全レビュー     | ⏳ Planned     |

---

## ボードミーティング議事

### Phase 0 — キックオフ（2026-06-23）

- **目的:** チーム編成（スキル/サブエージェント）を確立し、品質ゲートを enforce 可能にする。既存9画面の素地を「世界最高峰」基準まで磨く準備を整える。
- **対象:** リポジトリ全体の足場（ESLint/Prettier/Vitest/Playwright/CI）、docs 4種、デザイン/コード品質の初期レビュー。
- **DoD:** CI が緑（typecheck+lint+format+unit+build、E2E）。docs 4種が存在し本ブリーフと整合。
- **リスク:** 事実値（GOLD=18,600 等）の取り違え／秘密情報のフロント露出／既存デモモードの破壊。
- **必要な職能:** qa-test-engineer（足場）、frontend-engineer（UI磨き）、design-reviewer / code-reviewer（ゲート）。

### Phase 0 — 進捗メモ

- ✅ スキル群 `.claude/skills/`（8）・サブエージェント `.claude/agents/`（8）作成。
- ✅ プロジェクトを zip から展開しリポジトリ直下へ。
- ✅ ESLint(flat)/Prettier/Vitest/Playwright 導入、`lint`/`format`/`test`/`e2e` script 追加。
- ✅ GitHub Actions CI（typecheck+lint+format+unit+build / e2e）追加。
- 🚧 docs 4種（ROADMAP/AUDIT/DECISIONS/DATA_INTEGRITY）整備中。
- 🚧 既存画面の品質・デザイン磨き（design/code レビュー指摘の反映）。
- 🚧 検証5周（typecheck/lint/unit/build + Playwright ビジュアル）。
