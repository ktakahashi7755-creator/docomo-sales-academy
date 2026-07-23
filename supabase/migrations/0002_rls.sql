-- ============================================================
-- DOCOMO Sales Academy — Row Level Security
-- 0002_rls.sql
-- 方針: service_role キーはフロントに置かない。
--   admin: 管理データ編集可 / sv: 研修生評価の閲覧可
--   trainee/helper/closer: 公開コンテンツ閲覧 + 自分のデータのみ
-- ============================================================

-- 役割判定ヘルパー（RLS再帰を避けるため SECURITY DEFINER）
create or replace function auth_role()
returns text language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid()
$$;

create or replace function is_admin() returns boolean language sql stable as $$
  select auth_role() = 'admin'
$$;
create or replace function is_sv_or_admin() returns boolean language sql stable as $$
  select auth_role() in ('sv','admin')
$$;

-- 全テーブルで RLS 有効化
alter table profiles            enable row level security;
alter table courses             enable row level security;
alter table modules             enable row level security;
alter table products            enable row level security;
alter table product_versions    enable row level security;
alter table talk_scripts        enable row level security;
alter table objection_handlers  enable row level security;
alter table quiz_questions      enable row level security;
alter table quiz_attempts       enable row level security;
alter table roleplay_scenarios  enable row level security;
alter table roleplay_sessions   enable row level security;
alter table progress            enable row level security;
alter table badges              enable row level security;
alter table user_badges         enable row level security;
alter table certifications      enable row level security;
alter table announcements       enable row level security;
alter table audit_logs          enable row level security;

-- ---- profiles ----
create policy "profiles self read"   on profiles for select using (id = auth.uid() or is_sv_or_admin());
create policy "profiles self update" on profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles admin all"   on profiles for all using (is_admin()) with check (is_admin());

-- ---- 公開コンテンツ（読み取りは認証ユーザー、書き込みは admin のみ） ----
do $$
declare t text;
begin
  foreach t in array array[
    'courses','modules','products','product_versions','talk_scripts',
    'objection_handlers','quiz_questions','roleplay_scenarios','badges','announcements'
  ] loop
    execute format('create policy "%1$s read"  on %1$s for select using (auth.uid() is not null);', t);
    execute format('create policy "%1$s admin" on %1$s for all   using (is_admin()) with check (is_admin());', t);
  end loop;
end $$;

-- ---- 学習者データ（自分のみ。SV/adminは閲覧可） ----
-- quiz_attempts
create policy "attempts owner"  on quiz_attempts for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "attempts sv read" on quiz_attempts for select using (is_sv_or_admin());

-- roleplay_sessions
create policy "sessions owner"  on roleplay_sessions for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "sessions sv read" on roleplay_sessions for select using (is_sv_or_admin());

-- progress
create policy "progress owner"  on progress for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "progress sv read" on progress for select using (is_sv_or_admin());

-- user_badges
create policy "badges owner"  on user_badges for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "badges sv read" on user_badges for select using (is_sv_or_admin());

-- ---- certifications（本人閲覧 / SV承認・閲覧 / admin全権） ----
create policy "cert owner read" on certifications for select using (user_id = auth.uid() or is_sv_or_admin());
create policy "cert sv write"   on certifications for all using (is_sv_or_admin()) with check (is_sv_or_admin());

-- ---- audit_logs（admin のみ閲覧。書き込みはサーバー側/Edge Functionを想定） ----
create policy "audit admin read" on audit_logs for select using (is_admin());

-- 新規ユーザー作成時に profiles 行を自動生成
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name',''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
