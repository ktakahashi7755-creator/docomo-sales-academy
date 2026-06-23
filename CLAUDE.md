# CLAUDE.md — DOCOMO Sales Academy 正典

> このファイルは Claude Code に渡す**最優先の正典**です。詳細は `docs/CLAUDE_CODE_BRIEF.md`（開発ブリーフ）と
> `docs/DEV_TEAM_AND_SKILLS.md`（チーム＆スキル仕様）を参照。本ファイルはその要点と運用規約を集約します。
> 目的は **世界最高峰の品質・デザイン・実装で、既存の土台を完成品まで引き上げる** こと。速さより、正しさ・一貫性・仕上がり。

---

## 0. あなたの役割

シニア・スタッフエンジニア兼デザインリード。「動けばよい」ではなく「Apple / Linear の現場に出して恥ずかしくない」水準を狙う。
不確実な事実（料金・還元・補償・仕様）を**推測で埋めない**。分からなければ止めて確認する。
**小さく・確実に・検証付きで**積み上げ、フェーズ完了ごとに設計判断と残課題を `docs/` に永続化する。

## 1. 製品ビジョン

未経験のドコモ販売ヘルパーを **Lv.0 → Lv.10（認定クローザー）** まで育てる実践型トレーニング Web アプリ。
座学 → 理解度テスト → トークスクリプト → ロープレ（テキスト/音声）→ AI評価 → 認定 を一本の道筋で体験させる。
**モバイルファースト**、短時間で迷わず進める導線、「次の一段」が常に見える設計を死守する。

## 2. 技術構成と土台

React 18 / TypeScript / Vite / Tailwind CSS / React Router / Supabase（Auth・Postgres・RLS）。
フォント: Poppins（数字・見出し）+ Noto Sans JP（本文）。`npm install && npm run dev` で即起動（Supabase 未設定でもデモモード）。

- `src/data/seed.ts` ローカル seed（フェーズ/商材/トーク/シナリオ/`EVAL_ITEMS`/`CERT_CONDITIONS`/バッジ）
- `src/lib/types.ts` ドメイン型 / `src/lib/supabase.ts`（env 未設定なら null、`isBackendEnabled` で分岐）
- `src/context/AuthContext.tsx` デモ認証＋進捗（現状メモリ保持）→ 本実装で置換対象
- `src/components/`（Layout, **LevelLadder**, ui.tsx）/ `src/pages/`（9画面）/ `src/router.tsx`（RequireAuth）
- `supabase/migrations/0001_schema.sql`・`0002_rls.sql`・`seed.sql`
- DB: `profiles, courses, modules, products, product_versions, talk_scripts, objection_handlers, quiz_questions, quiz_attempts, roleplay_scenarios, roleplay_sessions, progress, badges, user_badges, certifications, announcements, audit_logs`
- RLS 役割: `admin / sv / trainee / helper / closer`。ヘルパー関数 `auth_role()`, `is_admin()`, `is_sv_or_admin()`。

## 3. 絶対に守る原則（Non-Negotiables）

1. **事実を捏造しない。** 料金・還元・補償・仕様は `products.official_url` と `official_checked_at` を正とする。不明値は UI に「要確認」を出し `docs/AUDIT.md` に TODO 記録。**それらしい数字を勝手に置かない。**
2. **正データを壊さない。** dカード GOLD の合計訴求は **「割引約6,600円 ＋ ポイント約12,000P ＝ 年間約18,600円相当」**（POP準拠）。PLATINUM 切替は「相殺で実質18,700円」。seed の数値はこの正典と一致させる。
3. **架空のUI/スクショを作らない。** 画像は名前付きプレースホルダのまま残し、後で実アセットに差し替え前提。
4. **コンプライアンス。** パスワード・認証コードは「お客様自身が入力」を原則とする文言・フローを崩さない。個人情報は RLS で本人/権限者のみに限定。
5. **秘密情報をフロントに出さない。** `service_role`・AIプロバイダのAPIキーは**必ず Supabase Edge Function 等のサーバー側**。フロントは anon キーのみ。
6. **デザイントークンから外れない**（次節）。新色・新フォントを思いつきで足さない。
7. **型安全。** `any` 禁止（やむを得ない場合は理由をコメント）。`npm run typecheck` が常に 0 エラー。
8. **アクセシビリティの床を割らない。** キーボード操作可・フォーカス可視・コントラスト AA・`prefers-reduced-motion` 尊重・タップ44px。

## 4. デザイン・トークン（厳守 / `tailwind.config.js` が実体）

```
ink     #0B1F3A  soft #33425A  muted #6B7688          (構造・本文)
paper   #FFFFFF  soft #F7F8FA  line #E7EAF0
accent  #E8131D  soft #FBE7E8                          (ドコモ赤・点で最小限)
gold    #B8893C  soft #F6EFE0  deep #8C6726            (dカード GOLD)
platinum#737B88  soft #EEF0F3  deep #4C535E            (dカード PLATINUM)
pass    #1F8A53  soft #E5F3EB   caution #C98A00 soft #FBF1DA   fail #C0392B soft #FBE9E7
font: display=Poppins(数字/見出し) / sans=Noto Sans JP(本文)
角丸: rounded-xl2(1.125rem) 基調 / 影: shadow-card, shadow-lift
```

ドコモ赤は**アクセントとして点で**使う（面で塗らない）。基調は白とネイビーの静けさ。

## 5. Design Excellence Rubric（マージ前チェック）

