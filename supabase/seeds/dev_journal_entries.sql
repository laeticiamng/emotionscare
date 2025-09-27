-- Dev/demo seed data for journal entries (text + tags)
-- Usage: psql $DATABASE_URL -f supabase/seeds/dev_journal_entries.sql
-- Override :demo_uid to match your local authenticated user id.
\if :{?demo_uid}
\else
\set demo_uid '00000000-0000-0000-0000-000000000001'
\endif

insert into public.journal_entries (id, user_id, text, tags, created_at)
values
  ('11111111-1111-1111-1111-111111111111', :'demo_uid'::uuid, 'Première note — petite respiration et musique douce.', ARRAY['calm','evening'], now() - interval '2 days'),
  ('22222222-2222-2222-2222-222222222222', :'demo_uid'::uuid, 'Deuxième note — pensée positive du jour.', ARRAY['focus','morning'], now() - interval '1 day')
on conflict (id) do nothing;
