# AUDIT — 要確認事項・技術的負債・TODO

> 推測で埋めない事実値、レビュー指摘、負債をここに集約。解消したらチェックして日付を残す。
> 重大度: 🔴 必須 / 🟡 要修正 / 🟢 提案。

## A. データ整合（data-integrity）

- [ ] **A-D1 🟡** seed の各商材 `official_url` / `official_checked_at` が実在URL・実確認日かを精査。デモ用の仮値が混じる可能性。実値確定まで「要確認」運用。（→ 高橋確認）
- [ ] **A-D2 🟡** Certification の c2「商材テスト90点以上」は導出可能な seed モジュール（`p10m1` / passing_score:90）が存在するが、`isCertConditionDone` は default で false 固定。捏造ではなく安全側の過少報告だが、合格済でも未達表示になる。c2 を導出対象に含めるか Phase 3/4 まで保留かを判断要。（→ 高橋確認）
- [x] **A-D3 🟢** `docs/DATA_INTEGRITY.md` の根拠行番号が seed.ts とズレていた → 行番号依存をやめ、定数名（`PRODUCTS`/トーク）参照に変更。（2026-06-23 解消）
- [ ] **A-D4 🟡** 高橋提供の新プラン値（ポイ活MAX 実質2,948円／mini 880円／光10ギガ500円・工事無料／home5G 本体実質無料）を seed・トークに反映し `official_checked_at=2026-06-23`・公式URL を登録。ドコモ公式は自動取得 403 で**ライブ照合未実施**。顧客提示前に公式ページで再確認（条件・期間・割引前提）。詳細は DATA_INTEGRITY.md。
- [ ] **A-D5 🟡** ドコモMAX・home 5G の月額は未提供のため数値を置いていない（要確認のまま）。公式確認後に追記する。（→ 高橋に実値の提供可否を確認）
- [x] **A-D6** コミット 9a74ae0 の新プラン反映を data-integrity-steward が検証（2026-06-23・🔴ゼロ）。提供値のみ使用・未提供値据え置き・条件は warnings に要確認明記・GOLD18,600/PLATINUM18,700 不変を確認。公式ライブ照合は 403 で未実施（A-D4 継続）。
- [ ] **A-D7 🟢** 既存商材（dcard-\*, hikari-1g, denki, gas）の `official_checked_at=2024-06-01` は本日基準で90日超＝鮮度警告対象。今回未改変のため捏造ではないが、再確認のうえ確認日更新を検討（A-D1 と併合）。
- [x] **A-D8（code 指摘反映）** 新モジュール `p1m5` を `DEMO_PROGRESS` に追加（デモの Phase 1 完走を維持）・モジュール順を p1m1〜p1m5 に整列・ポイ活MAX の oneLiner を短縮（カード高さ）。`他社比較` カテゴリは将来の競合比較用に型/ORDER 維持（seed 0件は filter で非表示・既存仕様）。

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
- [x] **D-N14 🟢** Roleplay の評価ランク閾値（S/A/B/C/D）の表示文字列ハードコードを解消。`progress.ts` の `GRADE_THRESHOLDS` を単一の正とし、`gradeOf` と `GRADE_LEGEND` を同一の正から導出（Phase 4・ADR-0013）。

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

## G. Phase 2（管理画面 CRUD）

- [x] **G-1** 管理シェル `/admin`（RequireAdmin・admin のみナビ表示）＋ 概要/商材/お知らせ/ユーザー/監査ログ。
- [x] **G-2** 商材編集 → `product_version`（before/after）記録 ＋ 版インクリメント ＋ 確認日更新 ＋ 監査記録、学習側（Products/ProductDetail）に即時反映（`ContentContext`、smoke テストで検証）。
- [x] **G-3** お知らせ CRUD（学習者ダッシュボードに反映）／ユーザーの権限・有効無効／監査ログ閲覧。
- [x] **G-4** 監査のサーバー側書込 RPC `log_audit`（migration 0004）＋ RLS/RPC テスト `rls_admin_audit.sql`。
- [x] **G-5** 純粋ロジック（`lib/content.ts`：diff/版/お知らせ）＋ Vitest、画面横断 smoke テスト（admin 編集→学習反映、非 admin 遮断）。
- [ ] **G-6 ⚠️** バックエンド（Supabase）への接続は env が無いため未実施。`ContentContext` を `products`/`product_versions`/`announcements` と `log_audit` に接続する統合が必要。**DB の `products` 列はフロント `Product` 型と形が異なるため写像が必要**（progress と同じギャップ。F-4 と合わせ Phase 2 統合で対応）。
- [ ] **G-7** お知らせ／ユーザー操作も `log_audit` 経由でサーバー側記録に統一（backend 接続時）。

