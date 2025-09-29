-- Setup feature flags for clinical assessments
INSERT INTO clinical_feature_flags (flag_name, is_enabled, rollout_percentage, instrument_domain, metadata) VALUES
  ('assess_who5', true, 100, 'well_being', '{"frequency": "weekly", "ui_priority": "high"}'),
  ('assess_sam', true, 100, 'emotion', '{"frequency": "instant", "ui_priority": "high"}'),
  ('assess_stai6', true, 100, 'anxiety', '{"frequency": "session", "ui_priority": "medium"}'),
  ('assess_poms_sf', false, 0, 'mood', '{"frequency": "session", "ui_priority": "medium"}'),
  ('assess_panas10', false, 0, 'emotion', '{"frequency": "monthly", "ui_priority": "low"}'),
  ('assess_pss10', false, 0, 'stress', '{"frequency": "weekly", "ui_priority": "medium"}'),
  ('assess_suds', true, 100, 'anxiety', '{"frequency": "instant", "ui_priority": "high"}')
ON CONFLICT (flag_name) 
DO UPDATE SET 
  is_enabled = EXCLUDED.is_enabled,
  rollout_percentage = EXCLUDED.rollout_percentage,
  updated_at = now();