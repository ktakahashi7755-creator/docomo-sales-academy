-- ============================================================
-- DOCOMO Sales Academy — 0004_admin_audit.sql
-- Phase 2: 監査ログのサーバー側書込。
--   audit_logs には insert ポリシーが無く、クライアントからの直接 insert は RLS で拒否される。
--   管理操作の記録は、この SECURITY DEFINER 関数（サーバー側）経由でのみ行う。
--   呼び出せるのは admin のみ（関数内で is_admin() を検査）。user_id は auth.uid() を強制。
-- ============================================================

create or replace function log_audit(
  p_action text,
  p_target_type text,
  p_target_id uuid,
  p_before jsonb default null,
  p_after jsonb default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  if not is_admin() then
    raise exception 'forbidden: admin only';
  end if;
  insert into audit_logs (user_id, action, target_type, target_id, before_json, after_json)
  values (auth.uid(), p_action, p_target_type, p_target_id, p_before, p_after)
  returning id into new_id;
  return new_id;
end;
$$;

-- 既定の public からは実行不可。認証ユーザーにのみ実行権を付与（中で admin を再検査）。
revoke all on function log_audit(text, text, uuid, jsonb, jsonb) from public;
grant execute on function log_audit(text, text, uuid, jsonb, jsonb) to authenticated;
