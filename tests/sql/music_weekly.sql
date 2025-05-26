BEGIN;
SELECT plan(3);

insert into public.biotune_sessions
  (user_id_hash, duration_s, bpm_target, hrv_pre, hrv_post, energy_mode)
values
  ('hashA',300,70,50,80,'calm');

insert into public.neon_walk_sessions
  (user_id_hash, steps, avg_cadence, joy_idx)
values ('hashA',3000,110,0.7);

call public.refresh_metrics_music();

SELECT is(
  (select mvpa_min from public.metrics_weekly_music where user_id_hash='hashA'),
  round((3000/100.0)*(110/120.0),2),
  'mvpa computed');

SELECT ok (
  exists(select 1 from public.metrics_weekly_music_org),
  'org view populated'
);

SELECT finish();
ROLLBACK;
