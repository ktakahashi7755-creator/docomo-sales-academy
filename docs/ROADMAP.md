# ROADMAP — DOCOMO Sales Academy

> フェーズ計画と状態。各フェーズ完了時にここを更新し、ボードミーティング議事を残す。
> 詳細な受け入れ基準は `docs/CLAUDE_CODE_BRIEF.md` §6 を参照。

## 状態凡例

`✅ Done` / `🚧 In progress` / `⏳ Planned` / `🅿️ 承認待ち`

## フェーズ一覧

| Phase | 内容                                                            | 主担当            | 状態                                  |
| ----- | --------------------------------------------------------------- | ----------------- | ------------------------------------- |
| 0     | ガバナンス整備（docs 4種・Lint/Prettier/Vitest/Playwright・CI） | qa+全レビュー     | ✅ Done（要承認）                     |
| 1     | Supabase 接続と本認証（progress を DB 永続化）                  | supabase          | ✅ Done（実機検証待ち）               |
| 2     | 管理画面 CRUD（product_versions 履歴・90日鮮度・audit_logs）    | frontend+supabase | ✅ Done（demo完結 / backend統合待ち） |
| 3     | クイズエンジン（採点純粋関数＋境界値テスト）                    | frontend+qa       | ✅ Done（demo完結 / backend統合待ち） |
| 4     | ロープレ会話＋AI評価（Edge Function・アダプタ）                 | ai-edge+frontend  | ✅ Done（demo完結 / backend統合待ち） |
| 5     | SV ダッシュボード・認定フロー                                   | supabase+frontend | ✅ Done（demo完結 / backend統合待ち） |
| 6     | 仕上げ（PWA・性能・E2E・配信）                                  | qa+全レビュー     | 🚧 In progress（実機リンク開通）      |

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

### Phase 2 — キックオフ／クローズ（2026-06-23）

- **目的:** 管理画面 CRUD（商材・お知らせ・ユーザー）、版履歴、90日鮮度連動、監査、UI＋RLS 二重防御。
- **実装:** `ContentContext`（学習側が編集を即時反映）・`/admin` シェル＋5画面・`lib/content.ts` 純粋ロジック・migration 0004（監査 RPC）・RLS/RPC テスト・画面横断 smoke テスト。
- **判断:** ADR-0009（ContentContext）／ADR-0010（UI＋RLS 二重防御・監査サーバー側）／ADR-0011（人手感・明るさ・絵文字不使用）。
- **DoD:** 管理者が商材編集→版履歴＋確認日更新＋監査、学習側に反映（smoke で検証）。非管理者は `/admin` 不可（UI＋RLS）。typecheck0/lint0/**unit 64件**/build。
- **⚠️ backend 統合待ち:** `ContentContext` を Supabase（products/product_versions/announcements/log_audit）へ接続。DB 列とフロント `Product` 型の写像が必要（AUDIT G-6）。

### Phase 3 — キックオフ／クローズ（2026-06-23）

- **目的:** 理解度テスト（受験UI→採点→進捗反映→合格判定）、合格点ロジック（通常80/重要90/コンプラ100）、再受験、純粋関数＋境界値テスト。
- **実装:** `lib/quiz.ts`（純粋採点）＋ `lib/quiz.test.ts`（境界値 79/80/89/90/99/100）・`data/quiz.ts`（6モジュール30問・正典準拠）・`pages/Quiz.tsx`（4状態・複数選択・解説）・`/quiz/:moduleId`・Roadmap/Dashboard から導線・smoke で受験→合格→反映。
- **判断:** ADR-0012（純粋採点＋進捗反映、バッジは進捗導出、quiz_attempts は backend）。
- **DoD:** 受験→採点→ロードマップ/ダッシュボード反映が一気通貫。境界値 unit 緑。typecheck0/lint0/**unit 79件**/build/smoke 緑。
- **残課題:** `quiz_attempts` 永続化と全モジュールへの設問拡充は backend 統合・コンテンツ追補で対応。

### Phase 4 — キックオフ／クローズ（2026-06-23）

