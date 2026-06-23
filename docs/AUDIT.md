# AUDIT — 要確認事項・技術的負債・TODO

> 推測で埋めない事実値、レビュー指摘、負債をここに集約。解消したらチェックして日付を残す。
> 重大度: 🔴 必須 / 🟡 要修正 / 🟢 提案。

## A. データ整合（data-integrity）

- [ ] **A-D1 🟡** seed の各商材 `official_url` / `official_checked_at` が実在URL・実確認日かを精査。デモ用の仮値が混じる可能性。実値確定まで「要確認」運用。（→ 高橋確認）
- [ ] **A-D2 🟡** Certification の c2「商材テスト90点以上」は導出可能な seed モジュール（`p10m1` / passing_score:90）が存在するが、`isCertConditionDone` は default で false 固定。捏造ではなく安全側の過少報告だが、合格済でも未達表示になる。c2 を導出対象に含めるか Phase 3/4 まで保留かを判断要。（→ 高橋確認）
- [x] **A-D3 🟢** `docs/DATA_INTEGRITY.md` の根拠行番号が seed.ts とズレていた → 行番号依存をやめ、定数名（`PRODUCTS`/トーク）参照に変更。（2026-06-23 解消）

## B. セキュリティ／コンプライアンス（後続フェーズで実装）

- [ ] **B-S1** Phase 1: Supabase 本認証移行時、anon キーのみフロント、`service_role`/AIキーはサーバー側に限定。
- [ ] **B-S2** Phase 2: `audit_logs` の書込はサーバー側関数/Edge Function 経由（フロント直 insert 禁止）。
- [ ] **B-S3** Phase 4: AI/STT/TTS キーはクライアントバンドルに含めない（dist で検証）。
- [ ] **B-S4** パスワード・認証コードは「お客様自身が入力」のフロー/文言を維持。

## C. デザイン／UX レビュー指摘（design-reviewer 2026-06-23 / 再レビュー同日）

すべて解消（コミット f0b1d99 + 96453d5 系で対応・再レビューで確認）。

- [x] **C-R1 🔴** ボトムナビ 44px → `min-h-[56px]`。
- [x] **C-R2 🔴** ラベル `text-[11px]`＋`text-ink-soft`／active `text-accent`（短ラベル化で〜360px も崩れず）。
- [x] **C-R3 🔴** 4状態 receiver：`ui.tsx` に Skeleton/SkeletonCard/PageLoading/EmptyState/ErrorState。loading=`PageLoading`（Dashboard/Certification の認証前）、empty=一覧/苦手、error=詳細 not-found に配線。
- [x] **C-R4 🔴** Roleplay の両開始ボタンを AI 未設定時 `disabled`＋理由表示。
- [x] **C-R5 🔴** Login に pending/error(`role="alert"`)/二重遷移ガード。
- [x] **C-Y1〜Y3 🟡** LevelLadder：次の一段強調・コネクタ進捗・`ol/li`＋`aria-current`。
- [x] **C-Y4 🟡** 難易度 range：`aria-valuetext`・目盛り・フォーカス可視＋`h-11` でタップ44px。
- [x] **C-Y5 🟡** シナリオ選択に `aria-pressed`。
- [x] **C-Y6 🟡** カードリンクの角丸フォーカス／`hover:shadow-lift` を Link 側に。
- [x] **C-Y7 🟡** 全9画面 `PageTitle` 統一（Dashboard 含む）。
- [x] **C-Y8/Y9 🟡** Certification：獲得/未獲得バッジ・未達条件の導線。
- [x] **C-Y10 🟡** Roleplay 既定シナリオを意味ベース（`RECOMMENDED_SCENARIO`）へ。
- [x] **C-Y11 🟡** 詳細画面の戻りリンク `min-h-[44px]`。
- [x] **C-Y12 🟡** 状態色に `deep` 追加（gold/platinum と同規約）で soft 背景テキストの AA を確保。
- [x] **C-G1 🟢** Dashboard おすすめロープレをデータ駆動（`RECOMMENDED_SCENARIO`）。
- [x] **C-G3 🟢** `ProgressBar` を `duration-200`（150–250ms 準拠）。

## D. コード品質（code-reviewer 2026-06-23 / 再レビュー同日）

