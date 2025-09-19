-- Dev/demo seed data for clinical assessments and organization rollups
-- Usage: psql $DATABASE_URL -f supabase/seeds/dev_assessments.sql
-- Override :demo_uid and :demo_org_id to target your local ids.
\if :{?demo_uid}
\else
\set demo_uid '00000000-0000-0000-0000-000000000001'
\endif

\if :{?demo_org_id}
\else
\set demo_org_id '11111111-1111-1111-1111-111111111111'
\endif

insert into public.assessments (user_id, instrument, score_json)
values
  (:'demo_uid'::uuid, 'WHO5', '{"summary":"semaine posée"}'),
  (:'demo_uid'::uuid, 'STAI6', '{"summary":"anxiété modérée"}')
on conflict do nothing;

insert into public.org_assess_rollups (org_id, period, instrument, n, text_summary)
values
  (:'demo_org_id'::uuid, '2025-W38', 'WEMWBS', 7, 'semaine plutôt posée'),
  (:'demo_org_id'::uuid, '2025-W38', 'UWES', 6, 'engagement stable')
on conflict do nothing;
