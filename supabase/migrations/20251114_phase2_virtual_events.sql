-- Phase 2: Événements virtuels avec visio intégrée

-- Table pour les événements virtuels
create table if not exists public.virtual_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_type text not null check (event_type in ('therapy', 'meditation', 'workshop', 'support_group', 'coaching', 'webinar', 'other')),
  host_id uuid references auth.users(id) on delete cascade not null,

  -- Dates et horaires
  start_time timestamptz not null,
  end_time timestamptz not null,
  timezone text default 'UTC',

  -- Visio configuration
  platform text not null check (platform in ('zoom', 'google_meet', 'teams', 'custom')),
  meeting_url text,
  meeting_id text,
  meeting_password text,
  platform_metadata jsonb default '{}'::jsonb,

  -- Participants
  max_participants integer,
  current_participants integer default 0,
  require_approval boolean default false,
  is_public boolean default false,

  -- Status
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'completed', 'cancelled')),

  -- Metadata
  tags text[] default array[]::text[],
  cover_image_url text,
  recording_url text,
  recording_available boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table pour les participants aux événements
create table if not exists public.event_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.virtual_events(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  status text not null default 'registered' check (status in ('registered', 'approved', 'declined', 'attended', 'cancelled')),
  registered_at timestamptz default now(),
  attended_at timestamptz,
  notes text,
  unique(event_id, user_id)
);

-- Table pour les rappels d'événements
create table if not exists public.event_reminders (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.virtual_events(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  remind_at timestamptz not null,
  reminder_type text not null check (reminder_type in ('email', 'notification', 'sms')),
  sent boolean default false,
  sent_at timestamptz,
  created_at timestamptz default now(),
  unique(event_id, user_id, remind_at)
);

-- Table pour les enregistrements et ressources
create table if not exists public.event_resources (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.virtual_events(id) on delete cascade not null,
  title text not null,
  description text,
  resource_type text not null check (resource_type in ('document', 'video', 'audio', 'link', 'other')),
  url text not null,
  file_size integer,
  is_public boolean default false,
  created_at timestamptz default now()
);

-- Table pour les séries d'événements récurrents
create table if not exists public.event_series (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  host_id uuid references auth.users(id) on delete cascade not null,
  recurrence_rule text not null, -- RRULE format (iCal)
  event_template jsonb not null, -- Template pour créer les événements
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_virtual_events_host_id on public.virtual_events(host_id);
create index if not exists idx_virtual_events_start_time on public.virtual_events(start_time);
create index if not exists idx_virtual_events_status on public.virtual_events(status);
create index if not exists idx_virtual_events_platform on public.virtual_events(platform);
create index if not exists idx_event_participants_event_id on public.event_participants(event_id);
create index if not exists idx_event_participants_user_id on public.event_participants(user_id);
create index if not exists idx_event_reminders_user_id on public.event_reminders(user_id);
create index if not exists idx_event_reminders_remind_at on public.event_reminders(remind_at);

-- RLS
alter table public.virtual_events enable row level security;
alter table public.event_participants enable row level security;
alter table public.event_reminders enable row level security;
alter table public.event_resources enable row level security;
alter table public.event_series enable row level security;

-- Policies pour virtual_events
create policy "Public events are viewable by all authenticated users"
  on public.virtual_events for select
  using (
    is_public = true or
    auth.uid() = host_id or
    exists (
      select 1 from public.event_participants
      where event_id = id and user_id = auth.uid()
    )
  );

create policy "Users can create their own events"
  on public.virtual_events for insert
  with check (auth.uid() = host_id);

create policy "Hosts can update their own events"
  on public.virtual_events for update
  using (auth.uid() = host_id);

create policy "Hosts can delete their own events"
  on public.virtual_events for delete
  using (auth.uid() = host_id);

-- Policies pour event_participants
create policy "Participants can view participants of events they're in"
  on public.event_participants for select
  using (
    exists (
      select 1 from public.virtual_events
      where id = event_id
      and (is_public = true or host_id = auth.uid() or
           exists (select 1 from public.event_participants ep where ep.event_id = event_id and ep.user_id = auth.uid()))
    )
  );

create policy "Users can register for events"
  on public.event_participants for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own participation"
  on public.event_participants for update
  using (auth.uid() = user_id or exists (select 1 from public.virtual_events where id = event_id and host_id = auth.uid()));

create policy "Users can cancel their own participation"
  on public.event_participants for delete
  using (auth.uid() = user_id);

-- Policies pour event_reminders
create policy "Users can view their own reminders"
  on public.event_reminders for select
  using (auth.uid() = user_id);

create policy "Users can create their own reminders"
  on public.event_reminders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reminders"
  on public.event_reminders for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reminders"
  on public.event_reminders for delete
  using (auth.uid() = user_id);

-- Policies pour event_resources
create policy "Users can view resources of events they have access to"
  on public.event_resources for select
  using (
    is_public = true or
    exists (
      select 1 from public.virtual_events
      where id = event_id
      and (host_id = auth.uid() or
           exists (select 1 from public.event_participants where event_id = event_resources.event_id and user_id = auth.uid()))
    )
  );

create policy "Event hosts can manage resources"
  on public.event_resources for all
  using (exists (select 1 from public.virtual_events where id = event_id and host_id = auth.uid()));

-- Policies pour event_series
create policy "Users can view public series or their own"
  on public.event_series for select
  using (auth.uid() = host_id or is_active = true);

create policy "Users can create their own series"
  on public.event_series for insert
  with check (auth.uid() = host_id);

create policy "Users can update their own series"
  on public.event_series for update
  using (auth.uid() = host_id);

create policy "Users can delete their own series"
  on public.event_series for delete
  using (auth.uid() = host_id);

-- Fonction pour vérifier et mettre à jour le status des événements
create or replace function public.update_event_status()
returns void as $$
begin
  -- Marquer les événements comme "live" s'ils ont commencé
  update public.virtual_events
  set status = 'live'
  where status = 'scheduled'
  and start_time <= now()
  and end_time > now();

  -- Marquer les événements comme "completed" s'ils sont terminés
  update public.virtual_events
  set status = 'completed'
  where status in ('scheduled', 'live')
  and end_time <= now();
end;
$$ language plpgsql security definer;

-- Fonction pour mettre à jour le compteur de participants
create or replace function public.update_participants_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' and new.status in ('registered', 'approved', 'attended') then
    update public.virtual_events
    set current_participants = current_participants + 1
    where id = new.event_id;
  elsif TG_OP = 'UPDATE' then
    if old.status in ('registered', 'approved', 'attended') and new.status not in ('registered', 'approved', 'attended') then
      update public.virtual_events
      set current_participants = current_participants - 1
      where id = new.event_id;
    elsif old.status not in ('registered', 'approved', 'attended') and new.status in ('registered', 'approved', 'attended') then
      update public.virtual_events
      set current_participants = current_participants + 1
      where id = new.event_id;
    end if;
  elsif TG_OP = 'DELETE' and old.status in ('registered', 'approved', 'attended') then
    update public.virtual_events
    set current_participants = current_participants - 1
    where id = old.event_id;
  end if;

  return coalesce(new, old);
end;
$$ language plpgsql security definer;

-- Trigger pour mettre à jour automatiquement le compteur
create trigger on_participant_change
  after insert or update or delete on public.event_participants
  for each row execute function public.update_participants_count();