### Phase 2 レビューゲート（2026-06-23）— security / data-integrity / code / design

- [x] **G-R🔴(code)** Content 編集 callback が変動 state を依存に持ちクロージャ陳腐化 → ref（productsRef/announcementsRef/usersRef）で最新参照＋依存を `[addAudit]` に安定化。
- [x] **G-R🔴(design)** お知らせ削除に確認が無い（即削除）→ 行内2段階確認（削除しますか？→削除する/やめる）＋`role="status"` の結果通知。
- [x] **G-R1(code/design)** 保存成功バナーの版番号 → `editProduct` が新版番号・確認日を返し表示（レンダリング順依存を排除）。
- [x] **G-R2(code)** `as never` を排除（配列フィールド専用 `updateList`）／`applyProductEdit` が `fields` を返し `diffProduct` 二重呼び出しを解消／`INITIAL_USERS` を seed の `DEMO_USERS` へ移動／`ManagedUser` を types へ。
- [x] **G-R3(design/code)** AdminProducts/AdminUsers に empty 状態、AdminUsers/AdminAnnouncements に aria-live 通知、ボタン間隔・checkbox 整列、select の可視ラベル、Dashboard お知らせ本文 `line-clamp-3`。
- [x] **G-R4(code)** smoke の input 順依存を `getByLabelText` に、`activeAnnouncement` 複数有効ケースのテスト追加（unit 65件）。
- [ ] **G-8 🟡(data)** 商材編集は管理者入力をそのまま保存し、内訳（割引/ポイント）と合計（約18,600円相当）の整合チェックはしない（「推測で直さない」正典に沿う設計）。不整合入力を検知できないため、保存前の整合バリデーションか「要確認」表示を入れるか方針判断要。（→ 高橋確認）
- [ ] **G-9 🟢(data)** G-8 の方針決定後、整合バリデーションの境界テストを追加。
- [ ] **G-10 🟡(security)** backend 化時、`setUserRole`/`setUserActive` はフロント直書きにせず SECURITY DEFINER RPC/Edge Function 経由に（admin 再検査・自己権限の admin 剥奪防止・最後の admin 保護）。
- [ ] **G-11 🟡(code)** admin 各画面（Overview/Products/Users）に loading スケルトンの受け皿（backend の非同期取得時に必要）。
- [ ] **G-12 🟢(data)** 「URL のみ修正でも確認日が進む」点（編集＝確認の既定）が鮮度管理の意図とズレないか確認。（→ 高橋確認）
- [x] **G-R5🔴(code・確認)** AdminUsers の empty 状態欠落 → `EmptyState`＋リスト条件描画を追加（4状態一貫）。
- [x] **G-R6(code・確認)** `applyProductEdit` の fields 検証テスト追加／`product!` アサーション解消（ガードを handleSave 内に）／render 中 ref 代入の理由コメント明記。
- [ ] **G-13 🟡(code)** AdminUsers の権限変更・有効無効はワンクリック即時（aria-live 通知あり・可逆）。お知らせ削除との UX 一貫性のため権限変更に確認ステップを入れるか検討。
- [ ] **G-14 🟢(code)** admin の smoke は商材編集のみ。お知らせ・ユーザー管理のスモークは将来追加。

## E. 性能・PWA（Phase 6）

- [ ] **E-P1** 初回 JS 予算 ~180KB gzip 目標、Lighthouse 90+ を計測し記録。現状ベースライン: JS 約220KB / gzip 約73KB（2026-06-23 build）。

## H. Phase 3（クイズエンジン）

- [x] **H-1** 受験UI `pages/Quiz.tsx`（4状態・単一/複数選択・採点・解説・再受験）＋ `/quiz/:moduleId`。
- [x] **H-2** 採点は純粋関数 `lib/quiz.ts`（gradeQuiz/isAnswerCorrect/allAnswered）。境界値 79/80/89/90/99/100 を採点パイプライン経由で Vitest 検証。
- [x] **H-3** 提出で `setModuleScore`（best score 保持）→ Roadmap/Dashboard に反映（smoke で受験→合格→反映を担保）。合格で `b-first` は進捗から自動導出。
- [x] **H-4** 設問 `data/quiz.ts`（p1m4/p1m5/p2m1/p3m1/p6m2/p8m1 各5問）は正典準拠（GOLD18,600/PLATINUM18,700・本人入力・プラン要確認運用）。
- [ ] **H-5 🟡** `quiz_attempts` への保存は backend 接続時に実装（受験履歴・回数）。現状は best score を progress に反映するのみ。
- [ ] **H-6 🟢** 設問は6モジュールのみ。残りモジュールへの設問拡充はコンテンツ追補で対応。

