# ドコモ販売ヘルパー育成アカデミー（DOCOMO Sales Academy）

未経験のヘルパーを **Lv.0 → Lv.10（認定クローザー）** まで段階的に育成する、実践型トレーニング Web アプリの土台です。
座学・理解度テスト・トークスクリプト・ロープレ・AI評価・認定までを一本の道筋に設計しています。

> 本リポジトリは「動く土台（雛形 + DB SQL + seed + 主要画面）」です。管理画面・クイズ受験UI・自由会話ロープレ・PWA Service Worker などは Claude Code での実装を想定したスタブ状態です（詳細は末尾「次工程」）。

---

## 🚀 社内メンバー向け：開発参加ガイド

このリポジトリのリンクを受け取った方は、以下だけで開発を始められます。

### 1. 開発に必要なもの
- [Node.js](https://nodejs.org/)（18以上を推奨）
- Git / GitHub アカウント（このリポジトリへの招待が必要です）
- エディタ（VS Code 推奨）

### 2. 手元で動かす（3分・Supabase不要）
```bash
git clone https://github.com/ktakahashi7755-creator/docomo-sales-academy.git
cd docomo-sales-academy
npm install
cp .env.example .env      # 中身は空のままでOK（デモモードで動きます）
npm run dev               # ブラウザで http://localhost:5173 を開く
```
ログイン画面で役割（研修生／ヘルパー／クローザー／SV／管理者）を選ぶと、ローカルの seed データで即体験できます。**Supabase を設定しなくても UI 開発は進められます。**

### 3. 開発の進め方（ブランチ運用）
`main` は常に動く安定版です。**直接 push せず**、機能ごとにブランチを切って Pull Request でレビュー・マージします。
```bash
git switch -c feature/やること         # 例: feature/quiz-ui
# …実装…
npm run build                          # 型チェック＋ビルドが通ることを確認
git add -A && git commit -m "説明"
git push -u origin feature/やること
```
GitHub 上で Pull Request を作成 → レビュー → `main` にマージ。

### 4. 作業の割り振り
末尾の「次工程」の各項目を GitHub の **Issues** に起票し、担当を割り当てて進めるのがおすすめです。

> 管理者向け: メンバー追加は GitHub リポジトリの **Settings → Collaborators**（または Team）から招待します。`main` は **Settings → Branches** でブランチ保護（PR必須・レビュー1件以上）を推奨します。

---

## 技術構成
- React 18 / TypeScript / Vite
- Tailwind CSS（デザイントークン定義済み）
- React Router
- Supabase（Auth / Postgres / RLS）
- フォント: Poppins（数字・見出し）+ Noto Sans JP（本文）

## クイックスタート（デモモード）
Supabase 未設定でも、ローカル seed データで動作します。

```bash
npm install
npm run dev
```

ログイン画面で役割（研修生／ヘルパー／クローザー／SV／管理者）を選ぶと、デモプロフィールで入れます。

## ビルド / 型チェック
```bash
npm run build      # tsc --noEmit && vite build
npm run typecheck  # 型チェックのみ
npm run preview    # ビルド成果物のプレビュー
```

## 環境変数（`.env`）
`.env.example` をコピーして `.env` を作成します。未設定の場合はデモモードになります。

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_AI_PROVIDER=        # 自由会話・音声ロープレ・AI評価で使用
```

> service_role キーはフロントに置かないこと。AI 呼び出しや採点は Supabase Edge Function 等のサーバー側に置く前提です。

## Supabase 適用
Supabase プロジェクト作成後、SQL Editor で順に実行します。

1. `supabase/migrations/0001_schema.sql` … 全テーブル + `updated_at` トリガ
2. `supabase/migrations/0002_rls.sql`   … RLS ポリシー + 新規ユーザー時の profiles 自動生成
3. `supabase/seed.sql`                  … コース/モジュール/商材/トーク/シナリオ/バッジ/お知らせ

権限モデル（RLS）:
- **admin**: 公開コンテンツ（コース・商材・トーク等）の編集、全データ閲覧
- **sv**: 研修生の進捗・ロープレ・認定の閲覧、認定承認
- **trainee / helper / closer**: 公開コンテンツ閲覧 + 自分のデータのみ

## 商材情報の更新フロー
料金・還元・補償は変更されます。`products.official_url` と `official_checked_at` を正とし、商材一覧では確認日が90日を超えると警告表示します。更新時は `product_versions` に履歴を残す設計です。

> seed の数値は POP（dカード GOLD / PLATINUM 訴求）と整合済みです。GOLD は「割引約6,600円 + ポイント約12,000P = 年間約18,600円相当」。

## ディレクトリ
```
src/
  data/seed.ts          # ローカルseed（フェーズ/商材/トーク/シナリオ/評価/バッジ）
  lib/{types,supabase}  # ドメイン型 / Supabaseクライアント（未設定時は null）
  context/AuthContext   # デモ認証 + 進捗（MVPはメモリ保持）
  components/           # Layout, LevelLadder(署名), ui
  pages/               # Login, Dashboard, Roadmap, Products, ProductDetail,
                       # TalkScripts, TalkScriptDetail, Roleplay, Certification
supabase/
  migrations/0001_schema.sql
  migrations/0002_rls.sql
  seed.sql
docs/
```

## 次工程（Claude Code での実装を想定）
- 管理画面（商材・トーク・クイズ・お知らせの CRUD、product_versions 履歴、ユーザー/権限管理）
- クイズ受験UI（quiz_questions → 採点 → quiz_attempts/progress 反映、合格判定）
- ロープレ会話UI（テキスト/音声の自由会話、AI評価で roleplay_sessions に保存）
- AI 連携（Edge Function 経由。プロバイダ差し替え可能なアダプタ）
- SV ダッシュボード（研修生の進捗・評価・認定承認）
- PWA Service Worker（オフライン対応・インストール）
- 実スクリーンショット/アセットの差し込み、E2E（Playwright）
