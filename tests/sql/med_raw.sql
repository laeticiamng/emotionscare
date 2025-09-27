BEGIN;
SELECT plan(4);

INSERT INTO flow_walk
  (user_id_hash, steps, cadence_spm, breath_rate_rpm,
   hrv_pre, hrv_post)
VALUES ('hashF', 350, 100, 16.5, 50, 80);

SELECT ok(
  (SELECT coherence_pct FROM flow_walk WHERE user_id_hash='hashF') > 90,
  'coherence % computed');

SELECT is(
  (SELECT rmssd_delta FROM flow_walk WHERE user_id_hash='hashF'), 30,
  'Δ RMSSD computed');

INSERT INTO glow_mug
  (user_id_hash, hr_pre, hr_post, calm_score, mood_emoji)
VALUES ('hashM', 70, 64, 3, '\xF0\x9F\x99\x82');
VALUES ('hashM', 70, 64, 3, '🙂');

SELECT is(
  (SELECT sms1 FROM glow_mug WHERE user_id_hash='hashM'), 4,
  'SMS-1 computed');

SELECT finish();
ROLLBACK;