### Phase 3 レビューゲート（2026-06-23）— design / code / data-integrity

- [x] **H-R1🔴(design)** `<legend>` × flex `<fieldset>` カードが iOS/小画面で崩れうる → 設問を `role="group"`＋`aria-labelledby` の div に変更（legend 撤去）。
- [x] **H-R2🔴(code)** `module!` 非null → `handleSubmit` 内で `if (!module) return` ガードに置換。
- [x] **H-R3🔴(code/design)** 採点バナーの `role="status"` がインタラクティブ要素を内包 → 常設の `role="status" aria-live` 領域（sr-only）に分離。バナーは視覚表示のみ。
- [x] **H-R4(code)** error を2分岐（モジュール無し=見つからない／設問無し=準備中）。
- [x] **H-R5(code)** `quizForModule` を事前計算マップ化（毎レンダリングの filter 回避）。
- [x] **H-R6(code)** 複数選択問題を1問追加（checkbox パスを実データで踏む）＋ `allAnswered([])`・`correct:[]` の境界テスト追加。
- [x] **H-R7(code)** UI 結合の100点境界：p1m4（合格点100）を全問正解で合格になる smoke を追加（unit 82件）。
- [x] **H-R8(code/design)** 採点後に結果へフォーカス＆スクロール、best score 保持の意図をコメント明記。
- [ ] **H-Q1 🟡(data)** `data/quiz.ts` 解説内の数値（mini 880円・ポイ活MAX 2,948円）が seed と単一ソース化されていない。seed の値更新時に quiz 解説も追従更新する（チェックリスト化）。2026-06-23 時点は正典一致・🔴なし。

## I. Phase 4（ロープレ会話＋AI評価）

- [x] **I-1** プロバイダ差し替え可能なアダプタ（`lib/ai/`）。デモ=`mockProvider`（キー不要）、本番=`edgeProvider`（`functions.invoke`）。切替は `getRoleplayProvider` 1 箇所。
- [x] **I-2** 純粋ロジック `lib/roleplay.ts`（モック顧客＋ヒューリスティック評価）＋境界/決定性テスト（`roleplay.test.ts` 16 件）。評価は振る舞いのみ採点し事実値を捏造しない。
- [x] **I-3** `pages/Roleplay.tsx` を setup/chat/result の3フェーズ＋4状態＋A11y で再構築。テキストロープレ→評価の一巡 smoke を追加（unit 99 件）。
- [x] **I-4** ランク閾値を `GRADE_THRESHOLDS` に単一化（D-N14 解消）。
- [ ] **I-5 ⚠️(security)** Edge Function `supabase/functions/roleplay` を本番有効化する前に必須対応：(a) CORS を `*` からアプリ origin に限定、(b) `action`/`payload` のスキーマ検証と `transcript` 長上限・基本的なレート制御、(c) JWT 必須でのデプロイ担保（`--no-verify-jwt=false`）、(d) エラーメッセージの一般化（内部情報の素通し防止）。本環境に env が無く未デプロイのため現時点は阻害なし。
- [ ] **I-6 ⚠️** 評価結果（`roleplay_sessions`）の永続化は未実装。保存はサーバー/RLS 準拠（本人限定）で Phase 5 に実装。フロント直 insert は禁止。
- [ ] **I-7 🟡(data)** 認定条件 c2/c4–c9・バッジ（GOLD/PLATINUM/セット/難敵）はロープレ評価の蓄積が前提のため、現状 false（捏造しない・ADR-0006）。評価の永続化後に判定を有効化。

### Phase 4 レビューゲート（2026-06-23）— security / design / code

