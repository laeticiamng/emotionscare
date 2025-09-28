-- Dev/demo seed data for core emotion modules (Emotion Scan, Mood Mixer, Sessions)
-- Usage: psql $DATABASE_URL -f supabase/seeds/dev_emotion_modules.sql
-- Override the :demo_uid variable before execution to target your local auth user id.
-- Example: psql ... -v demo_uid='00000000-0000-0000-0000-000000000001'
\if :{?demo_uid}
\else
\set demo_uid '00000000-0000-0000-0000-000000000001'
\endif

insert into public.mood_presets (user_id, name, sliders)
values
  (:'demo_uid'::uuid, 'Calm Evening', '{"energy":30,"calm":80,"focus":60}'),
  (:'demo_uid'::uuid, 'Focus Sprint', '{"energy":70,"calm":40,"focus":85}')
on conflict do nothing;

insert into public.emotion_scans (user_id, payload, mood_score)
values
  (:'demo_uid'::uuid, '{"labels":["calm"],"mood_score":7}', 7),
  (:'demo_uid'::uuid, '{"labels":["focused"],"mood_score":8}', 8)
on conflict do nothing;

insert into public.sessions (user_id, type, duration_sec, mood_delta, meta)
values
  (:'demo_uid'::uuid, 'flash_glow', 300, 1, '{"intensity":"medium"}'),
  (:'demo_uid'::uuid, 'breath', 420, 2, '{"protocol":"4-7-8"}')
on conflict do nothing;
