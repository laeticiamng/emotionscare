-- migrate:up
-- Ensure query performance indexes exist for assessments and rollups
create index if not exists idx_assessments_instrument_ts on public.assessments (instrument, ts desc);
create index if not exists idx_org_rollups_org_period_instrument on public.org_assess_rollups (org_id, period, instrument);

-- Harden RLS for assessments: owner access enforced
alter table public.assessments enable row level security;
alter table public.assessments force row level security;

drop policy if exists "assessments_owner_access" on public.assessments;
drop policy if exists "assessments_select_own" on public.assessments;
drop policy if exists "assessments_insert_own" on public.assessments;
drop policy if exists "assess_all_own" on public.assessments;
drop policy if exists "assess_select_own" on public.assessments;

create policy "assessments_owner_access" on public.assessments
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Harden RLS for clinical_signals: owner access enforced
alter table public.clinical_signals enable row level security;
alter table public.clinical_signals force row level security;

drop policy if exists "clinical_signals_owner_access" on public.clinical_signals;
drop policy if exists "signals_select_own" on public.clinical_signals;
drop policy if exists "signals_manage_own" on public.clinical_signals;

drop policy if exists "signals_service_access" on public.clinical_signals;

create policy "clinical_signals_owner_access" on public.clinical_signals
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "clinical_signals_service_access" on public.clinical_signals
  for all using (auth.jwt() ->> 'role' = 'service_role')
  with check (true);

-- Enforce minimum cohort size via RLS on org_assess_rollups
alter table public.org_assess_rollups enable row level security;
alter table public.org_assess_rollups force row level security;

drop policy if exists "org_rollups_admin_access" on public.org_assess_rollups;

drop policy if exists "org_rollups_min_n_guard" on public.org_assess_rollups;

create policy "org_rollups_min_n_guard" on public.org_assess_rollups
  for all using (
    n >= 5
    and (
      auth.jwt() ->> 'role' = 'service_role'
      or exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role in ('admin', 'b2b_manager')
      )
    )
  )
  with check (n >= 5);

-- migrate:down
-- Roll back indexes
drop index if exists idx_org_rollups_org_period_instrument;
drop index if exists idx_assessments_instrument_ts;

-- Restore previous assessment policies
alter table public.assessments no force row level security;
alter table public.assessments disable row level security;
alter table public.assessments enable row level security;

create policy "assessments_select_own" on public.assessments
  for select using (auth.uid() = user_id);

create policy "assessments_insert_own" on public.assessments
  for insert with check (auth.uid() = user_id);

create policy "assess_all_own" on public.assessments
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Restore clinical_signals policies
alter table public.clinical_signals no force row level security;
alter table public.clinical_signals disable row level security;
alter table public.clinical_signals enable row level security;

create policy "signals_select_own" on public.clinical_signals
  for select using (auth.uid() = user_id);

create policy "signals_manage_own" on public.clinical_signals
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "signals_service_access" on public.clinical_signals
  for all using (auth.jwt() ->> 'role' = 'service_role');

-- Restore rollup policy baseline
alter table public.org_assess_rollups no force row level security;
alter table public.org_assess_rollups disable row level security;
alter table public.org_assess_rollups enable row level security;

create policy "org_rollups_admin_access" on public.org_assess_rollups
  for all using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'b2b_manager')
    )
  );