- [x] **I-R1🔴(design)** 総合ランク D の chip が `text-fail`（AA 不足）→ `text-fail-deep` に（soft 背景上は deep の規約に統一）。
- [x] **I-R2🔴(design)** 結果遷移が支援技術に告知されない → 要約見出し（sr-only h2）へフォーカス移動で告知。
- [x] **I-R3🔴(code)** 「テキストロープレを開始」に二重起動ガードなし → `disabled={pending}`＋`startChat` 冒頭 `if (pending) return`。
- [x] **I-R4🔴(code)** `phase=result && evaluation=null` の中間レンダが空画面 → `PageLoading` フォールバックを追加（4状態を担保）。
- [x] **I-R5🟡(code)** Edge の AI 応答に `res.ok` 検査追加。評価 JSON の `JSON.parse` を try/catch で明示エラー化（0 点黙殺の防止）。
- [x] **I-R6🟡(code)** Edge 評価の `label` が英語キー → 日本語ラベル対応表（`EVAL_ITEMS`）で返す。
- [x] **I-R7🟡(code)** 評価中（`evaluating`）は textarea/送信をロック（多重実行防止・loading 主役の明確化）。
- [x] **I-R8🟡(code)** `getRoleplayProvider` のキャッシュに `resetRoleplayProvider`（テスト用）を追加。
- [x] **I-R9🟡(code)** `evaluateRoleplay` のランクが `gradeOf` に委譲されることの統合テストを追加。
- [x] **I-R10🟢(code)** `feedback` の key をインデックス→内容に。`FEEDBACK_TIPS` に `clarity` を追加。`evaluateRoleplay` の未使用 `scenario/difficulty` の保持意図をコメント明記。
- [x] **I-R11🟢(design)** 会話バブルの話者ラベルを `opacity-70`→トークン色（helper=`text-paper`／customer=`text-ink-muted`）。
- [x] **security 🔴0** キーのフロント露出なし・`service_role` 不使用・anon invoke のみ・「認証コード/パスワードはお客様ご自身が入力」維持・評価は事実非捏造。🟡（CORS/入力検証/JWT/結果永続化）は I-5/I-6 に集約。

## J. Phase 5（SVダッシュボード・認定フロー）

- [x] **J-1** 純粋ロジック `lib/certification.ts`（`certificationReadiness`/`canApprove`/`isAutoTracked`/`isPendingEvaluation`、必須=c1/c3）＋境界テスト8件（99/100・必須欠落）。
- [x] **J-2** SV名簿デモ `data/sv.ts`・`CertificationContext`（承認＝Lv.10化、ref で安定化、loading 受け皿）。
- [x] **J-3** `SvDashboard`/`SvTraineeDetail`（4状態・承認の確認ステップ＋告知・`LevelLadder` 主役）・`RequireSv`・`Layout` 導線・`Certification` に「SV承認待ち」。
- [x] **J-4** 承認 RPC `approve_certification`（migration 0005・SECURITY DEFINER・`is_sv_or_admin()`・`(user_id,certification_type)` 一意で冪等 upsert・level=10・監査）＋RLS テスト。
- [ ] **J-5 ⚠️** backend 未接続（env なし）。`CertificationContext` を profiles/progress/certifications（SV用 RLS）へ接続し、承認を RPC に置換。migration 0005 とRLS テストの実DB実行（高橋／CIテストDB）で確認。
- [ ] **J-6 🟡(data)** SV名簿は研修進捗のデモデータ（料金等の事実値ではない）。backend 接続で実データに差し替え。
- [ ] **J-7 🟡** SV の担当範囲（店舗/チーム）でのスコープ絞り込みは未実装（現状は全員表示）。RLS の `is_sv_or_admin()` は全SVに開く設計のため、チーム単位の制限が必要なら方針判断（→ 高橋確認）。

### Phase 5 レビューゲート（2026-06-23）— security / design / code

