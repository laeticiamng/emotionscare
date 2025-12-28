-- Tables pour le module social et collaboratif de /app/music

-- Table music_friends: amis et connexions sociales musicales
CREATE TABLE IF NOT EXISTS public.music_friends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  friend_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Enable RLS
ALTER TABLE public.music_friends ENABLE ROW LEVEL SECURITY;

-- Policies for music_friends
CREATE POLICY "Users can view their own friend connections" 
ON public.music_friends 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friend requests" 
ON public.music_friends 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their friend connections" 
ON public.music_friends 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can delete their friend connections" 
ON public.music_friends 
FOR DELETE 
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Table music_challenges: défis musicaux entre utilisateurs
CREATE TABLE IF NOT EXISTS public.music_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  participant_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT NOT NULL DEFAULT 'listening' CHECK (challenge_type IN ('listening', 'creation', 'discovery', 'streak')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired', 'cancelled')),
  goal_value INTEGER DEFAULT 10,
  creator_progress INTEGER DEFAULT 0,
  participant_progress INTEGER DEFAULT 0,
  reward_points INTEGER DEFAULT 100,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.music_challenges ENABLE ROW LEVEL SECURITY;

-- Policies for music_challenges
CREATE POLICY "Users can view challenges they created or participate in" 
ON public.music_challenges 
FOR SELECT 
USING (auth.uid() = creator_id OR auth.uid() = participant_id);

CREATE POLICY "Users can create challenges" 
ON public.music_challenges 
FOR INSERT 
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators and participants can update challenges" 
ON public.music_challenges 
FOR UPDATE 
USING (auth.uid() = creator_id OR auth.uid() = participant_id);

CREATE POLICY "Creators can delete their challenges" 
ON public.music_challenges 
FOR DELETE 
USING (auth.uid() = creator_id);

-- Table collaborative_playlists: playlists collaboratives
CREATE TABLE IF NOT EXISTS public.collaborative_playlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  invite_code TEXT UNIQUE,
  max_collaborators INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.collaborative_playlists ENABLE ROW LEVEL SECURITY;

-- Policies for collaborative_playlists
CREATE POLICY "Public playlists are viewable by everyone" 
ON public.collaborative_playlists 
FOR SELECT 
USING (is_public = true OR auth.uid() = owner_id);

CREATE POLICY "Users can create playlists" 
ON public.collaborative_playlists 
FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their playlists" 
ON public.collaborative_playlists 
FOR UPDATE 
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their playlists" 
ON public.collaborative_playlists 
FOR DELETE 
USING (auth.uid() = owner_id);

-- Table collaborative_playlist_members: membres des playlists collaboratives
CREATE TABLE IF NOT EXISTS public.collaborative_playlist_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID NOT NULL REFERENCES public.collaborative_playlists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(playlist_id, user_id)
);

-- Enable RLS
ALTER TABLE public.collaborative_playlist_members ENABLE ROW LEVEL SECURITY;

-- Policies for collaborative_playlist_members
CREATE POLICY "Members can view playlist membership" 
ON public.collaborative_playlist_members 
FOR SELECT 
USING (auth.uid() = user_id OR EXISTS (
  SELECT 1 FROM public.collaborative_playlists 
  WHERE id = playlist_id AND owner_id = auth.uid()
));

CREATE POLICY "Playlist owners can add members" 
ON public.collaborative_playlist_members 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.collaborative_playlists 
  WHERE id = playlist_id AND owner_id = auth.uid()
) OR auth.uid() = user_id);

CREATE POLICY "Playlist owners can update members" 
ON public.collaborative_playlist_members 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.collaborative_playlists 
  WHERE id = playlist_id AND owner_id = auth.uid()
));

CREATE POLICY "Owners can remove members or members can leave" 
ON public.collaborative_playlist_members 
FOR DELETE 
USING (auth.uid() = user_id OR EXISTS (
  SELECT 1 FROM public.collaborative_playlists 
  WHERE id = playlist_id AND owner_id = auth.uid()
));

-- Table collaborative_playlist_tracks: pistes dans les playlists collaboratives
CREATE TABLE IF NOT EXISTS public.collaborative_playlist_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID NOT NULL REFERENCES public.collaborative_playlists(id) ON DELETE CASCADE,
  added_by UUID NOT NULL,
  title TEXT NOT NULL,
  artist TEXT,
  audio_url TEXT,
  duration INTEGER,
  votes_up INTEGER DEFAULT 0,
  votes_down INTEGER DEFAULT 0,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.collaborative_playlist_tracks ENABLE ROW LEVEL SECURITY;

-- Policies for collaborative_playlist_tracks
CREATE POLICY "Members can view playlist tracks" 
ON public.collaborative_playlist_tracks 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.collaborative_playlist_members 
  WHERE playlist_id = collaborative_playlist_tracks.playlist_id AND user_id = auth.uid()
) OR EXISTS (
  SELECT 1 FROM public.collaborative_playlists 
  WHERE id = playlist_id AND (is_public = true OR owner_id = auth.uid())
));

CREATE POLICY "Members can add tracks" 
ON public.collaborative_playlist_tracks 
FOR INSERT 
WITH CHECK (auth.uid() = added_by AND EXISTS (
  SELECT 1 FROM public.collaborative_playlist_members 
  WHERE playlist_id = collaborative_playlist_tracks.playlist_id AND user_id = auth.uid()
));

CREATE POLICY "Track owners can update their tracks" 
ON public.collaborative_playlist_tracks 
FOR UPDATE 
USING (auth.uid() = added_by);

CREATE POLICY "Track owners or playlist owners can delete tracks" 
ON public.collaborative_playlist_tracks 
FOR DELETE 
USING (auth.uid() = added_by OR EXISTS (
  SELECT 1 FROM public.collaborative_playlists 
  WHERE id = playlist_id AND owner_id = auth.uid()
));

-- Table music_notifications: notifications musicales persistantes
CREATE TABLE IF NOT EXISTS public.music_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('friend_request', 'challenge_invite', 'playlist_update', 'achievement', 'recommendation', 'digest')),
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.music_notifications ENABLE ROW LEVEL SECURITY;

-- Policies for music_notifications
CREATE POLICY "Users can view their own notifications" 
ON public.music_notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
ON public.music_notifications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" 
ON public.music_notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" 
ON public.music_notifications 
FOR DELETE 
USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_music_friends_updated_at
BEFORE UPDATE ON public.music_friends
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_music_challenges_updated_at
BEFORE UPDATE ON public.music_challenges
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collaborative_playlists_updated_at
BEFORE UPDATE ON public.collaborative_playlists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();