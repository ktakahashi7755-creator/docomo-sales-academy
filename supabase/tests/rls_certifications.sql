-- ============================================================
-- RLS/RPC テスト: クローザー認定（SV/admin のみ承認、本人のみ閲覧）
--   サービスロールで実行。トランザクション内で検証し rollback する。
-- ============================================================

begin;

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000b1', 'sv@test.local'),
  ('00000000-0000-0000-0000-0000000000b2', 'trainee@test.local'),
  ('00000000-0000-0000-0000-0000000000b3', 'other@test.local')
on conflict (id) do nothing;

insert into profiles (id, display_name, role, level) values
  ('00000000-0000-0000-0000-0000000000b1', 'SV', 'sv', 10),
  ('00000000-0000-0000-0000-0000000000b2', 'Trainee', 'trainee', 9),
  ('00000000-0000-0000-0000-0000000000b3', 'Other', 'trainee', 5)
on conflict (id) do nothing;

-- --- trainee は他人の認定を承認できない（RPC が forbidden で拒否） ---
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}',
  true
);

do $$
begin
  begin
    perform approve_certification('00000000-0000-0000-0000-0000000000b3', null);
    assert false, 'FAIL: trainee は承認できてはいけない';
  exception
    when sqlstate 'P0001' then
      assert sqlerrm like 'forbidden%', 'FAIL: forbidden 以外の例外: ' || sqlerrm;
  end;
  -- 副作用が無いこと（level 据え置き・認定行なし）
  assert (select level from profiles where id = '00000000-0000-0000-0000-0000000000b3') = 5,
    'FAIL: 拒否時に level を変えてはいけない';
  assert (select count(*) from certifications where user_id = '00000000-0000-0000-0000-0000000000b3') = 0,
    'FAIL: 拒否時に認定行を作ってはいけない';
  -- 直接 certifications へ書く経路も RLS（sv write）で拒否される
  begin
    insert into certifications (user_id, status) values ('00000000-0000-0000-0000-0000000000b3', 'approved');
    assert false, 'FAIL: trainee の直接 insert は拒否されるべき';
  exception
    when insufficient_privilege then null;
  end;
  raise notice 'PASS: trainee は承認不可';
end $$;

-- --- SV は承認でき、Lv.10 と認定記録・監査が作られる ---
select set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}',
  true
);

do $$
declare
  cert_id uuid;
begin
  cert_id := approve_certification('00000000-0000-0000-0000-0000000000b2', '総合ロープレ良好');
  assert cert_id is not null, 'FAIL: SV は承認できるべき';
  assert (select level from profiles where id = '00000000-0000-0000-0000-0000000000b2') = 10,
    'FAIL: 承認で Lv.10 になるべき';
  assert (select status from certifications where id = cert_id) = 'approved',
    'FAIL: 認定が approved で記録されるべき';
  assert (select count(*) from audit_logs where target_id = cert_id and action = 'certification.approve') = 1,
    'FAIL: 承認は監査に記録されるべき';
  raise notice 'PASS: SV 承認で Lv.10・記録・監査 OK';
end $$;

-- --- 本人は自分の認定を閲覧できる / 他人のは見えない ---
select set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}',
  true
);

do $$
begin
  assert (select count(*) from certifications where user_id = '00000000-0000-0000-0000-0000000000b2') = 1,
    'FAIL: 本人は自分の認定を閲覧できるべき';
  assert (select count(*) from certifications where user_id = '00000000-0000-0000-0000-0000000000b3') = 0,
    'FAIL: 他人の認定は見えてはいけない';
  raise notice 'PASS: 本人閲覧 / 他人不可 OK';
end $$;

reset role;
rollback;
