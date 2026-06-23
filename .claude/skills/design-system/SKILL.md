---
name: design-system
description: UIの実装・レビュー時に必ず使用。配色トークン、タイポ、Excellence Rubric（4状態/モーション/署名要素 LevelLadder/モバイル人間工学/コピー規範）を提供する。
---
# Design System & Excellence Rubric

`CLAUDE.md` §4・§5 と `tailwind.config.js` を正典として要約。**新色・新フォントを足さない。**
迷ったら `pages/Dashboard.tsx` / `components/LevelLadder.tsx` / `components/ui.tsx` の質感に合わせる。

## 色トークン（tailwind 由来のみ使う）
- `ink` #0B1F3A / soft #33425A / muted #6B7688（構造・本文）
- `paper` #FFFFFF / soft #F7F8FA / line #E7EAF0
- `accent` #E8131D / soft #FBE7E8 … ドコモ赤は**点で最小限**（面で塗らない）
- `gold` #B8893C / soft #F6EFE0 / deep #8C6726（GOLD） ・ `platinum` #737B88 / soft #EEF0F3 / deep #4C535E
- 状態: `pass` #1F8A53(soft #E5F3EB) / `caution` #C98A00(soft #FBF1DA) / `fail` #C0392B(soft #FBE9E7)
- 角丸 `rounded-xl2`(1.125rem) 基調 / 影 `shadow-card`・`shadow-lift` / `max-w-content`(1120px)

## タイポ
- 数字・Lv.・料金は `font-num`（Poppins, tabular-nums）。本文は Noto Sans JP（`font-sans`）。
- 見出し階層は1画面で明快に。`SectionTitle` の eyebrow/title パターンを踏襲。

## 必須4状態（どの画面・データ取得でも）
- **loading**: スケルトン。 **empty**: 謝罪でなく**次の行動**を示す。 **error**: 何が起き・どう直すか。 **success**。

## モーション規律
- 150–250ms・ease。`prefers-reduced-motion` で無効化。演出は1画面に**主役1つ**だけ。

## 署名要素
- `LevelLadder`（Lv.0→10）を主役に「現在地と次の一段」を常に感じさせる。周囲は静かに。

## モバイル人間工学
- 主要操作は親指の届く下部（ボトムナビ/主要CTA）、最小タップ 44px、**横スクロール禁止**、〜380px で崩れない。

## コピー規範
- 能動態・sentence case・操作対象の名前で呼ぶ・余計な敬語の重複を避ける。
- ボタンの語と結果の語を一致（「保存」を押したら「保存しました」）。

## アイコン・一貫性
- lucide-react、線画 strokeWidth 1.75。色/余白/角丸/影は必ずトークン由来。場当たりの数値を入れない。
- 仕上げの最後に「装飾を1つ外す」。意味のない飾りは消す。
