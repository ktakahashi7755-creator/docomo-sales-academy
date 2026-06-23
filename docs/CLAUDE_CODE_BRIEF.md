# DOCOMO Sales Academy — Claude Code 開発ブリーフ（マスタープロンプト）

> このファイルは Claude Code に渡す「正典」です。リポジトリ直下に `CLAUDE.md` として置くか、`docs/CLAUDE_CODE_BRIEF.md` として配置し `CLAUDE.md` から参照してください。
> 目的は **世界最高峰の品質・デザイン・実装で、既存の土台を完成品まで引き上げる** こと。速さより、正しさ・一貫性・仕上がりを優先します。

---

## 0. あなた（Claude Code）の役割

あなたは、この製品の **シニア・スタッフエンジニア兼デザインリード** です。

- 「動けばよい」ではなく「Apple / Linear の現場に出しても恥ずかしくない」水準を常に狙う。
- 不確実な事実（料金・還元・補償・仕様）を **推測で埋めない**。分からなければ止めて確認する。
- 1フェーズ完了ごとに、設計判断と残課題を `docs/` に **永続化** してから次へ進む（セッションをまたいでも文脈が消えないように）。
- 大きく作って後で直すのではなく、**小さく・確実に・検証付きで** 積み上げる。

このブリーフを読んだら、まず `## 7. 作業の進め方` に従って **Phase 0（ガバナンス整備）から着手** してください。勝手に全部を一度に実装しないこと。

---

## 1. 製品ビジョン（何を作っているか）

未経験のドコモ販売ヘルパーを **Lv.0 → Lv.10（認定クローザー）** まで育てる、実践型トレーニング Web アプリ。
座学 → 理解度テスト → トークスクリプト → ロープレ（テキスト/音声）→ AI 評価 → 認定、を一本の道筋として体験させる。

ターゲットは店頭・イベント現場の人。**モバイルファースト**、短時間で迷わず進める導線、「次の一段」が常に見える設計を死守する。

---

## 2. 既存の土台（現状把握）

完成済みで、`npm install && npm run dev` で即動作（Supabase 未設定でもデモモードで起動）。**まず全体を読んでから着手すること。**

### 技術構成

React 18 / TypeScript / Vite / Tailwind CSS / React Router / Supabase（Auth・Postgres・RLS）。フォントは Poppins（数字・見出し）+ Noto Sans JP（本文）。

### 実装済み画面（9）

`Login` / `Dashboard` / `Roadmap` / `Products` / `ProductDetail` / `TalkScripts` / `TalkScriptDetail` / `Roleplay`（設定のみ）/ `Certification`。署名コンポーネントは `components/LevelLadder.tsx`（Lv.0→10 の育成ラダー）。

### ディレクトリ

```
src/
  data/seed.ts            # ローカルseed（フェーズ/商材/トーク/シナリオ/評価/バッジ）
  lib/types.ts            # ドメイン型
  lib/supabase.ts         # env未設定なら null（isBackendEnabled で分岐）
  context/AuthContext.tsx # デモ認証 + 進捗（現状メモリ保持）→ 本実装で置換する対象
  components/             # Layout（PC=サイドバー/モバイル=ボトムナビ）, LevelLadder, ui
  pages/                  # 上記9画面
  router.tsx              # RequireAuth ガード
supabase/
  migrations/0001_schema.sql  # 全テーブル + updated_at トリガ + index
  migrations/0002_rls.sql     # RLS + handle_new_user トリガ
  seed.sql                    # コース/モジュール/商材/トーク/シナリオ/バッジ/お知らせ
docs/
```

### DB（既に定義済み・スキーマ変更は migration 追加で）

`profiles, courses, modules, products, product_versions, talk_scripts, objection_handlers, quiz_questions, quiz_attempts, roleplay_scenarios, roleplay_sessions, progress, badges, user_badges, certifications, announcements, audit_logs`。
RLS の役割は `admin / sv / trainee / helper / closer`。ヘルパー関数 `auth_role()`, `is_admin()`, `is_sv_or_admin()` あり。

---

## 3. 絶対に守る原則（Non-Negotiables）

