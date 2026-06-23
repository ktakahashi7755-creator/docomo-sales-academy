---
name: accessibility
description: UIの実装・レビュー時に使用。キーボード操作・フォーカス可視・コントラストAA・reduced-motion・タップ44pxの床を保証する基準を提供する。
---

# Accessibility（床を割らない）

`CLAUDE.md` §3-8・§5 を正典に要約。**この床は妥協しない。**

## キーボード操作

- すべてのインタラクティブ要素はキーボードで到達・操作可能（Tab/Shift+Tab/Enter/Space/Esc）。
- フォーカス順序は視覚順序と一致。モーダルはフォーカストラップ＋Esc で閉じる。
- クリック専用要素を作らない。ボタンは `<button>`、リンクは `<a>`/`<Link>`。div に onClick を付けない。

## フォーカス可視

- フォーカスリングを消さない（`outline-none` 単独禁止）。トークン色で明示的な focus-visible を付ける。

## コントラスト

- テキスト/重要UIは AA（通常 4.5:1、大文字 3:1）。`ink-muted` 等の薄色は本文に使わない。

## モーション

- `prefers-reduced-motion: reduce` でアニメーション/トランジションを無効化または最小化。

## タップ領域・フォーム

- 主要操作の最小タップ領域 44px。隣接要素と十分な間隔。
- フォームは `<label>` 紐付け、エラーは色だけに頼らずテキストで原因と直し方を示す。
- 画像/アイコンには適切な `alt`/`aria-label`。装飾画像は `alt=""`。
- 動的更新（採点結果・トースト）は `aria-live` で通知。`role`/`aria-*` を正しく使う（例: `ProgressBar` の progressbar）。
