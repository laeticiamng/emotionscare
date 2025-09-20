-- migrate:up
-- B2B heatmap materialized view exposing text-only summaries per team/instrument
create materialized view if not exists public.org_heatmap_mv as
select
  r.org_id,
  r.period,
  r.team_id,
  r.instrument,
  r.n,
  r.text_summary
from public.org_assess_rollups r;

create index if not exists org_heatmap_mv_idx
  on public.org_heatmap_mv (org_id, period, team_id, instrument);

-- migrate:down
drop index if exists org_heatmap_mv_idx;
drop materialized view if exists public.org_heatmap_mv;
