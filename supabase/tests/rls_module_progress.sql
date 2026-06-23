-- ============================================================
-- RLS テスト: module_progress（本人の行のみ読み書き可・越権不可）
--
-- 実行方法: Supabase SQL Editor もしくは CI のテスト用DBで、
--   サービスロール（RLS をバイパスできる接続）で本ファイルを実行する。
--   トランザクション内で検証し、最後に rollback するので永続化されない。
--
-- 検証: auth.uid() = request.jwt.claims.sub。authenticated ロールに切り替えて
--   ユーザーA が自分の行だけを見え、ユーザーB の行を変更できないことを assert する。
-- ============================================================

begin;

-- --- セットアップ（この時点ではまだ所有者ロール＝RLSバイパス） ---
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'a@test.local'),
  ('00000000-0000-0000-0000-00000000000b', 'b@test.local')
on conflict (id) do nothing;

insert into profiles (id, display_name, role) values
  ('00000000-0000-0000-0000-00000000000a', 'User A', 'trainee'),
  ('00000000-0000-0000-0000-00000000000b', 'User B', 'trainee')
on conflict (id) do nothing;

insert into module_progress (user_id, module_key, score) values
  ('00000000-0000-0000-0000-00000000000a', 'p1m1', 80),
  ('00000000-0000-0000-0000-00000000000b', 'p1m1', 90);

-- --- ユーザーA として検証（RLS 適用） ---
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated"}',
  true
);

do $$
begin
  -- A は自分の1行のみ見える
  assert (select count(*) from module_progress) = 1,
    'FAIL: A は自分の1行のみ見えるべき';
  assert (select score from module_progress where module_key = 'p1m1') = 80,
    'FAIL: A のスコアは 80 のはず';

  -- A は B の行を更新できない（RLS により対象0行）
  update module_progress set score = 100 where user_id = '00000000-0000-0000-0000-00000000000b';
  assert (select count(*) from module_progress) = 1,
    'FAIL: A から B の行は見えない/変更できないはず';

  -- A は自分の行を upsert できる
  insert into module_progress (user_id, module_key, score)
    values ('00000000-0000-0000-0000-00000000000a', 'p1m2', 88)
    on conflict (user_id, module_key) do update set score = excluded.score;
  assert (select count(*) from module_progress) = 2,
    'FAIL: A は自分の行を追加できるはず';

  -- A は他人の user_id では書き込めない（with check 違反）
  begin
    insert into module_progress (user_id, module_key, score)
      values ('00000000-0000-0000-0000-00000000000b', 'p9m9', 100);
    assert false, 'FAIL: A は B の user_id で書き込めてはいけない';
  exception
    when insufficient_privilege or check_violation then
      null; -- 期待どおり拒否
  end;

  raise notice 'PASS: module_progress RLS isolation OK';
end $$;

reset role;
rollback;
