-- migrate:up
-- Ensure assessments table enforces text-only summaries and tightened RLS
alter table public.assessments enable row level security;

-- Replace permissive policy with explicit select/insert only
drop policy if exists "assess_all_own" on public.assessments;
drop policy if exists "assess_insert_own" on public.assessments;
create policy "assess_insert_own" on public.assessments
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "assess_select_own" on public.assessments;
create policy "assess_select_own" on public.assessments
  for select
  using (auth.uid() = user_id);

-- Prevent updates by omitting update policy, but make it explicit for clarity
drop policy if exists "assess_update_none" on public.assessments;
create policy "assess_update_none" on public.assessments
  for update
  using (false)
  with check (false);

-- Enforce minimal JSON payload (summary text + level only)
alter table public.assessments drop constraint if exists assessments_score_json_sanitized;
alter table public.assessments
  add constraint assessments_score_json_sanitized
  check (
    jsonb_typeof(score_json) = 'object'
    and score_json ? 'summary'
    and jsonb_typeof(score_json->'summary') = 'string'
    and trim((score_json->>'summary')) <> ''
    and score_json ? 'level'
    and jsonb_typeof(score_json->'level') = 'number'
    and ((score_json->>'level')::int between 0 and 4)
    and (not score_json ? 'raw_values')
  );

-- Org level rollups: enable RLS and lock down access
alter table public.org_assess_rollups enable row level security;

drop policy if exists "org_rollups_all" on public.org_assess_rollups;
drop policy if exists "org_rollups_select" on public.org_assess_rollups;
drop policy if exists "org_rollups_insert" on public.org_assess_rollups;

create policy "org_rollups_service_write" on public.org_assess_rollups
  for insert
  with check (auth.role() = 'service_role');

create policy "org_rollups_service_select" on public.org_assess_rollups
  for select
  using (auth.role() = 'service_role' or exists (
    select 1
    from public.org_memberships m
    where m.org_id = org_id
      and m.user_id = auth.uid()
      and coalesce(m.status, 'active') = 'active'
  ));

create policy "org_rollups_block_update" on public.org_assess_rollups
  for update
  using (false)
  with check (false);

create policy "org_rollups_block_delete" on public.org_assess_rollups
  for delete
  using (false);

-- migrate:down
alter table public.assessments drop constraint if exists assessments_score_json_sanitized;

drop policy if exists "assess_insert_own" on public.assessments;
drop policy if exists "assess_select_own" on public.assessments;
drop policy if exists "assess_update_none" on public.assessments;

create policy "assess_all_own" on public.assessments
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.org_assess_rollups disable row level security;
drop policy if exists "org_rollups_service_write" on public.org_assess_rollups;
drop policy if exists "org_rollups_service_select" on public.org_assess_rollups;
drop policy if exists "org_rollups_block_update" on public.org_assess_rollups;
drop policy if exists "org_rollups_block_delete" on public.org_assess_rollups;