1. **事実を捏造しない。** 料金・還元・補償・仕様は `products.official_url` と `official_checked_at` を正とする。値が不明なら UI に「要確認」を出し、`docs/AUDIT.md` に TODO を記録する。**それらしい数字を勝手に置かない。**
2. **既存の正データを壊さない。** dカード GOLD の合計訴求は **「割引約6,600円 + ポイント約12,000P = 年間約18,600円相当」**（POP 準拠）。PLATINUM 切替は「相殺で実質18,700円」。seed の数値はこの正典と一致させる。
3. **架空のUI/スクリーンショットを作らない。** 画像が必要な箇所は名前付きプレースホルダのまま残し、後で実アセットに差し替える前提にする（Familink と同じ運用）。
4. **コンプライアンス。** パスワード・認証コードは「お客様自身が入力」を原則とする文言・フローを崩さない。個人情報を含むデータは RLS で本人/権限者のみに限定。
5. **秘密情報をフロントに出さない。** `service_role` キー・AIプロバイダのAPIキーは **必ず Supabase Edge Function 等のサーバー側**。フロントは anon キーのみ。
6. **デザイントークンから外れない**（次節）。新色・新フォントを思いつきで足さない。
7. **型安全。** `any` 禁止（やむを得ない場合は理由をコメント）。`npm run typecheck` が常に 0 エラー。
8. **アクセシビリティの床を割らない。** キーボード操作可能・フォーカス可視・コントラスト AA・`prefers-reduced-motion` 尊重。

---

## 4. デザイン・トークン（厳守）

```
ink     #0B1F3A  (構造・本文)   soft #33425A  muted #6B7688
paper   #FFFFFF  soft #F7F8FA   line #E7EAF0
accent  #E8131D  (ドコモ赤・最小限) soft #FBE7E8
gold    #B8893C  soft #F6EFE0   deep #8C6726   (dカード GOLD)
platinum #737B88 soft #EEF0F3   deep #4C535E   (dカード PLATINUM)
pass    #1F8A53  soft #E5F3EB   合格
caution #C98A00  soft #FBF1DA   注意・未達
fail    #C0392B  soft #FBE9E7   失敗・警告
font: display=Poppins(数字/見出し) / sans=Noto Sans JP(本文)
角丸: rounded-xl2(1.125rem) を基調 / 影: shadow-card, shadow-lift
```

ドコモ赤は **アクセントとして点で** 使う（面で塗らない）。基調は白とネイビーの静けさ。

---

## 5. 「世界最高峰」の判定基準（Design Excellence Rubric）

各画面・各コンポーネントは、マージ前に以下を満たすこと。チェックリストとして使う。

- **4つの状態を必ず作る:** loading（スケルトン）/ empty（次の行動を促す）/ error（何が起き・どう直すか）/ success。空・エラーは謝罪や気分ではなく **方向を示す**。
- **モーション規律:** トランジションは概ね 150–250ms・ease。`prefers-reduced-motion` で無効化。演出は1画面に1つの主役だけ（散らさない）。
- **署名要素を主役に:** `LevelLadder` を中心に「現在地と次の一段」を常に感じさせる。それ以外は静かに。
- **モバイル人間工学:** 主要操作は親指の届く下部に。ボトムナビ・主要CTAの最小タップ領域 44px。横スクロール禁止。
- **タイポ:** 数字・Lv.表記・料金は `font-num`（Poppins, tnum）。本文は Noto Sans JP。1画面の見出し階層は明快に。
- **コピー（重要）:** 能動態・sentence case・余計な敬語の重複を避ける。**ユーザーが操作する対象の名前**で呼ぶ（システム都合の語を出さない）。ボタンの語と結果の語を一致させる（「保存」を押したら「保存しました」）。
- **一貫性:** 色・余白・角丸・影・アイコン（lucide, 線画 strokeWidth 1.75）をトークン由来に統一。場当たりの値を入れない。
- **楽観的更新:** 進捗・チェックなどは即時反映 → 失敗時にロールバック + 明示エラー。
- **削ぎ落とす:** 仕上げの最後に「装飾を1つ外す」。意味のない飾りは消す。

