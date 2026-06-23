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

## ADR-0009: コンテンツは ContentContext 経由（学習側が編集を即時反映）

- **日付:** 2026-06-23（Phase 2）
- **Context:** 管理画面の編集が学習側に反映される必要（DoD）。だが学習コンテンツは `src/data/seed.ts`（テキストキー）で、DB の `products` 等とはスキーマが異なり未整合（Phase 1 の progress と同じ構造的ギャップ）。
- **Decision:** `ContentContext` を導入し、学習側（Products/ProductDetail/Dashboard のお知らせ）はここを読む。デモモードは seed 初期値＋メモリ保持で編集が即時反映。バックエンド接続時は同インターフェースで Supabase の `products`/`product_versions`/`announcements` と監査 RPC に差し替える（DB↔フロントのスキーマ写像は Phase 2 バックエンド統合で実施・AUDIT 追跡）。
- **Consequences:** デモで DoD（編集→履歴→学習側反映）を完全検証可能（smoke テスト）。事実値は管理者入力をそのまま保存し捏造しない。`applyProductEdit` 等は純粋関数＋Vitest。

## ADR-0010: 管理画面は UI ガード＋RLS の二重防御、監査はサーバー側書込

- **日付:** 2026-06-23（Phase 2）
- **Context:** 非管理者を `/admin` から排除し、`audit_logs` の書込はサーバー側に限定する必要。
- **Decision:** UI は `RequireAdmin`（admin 以外は `/` へ）。DB は既存 RLS（`products`/`announcements` は `is_admin()` で書込）。`audit_logs` は insert ポリシーを置かず、`log_audit` SECURITY DEFINER 関数（migration 0004、内部で `is_admin()` 検査・`user_id=auth.uid()` 強制）経由でのみ記録する。
- **Consequences:** UI と DB の二重防御。監査のクライアント直接 insert は RLS で拒否。検証は `supabase/tests/rls_admin_audit.sql`。

## ADR-0011: プロダクト全体のトーン（人手感・明るさ・絵文字不使用）

- **日付:** 2026-06-23
- **Context:** 「AI 感を無くし、安っぽくせず明るく、絵文字は使わない」方針。
- **Decision:** UI コピーは販売現場の能動的で具体的な日本語にし、定型的な AI 文体を避ける。アイコンは lucide の線画のみ（絵文字不使用）。配色は既存トークン（白基調＋ネイビー＋点のアクセント）を保ちつつ、空・成功・お知らせを明るく前向きな文言にする。ドキュメント・コミット・チャット応答でも絵文字を使わない。
- **Consequences:** 一貫した端正なトーン。重大度表記など内部運用の記号は文字（必須/要修正/提案）で表す。

## ADR-0012: クイズエンジンは純粋採点＋進捗反映、バッジは進捗から導出

- **日付:** 2026-06-23（Phase 3）
- **Context:** 受験→採点→進捗反映→合格判定を一気通貫にし、採点ロジックを境界値テスト可能にする必要。
- **Decision:** 採点は `lib/quiz.ts` の純粋関数（`gradeQuiz`/`isAnswerCorrect`/`allAnswered`）に分離。合否は `lib/progress.isPassed(score, module.passing_score)`。提出時に `setModuleScore`（best score 保持）で進捗を更新し、Roadmap/Dashboard に反映。`b-first` バッジは進捗から自動導出（ADR-0006）で別ストア不要。設問は `src/data/quiz.ts`（事実は正典準拠）。複数選択は集合一致で採点。
- **Consequences:** 境界値 79/80/89/90/99/100 を採点パイプライン経由で Vitest 検証。再受験は best score を下げない。クイズ未整備モジュールは受験導線を出さない（ErrorState）。`quiz_attempts` への保存は backend 接続時（AUDIT 追跡）。

## ADR-0013: ロープレはアダプタ＋モック／Edge、評価は振る舞いのみ採点

- **日付:** 2026-06-23（Phase 4）
- **Context:** ロープレ会話と AI 評価を実装するが、(1) AI プロバイダの API キーをフロントに出せない、(2) デモ（Supabase 未設定）でも体験・検証可能にしたい、(3) 評価で料金・還元などの事実値を捏造させたくない。
- **Decision:**
  - `RoleplayProvider`（`opening`/`reply`/`evaluate`）インターフェースの背後を、デモは `mockProvider`（`lib/roleplay.ts` の決定的ロジック・キー不要）、本番は `edgeProvider`（`supabase.functions.invoke("roleplay")` 経由）に差し替える。切替は `lib/ai/index.ts` の `getRoleplayProvider()` 1 箇所のみ（`isBackendEnabled` で分岐）。
  - AI キーは Edge Function（`supabase/functions/roleplay`）の `Deno.env` だけで扱い、フロントは anon キーで invoke するのみ。プロバイダ・アダプタ（Anthropic/OpenAI）で差し替え可能。
  - 評価（`evaluateRoleplay`）は**会話の振る舞い**（挨拶・ヒアリング・提案・反論処理・クロージング・コンプラ等）をシグナル語のヒューリスティックで採点し、金額の正誤は判定しない。コンプラ項目は原則満点で「代理入力」等の違反語を大幅減点、本人確認の言及を加点。Edge 側もシステムプロンプトで「数値は断定せず公式確認を促す／事実を創作しない」を固定。
  - ランク閾値は `lib/progress.ts` の `GRADE_THRESHOLDS` に単一化し、`gradeOf` と表示凡例 `GRADE_LEGEND` を同一の正から導出（旧 D-N14 解消）。
