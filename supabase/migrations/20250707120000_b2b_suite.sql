-- B2B Suite migration: organisations, invitations, events, audit logs

create table if not exists public.orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.org_members (
  org_id uuid not null references public.orgs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','manager','member')),
  invited_at timestamptz,
  joined_at timestamptz default now(),
  primary key (org_id, user_id)
);

alter table public.orgs enable row level security;
alter table public.org_members enable row level security;

create table if not exists public.org_invites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  email_hash text not null,
  role text not null check (role in ('manager','member')),
  token_hash text not null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz default now()
);

alter table public.org_invites enable row level security;

create table if not exists public.org_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text,
  reminders jsonb not null default '{"email": false, "push": false}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

alter table public.org_events enable row level security;

create table if not exists public.org_event_rsvps (
  event_id uuid not null references public.org_events(id) on delete cascade,
  org_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('yes','no','maybe')),
  updated_at timestamptz default now(),
  primary key (event_id, user_id)
);

alter table public.org_event_rsvps enable row level security;

create table if not exists public.org_audit_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  occurred_at timestamptz default now(),
  actor_hash text,
  event text not null,
  target text,
  text_summary text not null
);

alter table public.org_audit_logs enable row level security;

create policy "orgs_read_member" on public.orgs for select
  using (id::text = auth.jwt()->>'org_id');

create policy "org_members_rw_member" on public.org_members for all
  using (org_id::text = auth.jwt()->>'org_id')
  with check (org_id::text = auth.jwt()->>'org_id');

create policy "org_invites_read_org" on public.org_invites for select
  using (org_id::text = auth.jwt()->>'org_id');

create policy "org_events_rw_member" on public.org_events for all
  using (org_id::text = auth.jwt()->>'org_id')
  with check (org_id::text = auth.jwt()->>'org_id');

create policy "org_event_rsvps_rw_member" on public.org_event_rsvps for all
  using (org_id::text = auth.jwt()->>'org_id')
  with check (org_id::text = auth.jwt()->>'org_id');

create policy "org_audit_logs_read_org" on public.org_audit_logs for select
  using (org_id::text = auth.jwt()->>'org_id');