- **目的:** テキストロープレ会話＋AI評価を、プロバイダ差し替え可能なアダプタで構築。デモはローカルのモック（APIキー不要）で完結、本番は Supabase Edge Function 経由（キーはサーバー側）。
- **実装:** `lib/ai/`（`types.ts` の `RoleplayProvider` インターフェース・`mockProvider`・`edgeProvider`・`index.ts` の唯一の切替点 `getRoleplayProvider`）・`lib/roleplay.ts`（純粋：モック顧客 `customerOpening`/`customerReply`＋ヒューリスティック評価 `evaluateRoleplay`）＋ `lib/roleplay.test.ts`（15件）・`pages/Roleplay.tsx`（setup/chat/result の3フェーズ・4状態・A11y）・`supabase/functions/roleplay/index.ts`（Deno Edge Function テンプレート・未デプロイ）・smoke にロープレ一巡を追加。
- **判断:** ADR-0013（アダプタ＋モック／Edge・キーはサーバー側・評価は振る舞いのみ採点で事実を捏造しない・ランク閾値は GRADE_THRESHOLDS に単一化＝D-N14 解消）。
- **レビューゲート:** security 🔴0（キーのフロント露出なし・anon invoke のみ・コンプラ文言維持・事実非捏造）／design 🔴2→解消（D ランク chip の deep 化で AA・結果遷移のフォーカス告知）＋🟡（評価中の入力ロック・凡例の単一正典化・ラベル不透明度）対応／code-reviewer 実行。
- **DoD:** テキストロープレ開始→送信→評価まで一気通貫（smoke 緑）。typecheck0/lint0/prettier/**unit 98件**/build。音声は backend+AI 接続後に有効化（UI は disabled で明示）。
- **⚠️ backend 有効化前の必須対応（AUDIT 追跡）:** Edge Function の CORS 限定・入力バリデーション/レート制御・JWT 必須のデプロイ担保・評価結果の `roleplay_sessions` 永続化はサーバー/RLS 準拠で実装。

### Phase 5 — キックオフ／クローズ（2026-06-23）

- **目的:** SV ダッシュボードで担当メンバーの進捗・認定状況を確認し、`CERT_CONDITIONS` の自動判定を材料に SV 承認で Lv.10 認定を確定する。
- **実装:** `lib/certification.ts`（純粋：`certificationReadiness`/`canApprove`/`isAutoTracked`/`isPendingEvaluation`、必須=c1/c3）＋テスト8件・`data/sv.ts`（名簿デモ）・`context/CertificationContext.tsx`（承認＝Lv.10化）・`pages/sv/SvDashboard.tsx`＋`SvTraineeDetail.tsx`（承認は確認ステップ＋告知、`LevelLadder` を主役に、4状態）・`router.tsx` `RequireSv`・`Layout` 導線・`Certification` に「SV承認待ち」表示・migration `0005_certifications`（承認 RPC＋一意制約）・RLS テスト・smoke（承認一巡／二重承認防止／非SVブロック）。
- **判断:** ADR-0014（自動判定は意思決定の材料・最終ゲートは SV承認、承認はサーバー側 RPC で profiles.level=10＋認定記録＋監査を冪等に、二層防御）。
- **レビューゲート:** security 初回🔴1（RPC 非冪等／user一意欠如）→ 解消（`on conflict` upsert＋`(user_id,certification_type)` UNIQUE＋`pg_temp`、異常系テスト追加）／design 初回🔴2（和文への `font-num`／行リンク aria）→ 解消＋🟡（承認可能の色を caution・loading・確認フォーカス/告知）対応／code 初回🔴2（4状態 loading 欠落／`AuditAction` 型未追加）→ 解消＋🟡（境界テスト・level整合・二重承認 smoke・aria）対応。
- **DoD:** SV が承認可能な研修生をクローザー認定→状態反映、認定済みは承認不可、非SVは `/sv` 不可（UI＋RLS）。typecheck0/lint0/prettier/**unit 110件**/build（gzip ~101KB）。
- **⚠️ backend 統合待ち:** `CertificationContext` を profiles/progress/certifications（SV用 RLS）に接続し、承認を RPC `approve_certification` に置換（AUDIT J 追跡）。

### Phase 6 — キックオフ（2026-06-23 / 進行中）

- **目的:** 仕上げ。実機確認できる公開デモ配信・PWA（インストール可/基本オフライン）・初期バンドルの軽量化・E2E の追従。
- **実装:** GitHub Pages デプロイ（`.github/workflows/pages.yml`、デモモードで配信・SPA フォールバック）＋ サブパス対応（`vite.config` base / `App` basename）・PWA（`public/sw.js` の network-first ナビ＋stale-while-revalidate 資産、`lib/pwa.ts` は本番のみ登録）・役割限定の SV/管理画面を `React.lazy` で分割（初期 JS を ~101KB→~95.7KB gzip）・E2E を Phase 4/5 に追従（テキストロープレ一巡・SV承認を追加、旧「ロープレ無効」アサーションを是正）。
- **実機リンク（デモ）:** `https://<owner>.github.io/docomo-sales-academy/`（Pages を「GitHub Actions」ソースで有効化後）。
- **判断:** ADR-0015（PWA は依存追加なしの手書き SW・同一オリジン資産は SWR・キーを焼かないデモ配信・役割限定ツリーのみ遅延読込）。
- **残（Phase 6 継続）:** Lighthouse 90+ の実測（CI/実機）、必要なら学習者主要ページの追加分割・画像最適化。backend 接続後に実データ E2E。
- **検証:** typecheck0/lint0/prettier(format:check)/**unit 110件**/build。E2E はブラウザ取得不可の本環境では未実行（CI 実行前提）。
