-- 1. VUE PAR UTILISATEUR -----------------------------------------
create materialized view if not exists public.metrics_weekly_music as
select
  user_id_hash,
  date_trunc('week', coalesce(ts_start, ts))::date as week_start,

  percentile_cont(0.5) within group (order by rmssd_delta) as hrv_stress_idx,
  avg(case when energy_mode = 'calm' then coherence end)     as coherence_avg,
  sum(mvpa_min)                                              as mvpa_min,
  avg(joy_idx)                                               as joy_avg

from (
  select user_id_hash, ts_start, rmssd_delta, coherence, energy_mode,
         null::int as mvpa_min, null::real as joy_idx
  from public.biotune_sessions
  union all
  select user_id_hash, ts, null::int, null::real, null::text,
         mvpa_min, joy_idx
  from public.neon_walk_sessions
) u
group by user_id_hash, week_start
with no data;

create unique index if not exists metrics_weekly_music_pk
  on public.metrics_weekly_music (user_id_hash, week_start);

-- 2. VUE PAR ORGANISATION ----------------------------------------
create materialized view if not exists public.metrics_weekly_music_org as
select
  map.org_id,
  m.week_start,
  count(*)                                  as members,
  avg(hrv_stress_idx)                       as org_hrv_idx,
  avg(coherence_avg)                        as org_coherence,
  avg(mvpa_min)                             as org_mvpa,
  avg(joy_avg)                              as org_joy
from public.metrics_weekly_music m
join public.user_org_map map using (user_id_hash)
group by map.org_id, m.week_start
with no data;

create unique index if not exists metrics_weekly_music_org_pk
  on public.metrics_weekly_music_org (org_id, week_start);
