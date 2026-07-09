# 詳細設計書 — Provide Growth Academy

| 項目     | 内容                  |
| -------- | --------------------- |
| 文書番号 | PGA-DD-001            |
| 版数     | 1.0                   |
| 作成日   | 2026-07-09            |
| 上位文書 | 基本設計書 PGA-BD-001 |

---

## 1. ディレクトリ構成

```
src/
├── App.tsx                     # Provider＋入室ゲート＋Router
├── router.tsx                  # ルーティング（GrowthLayout配下）
├── growth/                     # Provide Growth Academy 本体
│   ├── assets/provide-mark.png # ブランドマーク
│   ├── components/             # Layout/Sidebar/Header/カード群/AIBot/ui(共通)
│   ├── context/ProvideContext.tsx
│   ├── data/                   # curriculum/salesProcess/scenes/hearingItems/objections/rubric
│   ├── lib/bot.ts              # ローカルBot応答
│   └── pages/                  # Entry + 12画面
├── data/                       # seed(商材正典)/quiz(設問)/sv(SVデモ名簿)
└── lib/                        # types/quiz採点/roleplay/progress/product(鮮度)/ai
```

## 2. 型定義（主要インタフェース）

### 2.1 教材（`growth/data/curriculum.ts`）

```ts
interface Lesson {
  id: string;
  stepId: string;
  no: number;
  title: string;
  summary: string;
  minutes: number;
  body: string[]; // 本文（3〜4段落）
  keyPoints: string[]; // この回のポイント（3〜5）
  tip?: string; // 現場のひとこと
  fieldContext?: string; // 現場の前提
  examples?: { ng: string; good: string };
  talkScript?: TalkLine[]; // 会話で学ぶ（注釈付き）
  channelDifferences?: { channel: "店内" | "イベント" | "外販" | "軒先"; point: string }[];
  mistakes?: { mistake: string; fix: string }[];
  complianceNotes?: string[];
  practice?: string; // 実践課題
  quizModuleId?: string; // data/quiz のモジュール
  scenarioId?: string; // seed SCENARIOS
  productIds?: string[]; // seed PRODUCTS（商材ナレッジ差込）
}
interface TalkLine {
  role: "staff" | "customer";
  text: string;
  note?: string;
}
interface CurriculumStep {
  id: string;
  no: number;
  title: string;
  subtitle: string;
  duration: string;
  icon: GrowthIcon;
  accent: Accent;
  goalHeading: string;
  goalDescription: string;
  checklist: { text: string; lessonId?: string }[]; // レッスン完了に連動
  recap: string; // 章末まとめ
  lessons: Lesson[];
}
```

### 2.2 商材マスター（`lib/types.ts`）

```ts
interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  tier?: "regular" | "gold" | "platinum";
  oneLiner: string;
  target: string;
  benefits: string[];
  warnings: string[];
  timing: string;
  hearing: string[];
  pitch: string[];
  objections: { q: string; a: string }[];
  closing: string;
  officialUrl: string;
  officialCheckedAt: string; // YYYY-MM-DD
  version: number;
  freshnessStatus?: "verified" | "needs_review"; // 省略時は90日判定
  isCampaign?: boolean; // 恒常/キャンペーン分離
  prohibitedClaims?: string[]; // 言ってはいけない表現
  complianceNotes?: string[];
}
```

### 2.3 状態（`ProvideContext`）

```ts
interface ProvideState {
  user: { name: string; role: string };
  entered: boolean; // 入室ゲート
  lessonProgress: Record<string, number>; // lessonId -> 0..100
  quizScores: Record<string, number>; // moduleId -> best
  roleplayResults: RoleplayResult[];
  studyMinutes: number;
  botOpen: boolean;
  // actions
  enter(name?: string): void;
  logout(): void;
  startLesson(id: string): void;
  completeLesson(id: string): void;
  recordQuiz(moduleId: string, score: number): void;
  recordRoleplay(r: Omit<RoleplayResult, "id" | "date">): void;
  openBot(): void;
  closeBot(): void;
  // selectors（純粋）
  lessonStatus(id): "completed" | "in-progress" | "not-started";
  stepProgress(stepId): number;
  overallProgress: number;
  currentLesson: Lesson | null;
  quizAverage: number | null;
}
```

永続化キー：`provide.entered` / `provide.userName`（localStorage、例外安全な read/write ラッパ経由）。
**M2置換方針**：actions/selectorsの契約は不変のまま、実装をSupabaseリポジトリへ差し替える。

## 3. 主要ロジック（純粋関数・全て単体テスト済み）

