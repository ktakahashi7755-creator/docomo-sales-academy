# ROADMAP — DOCOMO Sales Academy

> フェーズ計画と状態。各フェーズ完了時にここを更新し、ボードミーティング議事を残す。
> 詳細な受け入れ基準は `docs/CLAUDE_CODE_BRIEF.md` §6 を参照。

## 状態凡例

`✅ Done` / `🚧 In progress` / `⏳ Planned` / `🅿️ 承認待ち`

## フェーズ一覧

| Phase | 内容                                                            | 主担当            | 状態                    |
| ----- | --------------------------------------------------------------- | ----------------- | ----------------------- |
| 0     | ガバナンス整備（docs 4種・Lint/Prettier/Vitest/Playwright・CI） | qa+全レビュー     | ✅ Done（要承認）       |
| 1     | Supabase 接続と本認証（progress を DB 永続化）                  | supabase          | ✅ Done（実機検証待ち） |
| 2     | 管理画面 CRUD（product_versions 履歴・90日鮮度・audit_logs）    | frontend+supabase | ⏳ Planned              |
| 3     | クイズエンジン（採点純粋関数＋境界値テスト）                    | frontend+qa       | ⏳ Planned              |
| 4     | ロープレ会話＋AI評価（Edge Function・アダプタ）                 | ai-edge+frontend  | ⏳ Planned              |
| 5     | SV ダッシュボード・認定フロー                                   | supabase+frontend | ⏳ Planned              |
| 6     | 仕上げ（PWA・性能・E2E・Lighthouse 90+）                        | qa+全レビュー     | ⏳ Planned              |

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
- ✅ docs 4種（ROADMAP/AUDIT/DECISIONS/DATA_INTEGRITY）整備。
- ✅ 既存9画面の品質・デザイン磨き（design/code/security/data-integrity レビュー指摘を反映）。
- ✅ 純粋ロジック切り出し（`lib/progress.ts`）＋境界値 Vitest 37件。
- ✅ 検証ゲート緑（typecheck0 / lint0 / prettier / unit37 / build / preview 200・秘密なし）。
- ⚠️ Playwright E2E はコミット済みだが、本環境はブラウザDL不可のため CI 実行。

### Phase 0 — レビューゲート結果（2026-06-23）

- **design-reviewer:** 🔴ゼロ・マージ可（初回 R1–R5 / Y1–Y12 解消、再指摘も解消）。
- **code-reviewer:** 初回 🔴2件 → 解消（4状態配線・AUDIT D 記録）、境界テスト追加。
- **security-compliance-auditor:** 🔴ゼロ・マージ可（秘密露出なし・anon のみ・コンプラ逸脱なし）。
- **data-integrity-steward:** 🔴ゼロ・マージ可（正典値維持・未追跡は false で捏造なし）。残 🟡 A-D1/A-D2 は高橋確認。
- **結論:** 🔴ゼロ・DoD 充足。Phase 1 着手は高橋の承認待ち。

### Phase 0 — レトロ（2026-06-23 クローズ）

- **検証5周:** ①実装+ゲート緑 → ②4レビュー+修正 → ③確認レビュー+配信/秘密チェック → ④微修正+バンドル予算 → ⑤最終ゲート。各周で `typecheck0 / lint0 / prettier / unit / build` を実通過。
- **得た判断:** ADR-0005（状態色 deep 拡張＝A11y駆動）／ADR-0006（未追跡＝未達で捏造しない）。
- **残課題（次フェーズ持ち越し）:** A-D1/A-D2（事実値・c2 導出は高橋確認）、D-N02（isStaleのTZ）、D-N14（評価閾値の単一正典化）、Playwright をブラウザのある環境/CIで実走。
- **メトリクス:** JS 約71KB gzip（予算180KB内）、unit 37件、9画面 PageTitle 統一・4状態配線・タップ44px床。

### Phase 1 — キックオフ／クローズ（2026-06-23）

- **目的:** Supabase 本認証（メール OTP）と進捗の DB 永続化。デモモードは維持。
- **実装:** `lib/auth.ts`（OTP/セッション/profile）・`lib/progressStore.ts`・`AuthContext` デュアルモード・`Login` OTP フロー・migration `0003_module_progress`（RLS）・RLS テスト。
- **判断:** ADR-0007（メール OTP）／ADR-0008（追加テーブル module_progress・テキストキー）。
- **レビューゲート:** security 🔴0・design 🔴0・code 初回🔴1（楽観更新レース）→ 解消、確認レビューで🔴0。
- **DoD:** typecheck0 / lint0 / **unit 49件** / build / demo 200・秘密なし。
- **⚠️ 実機検証待ち（高橋）:** Supabase に migrations 0001→0003 適用、OTP メールテンプレート設定、実ログイン→進捗表示、`rls_module_progress.sql` 実行（AUDIT F-3/F-5）。
- **残課題:** `module_progress`↔`progress`(uuid) 整合は Phase 2、F-R8（応答バリデーション）等。