- **Consequences:** デモでテキストロープレ→評価まで DoD を実検証可能（smoke）。キーはサーバー側のみ。評価は事実を捏造しない。音声と本番 AI は backend 接続後に有効化。Edge Function の CORS 限定・入力検証・レート制御・JWT 必須・結果永続化（`roleplay_sessions`）は有効化前に対応（AUDIT 追跡）。

## ADR-0014: 認定は自動判定を材料に SV 承認で確定、承認はサーバー側 RPC で冪等に

- **日付:** 2026-06-23（Phase 5）
- **Context:** クローザー認定（Lv.10）を、推測で達成にせず（ADR-0006）、かつ越権なく確定させる必要。ロープレ評価系の条件（c2,c4–c9）は評価の蓄積が前提でまだ自動追跡できない。
- **Decision:**
  - 認定条件は **進捗から客観導出できるもの（c1 全必須合格・c3 コンプラ100）を自動判定**し、SV 承認の前提（`REQUIRED_AUTO_CONDITION_IDS`）とする。ロープレ系は `isPendingEvaluation` で「評価蓄積待ち・SV判断」と明示し、自動で達成にしない。最終的な Lv.10 は **SV 承認（人手）** で確定（c10）。
  - 判定は `lib/certification.ts` の純粋関数（`certificationReadiness`/`canApprove`）に集約し、UI（SvDashboard/SvTraineeDetail/Certification）は結果を表示するだけにする。境界（99/100・必須欠落）を Vitest 検証。
  - SV 承認は UI ガード（`RequireSv`：sv/admin 以外は `/`）＋サーバー側の二層防御。承認はサーバー側 RPC `approve_certification`（migration 0005・SECURITY DEFINER・`is_sv_or_admin()` 検査）で、(1) certifications を `(user_id, certification_type)` 一意制約で **冪等に upsert**、(2) profiles.level=10、(3) audit_logs 記録、を1トランザクションで行う。SV は profiles を直接更新できず（admin only ポリシー）、この経路に限り level を確定する。`search_path=public, pg_temp` 固定・`auth.*` はスキーマ修飾・public revoke / authenticated grant。
  - デモは `CertificationContext`（メモリ・承認で Lv.10化）で完結し DoD を検証。backend 接続時は同インターフェースで profiles/progress/certifications（SV用 RLS）と RPC に置換。
- **Consequences:** 二重承認は純粋関数（`canApprove`）・Context（level<10 ガード）・DB（一意制約）の三層で防止。承認は監査に残る。評価永続化（Phase 4/backend）後に c2/c4–c9 を自動判定へ拡張できる。

## ADR-0015: 仕上げ — 公開デモ配信・手書き SW の PWA・役割限定ツリーの遅延読込

- **日付:** 2026-06-23（Phase 6）
- **Context:** 実機（スマホ）で確認できる公開リンクが必要。セッションは使い捨てコンテナで localhost を外部公開できない。あわせて PWA 化・初期バンドル軽量化を進める。
- **Decision:**
  - **配信:** バックエンド不要で動くデモモードを GitHub Pages（`actions/deploy-pages`）へ静的配信。ビルドに Supabase env を渡さず（`supabase=null`＝デモ）、anon/サービス/AI いずれの鍵もバンドルに含めない。SPA 直リンク対策に `index.html`→`404.html` を複製。サブパス配信のため `base`（`PAGES_BASE`）と `BrowserRouter basename`（`BASE_URL` 末尾スラッシュ除去で既定 "/" は ""）を対応。
  - **PWA:** 依存追加を避け、`public/sw.js` を手書き。ナビゲーションは network-first（更新優先・オフライン時は app shell）、同一オリジン資産は stale-while-revalidate（ハッシュ無し資産も次回反映＝CACHE 名の手動更新に非依存）、非GET・クロスオリジンは非キャッシュ（Supabase API/トークンに触れない）。登録は本番ビルドのみ（dev/テストは無効）。app shell はユーザー非依存・データは実行時取得（クライアントレンダリング）を前提とし、将来 SSR でユーザーデータを HTML へ埋め込む場合は SW のシェルキャッシュを再監査する。
  - **性能:** 役割限定で利用頻度の低い SV/管理画面のみ `React.lazy` で分割（学習者の初期 JS から除外）。学習者の主要ページと Login/Dashboard は eager。Suspense フォールバックは各レイアウトの Outlet に置き、ナビ chrome を保つ。
- **Consequences:** スマホで開ける実機リンクを提供。初期 JS が ~95.7KB gzip（予算180KB内）。秘密非露出・SW のキャッシュ安全性は監査済み。Lighthouse 実測は CI/実機で継続。

## ADR-0004: 検証は「実機ビルド＋ビジュアル」で担保

- **日付:** 2026-06-23
- **Context:** 「実機確認できる成果物」が要件。口頭の「動くはず」を排する。
- **Decision:** Playwright で production preview を起動し、9画面を mobile/desktop でスクリーンショット取得。`dist/` を実行可能成果物とする。検証は typecheck/lint/unit/build を1周として複数周回す。
- **Consequences:** 退行を視覚・機械の両面で検出。成果物はビルド＋スクショ＋（任意で）デプロイ。