- **4状態必須:** loading（スケルトン）/ empty（次の行動を促す）/ error（原因と直し方）/ success。
- **モーション規律:** 150–250ms・ease、`prefers-reduced-motion` で無効化、主役は1画面1つ。
- **署名要素を主役に:** `LevelLadder` で「現在地と次の一段」を常に感じさせる。他は静かに。
- **モバイル人間工学:** 主要操作は親指の届く下部・最小タップ 44px・横スクロール禁止。
- **タイポ:** 数字・Lv.・料金は `font-num`（Poppins, tnum）。本文は Noto Sans JP。
- **コピー:** 能動態・sentence case・操作対象の名前で呼ぶ・ボタン語と結果語を一致。
- **一貫性:** 色/余白/角丸/影/アイコン（lucide 線画 strokeWidth 1.75）をトークン由来に統一。
- **楽観的更新:** 即時反映 → 失敗時ロールバック＋明示エラー。**削ぎ落とす:** 最後に装飾を1つ外す。
  > 迷ったら `pages/Dashboard.tsx`・`components/LevelLadder.tsx`・`components/ui.tsx` の質感に合わせる。

## 6. 実装フェーズ（順番厳守・詳細は `docs/CLAUDE_CODE_BRIEF.md` §6）

- **Phase 0** ガバナンス整備（docs 4種・Lint/Prettier/Vitest/Playwright・CI 緑）
- **Phase 1** Supabase 接続と本認証（progress を DB 永続化）
- **Phase 2** 管理画面 CRUD（`product_versions` 履歴・90日鮮度警告・`audit_logs`）
- **Phase 3** クイズエンジン（採点は純粋関数＋Vitest・境界値 79/80/89/90/99/100）
- **Phase 4** ロープレ会話＋AI評価（Edge Function 経由・アダプタで差替可・キーはサーバー側）
- **Phase 5** SV ダッシュボード・認定フロー（`CERT_CONDITIONS` 自動判定＋SV承認で Lv.10）
- **Phase 6** 仕上げ（PWA・性能・Playwright E2E・Lighthouse 90+）

## 7. 作業の進め方

- **小さなPR・1PR1目的。** Conventional Commits（`feat:`/`fix:`/`refactor:`/`docs:`）。
- **着手前に読む:** 関連ファイル全体 → `docs/DECISIONS.md` → `docs/AUDIT.md`。
- **データの置き場所:** コード・スキーマ・seed・設計は git。学習者の運用データ（進捗・受験・ロープレ・認定）は Supabase。
- **各フェーズ完了時:** `docs/ROADMAP.md` 状態更新／設計判断は `docs/DECISIONS.md`／要確認・負債は `docs/AUDIT.md`。
- **不明な事実は止めて確認:** 推測で実装せず TODO 化し、高橋に質問する。
- **検証を口頭で済ませない:** `typecheck`・`lint`・`unit`・`build`（該当時 E2E）を実際に通してから完了。

## 8. Definition of Done（全PR共通）

- [ ] `typecheck` 0 / `lint` 0 / 関連 `unit` 緑 / `build` 成功
- [ ] トークン準拠（新色・新フォント無し） / loading・empty・error・success の4状態
- [ ] キーボード操作可・フォーカス可視・コントラスト AA・reduced-motion 尊重
- [ ] モバイル（〜380px）で崩れ・横スクロールなし / 秘密情報がフロントに出ていない
- [ ] 事実値は公式URL/確認日に紐づく。不明値は「要確認」表示＋AUDIT 記録
- [ ] ROADMAP / DECISIONS / AUDIT を更新

---

## 9. チーム運用ルール（サブエージェント編成・DEV_TEAM_AND_SKILLS.md §3–§5）

- **レビューゲートを必ず通す:**
  - **UI を書いたら `design-reviewer`** をかける。
  - **DB・認証・鍵に触れたら `security-compliance-auditor`** をかける。
  - **料金/商材/トークの事実値に触れたら `data-integrity-steward`** をかける。
  - **全 PR は `code-reviewer`** を通す。
- **スキルは継承されない。** 実装系サブエージェントを使う前に、関連スキルが各エージェントの `skills:` に入っているか確認する。
- **レビュー/監査系は read-only。** 指摘の反映（編集）は実装系サブエージェントまたは親（デリバリーリード）が行う。
- **マージ条件:** 🔴指摘ゼロ かつ DoD 充足。1件でも🔴があればマージ不可。
- **フェーズ完了時:** `ROADMAP` / `DECISIONS` / `AUDIT` を更新してから閉じる。
- **フェーズ別主担当:** Phase1=supabase / Phase2=frontend+supabase / Phase3=frontend+qa / Phase4=ai-edge+frontend / Phase5=supabase+frontend / Phase6=qa（＋全レビュー）。
- **ボードミーティング:** 各フェーズ開始/終了時に短いボードを回し、議事を `docs/ROADMAP.md` に残す。

### スキル（`.claude/skills/`）

`design-system` / `accessibility` / `react-ts-conventions` / `supabase-rls` / `data-integrity` / `ai-edge-adapter` / `security-compliance` / `testing-standards`

### サブエージェント（`.claude/agents/`）

実装系（write 可）: `frontend-engineer` / `supabase-engineer` / `ai-edge-engineer` / `qa-test-engineer`
レビュー/監査系（read-only）: `design-reviewer` / `code-reviewer` / `security-compliance-auditor` / `data-integrity-steward`
