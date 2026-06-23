---
name: supabase-rls
description: スキーマ・migration・RLS・SQL/データアクセス実装やレビュー時に使用。migration追加のみの原則、RLS方針、ヘルパー関数、updated_at・indexの規律を提供する。
---

# Supabase / RLS Conventions

`supabase/migrations/0001_schema.sql`・`0002_rls.sql` が実体・正典。**既存スキーマを壊さない。**

## migration 規律

- スキーマ変更は**新しい migration ファイルを追加**して行う（既存 migration を書き換えない）。命名は連番 `0003_*.sql`。
- 破壊的変更（drop/rename）は影響範囲を明記し、データ移行を伴う場合は段階的に。

## RLS 方針

- 全テーブルで RLS 有効。役割は `admin / sv / trainee / helper / closer`。
- 原則: **公開コンテンツ**は認証ユーザー読み取り・`is_admin()` 書込。**学習者データ**（quiz_attempts/roleplay_sessions/progress/user_badges）は本人のみ、SV/admin は閲覧可。
- `certifications` は本人閲覧／`is_sv_or_admin()` が承認・書込／admin 全権。
- `audit_logs` は admin 読み取りのみ、**書込はサーバー側/Edge Function** を想定（フロントから直接 insert しない）。

## ヘルパー関数（再帰回避のため SECURITY DEFINER）

- `auth_role()` / `is_admin()` / `is_sv_or_admin()` を使う。新ポリシーでも独自に role を直接参照せずこれらを使う。

## index・トリガ

- `updated_at` の自動更新トリガを新テーブルにも付ける（0001 のパターン踏襲）。
- 外部キー・頻繁な検索列に index を付ける。`handle_new_user` で profiles 自動生成の流れを壊さない。

## 安全

- `service_role` キーをフロントに出さない。フロントは anon キーのみ。RLS を「UIで隠す」だけで代替しない（二重防御）。
