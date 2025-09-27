-- migrate:up
-- Harmonise org_assess_rollups with text-only aggregates and strict RLS
alter table public.org_assess_rollups
  drop constraint if exists org_rollups_min_n;

alter table public.org_assess_rollups
  add constraint org_rollups_min_n_non_negative check (n >= 0);

create index if not exists org_assess_rollups_org_period_idx
  on public.org_assess_rollups (org_id, period);

create index if not exists org_assess_rollups_org_period_instr_idx
  on public.org_assess_rollups (org_id, period, instrument);

alter table public.org_assess_rollups enable row level security;

drop policy if exists "org_rollups_service_write" on public.org_assess_rollups;
drop policy if exists "org_rollups_service_select" on public.org_assess_rollups;
drop policy if exists "org_rollups_block_update" on public.org_assess_rollups;
drop policy if exists "org_rollups_block_delete" on public.org_assess_rollups;
drop policy if exists "org_rollups_read_min5" on public.org_assess_rollups;
drop policy if exists "org_rollups_write_service" on public.org_assess_rollups;
drop policy if exists "org_rollups_update_service" on public.org_assess_rollups;

drop policy if exists "org_rollups_admin_access" on public.org_assess_rollups;
drop policy if exists "org_rollups_min_n_guard" on public.org_assess_rollups;

create policy "org_rollups_read_min5"
  on public.org_assess_rollups
  for select
  using (
    (auth.jwt() ->> 'org_id')::uuid = org_id
    and n >= 5
  );

create policy "org_rollups_write_service"
  on public.org_assess_rollups
  for insert
  to service_role
  with check (true);

create policy "org_rollups_update_service"
  on public.org_assess_rollups
  for update
  to service_role
  using (true)
  with check (true);

-- migrate:down
alter table public.org_assess_rollups
  drop constraint if exists org_rollups_min_n_non_negative;

alter table public.org_assess_rollups
  add constraint org_rollups_min_n check (n >= 5);

drop index if exists org_assess_rollups_org_period_idx;
drop index if exists org_assess_rollups_org_period_instr_idx;

drop policy if exists "org_rollups_read_min5" on public.org_assess_rollups;
drop policy if exists "org_rollups_write_service" on public.org_assess_rollups;
drop policy if exists "org_rollups_update_service" on public.org_assess_rollups;

create policy "org_rollups_service_write" on public.org_assess_rollups
  for insert
  with check (auth.role() = 'service_role');

create policy "org_rollups_service_select" on public.org_assess_rollups
  for select
  using (auth.role() = 'service_role');

create policy "org_rollups_block_update" on public.org_assess_rollups
  for update
  using (false)
  with check (false);

create policy "org_rollups_block_delete" on public.org_assess_rollups
  for delete
  using (false);
