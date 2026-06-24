# Provide Growth Academy カリキュラム高度化・階層化 設計方針（V2）

> 出典：高橋からの開発依頼プロンプト＋深掘りリサーチレポート（`deepresearchreport.md`）＋
> 引き継ぎ書（`HANDOFF_CURRICULUM_BRUSHUP.md`）。本書は実装の正典として段階的に更新する。

## 0. ゴール

未経験者が「店内販売ヘルパー → イベント → 外販 → 軒先 → クローザー」へ段階昇格できる
実戦型カリキュラム。商品説明アプリではなく「現場の意思決定を支える営業OS」を目指す。

## 1. 設計原則（保守性）

- **データ分離**：カリキュラム本文（`curriculum.ts`）と商材ナレッジ（`seed.ts`）を二重管理しない。
  変動する数値（料金・還元）は本文に直書きせず、商材マスター参照にする。
- **公式情報の鮮度管理**：商材は `officialUrl` / `officialCheckedAt` / `freshnessStatus` を持ち、
  90日超または未照合は `needs_review`（要確認）。UIで明示する。
- **恒常制度とキャンペーンの分離**：`isCampaign` フラグで分け、期間・条件付き施策を恒常料金と混同しない。
- **コンプラの埋め込み**：単独レッスンで終わらせず、各商材・各工程に `prohibitedClaims`（禁止表現）と
  `complianceNotes`（注意）を持たせ、該当箇所で表示する。

## 2. 絶対ルール（非交渉）

- 事実を捏造しない。料金・還元・補償・キャンペーン条件は公式URL＋最終確認日を正とする。
- 「必ず安くなる」「絶対お得」「誰でも対象」「ずっとこの金額」「実質0円」「どこでも使える」等の断定禁止。
- 条件付き料金は「条件を満たした場合」「実質」「要確認」と明記。キャンペーンは恒常制度と分ける。
- パスワード・認証コードは必ずお客様ご自身が入力。代理入力の導線・説明を作らない。
- 個人情報は必要最小限。他社批判をしない。高齢者・外国籍のお客様には理解確認を増やす。
- dカード・端末購入プログラムは審査・返却・残価・早期利用料などの条件を省略しない。
- 絵文字を使わない。未経験者に分かる言葉で、内容はプロレベルに。

## 3. 実装フェーズと状態

| Phase | 内容                                                                               | 状態     |
| ----- | ---------------------------------------------------------------------------------- | -------- |
| A     | 商材マスター基盤（鮮度/キャンペーン/禁止表現/コンプラ・新商材・要確認UI）          | **完了** |
| B     | 標準販売プロセス(15工程)・場面別トーク集・ヒアリング項目・反論処理集の分離データ化 | **完了** |
| C     | 全19レッスン本文の深掘り（チャネル差・条件付き表現・コンプラ注記）                 | **完了** |
| D     | 確認テスト強化（各レッスン3問以上・コンプラ100点）。ロープレ評価は既存12項目で充足 | **完了** |
| E     | 現場ガイドに評価ルーブリック・育成ロードマップを追加。設計ドキュメント整備         | **完了** |

> UI階層化は現場ガイド（`/field-guide`・5タブ）＋レッスン詳細の3階層化で実現。
> SV評価ルーブリックは `src/growth/data/rubric.ts`（12観点＋育成10段階）。AIロープレ評価は
> seed の `EVAL_ITEMS`（12項目）が要件を満たすため、データ拡張は据え置き。

## 4. データ構造（拡張方針）

### 4-1. 商材マスター（`Product` / `seed.ts`）— Phase A 実装済み

追加フィールド（すべて任意＝既存非破壊）：

- `freshnessStatus?: "verified" | "needs_review"`（未指定は `officialCheckedAt` から90日で判定）
- `isCampaign?: boolean`（恒常制度と分離）
- `prohibitedClaims?: string[]`（言ってはいけない断定・誤認表現）
- `complianceNotes?: string[]`（本人入力・条件省略禁止などの注意）

鮮度判定の純粋関数：`src/lib/product.ts` の `freshnessOf(product, todayISO)` / `needsReview(...)`。

新商材（要確認・公式URL付き）：`ahamo` / `eximo-irumo`（比較用・受付終了）/ `kaedoki` /
`kaedoki-plus`。研究レポート由来の数値はすべて「要確認」として扱う。

### 4-2. 標準販売プロセス（Phase B 予定・新規データ）

15工程：事前準備 / 立ち位置・アイキャッチ / ファーストキャッチ / 足止め / ライトヒアリング /
課題発見 / メリット提示 / 深掘りヒアリング / 試算・比較 / 反論処理 / 着座誘導 /
クローザー引き継ぎ / 申込前確認 / お見送り / 日報・振り返り。
各工程：`purpose / customerMindset / staffAction / talkExamples / ngExamples / rookieMistakes / svEvaluationPoints`。

### 4-3. 場面別トーク集（Phase B）

15シーン（店内展示/料金相談/イベント通過/軒先/家族連れ/高齢/外国籍/他社長期/端末古い/
料金高い/家ネット遅い/カード抵抗/他社経済圏/家族相談/見るだけ）。
各：`scene / objective / script[] / intent / salesTechnique / ngExpression / rookieExplanation / advancedTip / relatedLessons`。

### 4-4. ヒアリング項目（Phase B）

19項目（キャリア〜本当は変えたいこと）。各：`purpose / naturalQuestion / deepDiveQuestions /
proposalDirectionByAnswer / prohibitedQuestion / complianceNotes / relatedProducts / relatedLessons`。

### 4-5. 反論処理集（Phase B）

17反論。基本型＝受け止める→本音特定→条件付きで見直す→小さな次アクション。
各：`objection / customerRealIntent / acceptancePhrase / ngResponse / goodResponse /
deepDiveQuestion / closeConnection / rookieExplanation / advancedExplanation / relatedScenarioIds`。

### 4-6. レッスン拡張（Phase C・`Lesson` 型）

既存（body/keyPoints/tip/examples/talkScript/mistakes/practice）に加え、任意で
`fieldContext`（現場前提）/ `channelDifferences`（店内・イベント・外販・軒先の差）/
`complianceNotes` / `completionCriteria` / `evaluationRubric` を持てるよう拡張する。

### 4-7. AIロープレ（Phase D）/ 確認テスト（Phase D）/ SVルーブリック（Phase E）

リサーチレポートのシナリオ表・評価項目を `seed.ts` の `SCENARIOS` / `EVAL_ITEMS` と整合させ拡張する。

## 5. UI 方針（Phase E）

Step Progress / Lesson Overview / Key Point / Field Context / NG-Good Compare /
Talk Script Chat / Product Knowledge（鮮度・要確認・キャンペーン表示）/ Compliance Warning Box /
Practice Task / AI Roleplay CTA / Completion Criteria / SV Evaluation Rubric。
デザインは現状の Provide 基調を固定し、中身の階層を増やす。

## 6. 要確認事項（高橋へ）

- 商材の最新数値（特に `needs_review` の `dcard-*` / `hikari-*` / `denki` / `gas` / 新商材）は
  公式で再確認し、確認日と最新値を共有いただけると `officialCheckedAt` と本文を更新できる。
- PI の社内KPI定義は現場により差があるため、明文化が必要（教材に反映する）。
- キャンペーン（ドコモ光ワンコイン等）の対象期間・条件は流動的。期限管理の運用方針を決めたい。
