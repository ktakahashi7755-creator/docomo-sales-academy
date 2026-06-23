-- ============================================================
-- DOCOMO Sales Academy — schema
-- 0001_schema.sql
-- ============================================================

create extension if not exists "pgcrypto";

-- updated_at 自動更新
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ===== profiles =====
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  role text not null default 'trainee'
    check (role in ('trainee','helper','closer','sv','admin')),
  store_name text,
  team_name text,
  avatar_url text,
  level int not null default 0 check (level between 0 and 10),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();

-- ===== courses =====
create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  phase int,
  sort_order int not null default 0,
  required_role text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_courses_updated before update on courses
  for each row execute function set_updated_at();

-- ===== modules =====
create table modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  description text,
  content_type text,
  content_json jsonb,
  estimated_minutes int,
  difficulty int check (difficulty between 1 and 10),
  is_required boolean not null default true,
  passing_score int not null default 80,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_modules_updated before update on modules
  for each row execute function set_updated_at();

-- ===== products =====
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  summary text,
  target_customer text,
  benefits_json jsonb,
  warnings_json jsonb,
  talk_points_json jsonb,
  official_url text,
  official_checked_at date,
  version int not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_products_updated before update on products
  for each row execute function set_updated_at();

-- ===== product_versions（差し替え履歴） =====
create table product_versions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  version int not null,
  before_json jsonb,
  after_json jsonb,
  changed_by uuid references profiles(id),
  change_reason text,
  created_at timestamptz not null default now()
);

-- ===== talk_scripts =====
create table talk_scripts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  product_id uuid references products(id) on delete set null,
  target_customer text,
  difficulty int check (difficulty between 1 and 10),
  timing text,
  body jsonb,            -- セクション配列
  points_json jsonb,
  ng_examples_json jsonb,
  good_examples_json jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_scripts_updated before update on talk_scripts
  for each row execute function set_updated_at();

-- ===== objection_handlers =====
create table objection_handlers (
  id uuid primary key default gen_random_uuid(),
  title text,
  objection text not null,
  background text,
  ng_response text,
  good_response text,
  reframe_talk text,
  closing_talk text,
  difficulty int check (difficulty between 1 and 10),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_obj_updated before update on objection_handlers
  for each row execute function set_updated_at();

-- ===== quiz_questions =====
create table quiz_questions (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references modules(id) on delete cascade,
  question_type text,
  question text not null,
  choices_json jsonb,
  correct_answer_json jsonb,
  explanation text,
  points int not null default 1,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_quiz_updated before update on quiz_questions
  for each row execute function set_updated_at();

-- ===== quiz_attempts =====
create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  module_id uuid references modules(id) on delete cascade,
  score int,
  passed boolean,
  answers_json jsonb,
  started_at timestamptz,
  completed_at timestamptz
);

-- ===== roleplay_scenarios =====
create table roleplay_scenarios (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  customer_carrier text,
  customer_profile_json jsonb,
  family_type text,
  internet_line text,
  payment_method text,
  interest_level text,
  resistance_level text,
  difficulty int check (difficulty between 1 and 10),
  goal text,
  system_prompt text,
  expected_points_json jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_scn_updated before update on roleplay_scenarios
  for each row execute function set_updated_at();

-- ===== roleplay_sessions =====
create table roleplay_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  scenario_id uuid references roleplay_scenarios(id) on delete set null,
  mode text,
  transcript_json jsonb,
  score int,
  rank text,
  evaluation_json jsonb,
  started_at timestamptz,
  completed_at timestamptz
);

-- ===== progress =====
create table progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  module_id uuid references modules(id) on delete cascade,
  status text,
  score int,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, module_id)
);
create trigger trg_progress_updated before update on progress
  for each row execute function set_updated_at();

-- ===== badges / user_badges =====
create table badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text,
  condition_json jsonb,
  created_at timestamptz not null default now()
);
create table user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  badge_id uuid references badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

-- ===== certifications =====
create table certifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  certification_type text,
  status text,
  score int,
  approved_by uuid references profiles(id),
  approved_at timestamptz,
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_cert_updated before update on certifications
  for each row execute function set_updated_at();

-- ===== announcements =====
create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  severity text,
  published_from timestamptz,
  published_until timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ===== audit_logs =====
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  action text,
  target_type text,
  target_id uuid,
  before_json jsonb,
  after_json jsonb,
  created_at timestamptz not null default now()
);

-- 参照用インデックス
create index on modules (course_id);
create index on quiz_questions (module_id);
create index on quiz_attempts (user_id);
create index on roleplay_sessions (user_id);
create index on progress (user_id);
create index on talk_scripts (product_id);
