-- ECC-B2B-01B — Monthly reports support

create table if not exists public.org_action_hints (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  period text not null,
  team_id uuid,
  instrument text not null,
  action_text text not null,
  created_at timestamptz default now()
);

create unique index if not exists org_action_hints_period_key
  on public.org_action_hints (org_id, period, instrument, coalesce(team_id, '00000000-0000-0000-0000-000000000000'::uuid));

alter table public.org_action_hints enable row level security;

create policy "action_hints_read_org" on public.org_action_hints
  for select using (auth.jwt() ->> 'org_id' = org_id::text);

create policy "action_hints_write_service" on public.org_action_hints
  for insert with check (auth.role() = 'service_role');

create materialized view if not exists public.org_heatmap_trend_mv as
select
  cur.org_id,
  cur.period,
  cur.team_id,
  cur.team_label,
  cur.instrument,
  cur.text_summary as summary_now,
  prev.text_summary as summary_prev
from org_heatmap_mv cur
left join org_heatmap_mv prev
  on prev.org_id = cur.org_id
 and coalesce(prev.team_id, '00000000-0000-0000-0000-000000000000') = coalesce(cur.team_id, '00000000-0000-0000-0000-000000000000')
 and prev.instrument = cur.instrument
 and prev.period = to_char((to_date(cur.period || '-01', 'YYYY-MM-DD') - interval '1 month'), 'YYYY-MM');

create index if not exists org_heatmap_trend_org_period_idx
  on public.org_heatmap_trend_mv (org_id, period);
