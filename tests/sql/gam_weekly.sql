BEGIN;
SELECT plan(3);

-- Insère trois lignes d’exemple (une par table) ---------------
INSERT INTO echo_crystal
  (user_id_hash, joy_idx, arousal_voice, laugh_db, laugh_pitch,
   crystal_type, color_hex, sparkle_level)
VALUES ('hashX', 0.9, 0.4, 70, 260,'gem','#FF88CC',0.9);

INSERT INTO bb_chain (user_id_hash) VALUES ('hashX'); -- depth 0
INSERT INTO bb_chain (user_id_hash,parent_id) SELECT 'hashX', id FROM bb_chain WHERE depth=0; -- depth 1

INSERT INTO neon_challenge (user_id_hash, steps, km, streak_flag)
VALUES ('hashX', 4000, 3.2, true);

CALL public.refresh_metrics_gam();

SELECT is(
  (SELECT shares_total FROM metrics_weekly_gam WHERE user_id_hash='hashX'), 2,
  'shares_total agrégé');

SELECT ok(
  (SELECT mvpa_min FROM metrics_weekly_gam WHERE user_id_hash='hashX') > 0,
  'mvpa agrégé');

SELECT isnt_null(
  (SELECT pa_org_avg FROM metrics_weekly_gam_org LIMIT 1),
  'vue org peuplée');

SELECT finish();
ROLLBACK;
