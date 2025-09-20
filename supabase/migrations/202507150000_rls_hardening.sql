-- Activer RLS partout
alter table public.consents            enable row level security;
alter table public.assessments        enable row level security;
alter table public.org_assess_rollups enable row level security;
alter table public.orgs               enable row level security;
alter table public.org_members        enable row level security;
alter table public.org_invites        enable row level security;
alter table public.org_events         enable row level security;
alter table public.org_event_rsvps    enable row level security;
alter table public.org_audit_logs     enable row level security;

-- (Optionnel si présents)
do $$ begin
  if to_regclass('public.sessions') is not null then
    execute 'alter table public.sessions enable row level security';
  end if;
  if to_regclass('public.profiles') is not null then
    execute 'alter table public.profiles enable row level security';
  end if;
  if to_regclass('public.favorites') is not null then
    execute 'alter table public.favorites enable row level security';
  end if;
  if to_regclass('public.coach_logs') is not null then
    execute 'alter table public.coach_logs enable row level security';
  end if;
  if to_regclass('public.emotion_scans') is not null then
    execute 'alter table public.emotion_scans enable row level security';
  end if;
  if to_regclass('public.mood_presets') is not null then
    execute 'alter table public.mood_presets enable row level security';
  end if;
end $$;

-- Politiques "self" (user scope)
drop policy if exists consents_self_rw on public.consents;
create policy "consents_self_rw"
  on public.consents
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists assessments_self_rw on public.assessments;
create policy "assessments_self_rw"
  on public.assessments
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Rollups B2B : lecture org + min_n>=5
drop policy if exists org_rollups_read_min5 on public.org_assess_rollups;
create policy "org_rollups_read_min5"
  on public.org_assess_rollups
  for select
  using (
    org_id::text = coalesce(auth.jwt() ->> 'org_id','') and n >= 5
  );

-- Accès entités org : lecture/écriture limitée à l’org du JWT
drop policy if exists orgs_read_member on public.orgs;
create policy "orgs_read_member"
  on public.orgs
  for select
  using (id::text = coalesce(auth.jwt() ->> 'org_id',''));

drop policy if exists org_members_rw_member on public.org_members;
create policy "org_members_rw_member"
  on public.org_members
  for all
  using (org_id::text = coalesce(auth.jwt() ->> 'org_id',''))
  with check (org_id::text = coalesce(auth.jwt() ->> 'org_id',''));

drop policy if exists org_invites_read_org on public.org_invites;
create policy "org_invites_read_org"
  on public.org_invites
  for select
  using (org_id::text = coalesce(auth.jwt() ->> 'org_id',''));

drop policy if exists org_events_rw_member on public.org_events;
create policy "org_events_rw_member"
  on public.org_events
  for all
  using (org_id::text = coalesce(auth.jwt() ->> 'org_id',''))
  with check (org_id::text = coalesce(auth.jwt() ->> 'org_id',''));

drop policy if exists org_event_rsvps_rw_member on public.org_event_rsvps;
create policy "org_event_rsvps_rw_member"
  on public.org_event_rsvps
  for all
  using (org_id::text = coalesce(auth.jwt() ->> 'org_id',''))
  with check (org_id::text = coalesce(auth.jwt() ->> 'org_id',''));

drop policy if exists org_audit_logs_read_org on public.org_audit_logs;
create policy "org_audit_logs_read_org"
  on public.org_audit_logs
  for select
  using (org_id::text = coalesce(auth.jwt() ->> 'org_id',''));
