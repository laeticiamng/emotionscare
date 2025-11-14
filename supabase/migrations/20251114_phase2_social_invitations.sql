-- Phase 2: Système d'invitations sociales complet

-- Table pour les profils utilisateurs publics
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  is_public boolean default true,
  show_activity boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table pour les relations d'amitié
create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  friend_id uuid references auth.users(id) on delete cascade not null,
  status text not null check (status in ('active', 'blocked')),
  created_at timestamptz default now(),
  unique(user_id, friend_id)
);

-- Table pour les invitations d'amis
create table if not exists public.friend_invitations (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users(id) on delete cascade not null,
  receiver_id uuid references auth.users(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'cancelled')),
  message text,
  created_at timestamptz default now(),
  responded_at timestamptz,
  unique(sender_id, receiver_id)
);

-- Table pour les suggestions d'amis
create table if not exists public.friend_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  suggested_user_id uuid references auth.users(id) on delete cascade not null,
  reason text, -- 'mutual_friends', 'similar_interests', 'location', etc.
  score numeric(3,2) default 0.5, -- Score de pertinence 0-1
  dismissed boolean default false,
  created_at timestamptz default now(),
  unique(user_id, suggested_user_id)
);

-- Table pour les activités sociales (feed)
create table if not exists public.social_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  activity_type text not null check (activity_type in ('achievement', 'music_share', 'journal_milestone', 'streak', 'badge', 'level_up')),
  activity_data jsonb default '{}'::jsonb,
  is_public boolean default true,
  created_at timestamptz default now()
);

-- Table pour les notifications sociales
create table if not exists public.social_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  notification_type text not null check (notification_type in ('friend_request', 'friend_accept', 'mention', 'comment', 'like', 'share')),
  sender_id uuid references auth.users(id) on delete cascade,
  reference_id uuid, -- ID de l'objet concerné (post, comment, etc.)
  message text,
  read boolean default false,
  created_at timestamptz default now()
);

-- Indexes pour performance
create index if not exists idx_user_profiles_display_name on public.user_profiles(display_name);
create index if not exists idx_friendships_user_id on public.friendships(user_id);
create index if not exists idx_friendships_friend_id on public.friendships(friend_id);
create index if not exists idx_friend_invitations_receiver_id on public.friend_invitations(receiver_id);
create index if not exists idx_friend_invitations_sender_id on public.friend_invitations(sender_id);
create index if not exists idx_friend_invitations_status on public.friend_invitations(status);
create index if not exists idx_friend_suggestions_user_id on public.friend_suggestions(user_id);
create index if not exists idx_social_activities_user_id on public.social_activities(user_id);
create index if not exists idx_social_activities_created_at on public.social_activities(created_at);
create index if not exists idx_social_notifications_user_id on public.social_notifications(user_id);
create index if not exists idx_social_notifications_read on public.social_notifications(read);

-- RLS policies
alter table public.user_profiles enable row level security;
alter table public.friendships enable row level security;
alter table public.friend_invitations enable row level security;
alter table public.friend_suggestions enable row level security;
alter table public.social_activities enable row level security;
alter table public.social_notifications enable row level security;

-- Policies pour user_profiles
create policy "Public profiles are viewable by everyone"
  on public.user_profiles for select
  using (is_public = true or auth.uid() = id);

create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Policies pour friendships
create policy "Users can view their own friendships"
  on public.friendships for select
  using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can create friendships"
  on public.friendships for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own friendships"
  on public.friendships for update
  using (auth.uid() = user_id);

create policy "Users can delete their own friendships"
  on public.friendships for delete
  using (auth.uid() = user_id);

-- Policies pour friend_invitations
create policy "Users can view invitations they sent or received"
  on public.friend_invitations for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send friend invitations"
  on public.friend_invitations for insert
  with check (auth.uid() = sender_id);

create policy "Users can update invitations they received"
  on public.friend_invitations for update
  using (auth.uid() = receiver_id or auth.uid() = sender_id);

-- Policies pour friend_suggestions
create policy "Users can view their own suggestions"
  on public.friend_suggestions for select
  using (auth.uid() = user_id);

create policy "Users can dismiss suggestions"
  on public.friend_suggestions for update
  using (auth.uid() = user_id);

-- Policies pour social_activities
create policy "Users can view public activities and their own"
  on public.social_activities for select
  using (
    is_public = true or
    auth.uid() = user_id or
    exists (
      select 1 from public.friendships
      where (user_id = auth.uid() and friend_id = social_activities.user_id)
         or (friend_id = auth.uid() and user_id = social_activities.user_id)
    )
  );

create policy "Users can create their own activities"
  on public.social_activities for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own activities"
  on public.social_activities for update
  using (auth.uid() = user_id);

create policy "Users can delete their own activities"
  on public.social_activities for delete
  using (auth.uid() = user_id);

-- Policies pour social_notifications
create policy "Users can view their own notifications"
  on public.social_notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.social_notifications for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notifications"
  on public.social_notifications for delete
  using (auth.uid() = user_id);

-- Fonction pour créer automatiquement un profil lors de l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger pour créer automatiquement le profil
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Fonction pour accepter une invitation d'ami
create or replace function public.accept_friend_invitation(invitation_id uuid)
returns void as $$
declare
  v_sender_id uuid;
  v_receiver_id uuid;
begin
  -- Récupérer les IDs
  select sender_id, receiver_id into v_sender_id, v_receiver_id
  from public.friend_invitations
  where id = invitation_id and receiver_id = auth.uid() and status = 'pending';

  if not found then
    raise exception 'Invitation not found or not pending';
  end if;

  -- Mettre à jour l'invitation
  update public.friend_invitations
  set status = 'accepted', responded_at = now()
  where id = invitation_id;

  -- Créer les relations d'amitié (bidirectionnelles)
  insert into public.friendships (user_id, friend_id, status)
  values (v_sender_id, v_receiver_id, 'active')
  on conflict (user_id, friend_id) do nothing;

  insert into public.friendships (user_id, friend_id, status)
  values (v_receiver_id, v_sender_id, 'active')
  on conflict (user_id, friend_id) do nothing;

  -- Créer une notification pour l'émetteur
  insert into public.social_notifications (user_id, notification_type, sender_id, message)
  values (v_sender_id, 'friend_accept', v_receiver_id, 'a accepté votre demande d''ami');
end;
$$ language plpgsql security definer;