- [x] **J-R1🔴(security)** `approve_certification` が非冪等（複数行 UPDATE／重複 INSERT・user一意欠如）→ `(user_id,certification_type)` UNIQUE 追加＋`on conflict do update` の単一冪等文に。`search_path` に `pg_temp`。
- [x] **J-R2🔴(design)** 状態 pill／「SV承認待ち」バッジが和文に `font-num`（字形劣化）→ 除去（数字のみ `font-num`）。
- [x] **J-R3🔴(design)** 名簿行リンクのアクセシブルネーム不明瞭 → `aria-label`（氏名・状態・進捗）を付与。
- [x] **J-R4🔴(code)** 4状態の loading 欠落 → `CertificationContext` に `loading`、両ページに `PageLoading` 受け皿。
- [x] **J-R5🔴(code)** `AuditAction`/`targetType` に `certification.approve`/`certification` 未追加 → 型へ追加（AdminAudit のアイコンも）。
- [x] **J-R6🟡(design)** 「承認可能」が pass(緑＝達成済み) で誤読 → caution（SVアクション待ち）へ。0件は中立トーン。
- [x] **J-R7🟡(design)** 承認の確認パネルでフォーカス移送＋`role=status` 告知を追加（取り消し不可に近い操作）。
- [x] **J-R8🟡(code)** `AUTO_TRACKED_CONDITION_IDS` から c10 を除外（人手のため）。UI バッジは `isPendingEvaluation` に統一。
- [x] **J-R9🟡(code)** `sv.ts` の level と達成フェーズの不整合（t-3）を是正。境界テスト（c1 必須欠落）・二重承認防止 smoke・StatCard/アイコンの aria を追加。
- [x] **J-R10🟡(security)** RLS テストの例外捕捉を `forbidden`(P0001) に限定し、拒否時の副作用なし（level据置・行なし）を検証。
- [x] **security/design/code 🔴0（再）** 上記解消後、二層防御・トークン準拠・型安全・4状態を満たす。

## K. Phase 6（仕上げ：PWA・性能・配信）

- [x] **K-1** GitHub Pages デモ配信（`.github/workflows/pages.yml`）。デモモードでビルド（Supabase env を渡さない＝鍵を焼かない）、SPA フォールバック（index→404）。サブパス対応（vite base / BrowserRouter basename）。
- [x] **K-2** PWA：手書き `public/sw.js`（ナビ network-first・同一オリジン資産 SWR・非GET/クロスオリジン非キャッシュ）＋本番のみ登録（`lib/pwa.ts`）。
- [x] **K-3** 役割限定の SV/管理画面を `React.lazy` で分割（初期 JS ~101KB→~95.7KB gzip）。
- [x] **K-4** E2E を Phase 4/5 に追従（テキストロープレ一巡・SV承認を追加、旧「ロープレ無効」アサーション是正）。本環境はブラウザ取得不可のため CI 実行前提。
- [x] **K-5** GitHub Pages 開通（Source: GitHub Actions・github-pages 環境のブランチ制限を解除）。`https://ktakahashi7755-creator.github.io/docomo-sales-academy/` が実機で閲覧可（2026-06-23・高橋確認済み）。
- [x] **K-8** インストール/SEO ポリッシュ：`description`・iOS PWA メタ（apple-mobile-web-app-\*）・`format-detection: telephone=no`（料金数字の電話リンク化防止）・`apple-touch-icon`／`icon`・manifest `id`。Pages サブパスでも head の各リンクが base 付きに書き換わることを build で確認。
- [ ] **K-6 🟡** Lighthouse 90+ の実測は CI/実機で継続（本環境では計測不可）。
- [ ] **K-7 🟡** `pages.yml` の push トリガに作業ブランチを含む（実機リンクを今出すため）。main マージ後に作業ブランチを外す。
- [ ] **K-9 🟢** `apple-touch-icon` は SVG 指定。iOS は PNG を好むため、ホーム画面アイコンの最適表示には 180×180 PNG を後で用意する。
- [x] **K-10** Playwright E2E を CI ログから根治。E2E は本環境でブラウザ取得不可のため一度も検証されておらず、アプリではなくテスト側の陳腐化（商材・シナリオ順の変更、live ロケータ、モバイル非表示リンク、strict 競合）が累積していた。`quality` ジョブ（typecheck/lint/format/unit/build）は一貫して緑。修正で 8→16→全件 緑へ（下記 K-R6〜K-R11）。

### Phase 6 E2E 修正（2026-06-23・CI ログ駆動）

- [x] **K-R6** `navigate` を `a[href]:visible` 限定（モバイルで非表示のサイドバーリンクを掴みクリックがタイムアウトしていた）。
- [x] **K-R7** 商材詳細テストは一覧のカテゴリ順変更で「先頭＝GOLD」前提が崩れていた → `a[href="/products/dcard-gold"]` を直接開く。
- [x] **K-R8** ロープレ評価見出しが h1 と sr-only h2 に二重マッチ → `exact: true` で h1 限定。
- [x] **K-R9** `[aria-pressed="false"]` の live ロケータがクリック後に別ボタンへ再解決 → `nth(0)` 位置指定に。
- [x] **K-R10** `serviceWorkers: "block"`（オフラインは E2E 対象外、遷移・資産取得を決定的化）。
- [x] **K-R11** 「約18,600円相当」がメリットと訴求ポイントの2箇所に出るため `getByText(...).first()` で一意化（strict 競合解消）。

