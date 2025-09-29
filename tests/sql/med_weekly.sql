BEGIN;
SELECT plan(3);

-- Données factices ---------------------------------------------
INSERT INTO flow_walk
  (user_id_hash, steps, cadence_spm, breath_rate_rpm,
   coherence_pct, rmssd_delta, mvpa_min)
VALUES ('hashA', 350, 100, 16.6, 90, 25, 18);

INSERT INTO glow_mug
  (user_id_hash, hr_pre, hr_post, hr_drop_bpm, calm_score, sms1, mood_emoji)
VALUES ('hashA', 70, 64, 6, 3, 4, '🙂');

CALL public.refresh_metrics_breath();

SELECT is_not_null(
  (SELECT org_hrv_idx FROM metrics_weekly_breath_org
     WHERE org_id IS NOT NULL LIMIT 1),
  'vue org peuplée');

SELECT is(
 (SELECT relax_idx FROM metrics_weekly_breath
   WHERE user_id_hash='hashA'), 6, 'relax_idx ok');

SELECT finish();
ROLLBACK;
