-- migrate:up
update public.clinical_feature_flags
set is_enabled = false, rollout_percentage = 0
where flag_name in (
  'FF_ASSESS_WHO5',
  'FF_ASSESS_STAI6',
  'FF_ASSESS_PANAS',
  'FF_ASSESS_PSS10',
  'FF_ASSESS_WEMWBS',
  'FF_ASSESS_CBI',
  'FF_ASSESS_UWES'
);

-- migrate:down
-- Down migration restores previous defaults for documentation purposes only
update public.clinical_feature_flags
set is_enabled = true, rollout_percentage = 100
where flag_name in (
  'FF_ASSESS_WHO5',
  'FF_ASSESS_STAI6',
  'FF_ASSESS_PANAS'
);
