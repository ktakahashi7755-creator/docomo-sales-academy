# 実装完了報告 — カリキュラム高度化・階層化（V2 / Phase A〜E）

## 1. 実施したこと

Provide Growth Academy を「商品説明アプリ」から「現場の意思決定を支える営業OS」へ。
深掘りリサーチと引き継ぎ書をもとに、商材マスターの保守性基盤、現場で引ける実戦コンテンツ、
レッスンの深掘り、確認テスト強化、SV評価ルーブリックまでを段階的に実装した。

## 2. 更新した主なファイル

- 商材マスター：`src/lib/types.ts`・`src/data/seed.ts`・`src/lib/product.ts`（+test）
- 実戦コンテンツ：`src/growth/data/{salesProcess,scenes,hearingItems,objections,rubric}.ts`
- UI：`src/growth/pages/FieldGuide.tsx`（5タブ）・`src/growth/pages/LessonDetail.tsx`（3階層化）
- レッスン：`src/growth/data/curriculum.ts`（Lesson 型拡張＋投入）
- テスト：`src/growth/fieldGuide.test.ts`・`src/data/quiz.ts`・`src/growth/growth.test.tsx`
- ドキュメント：`docs/CURRICULUM_V2_DESIGN.md`・`docs/AUDIT.md`・本書

## 3. カリキュラム改善内容

- 全19レッスンに、会話台本・失敗リカバリー・実践課題（前段）に加え、現場の前提・
  チャネル別の違い（店内/イベント/外販/軒先）・コンプライアンス注意を追加
- 標準販売プロセス15工程・場面別トーク15・ヒアリング19項目・反論処理17を分離データ化し、
  「現場ガイド」から引ける形に
- 確認テストを現場判断型（NG/Good選択・条件付き料金・コンプラ判断・引き継ぎ不足）で強化、
  各レッスン3問以上・コンプラ100点を維持

## 4. 追加したデータ構造

- `Product`：`freshnessStatus` / `isCampaign` / `prohibitedClaims` / `complianceNotes`
- `Lesson`：`fieldContext` / `channelDifferences` / `complianceNotes`
- 新規：`SalesProcessStep` / `SceneScript` / `HearingItem` / `ObjectionCard` / `RubricItem` / `GrowthStage`
- 新商材：`ahamo` / `eximo-irumo`（比較用・受付終了）/ `kaedoki` / `kaedoki-plus`（要確認）

## 5. UI改善内容

- 「現場ガイド」（`/field-guide`・5タブ：販売プロセス/場面別トーク/ヒアリング/反論処理/評価・育成）
- レッスン詳細を3階層化（白カード=主役／フラットtinted=補助／オレンジ枠=コンプラ最重要）
- 商材カードに「要確認」「キャンペーン」バッジと「言ってはいけない表現」ボックス
- チャットUIによる会話台本、NG/Good比較カード、コンプラ警告ボックス

## 6. コンプライアンス対応

- 料金・還元・補償・キャンペーン条件は公式URL＋最終確認日に紐付け、要確認は明示
- 「必ず安くなる」「実質0円」「どこでも使える」等の断定・誇張は禁止表現として明文化・テスト化
- パスワード・認証コードは本人入力を全工程で維持。詳細個人情報の早期取得をNG化
- 端末購入プログラムは残価・返却・早期利用料の条件を省略しない方針を明記
- 恒常制度とキャンペーンを `isCampaign` で分離

## 7. 注意点・要確認事項

- `needs_review` の商材（新商材・dカード系・光1G・でんき・ガス）は公式での再確認待ち。
  確定値＋確認日をいただければ `verified` 化・本文更新する（AUDIT A-D10/A-D11/A-D12/A-D13）
- quiz.ts の数値は seed と単一ソース化されておらず文字列複製（H-Q1 継続課題）
- PI の社内KPI定義は現場差があり、明文化が必要

## 8. 実行した品質確認（最終）

- typecheck: 0 エラー
- lint: 0 エラー
- test: 119 passed（unit＋スモーク）
- build: 成功
- レビュー：data-integrity 🟢（A〜E 全🔴/🟡ゼロ）／design 🔴は各フェーズで修正済み／
  code 🔴は各フェーズで修正済み

## 9. 次にやるべきこと

- 商材数値の公式再確認と `officialCheckedAt` 更新（要確認の解消）
- quiz/seed の事実値の単一ソース化（H-Q1）
- SVダッシュボード（実データ）・Supabase 連携（進捗の永続化・本認証）
- AIロープレの自動採点を rubric.ts の12観点に明示マッピング
  </content>