- [x] **D-N10 🔴** 4状態 primitive が未配線 → `PageLoading`（Dashboard/Certification）・`ErrorState`（詳細 not-found）・`EmptyState`（一覧/苦手）に配線。
- [x] **D-N17 🔴** AUDIT D 欄が空 → 本節に記録（DoD 充足）。
- [x] **D-N03/N04 🟡** `c1` 空必須・`c3` 空コンプラの境界テスト追加。
- [x] **D-N05 🟡** `weakModules(limit=0)` 境界テスト追加。
- [x] **D-N01 🟡** 負数スコアの異常系テスト追加。
- [x] **D-N06 🟢** `phaseProgress(total=0)` 境界テスト追加。
- [x] **D-N07 🟡** `React.ReactNode` 暗黙参照を `import type { ReactNode }` に統一（router/ProductDetail）。
- [x] **D-N11/N12 🟡** `Certification`/`Dashboard` の `return null` を `PageLoading` に。
- [x] **D-N15 🟡** Dashboard おすすめロープレのハードコード二重管理を解消（C-G1 と同件）。
- [x] **D-N16 🟢** `flattenModules(PHASES)` をモジュールスコープ定数に（再計算回避）。
- [x] **D-N18 🟡** `ScoreChip` の合否判定を `isPassed` に委譲（重複解消）。
- [x] **D-N19 🟡** `Products` の `isStale` 二重呼び出しを1回に。
- [ ] **D-N02 🟢** `isStale` の「90日ちょうど」判定が DST/タイムゾーンでズレうる。Phase 3 で日本時間基準にする際に再確認。
- [ ] **D-N14 🟢** Roleplay の評価ランク閾値（S/A/B/C/D）が表示文字列にハードコード。Phase 4 で `gradeOf` から導出して単一正典化。

## F. Phase 1（Supabase 接続・本認証）

- [x] **F-1** メール OTP 認証（`lib/auth.ts`）＋ progress 永続化（`module_progress` / migration 0003）＋ デュアルモード（demo/backend）実装。
- [x] **F-2** RLS テスト `supabase/tests/rls_module_progress.sql`（本人のみ・越権不可）。
- [ ] **F-3 ⚠️** 本環境に Supabase プロジェクト（env）が無いため、**実ログイン→進捗表示／RLS の実通過は未検証**。Supabase 設定済み環境（高橋）または CI のテストDBで `migrations 0001→0003` 適用後、実ログインと `rls_module_progress.sql` を実行して確認すること。
- [ ] **F-4 🟡** `module_progress`(text key) と既存 `progress`(uuid) の整合は Phase 2（コンテンツ DB 駆動化）で実施。
- [ ] **F-5** Supabase Auth の OTP メールテンプレート設定（6桁コードが届くよう Email テンプレートを確認）。

### Phase 1 レビューゲート（2026-06-23）— security / code / design

- [x] **F-R🔴** code: `setModuleScore` の `prevScore` が古い progress を参照（連続更新でロールバック誤動作）→ `progressRef` で同期追跡＋純粋ヘルパー（`nextScore/withScore/rolledBack`）に分離しテスト（unit 49件）。
- [x] **F-R1 🟡** `client()` 重複 → `supabase.requireClient()` に集約。
- [x] **F-R2 🟡** Login：検証エラー時に info(成功色) を消す／コード入力 autoFocus／再送（30秒クールダウン）／`role="status"`／枠線を可視化（`border-*/30`）／エラー時にコード欄へ再フォーカス。
- [x] **F-R3 🟡** RLS テスト：例外を `check_violation` に限定＋SV 閲覧可・書込不可ケース追加。
- [x] **F-R4 🟡** `progressStore` の `updated_at` をペイロードから除去（trigger/default に委譲）＋ fetch/save の単体テスト（モック）追加。
- [ ] **F-R5 🟡** supabase-js のレスポンス型を `as ProfileRow/ProgressRow` でキャスト中。将来 `createClient<Database>` の生成型導入で解消（Phase 2 で DB 型を生成時）。
- [ ] **F-R6 🟢** StrictMode の dev 二重購読（`active` フラグで実害なし）。`score=0` と未受講の区別は Phase 3 採点実装で確定。
- [x] **F-R7 🟡** `sendOtp`/`verifyOtp` の inline ラッパを `auth.sendOtp`/`auth.verifyOtp` 直接参照に（明示性）。
- [ ] **F-R8 🟡** Supabase 応答の `as` キャスト（`fetchProfile`/`fetchProgress`）に typeof/Zod の実行時バリデーションが無い。Phase 2 で DB 生成型＋軽量バリデーションを導入して堅牢化。
- [ ] **F-R9 🟢** `progressStore.test.ts` のチェーンモックは `select`/`eq`・テーブル名を個別キャプチャするとより堅牢（実装変更の検出力向上）。
- [ ] **F-R10 🟢** `signOut` の失敗（ネットワーク断等）が UI に伝わらない（`void`）。将来トースト等で通知。

## E. 性能・PWA（Phase 6）

- [ ] **E-P1** 初回 JS 予算 ~180KB gzip 目標、Lighthouse 90+ を計測し記録。現状ベースライン: JS 約220KB / gzip 約73KB（2026-06-23 build）。