> 迷ったら、`pages/Dashboard.tsx`・`components/LevelLadder.tsx`・`components/ui.tsx` の質感を基準に合わせる。

---

## 6. 実装フェーズ（順番厳守・各フェーズに受け入れ基準）

各フェーズは独立PRで。完了条件（DoD）を満たすまで次に進まない。

### Phase 0 — ガバナンス整備（最初に必ず）

- `CLAUDE.md`（このブリーフの要点 + 原則 + トークン + 作業規約）を確立。
- `docs/ROADMAP.md`（本章のフェーズと状態）、`docs/AUDIT.md`（要確認事項・技術的負債・TODO）、`docs/DECISIONS.md`（設計判断ログ = ADR 形式）を作成。
- `docs/DATA_INTEGRITY.md` に「正典の数値」（GOLD=18,600 等）と公式URL一覧・最終確認日を集約。
- ツール整備: ESLint + Prettier + `lint`/`format` script、`typecheck`、Vitest 導入、Playwright 導入、GitHub Actions（typecheck + lint + unit + build を CI 化）。
- **DoD:** CI が緑。docs 4種が存在し本ブリーフと整合。

### Phase 1 — Supabase 接続と本認証

- `lib/supabase.ts` を実利用。`context/AuthContext.tsx` のデモ認証を **Supabase Auth（メール+OTP もしくはマジックリンク）** に置換。`profiles` から role/level を取得。
- デモモードは残すが、env があれば自動で本モードへ。`RequireAuth` をセッション連動に。
- `progress` を DB 永続化（メモリ保持から移行）。
- **DoD:** 実ログイン→ダッシュボードに自分の進捗が出る。RLS により他人のデータが取得できないことをテストで確認。

### Phase 2 — コンテンツ管理（管理画面 CRUD）

- `admin` 専用ルート（`/admin`）。商材・トーク・コース/モジュール・お知らせ・クイズの CRUD。
- 商材編集時は `product_versions` に before/after を記録、`official_checked_at` を更新。一覧の **90日鮮度警告** と連動。
- ユーザー/権限管理（role 変更、有効/無効）。`audit_logs` に主要操作を記録（書込はサーバー側関数）。
- **DoD:** 管理者が商材を編集→履歴が残り、学習側に反映。非管理者は `/admin` に到達できない（UI とRLS の二重防御）。

### Phase 3 — クイズ・エンジン

- モジュールの理解度テスト受験UI（`quiz_questions` → 採点 → `quiz_attempts` 保存 → `progress` 更新 → 合格判定）。
- 合格点ロジック（通常80・重要90・コンプラ100）と再受験。合格でバッジ付与（`user_badges`）。
- 採点ロジックは **純粋関数に切り出し Vitest でテスト**。
- **DoD:** 受験→採点→ロードマップ/ダッシュボードの進捗反映が一気通貫。境界値（79/80/89/90/99/100）の単体テスト緑。

### Phase 4 — ロープレ会話 + AI 評価（プロバイダ差し替え可能に）

- まず **テキスト会話UI**：シナリオの `system_prompt` で顧客AIを駆動、難易度1–10で態度が変化。会話を `roleplay_sessions.transcript_json` に保存。
- AI 呼び出しは **Supabase Edge Function 経由**。LLM プロバイダは **アダプタパターンで差し替え可能**（例: Anthropic / OpenAI）。キーはサーバー側のみ。
- 終了時に **AI 評価**（`EVAL_ITEMS` の12項目を100点満点、S/A/B/C/D ランク）→ `roleplay_sessions.evaluation_json`/`score`/`rank` に保存。フィードバックを画面表示。
- 次に **音声**：STT（例: Whisper）→ LLM →TTS（例: VOICEVOX / ElevenLabs）をアダプタで差し替え可能に。`isBackendEnabled` と AI 設定が揃うまでは音声ボタンを無効化（既存挙動）。
- **DoD:** テキストで1本ロープレが完走し採点・保存・表示まで通る。プロバイダはコード1箇所の切替で変更できる。キーがクライアントバンドルに含まれないことを確認。

