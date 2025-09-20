-- Post-migration verification for clinical assessment tables
-- Usage: psql $DATABASE_URL -f supabase/tests/assessments_checks.sql
-- Override :demo_uid and :demo_org_id if you need custom identifiers.
\if :{?demo_uid}
\else
\set demo_uid '00000000-0000-0000-0000-000000000001'
\endif

\if :{?demo_org_id}
\else
\set demo_org_id '11111111-1111-1111-1111-111111111111'
\endif

\echo '== RLS status (assessments) =='
select relname, relrowsecurity
from pg_class
where relname in ('assessments')
order by relname;

\echo '\n== Policy counts (assessments) =='
select c.relname, count(p.*) as policies
from pg_class c
left join pg_policy p on p.polrelid = c.oid
where c.relname in ('assessments')
  and c.relnamespace = 'public'::regnamespace
group by c.relname
order by c.relname;

\echo '\n== Index coverage (assessments & rollups) =='
select indexname, tablename
from pg_indexes
where schemaname = 'public'
  and indexname in (
    'idx_assessments_instrument_ts',
    'idx_org_rollups_org_period_instrument'
  )
order by tablename, indexname;

\echo '\n== RLS policy clauses (org_assess_rollups) =='
select policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'org_assess_rollups';

\echo '\n== Constraint definition (org_assess_rollups) =='
select conname, pg_get_constraintdef(oid) as definition
from pg_constraint
where conname = 'org_rollups_min_n';

\echo '\n== Constraint enforcement smoke test (expect notice) =='
do $$
declare
  violation boolean := false;
begin
  begin
    insert into public.org_assess_rollups (org_id, period, instrument, n, text_summary)
    values (:'demo_org_id'::uuid, '2999-W01', 'CHECK_TEST', 3, 'texte de test');
  exception
    when check_violation then
      violation := true;
  end;

  if violation then
    raise notice 'org_rollups_min_n constraint rejected n < 5 as expected.';
  else
    delete from public.org_assess_rollups
    where org_id = :'demo_org_id'::uuid and period = '2999-W01' and instrument = 'CHECK_TEST';
    raise exception 'Expected org_rollups_min_n to reject n < 5 but insert succeeded.';
  end if;
end $$;
