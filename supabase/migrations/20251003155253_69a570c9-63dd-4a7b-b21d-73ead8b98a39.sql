-- ============================================
-- JOUR 3 - VAGUE 1 : STEP 6 - Nettoyer RLS des tables rate limiting & quotas
-- Supprimer doublons, ajouter policies users, sécuriser
-- ============================================

-- 1. RATE_LIMIT_COUNTERS : Nettoyer et sécuriser
DROP POLICY IF EXISTS "Service role can manage rate limit counters" ON public.rate_limit_counters;

-- Policy pour les users : voir leurs propres rate limits
CREATE POLICY "rate_limit_counters_user_select"
ON public.rate_limit_counters
FOR SELECT
TO authenticated
USING (identifier = auth.uid()::text);

-- Policy pour service role : gérer tout
CREATE POLICY "rate_limit_counters_service_manage"
ON public.rate_limit_counters
FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role');

-- Policy pour admins : gérer tout
CREATE POLICY "rate_limit_counters_admin_manage"
ON public.rate_limit_counters
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- 2. USER_QUOTAS : Nettoyer les doublons
DROP POLICY IF EXISTS "Service role can manage all quotas" ON public.user_quotas;
DROP POLICY IF EXISTS "Service role can manage all user_quotas" ON public.user_quotas;
DROP POLICY IF EXISTS "Service role can manage quotas" ON public.user_quotas;
DROP POLICY IF EXISTS "System can manage quotas" ON public.user_quotas;
DROP POLICY IF EXISTS "Users can view their own quotas" ON public.user_quotas;
DROP POLICY IF EXISTS "Users can update own quotas" ON public.user_quotas;
DROP POLICY IF EXISTS "Users can view own quotas" ON public.user_quotas;

-- Recréer policies propres pour user_quotas
CREATE POLICY "user_quotas_user_select"
ON public.user_quotas
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users ne peuvent PAS modifier leurs quotas (seulement le système)
CREATE POLICY "user_quotas_service_manage"
ON public.user_quotas
FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "user_quotas_admin_manage"
ON public.user_quotas
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- 3. MUSIC_GENERATION_USAGE : Nettoyer doublons
DROP POLICY IF EXISTS "Service role can manage all usage" ON public.music_generation_usage;
DROP POLICY IF EXISTS "Service role full access to music usage" ON public.music_generation_usage;
DROP POLICY IF EXISTS "Users can manage their own music usage data" ON public.music_generation_usage;
DROP POLICY IF EXISTS "Users can update their own usage" ON public.music_generation_usage;
DROP POLICY IF EXISTS "Users can view their own usage" ON public.music_generation_usage;

-- Recréer policies propres pour music_generation_usage
CREATE POLICY "music_usage_user_select"
ON public.music_generation_usage
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users peuvent insérer leur propre usage (pour tracking)
CREATE POLICY "music_usage_user_insert"
ON public.music_generation_usage
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "music_usage_service_manage"
ON public.music_generation_usage
FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "music_usage_admin_manage"
ON public.music_generation_usage
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- 4. Commentaires documentation
COMMENT ON POLICY "rate_limit_counters_user_select" ON public.rate_limit_counters 
IS 'Users peuvent voir leurs propres rate limits';

COMMENT ON POLICY "user_quotas_user_select" ON public.user_quotas 
IS 'Users peuvent voir leurs propres quotas (lecture seule)';

COMMENT ON POLICY "music_usage_user_select" ON public.music_generation_usage 
IS 'Users peuvent voir leur historique de génération musicale';

COMMENT ON POLICY "music_usage_user_insert" ON public.music_generation_usage 
IS 'Users peuvent créer des entrées de tracking de génération';