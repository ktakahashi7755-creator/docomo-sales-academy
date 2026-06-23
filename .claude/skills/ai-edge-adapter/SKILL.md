---
name: ai-edge-adapter
description: ロープレ会話・AI評価・音声(STT/TTS)・Edge Function 実装やレビュー時に使用。Edge Function経由・プロバイダ差し替え可能なアダプタ・サーバー側キー・保存形の規律を提供する。
---
# AI / Edge Adapter Conventions

`CLAUDE.md` §6 Phase4 を正典に要約。

## 呼び出し経路
- AI 呼び出し（LLM/STT/TTS）は**必ず Supabase Edge Function 等のサーバー側経由**。フロントから直接プロバイダを叩かない。
- APIキー・`service_role` は**サーバー側のみ**。クライアントバンドルに含めない（ビルド出力で検証）。

## アダプタパターン（差し替え可能に）
- LLM/STT/TTS はそれぞれ**インターフェースを定義し、実装を1箇所で切替**できる構成にする（例: Anthropic / OpenAI、Whisper、VOICEVOX / ElevenLabs）。
- プロバイダ固有の型を上位に漏らさない。`generate(messages, opts)` 等の安定 I/O を保つ。
- プロバイダ選択は環境変数（例 `VITE_AI_PROVIDER` はUI表示用、実キーはサーバー側 env）で行い、コード1箇所の切替で変更可能にする。

## ロープレ・評価の保存形
- 会話は `roleplay_sessions.transcript_json` に保存。顧客AIはシナリオの `system_prompt`＋難易度1–10で態度が変化。
- 終了時に AI 評価（`EVAL_ITEMS` の12項目を100点満点・S/A/B/C/D ランク）→ `roleplay_sessions.evaluation_json` / `score` / `rank` に保存。
- 顧客発話・評価で**事実値（料金等）を捏造しない**（data-integrity の正典に従う）。

## 段階導入
- 先にテキスト会話＋評価を完走させ、次に音声（STT→LLM→TTS）。`isBackendEnabled` と AI 設定が揃うまで音声ボタンは無効化（既存挙動）。
