BEGIN;
SELECT plan(5);

INSERT INTO scan_face
  (user_id_hash, duration_s, valence_series, arousal_series)
VALUES
  ('hashF', 6,
   ARRAY[0.1,0.2,0.3],
   ARRAY[0.1,0.2,0.5]);

SELECT is(
  (SELECT valence_avg FROM scan_face WHERE user_id_hash='hashF'), 0.2,
  'valence_avg computed');

SELECT ok(
  (SELECT arousal_sd FROM scan_face WHERE user_id_hash='hashF') > 0,
  'arousal_sd computed');

INSERT INTO scan_glimmer
  (user_id_hash, joy_series, delay_ms)
VALUES ('hashG', ARRAY[0.4,0.6,0.8], 300);

SELECT is(
  (SELECT joy_avg FROM scan_glimmer WHERE user_id_hash='hashG'), 0.6,
  'joy_avg computed');

INSERT INTO scan_voice
  (user_id_hash, word, valence_voice, arousal_voice)
VALUES ('hashV','peace',0.7,0.2);

SELECT is(
  (SELECT expressive_len FROM scan_voice WHERE user_id_hash='hashV'), 5,
  'expressive_len computed');

SELECT finish();
ROLLBACK;
