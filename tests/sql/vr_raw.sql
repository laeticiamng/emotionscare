BEGIN;
SELECT plan(4);

-- Bio-Nebula
INSERT INTO public.vr_nebula_sessions
  (user_id_hash,duration_s,resp_rate_avg,hrv_pre,hrv_post)
VALUES ('hashN',300,5.5,40,70);

SELECT is(
  (SELECT rmssd_delta FROM vr_nebula_sessions WHERE user_id_hash='hashN'),30,
  'ΔRMSSD computed');
SELECT is(
  (SELECT coherence_score FROM vr_nebula_sessions WHERE user_id_hash='hashN'),100,
  'Coherence 100 pts');

-- Dome (2 users pour σ)
INSERT INTO public.vr_dome_sessions
  (session_id,user_id_hash,ts_leave,hr_mean,hr_std,valence_avg)
VALUES
  ('00000000-0000-0000-0000-000000000001','hashA',now(),70,2.0,0.3),
  ('00000000-0000-0000-0000-000000000001','hashB',now(),72,3.0,0.4);

SELECT ok(
  (SELECT group_sync_idx FROM vr_dome_sessions
   WHERE user_id_hash='hashB') IS NOT NULL,
  'Group σ populated');
SELECT ok(
  (SELECT team_pa FROM vr_dome_sessions
   WHERE user_id_hash='hashB') > 0,
  'Team PA populated');

SELECT finish();
ROLLBACK;
