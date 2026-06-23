-- ============================================================
-- DOCOMO Sales Academy — 0005_certifications.sql
-- Phase 5: クローザー認定の承認をサーバー側 RPC に集約。
--   SV/admin のみが承認でき（関数内で is_sv_or_admin() を検査）、
--   承認は (1) certifications を approved で upsert、(2) profiles.level を 10 に更新、
--   (3) audit_logs に記録、を1トランザクションで行う。
--   profiles.level の更新は通常 admin only ポリシーだが、SECURITY DEFINER でこの経路に限り許可する。
-- ============================================================

-- ユーザー×認定種別で一意（重複行を防ぎ、承認を冪等にする）。
alter table certifications
  add constraint certifications_user_type_key unique (user_id, certification_type);

create or replace function approve_certification(
  p_user_id uuid,
  p_comment text default null
) returns uuid
-- search_path は public 固定（+ pg_temp 末尾）。auth.* は常にスキーマ修飾で呼ぶ。
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  cert_id uuid;
begin
  if not is_sv_or_admin() then
    raise exception 'forbidden: sv or admin only';
  end if;
  if p_user_id is null then
    raise exception 'p_user_id is required';
  end if;

  -- 認定記録（closer 種別を upsert：既存があれば承認で更新、なければ作成）。
  -- (user_id, certification_type) の一意制約により1行に収束し、二重承認でも行は増えない。
  insert into certifications (user_id, certification_type, status, approved_by, approved_at, comment)
  values (p_user_id, 'closer', 'approved', auth.uid(), now(), p_comment)
  on conflict (user_id, certification_type) do update
    set status = 'approved',
        approved_by = auth.uid(),
        approved_at = now(),
        comment = p_comment,
        updated_at = now()
  returning id into cert_id;

  -- 認定クローザー（Lv.10）に更新
  update profiles set level = 10 where id = p_user_id;

  -- 監査記録（SV の承認操作をサーバー側で残す）
  insert into audit_logs (user_id, action, target_type, target_id, after_json)
  values (auth.uid(), 'certification.approve', 'certification', cert_id,
          jsonb_build_object('user_id', p_user_id, 'level', 10, 'comment', p_comment));

  return cert_id;
end;
$$;

-- public からは実行不可。認証ユーザーにのみ実行権を付与（中で sv/admin を再検査）。
revoke all on function approve_certification(uuid, text) from public;
grant execute on function approve_certification(uuid, text) to authenticated;
