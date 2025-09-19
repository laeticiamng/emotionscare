-- migrate:up
-- Table individuelle : jamais stocker de réponses brutes, uniquement un résumé strict
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  instrument text not null,
  score_json jsonb not null,
  ts timestamptz not null default now()
);

create index if not exists idx_assessments_user_ts on public.assessments(user_id, ts desc);
create index if not exists idx_assessments_instr_ts on public.assessments(instrument, ts desc);

alter table public.assessments enable row level security;

-- Owner-only policies: select/insert/update/delete restricted to auth.uid()
drop policy if exists "assess_select_own" on public.assessments;
create policy "assess_select_own" on public.assessments
  for select using (auth.uid() = user_id);

drop policy if exists "assess_all_own" on public.assessments;
create policy "assess_all_own" on public.assessments
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- migrate:down
drop table if exists public.assessments cascade;
