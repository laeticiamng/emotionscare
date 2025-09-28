-- migrate:up
-- Agrégations B2B : texte uniquement, n >= 5 obligatoire
create table if not exists public.org_assess_rollups (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  period text not null,
  instrument text not null,
  n int not null,
  text_summary text not null,
  created_at timestamptz not null default now(),
  unique (org_id, period, instrument)
);

create index if not exists idx_rollups_org_period on public.org_assess_rollups(org_id, period);
create index if not exists idx_rollups_instr on public.org_assess_rollups(instrument);

alter table public.org_assess_rollups
  add constraint org_rollups_min_n check (n >= 5);

-- migrate:down
alter table if exists public.org_assess_rollups drop constraint if exists org_rollups_min_n;
drop table if exists public.org_assess_rollups cascade;
