-- ============================================================
-- DOCOMO Sales Academy — 0003_module_progress.sql
-- Phase 1: 学習進捗の永続化（フロントの seed モジュールキー対応）
--
-- 背景: フロントのコンテンツ（src/data/seed.ts の PHASES）は現状ローカル seed で、
--   モジュールIDは "p1m1" 等のテキストキー。一方 0001 の progress 表は
--   modules(uuid) への FK で、DB駆動コンテンツ（Phase 2）用。
--   両者の整合は Phase 2 で行うため、Phase 1 では衝突を避けて
--   テキストキー対応の module_progress を「追加」して進捗を永続化する。
--   既存の progress 表・ポリシーは一切変更しない。
-- ============================================================

create table if not exists module_progress (
  user_id uuid not null references profiles(id) on delete cascade,
  module_key text not null, -- フロント seed のモジュールキー（例: p1m1）
  score int not null check (score between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, module_key)
);

create index if not exists module_progress_user_idx on module_progress (user_id);

-- updated_at 自動更新（0001 の共通関数を再利用）
drop trigger if exists trg_module_progress_updated on module_progress;
create trigger trg_module_progress_updated
  before update on module_progress
  for each row execute function set_updated_at();

-- RLS: 本人のみ読み書き。SV/admin は閲覧のみ（既存 progress と同方針）。
alter table module_progress enable row level security;

drop policy if exists "module_progress owner" on module_progress;
create policy "module_progress owner" on module_progress for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "module_progress sv read" on module_progress;
create policy "module_progress sv read" on module_progress for select
  using (is_sv_or_admin());
