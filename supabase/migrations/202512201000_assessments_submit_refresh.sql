-- migrate:up
alter table public.assessments
  add column if not exists submitted_at timestamptz;

alter table public.assessments
  add column if not exists created_at timestamptz default now();

update public.assessments
  set submitted_at = coalesce(submitted_at, ts, now())
where submitted_at is null;

update public.assessments
  set created_at = coalesce(created_at, ts, now())
where created_at is null;

alter table public.assessments
  alter column submitted_at set not null;

alter table public.assessments
  alter column submitted_at set default now();

alter table public.assessments
  alter column created_at set not null;

alter table public.assessments
  alter column created_at set default now();

alter table public.assessments
  alter column user_id set default auth.uid();

create index if not exists idx_assessments_user_created on public.assessments (user_id, created_at desc);
create index if not exists idx_assessments_instrument on public.assessments (instrument);

-- migrate:down
alter table public.assessments alter column user_id drop default;
alter table public.assessments alter column created_at drop default;
alter table public.assessments alter column submitted_at drop default;
alter table public.assessments alter column created_at drop not null;
alter table public.assessments alter column submitted_at drop not null;
alter table public.assessments drop column if exists created_at;
alter table public.assessments drop column if exists submitted_at;
