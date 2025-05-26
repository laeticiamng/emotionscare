BEGIN;
SELECT plan(3);

-- 1. insérer une session face + voice
INSERT INTO scan_face    (user_id_hash,duration_s,valence_series,arousal_series)
VALUES ('hashX',6, ARRAY[0.1,0.3,0.5], ARRAY[0.2,0.2,0.2]);

INSERT INTO scan_voice   (user_id_hash,word,valence_voice,arousal_voice)
VALUES ('hashX','hope',0.6,0.3);

CALL public.refresh_metrics_scan();

SELECT isnt_null(
  (SELECT valence_face_avg FROM metrics_weekly_scan
     WHERE user_id_hash='hashX'), 'vue user alimentée');

SELECT isnt_null(
  (SELECT org_id FROM metrics_weekly_scan_org LIMIT 1),
  'vue org alimentée');

SELECT finish();
ROLLBACK;
