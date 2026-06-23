# Provide Growth Academy

未経験・学生・新人スタッフでも直感的に使える、**販売育成カリキュラムの学習プラットフォーム**です。
学習（座学）・確認テスト・実践ロールプレイ・AI評価・進捗管理を1つの SaaS ダッシュボードにまとめています。

> 現在は **フロント完結のデモ**（ブラウザ内メモリ保持）です。データ構造は素朴な配列／Record で持ち、
> 後から Supabase・認証を載せやすい構成にしています。AI は API キー不要のローカル応答（決定的）で動きます。

## 技術構成

- React 18 / TypeScript / Vite
- Tailwind CSS（標準パレット＋ソフトな影 `shadow-card` / `shadow-lift`、角丸 2xl）
- React Router（`/` がメイン。サイドバー＋ヘッダーは全画面で固定）
- Lucide React（アイコン）
- フォント: Poppins（数字・見出し）＋ Noto Sans JP（本文）

## クイックスタート

```bash
npm install
npm run dev        # → http://localhost:5173/
```

ログイン不要で、デモユーザー（山田 花子・研修生）としてそのまま使えます。

## 主な機能（すべて動作します）

- **ダッシュボード** — 現在地・5ステップナビ・現在のカリキュラム・学習ステップ・ゴール・パフォーマンス・スケジュール・学習サポート・おすすめ・成功事例
- **カリキュラム一覧** — 5ステップ × レッスン、進捗・ロック解放
- **学習コンテンツ** — レッスン一覧（ステップで絞り込み）／レッスン詳細（本文・要点・商材ナレッジ・確認テスト/ロープレ導線・完了）
- **実践・ロープレ** — AI顧客と会話 → 終了後に12項目の AI 評価（S〜D）
- **クイズ・テスト** — モジュール別の確認テスト（採点・合否・解説・再受験）
- **進捗レポート** — 完了率・学習時間・テスト正答率・ステップ別進捗・ロープレ評価
- **お知らせ / ヘルプ・FAQ** — 運営連絡とよくある質問
- **AIサポートBot** — 右下/サイドバーからいつでも質問（ローカル応答）

## 構成

```
src/growth/
  data/curriculum.ts      # カリキュラム・テスト・お知らせ・FAQ などのデータ（配列管理・拡張前提）
  context/ProvideContext  # 学習状態（進捗・テスト・ロープレ・学習時間・AIボット）
  components/             # Sidebar / Header / GrowthLayout / AIBot / ダッシュボード各カード / 共通UI
  pages/                  # Dashboard / Curriculum / Content / LessonDetail / Quiz / QuizTake /
                          # Roleplay / RoleplaySession / Reports / Announcements / Help
  lib/bot.ts             # AIサポートBotのローカル応答
src/lib/                 # 採点・進捗・ロープレ評価・AIアダプタ等の純粋ロジック（再利用）
src/data/                # 教材・設問・シナリオのデータ
```

## ビルド / 検証（品質ゲート）

```bash
npm run typecheck     # 型チェック（any 禁止・strict）
npm run lint          # ESLint
npm run format:check  # Prettier 整形チェック
npm run test          # Vitest（ロジック単体＋画面スモーク）
npm run build         # tsc --noEmit && vite build
npm run preview       # ビルド成果物をローカル配信（実機確認用）
npm run e2e           # Playwright E2E（要ブラウザ・CIで実行）
```

CI（`.github/workflows/ci.yml`）が push/PR ごとに `typecheck → lint → format:check → test → build` と E2E を実行します。

## 公開デモ（GitHub Pages）

`main`／開発ブランチへの push で `.github/workflows/pages.yml` がデモモードを配信します。
公開 URL: `https://<owner>.github.io/docomo-sales-academy/`