### Phase 6 レビューゲート（2026-06-23）— security / code

- [x] **K-R1🔴(code)** SW ナビゲーションのキャッシュ書込が浮いた Promise → `event.waitUntil` で保持。
- [x] **K-R2🔴(code)** SW 資産取得の失敗時フォールバック欠如 → SWR 化で `fetch().catch(()=>cached)`（ハードエラー回避）。
- [x] **K-R3🟡(security)** 同一オリジン資産を cache-first→SWR にし、ハッシュ無し資産（icon/manifest）の陳腐化を回避（CACHE 名の手動更新依存を低減）。
- [x] **K-R4🟡(code)** SW 登録を `document.readyState` 分岐で load 後実行でも確実に。
- [x] **K-R5🟡(code)** E2E のシナリオ選択ロケータを `button[aria-pressed="false"]` に限定（誤クリック回避）。
- [x] **security 🔴0** 鍵非露出・SW はトークン/越境応答を残さない・公開配信は seed のみ（個人情報なし）。

### V2 Phase A 商材マスター（2026-06-24）— data-integrity

- [x] **A-D9 🟡(data)** home5g の oneLiner/pitch が「実質無料」を条件併記なしで使い、自らの prohibitedClaims に近接 → oneLiner/pitch に「（条件あり）」を併記して解消。
- [ ] **A-D10 🟡(data)** 新商材 ahamo / eximo-irumo / kaedoki / kaedoki-plus の数値は研究レポート由来で `freshnessStatus=needs_review`・「（要確認）」運用。公式ライブ照合は 403 で未実施（A-D4 と同状況）。顧客提示前に各 officialUrl で再確認し、確定後に verified へ・officialCheckedAt を更新。
- [ ] **A-D11 🟢(data)** dcard-platinum/dcard-regular/hikari-1g/denki/gas の officialCheckedAt=2024-06-01 は90日超＝鮮度警告対象。freshnessOf の日付判定で UI は要確認表示される（dcard-gold は明示 needs_review 付与済み）。公式再確認後に確認日と値を更新。

### V2 Phase D/E（2026-06-24）— data-integrity

- [x] **A-D12** Phase D/E（git diff 1415bfb..dcaaae8）の追加クイズ6問（q-p1m4-6 / q-p2m1-6 / q-p3m1-6 / q-p6m2-7 / q-p8m1-6 / q-p10m1-7）と growth/data/rubric.ts を検証。🔴/🟡ゼロ。NG/Good設計が正典と一致：ポイ活MAX 実質2,948円＝条件付き（無条件断定をNG選択肢化）・GOLD約18,600円相当／PLATINUM実質18,700円／年会費11,000円 不変・「必ず安くなる/誰でも対象」をNG・本人入力維持・詳細個人情報の早期取得をNG。rubric.ts は料金数値を含まず技法/基準のみ。
- [ ] **A-D13 🟡(継続/H-Q1)** quiz.ts の数値（880/2,948/18,600/11,000/18,700円）は seed と単一ソース化されておらず文字列複製。今回も正典一致だが、seed 更新時の追従漏れリスクは残存。単一ソース化は将来Phaseで検討。

### 商材 公式数値の検証（2026-06-24）

- [ ] **A-D14** needs_review 商材10件（dcard-gold/platinum/regular・hikari-1g・denki・gas・ahamo・eximo-irumo・kaedoki・kaedoki-plus）の公式数値の確認が必要。エージェント環境では docomo/ahamo/dcard が 403 で取得不可（サイト側ボット遮断、proxy relay失敗ではない）。`docs/PRODUCT_VERIFICATION_CHECKLIST.md` を用意。高橋または現場が公式値を記入し次第、seed/curriculum/quiz を更新して verified 化する。捏造はしない。

### クイズ全面改稿の事実値検証（2026-06-24）— data-integrity