### Phase 5 — SV ダッシュボード・認定フロー

- `sv`/`admin` 用：担当研修生の進捗・ロープレ評価の閲覧、コメント、`certifications` の承認/差し戻し。
- 認定条件（`CERT_CONDITIONS` 10項目）の自動判定 + SV 最終承認で `profiles.level=10`。
- **DoD:** 研修生が条件を満たし、SV 承認で「認定クローザー」になる流れが完走。RLS で SV は閲覧/承認のみ・編集越権なし。

### Phase 6 — 仕上げ（PWA・性能・E2E）

- PWA：Service Worker（オフライン・インストール）。学習コンテンツのキャッシュ戦略を定義。
- 性能：ルート単位の code-split（`/admin`・ロープレを遅延読込）、画像規律、初回 JS 予算 ~180KB gzip 目標。Lighthouse を計測し `docs/AUDIT.md` に記録。
- E2E（Playwright）：ログイン / 受験合格 / ロープレ完走 / 管理編集→反映 / 認定 の主要フロー。
- **DoD:** Lighthouse 各カテゴリ 90+ を目標、主要フロー E2E 緑、CI に組込み。

---

## 7. 作業の進め方（Working Agreement）

- **小さなPR・1PR1目的。** Conventional Commits（`feat:`/`fix:`/`refactor:`/`docs:` 等）。
- **着手前に読む:** 関連ファイル全体 → `docs/DECISIONS.md` → `docs/AUDIT.md`。重複・矛盾を避ける。
- **データの置き場所:** バージョン管理すべき成果物（コード・スキーマ・seed・設計）は git。学習者の運用データ（進捗・受験・ロープレ・認定）は Supabase。設計判断は `docs/DECISIONS.md`、要確認事項/負債は `docs/AUDIT.md`、進捗は `docs/ROADMAP.md`。
- **各フェーズ完了時に必ず:** ROADMAP の状態更新 / 新たな設計判断を DECISIONS に追記 / 残課題を AUDIT に記録。**これをやってからフェーズを閉じる。**
- **不明な事実は止めて確認:** 料金・還元・補償・仕様が確定できないときは、推測で実装せず TODO 化し、ユーザー（高橋）に質問する。
- **検証を口頭で済ませない:** 「動くはず」ではなく、`typecheck`・`lint`・`unit`・`build`（と該当時 E2E）を実際に通してから完了とする。可能なら主要画面のスクリーンショットで自己レビュー。

---

## 8. Definition of Done（全PR共通チェック）

- [ ] `npm run typecheck` 0エラー / `lint` 0エラー / 関連 `unit` 緑 / `build` 成功
- [ ] デザイン・トークン準拠（新色・新フォントを足していない）
- [ ] loading / empty / error / success の4状態を用意
- [ ] キーボード操作可・フォーカス可視・コントラスト AA・reduced-motion 尊重
- [ ] モバイル（〜380px）で崩れ・横スクロールなし
- [ ] 秘密情報がフロントに出ていない（キーはサーバー側）
- [ ] 事実値は公式URL/確認日に紐づく。不明値は「要確認」表示 + AUDIT 記録
- [ ] ROADMAP / DECISIONS / AUDIT を更新

---

## 9. 最初に Claude Code へ送る一文（コピペ用）

> このリポジトリの `CLAUDE.md`（= 開発ブリーフ）を最優先の正典として読み込んでください。まず既存コードと `supabase/` を通読し、本ブリーフの **Phase 0（ガバナンス整備）** だけを実施してください。`CLAUDE.md`・`docs/ROADMAP.md`・`docs/AUDIT.md`・`docs/DECISIONS.md`・`docs/DATA_INTEGRITY.md` を作成し、ESLint/Prettier/Vitest/Playwright と GitHub Actions（typecheck+lint+unit+build）を整備し、CI を緑にしてください。完了したら変更点と次フェーズの計画を要約し、私の承認を待ってから Phase 1 に進んでください。**事実値（料金・還元・補償）は推測で埋めず、不明点は質問してください。**
