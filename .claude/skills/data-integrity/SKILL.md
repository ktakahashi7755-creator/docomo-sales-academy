---
name: data-integrity
description: 料金・還元・補償・仕様など事実値に触れる実装やレビュー時に必ず使用。正典の数値、official_checked_at、捏造禁止・要確認運用、product_versions履歴の規律を提供する。
---

# Data Integrity（事実の正典）

`CLAUDE.md` §3 と `src/data/seed.ts` / `supabase/seed.sql` が実体。**事実を捏造しない。**

## 正典の数値（dカード GOLD / PLATINUM）

- **GOLD: 割引約6,600円 ＋ ポイント約12,000P ＝ 年間約18,600円相当**（POP 準拠、年会費 11,000円）。
- **PLATINUM 切替: 11,000円が相殺され、実質18,700円**で初年度お試し。合わなければ GOLD に戻せる。
- seed・UI・トークの数値はこの正典と一致させる。内訳（6,600 / 12,000）と合計（18,600）の整合を崩さない。

## 出典・鮮度

- 料金・還元・補償・仕様は `products.official_url` と `official_checked_at`（YYYY-MM-DD）を正とする。
- 90日を超えた `official_checked_at` は鮮度警告対象。値を更新したら確認日も更新する。

## 不明値の扱い（推測禁止）

- 確定できない値は**それらしい数字を置かない**。UI に「**要確認**」を表示し、`docs/AUDIT.md` に TODO を記録。
- 迷ったら止めて高橋に質問する。推測実装で先に進めない。

## 履歴

- 商材の事実値を変更したら `product_versions` に before/after を記録し、`official_checked_at` を更新する。