- [x] **A-D15** quiz.ts 全面改稿（43問：正解位置の分散 5/33/3/0→11/8/11/11・誤答を現実的 near-miss 化）を検証。🔴/🟡ゼロ。正典一致を全件確認：GOLD年会費11,000円／PLATINUM 29,700円（5,500円・無料は実在しないダミー誤答、explanationで混同防止）、GOLD合計訴求 約18,600円相当・PLATINUM切替 実質18,700円、ポイ活MAX 実質2,948円＝条件付き正答（無条件/基本料金/キャンペーン価格を誤答）、mini=4GB小容量/MAX=無制限。新規誤答に断定的事実主張・捏造数値の混入なし。コンプラ振り分け（本人入力/断定禁止/個人情報最小限）も方針どおり。
- [ ] **A-D16 🟡(継続/A-D13)** 本改稿でも quiz.ts の数値は seed と文字列複製のまま。seed 更新時の追従漏れリスクは残存（単一ソース化は将来Phaseで検討）。

### 確認テスト追加18問の事実値検証（2026-06-24）— data-integrity

- [x] **A-D17** quiz.ts 追加18問（q-p1m5-6〜8 / q-p6m2-8〜10 / q-p4m3-1〜4 / q-p7m1-1〜4 / q-p9m1-1〜4）を seed と突き合わせ検証。🔴/🟡ゼロ。home 5G「登録設置場所のみ・持ち運べるは誤り」は prohibitedClaims と一致、光10ギガ「ワンコイン＝月額500円」は hikari-10g.benefits と一致しキャンペーンを恒常料金と分離、でんき/ガスはエリア・名義・還元条件確認＋断定禁止。p7m1(3価値連動/世帯試算/MNP番号そのまま)・p9m1(選択式/損失回避/申込前確認/本人入力)も正典整合。新規捏造数値ゼロ（具体数値は500円のみ＝seed一致）。
- [ ] **A-D18 🟡(継続/A-D16)** 追加18問でも光10ギガ「月額500円」は seed と文字列複製。今回一致だが seed 更新時の追従漏れリスクは残存。要：A-D14 の公式再確認で ワンコインの対象期間・条件、home 5G 本体実質無料の条件を確定。

### 総点検ラウンド3（2026-07-09）— design-reviewer desktop/mobile 36枚走査

- [x] **R3-1 🟡(design)** 入室画面のサブコピー/フッターがネイビー地で低コントラスト → blue-100 / blue-200/80 へ引き上げ。
- [x] **R3-2 🟡(a11y)** ヘッダーの通知・ログアウトのタップ領域 40px → 44px（h-11 w-11）＋通知ボタンに focus-visible リング追加。
- [x] **R3-3 🟡(design)** ヘッダーの進捗ラベル「現在の進捗」→「全体の進捗」に変更（画面内のステップ進捗%との重複解消・意味の区別）。
- [x] **R3-4 🟡(design)** 今後のスケジュールのタイトル truncate による語中切れ → 折返し許容に変更。
- [x] **R3-5 🟡(design)** カリキュラム一覧のロック中ステップの「進捗 0%＋空バー」→「未着手」の状態語に置換。
- [x] **R3-6 🟡(design)** ロープレ難易度バッジの色スケール逆転（超難がグレー）→ StatusBadge に hard トーン（red-50/red-700）を追加し 8+ に適用。locked トーンの文字色も slate-400→500 に引き上げ。
- [x] **R3-7 🟡(design)** 進捗レポートのステップ名が語中で truncate → 2行折返し許容。
- [x] **R3-8 🟡(design)** モバイルボトムナビ半透明（bg-white/95+blur）で通過コンテンツがラベルに透ける → 不透明 bg-white に。非アクティブラベル slate-400→500（AA）。
- [x] **R3-9 🟡(design)** Bot FAB と最下部コンテンツの重なり → main の モバイル下パディングを pb-24→pb-36 に拡大。FAB に focus-visible/motion-reduce を追加。
- [x] **R3-10 🟡(design)** レッスン/シナリオ非発見状態にアイコン（SearchX）追加・補足文の slate-400→500。ロープレのコンプラ注記・空状態の案内文も slate-500 に引き上げ。
- [ ] **R3-11 🟡(保留)** ダッシュボードの動画サムネのベタ塗りプレースホルダ・ヘルプ末尾のBot CTAバナーは、PO承認済み参照デザイン準拠（DECISIONS D1）として維持。実アセット差し替え時に再検討。
- [ ] **R3-12 🟡(保留)** 現場ガイドの長尺タブ（場面別/反論処理）のセクションジャンプ・折りたたみはバックログ（M2以降のUX改善候補）。クイズ受験の採点ボタン固定化も6問構成のため見送り。