| 関数                             | 場所                | 仕様                                                                                      |
| -------------------------------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `gradeQuiz(questions, answers)`  | `lib/quiz.ts`       | 完全一致採点（複数選択は集合一致）。0..100丸め。境界値79/80/89/90/99/100テスト            |
| `isPassed(score, passing)`       | `lib/progress.ts`   | `score >= passing`。undefined→false                                                       |
| `freshnessOf(product, todayISO)` | `lib/product.ts`    | 明示`freshnessStatus`優先→`officialCheckedAt`から90日超で`needs_review`。不正日付は安全側 |
| `stepStatus(step, stepProgress)` | `ProvideContext`    | 100%→completed／前ステップ未完了かつ0%→locked／他→in-progress                             |
| `evaluate(transcript)`           | `lib/roleplay.ts`   | 12観点の決定的ヒューリスティック評価（M4でEdge Functionに置換、I/F同一）                  |
| `botReply(text)`                 | `growth/lib/bot.ts` | 先頭一致ルール16件＋フォールバック。キーワード衝突は回帰テストで保護                      |

## 4. 画面詳細（代表：レッスン詳細 SCR-004）

### 4.1 表示ブロックと出し分け

| 順  | ブロック                                                 | 出現条件                      | 視覚階層                                                        |
| --- | -------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------- |
| 1   | 戻るリンク／PageHeader（STEP内位置 n/total・状態バッジ） | 常時                          | —                                                               |
| 2   | 現場の前提                                               | `fieldContext`                | フラット（slate-50・影なし）                                    |
| 3   | 本文＋この回のポイント                                   | 常時／`keyPoints.length>0`    | 白カード（主役）                                                |
| 4   | チャネル別の違い                                         | `channelDifferences.length>0` | フラット                                                        |
| 5   | コンプライアンス注意                                     | `complianceNotes.length>0`    | オレンジ左枠（唯一の警告カード）                                |
| 6   | 現場のひとこと／NG・Good                                 | `tip`／`examples`             | 白カード                                                        |
| 7   | 会話で学ぶ（チャットUI）                                 | `talkScript.length>0`         | 白カード。staff=右/blue、customer=左/slate、note=amber電球      |
| 8   | よくある失敗とリカバリー／実践課題                       | `mistakes`／`practice`        | 白カード／teal左枠                                              |
| 9   | 商材ナレッジ                                             | `productIds` 解決結果>0       | 要確認/キャンペーンバッジ・禁止表現ボックス・公式リンク(確認日) |
| 10  | 実践導線（テスト/ロープレ）＋現場ガイド導線              | 各ID存在時／STEP→タブ対応表   | ホバーカード                                                    |
| 11  | 完了・前後移動                                           | 常時                          | success時 `role=status aria-live=polite`                        |

### 4.2 現場ガイド導線の対応表

`step-1→process / step-2→hearing / step-3→scenes / step-4→objections / step-5→rubric`（`/field-guide?tab=`、無効値はprocessへフォールバック）

## 5. ルーティング・ゲート

```
App = ProvideProvider > Gate
Gate: entered=false → <Entry/>（Router外・URL保持）
      entered=true  → BrowserRouter(basename=BASE_URL) > GrowthLayout > 各画面
未知URL: "*" → "/"
```

- 深いURL（例 `/content/l3-2`）で未入室の場合：入室後にそのURLへそのまま到達（Routerを遅延マウントするため）
- GitHub Pagesサブパス：`vite base=PAGES_BASE` → `basename` に伝播。404.htmlでSPAフォールバック

## 6. エラー・例外設計

| ケース                                 | 挙動                                                 |
| -------------------------------------- | ---------------------------------------------------- |
| 不正lessonId/moduleId/scenarioId       | 「見つかりません」カード＋一覧への導線（empty状態）  |
| localStorage不可（プライベートモード） | メモリ内動作にフォールバック（入室は可能・永続なし） |
| 商材鮮度の日付不正                     | `needs_review` 扱い（安全側）                        |
| Bot未マッチ                            | 定型フォールバック応答（キーワード候補を提示）       |
| AI評価失敗（M4）                       | ローカル決定的評価へフォールバックし、その旨を表示   |

## 7. テスト設計フック

- data整合テスト：クイズID一意・correct範囲内・モジュール件数／レッスン→テスト網羅（全19・各3問以上・p1m4=100点）／現場ガイド件数・ID名前空間（`fg-obj-*`）
- スモーク（jsdom）：入室→全タブ→レッスン完了→クイズ合格→Bot応答→ログアウト
- E2E（実ブラウザ2プロファイル）：入室/氏名反映/ナビ/完了/Bot/ログアウト。ロケータは`:visible`・`exact`で決定的に
- 詳細はテスト仕様書 PGA-QA-001

## 8. 命名・コーディング規約（抜粋）

- コンポーネント＝PascalCase、データ定数＝UPPER_SNAKE、ID＝kebab（`l3-2`/`fg-obj-*`/`scene-*`）
- `any`禁止。map keyにindex単独を使わない（複合キー可）。未使用importゼロ（ESLintで強制）
- 文言：絵文字禁止・能動態・断定表現禁止（「必ず」「絶対」「誰でも」「実質0円」等）
- コミット：Conventional Commits。マージ条件＝レビュー🔴ゼロ＋DoD
