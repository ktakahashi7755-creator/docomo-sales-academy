-- ============================================================
-- RLS/RPC テスト: 監査ログ（admin のみ書込・閲覧、非 admin は不可）
--   サービスロールで実行。トランザクション内で検証し rollback する。
-- ============================================================

begin;

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'admin@test.local'),
  ('00000000-0000-0000-0000-0000000000a2', 'trainee@test.local')
on conflict (id) do nothing;

insert into profiles (id, display_name, role) values
  ('00000000-0000-0000-0000-0000000000a1', 'Admin', 'admin'),
  ('00000000-0000-0000-0000-0000000000a2', 'Trainee', 'trainee')
on conflict (id) do nothing;

-- --- admin として log_audit が成功し、admin は閲覧できる ---
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}',
  true
);

do $$
begin
  perform log_audit('product.update', 'product', null, '{"v":1}'::jsonb, '{"v":2}'::jsonb);
  assert (select count(*) from audit_logs) = 1, 'FAIL: admin は監査を記録・閲覧できるべき';
  raise notice 'PASS: admin log_audit OK';
end $$;

-- --- 非 admin（trainee）は log_audit を呼べず、audit_logs を閲覧もできない ---
select set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated"}',
  true
);

do $$
begin
  begin
    perform log_audit('product.update', 'product', null, null, null);
    assert false, 'FAIL: 非 admin は log_audit を呼べてはいけない';
  exception
    when others then null; -- forbidden で拒否
  end;

  -- audit_logs の read ポリシーは is_admin() のみ → trainee には0件
  assert (select count(*) from audit_logs) = 0, 'FAIL: 非 admin は監査を閲覧できない';

  -- audit_logs への直接 insert は insert ポリシーが無いため拒否される
  begin
    insert into audit_logs (user_id, action) values (auth.uid(), 'x');
    assert false, 'FAIL: クライアント直接 insert は拒否されるべき';
  exception
    when insufficient_privilege then null;
  end;

  raise notice 'PASS: non-admin denied OK';
end $$;

reset role;
rollback;
