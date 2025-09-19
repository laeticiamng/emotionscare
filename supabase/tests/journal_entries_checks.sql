-- Post-migration verification for public.journal_entries
-- Usage: psql $DATABASE_URL -f supabase/tests/journal_entries_checks.sql
-- Override :demo_uid to point at a local authenticated user id when needed.
\if :{?demo_uid}
\else
\set demo_uid '00000000-0000-0000-0000-000000000001'
\endif

\echo '== RLS status (journal_entries) =='
select relname, relrowsecurity
from pg_class
where relname = 'journal_entries';

\echo '\n== Policy counts (journal_entries) =='
select c.relname, count(p.*) as policies
from pg_class c
left join pg_policy p on p.polrelid = c.oid
where c.relname = 'journal_entries'
  and c.relnamespace = 'public'::regnamespace
group by 1;

\echo '\n== Query plan using created_at index =='
select set_config('request.jwt.claim.sub', :'demo_uid', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

explain analyze
select id from public.journal_entries
where user_id = auth.uid()
order by created_at desc
limit 10;
