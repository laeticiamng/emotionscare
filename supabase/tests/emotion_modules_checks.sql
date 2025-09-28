-- Post-migration verification for emotion module tables
-- Usage: psql $DATABASE_URL -v demo_uid='<uid>' -f supabase/tests/emotion_modules_checks.sql
\if :{?demo_uid}
\else
\set demo_uid '00000000-0000-0000-0000-000000000001'
\endif
\echo '== RLS status =='
select relname, relrowsecurity
from pg_class
where relname in ('emotion_scans','mood_presets','sessions')
order by relname;

\echo '\n== Policy counts =='
select c.relname, count(p.*) as policy_count
from pg_class c
left join pg_policy p on p.polrelid = c.oid
where c.relname in ('emotion_scans','mood_presets','sessions')
  and c.relnamespace = 'public'::regnamespace
group by c.relname
order by c.relname;

\echo '\n== Query plan (latest scans for demo user) =='
explain (analyze, verbose, costs, buffers)
select id
from public.emotion_scans
where user_id = :'demo_uid'::uuid
order by created_at desc
limit 10;
