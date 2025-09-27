BEGIN;
SELECT plan(2);

-- Mock : deux sessions Bio-Nebula, une session Glow-Collective
INSERT INTO vr_nebula_sessions
  (user_id_hash, ts_finish, rmssd_delta, coherence_score)
VALUES
 ('hashA', date_trunc('week', now()), 18, 70),
 ('hashA', date_trunc('week', now()) + interval '1 day', 22, 80);

INSERT INTO vr_dome_sessions
  (user_id_hash, ts, hr_std, valence)
VALUES ('hashA', date_trunc('week', now()), 6.0, 0.25);

INSERT INTO user_org_map VALUES ('hashA', '00000000-0000-0000-0000-00000000AAAA')
ON CONFLICT (user_id_hash) DO NOTHING;

CALL public.refresh_metrics_vr();

/* métrique perso */
SELECT is(
 (SELECT hrv_gain_median FROM public.metrics_weekly_vr
  WHERE user_id_hash='hashA'), 20, 'median ΔRMSSD ok');

/* métrique org */
SELECT ok(
 (SELECT org_sync_idx FROM public.metrics_weekly_vr_org
  WHERE org_id='00000000-0000-0000-0000-00000000AAAA') IS NOT NULL,
 'org sync idx calculé');

SELECT finish();
ROLLBACK;
