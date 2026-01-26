-- =====================================================
-- ÉTAPE 1: Supprimer d'abord les policies qui dépendent des fonctions
-- =====================================================

DROP POLICY IF EXISTS "room_members_select_v2" ON public.room_members;
DROP POLICY IF EXISTS "social_rooms_select_v2" ON public.social_rooms;
DROP POLICY IF EXISTS "social_rooms_select" ON public.social_rooms;
DROP POLICY IF EXISTS "room_members_select" ON public.room_members;

-- =====================================================
-- ÉTAPE 2: Supprimer puis recréer les fonctions avec search_path
-- =====================================================

DROP FUNCTION IF EXISTS public.is_room_host(uuid, uuid);
DROP FUNCTION IF EXISTS public.is_room_member(uuid, uuid);

CREATE FUNCTION public.is_room_host(p_user_id uuid, p_room_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.social_rooms
    WHERE id = p_room_id AND host_id = p_user_id
  )
$$;

CREATE FUNCTION public.is_room_member(p_user_id uuid, p_room_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.room_members
    WHERE room_id = p_room_id AND user_id = p_user_id
  )
$$;

-- =====================================================
-- ÉTAPE 3: Recréer les policies SANS récursion
-- =====================================================

CREATE POLICY "social_rooms_select_safe" ON public.social_rooms
FOR SELECT TO authenticated
USING (
  host_id = auth.uid() 
  OR is_private = false 
  OR public.is_room_member(auth.uid(), id)
);

CREATE POLICY "room_members_select_safe" ON public.room_members
FOR SELECT TO authenticated
USING (
  user_id = auth.uid() 
  OR public.is_room_host(auth.uid(), room_id)
);

-- =====================================================
-- ÉTAPE 4: Nettoyer pwa_metrics
-- =====================================================

DROP POLICY IF EXISTS "pwa_metrics_authenticated_insert" ON public.pwa_metrics;
DROP POLICY IF EXISTS "pwa_metrics_public_read" ON public.pwa_metrics;