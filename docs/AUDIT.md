# AUDIT — 要確認事項・技術的負債・TODO

> 推測で埋めない事実値、レビュー指摘、負債をここに集約。解消したらチェックして日付を残す。
> 重大度: 🔴 必須 / 🟡 要修正 / 🟢 提案。

## A. データ整合（data-integrity）

- [ ] **A-D1 🟡** seed の各商材 `official_url` / `official_checked_at` が実在URL・実確認日かを精査。デモ用の仮値が混じる可能性。実値確定まで「要確認」運用。（→ 高橋確認）

## B. セキュリティ／コンプライアンス（後続フェーズで実装）

- [ ] **B-S1** Phase 1: Supabase 本認証移行時、anon キーのみフロント、`service_role`/AIキーはサーバー側に限定。
- [ ] **B-S2** Phase 2: `audit_logs` の書込はサーバー側関数/Edge Function 経由（フロント直 insert 禁止）。
- [ ] **B-S3** Phase 4: AI/STT/TTS キーはクライアントバンドルに含めない（dist で検証）。
- [ ] **B-S4** パスワード・認証コードは「お客様自身が入力」のフロー/文言を維持。

## C. デザイン／UX レビュー指摘（design-reviewer 2026-06-23）

### 🔴 Phase 0 で対応

- [ ] **C-R1 🔴** ボトムナビのタップ領域 44px 未満（`Layout.tsx`）。`min-h` で床を確保。
- [ ] **C-R2 🔴** ボトムナビのラベル `text-[10px]`＋`ink-muted` がトークン外＆コントラスト/可読性不足。`text-xs`＋`ink-soft` 以上へ。
- [ ] **C-R3 🔴** 4状態（loading/error）が全画面で欠落。`ui.tsx` に Skeleton/ErrorState/EmptyState を追加し receiver を用意（本格運用は Phase 1）。
- [ ] **C-R4 🔴** Roleplay「テキスト開始」が死にボタン（`Roleplay.tsx`）。遷移 or disabled＋理由表示へ。
- [ ] **C-R5 🔴** Login に loading/error/二重遷移ガードが無い（`Login.tsx`）。pending UI とエラー領域を用意。

### 🟡 Phase 0〜1 で対応

- [ ] **C-Y1 🟡** LevelLadder「次の一段」(`current+1`)が未強調。署名要素の核心。
- [ ] **C-Y2 🟡** LevelLadder コネクタ線に進捗が乗らない（done区間も灰色）。
- [ ] **C-Y3 🟡** LevelLadder を `ol/li`＋`aria-current="step"` で意味付け。
- [ ] **C-Y4 🟡** 難易度 range のフォーカス可視・つまみ44px・目盛り（`Roleplay.tsx`）。
- [ ] **C-Y5 🟡** シナリオ選択トグルに `aria-pressed`（`Roleplay.tsx`）。
- [ ] **C-Y6 🟡** カード全体リンクのフォーカス輪郭を `rounded-xl2` に合わせる／`hover:shadow-lift` 抑制（`TalkScripts.tsx`）。
- [ ] **C-Y7 🟡** ページ見出しを `PageTitle` に統一（手書き eyebrow の重複解消）。
- [ ] **C-Y8 🟡** Certification 獲得/未獲得バッジを区別（gold 点灯 / ロック）。
- [ ] **C-Y9 🟡** Certification 未達条件に該当画面への導線（次の一段）。
- [ ] **C-Y10 🟡** Roleplay 既定シナリオの添字マジックナンバーを意味ベース指定へ。
- [ ] **C-Y11 🟡** 詳細画面の戻りリンクが44px未満（`ProductDetail.tsx`/`TalkScriptDetail.tsx`）。
- [ ] **C-Y12 🟡** ScoreChip/TierBadge/デモバナーの小文字コントラスト AA 実測。

### 🟢 提案

- [ ] **C-G3 🟢** `ProgressBar` の `duration-500` が 250ms 上限超過。300ms 以内へ。
- [ ] **C-G1 🟢** Dashboard「おすすめロープレ」難易度のハードコード二重管理をデータ駆動に。

## D. コード品質（code-reviewer 2026-06-23）

- （code-reviewer の指摘を反映予定）

## E. 性能・PWA（Phase 6）

- [ ] **E-P1** 初回 JS 予算 ~180KB gzip 目標、Lighthouse 90+ を計測し記録。現状ベースライン: JS 215.55KB / gzip 71.13KB（2026-06-23 build）。
