-- ============================================
-- SOCIAL COCON : Tables (sans policies croisées)
-- ============================================

-- 1. Table des rooms privées
CREATE TABLE IF NOT EXISTS public.social_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  topic TEXT,
  description TEXT,
  is_private BOOLEAN DEFAULT true,
  invite_code TEXT UNIQUE,
  allow_audio BOOLEAN DEFAULT true,
  soft_mode_enabled BOOLEAN DEFAULT false,
  host_id UUID,
  host_display_name TEXT DEFAULT 'Hôte',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_social_rooms_host ON public.social_rooms(host_id);
CREATE INDEX IF NOT EXISTS idx_social_rooms_invite ON public.social_rooms(invite_code);

-- 2. Table des membres de room
CREATE TABLE IF NOT EXISTS public.room_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.social_rooms(id) ON DELETE CASCADE,
  member_id UUID,
  user_id UUID,
  display_name TEXT DEFAULT 'Membre',
  role TEXT DEFAULT 'guest' CHECK (role IN ('host', 'guest')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  preferences JSONB DEFAULT '{"audio": true, "text": true}'::jsonb,
  UNIQUE(room_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_room_members_room ON public.room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_room_members_user ON public.room_members(user_id);

-- 3. Table des pauses planifiées
CREATE TABLE IF NOT EXISTS public.social_room_breaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.social_rooms(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 15 CHECK (duration_minutes > 0 AND duration_minutes <= 60),
  remind_at TIMESTAMPTZ,
  delivery_channel TEXT DEFAULT 'in-app' CHECK (delivery_channel IN ('email', 'in-app')),
  invitees JSONB DEFAULT '[]'::jsonb,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_social_breaks_room ON public.social_room_breaks(room_id);
CREATE INDEX IF NOT EXISTS idx_social_breaks_starts ON public.social_room_breaks(starts_at);

-- 4. Table des événements anonymisés
CREATE TABLE IF NOT EXISTS public.social_room_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('create', 'join', 'leave')),
  room_ref TEXT NOT NULL,
  role TEXT DEFAULT 'guest',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_social_events_type ON public.social_room_events(event_type);
CREATE INDEX IF NOT EXISTS idx_social_events_created ON public.social_room_events(created_at);

-- 5. Table des quiet hours
CREATE TABLE IF NOT EXISTS public.quiet_hours_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE,
  enabled BOOLEAN DEFAULT false,
  start_utc TEXT DEFAULT '21:00',
  end_utc TEXT DEFAULT '07:00',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quiet_hours_user ON public.quiet_hours_settings(user_id);

-- ============================================
-- RLS : Activer sur toutes les tables
-- ============================================
ALTER TABLE public.social_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_room_breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_room_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiet_hours_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES : social_rooms
-- ============================================
CREATE POLICY "social_rooms_select" ON public.social_rooms FOR SELECT
  USING (
    host_id = auth.uid()
    OR id IN (SELECT room_id FROM public.room_members WHERE user_id = auth.uid())
  );

CREATE POLICY "social_rooms_insert" ON public.social_rooms FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "social_rooms_update" ON public.social_rooms FOR UPDATE
  USING (host_id = auth.uid());

CREATE POLICY "social_rooms_delete" ON public.social_rooms FOR DELETE
  USING (host_id = auth.uid());

-- ============================================
-- POLICIES : room_members
-- ============================================
CREATE POLICY "room_members_select" ON public.room_members FOR SELECT
  USING (
    user_id = auth.uid()
    OR room_id IN (SELECT id FROM public.social_rooms WHERE host_id = auth.uid())
  );

CREATE POLICY "room_members_insert" ON public.room_members FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "room_members_delete" ON public.room_members FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- POLICIES : social_room_breaks
-- ============================================
CREATE POLICY "breaks_select" ON public.social_room_breaks FOR SELECT
  USING (
    created_by = auth.uid()
    OR room_id IN (SELECT id FROM public.social_rooms WHERE host_id = auth.uid())
    OR room_id IN (SELECT room_id FROM public.room_members WHERE user_id = auth.uid())
  );

CREATE POLICY "breaks_insert" ON public.social_room_breaks FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "breaks_delete" ON public.social_room_breaks FOR DELETE
  USING (created_by = auth.uid());

-- ============================================
-- POLICIES : social_room_events (write-only)
-- ============================================
CREATE POLICY "events_insert" ON public.social_room_events FOR INSERT
  WITH CHECK (true);

-- ============================================
-- POLICIES : quiet_hours_settings
-- ============================================
CREATE POLICY "quiet_select" ON public.quiet_hours_settings FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "quiet_insert" ON public.quiet_hours_settings FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "quiet_update" ON public.quiet_hours_settings FOR UPDATE
  USING (user_id = auth.uid());