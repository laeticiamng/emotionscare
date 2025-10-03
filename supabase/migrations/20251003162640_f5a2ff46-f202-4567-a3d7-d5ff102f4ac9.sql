-- JOUR 3 - VAGUE 2 : Nettoyage policies dupliquées et sécurisation service_role
-- Date: 2025-10-03
-- Phase: Correction policies redondantes identifiées dans l'audit

-- ============================================
-- 1. NETTOYAGE TABLE badges (7 policies → 5)
-- ============================================

-- Supprimer doublons INSERT
DROP POLICY IF EXISTS "Users can insert own badges" ON badges;

-- Supprimer doublons SELECT  
DROP POLICY IF EXISTS "Users can view own badges" ON badges;

-- Sécuriser policy service_role avec JWT check
DROP POLICY IF EXISTS "Service role can manage all badges" ON badges;

CREATE POLICY "Service role can manage all badges"
ON badges
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

COMMENT ON POLICY "Service role can manage all badges" ON badges IS 
'Allows service role to manage all badge records with explicit JWT verification';

-- ============================================
-- 2. NETTOYAGE TABLE "Digital Medicine" (2 policies → 1)
-- ============================================

-- Supprimer doublon
DROP POLICY IF EXISTS "digital_medicine_user_access_only" ON "Digital Medicine";

-- Sécuriser policy restante (déjà existante, on la garde)
-- "Users can manage their own digital medicine subscription"

-- ============================================
-- 3. NETTOYAGE TABLE abonnement_biovida (3 policies → 1)
-- ============================================

-- Supprimer doublons
DROP POLICY IF EXISTS "abonnement_biovida_user_access_only" ON abonnement_biovida;

-- Sécuriser policy service_role avec JWT check
DROP POLICY IF EXISTS "Service role can manage all biovida data" ON abonnement_biovida;

CREATE POLICY "Service role can manage all biovida data"
ON abonnement_biovida
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- ============================================
-- 4. NETTOYAGE TABLE abonnement_fiches (doublons détectés)
-- ============================================

-- Supprimer doublon INSERT
DROP POLICY IF EXISTS "abonnement_fiches_user_insert" ON abonnement_fiches;

-- Supprimer doublon SELECT
DROP POLICY IF EXISTS "abonnement_fiches_user_select" ON abonnement_fiches;

-- Les policies "Users can insert their own fiches subscription" et 
-- "Users can read their own fiches subscription" sont conservées

-- ============================================
-- 5. DOCUMENTATION POLICIES MANQUANTES INTENTIONNELLES
-- ============================================

-- abonnement_fiches : Pas de UPDATE/DELETE volontairement
-- Raison: Les abonnements ne doivent pas être modifiés une fois créés
-- Seule l'équipe admin via service_role peut modifier
COMMENT ON TABLE abonnement_fiches IS 
'Table des abonnements fiches. Pas de UPDATE/DELETE pour users (intentionnel). Seul service_role peut modifier.';

-- ai_recommendations : Pas de INSERT/UPDATE/DELETE pour users
-- Raison: Généré uniquement par le système IA
COMMENT ON TABLE ai_recommendations IS 
'Table des recommandations IA. Lecture seule pour users. Génération système uniquement via service_role.';

-- ============================================
-- 6. SÉCURISATION POLICIES service_role RESTANTES
-- ============================================

-- Table: buddies
DROP POLICY IF EXISTS "Service role can manage all buddies" ON buddies;

CREATE POLICY "Service role can manage all buddies"
ON buddies
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Table: chat_conversations
DROP POLICY IF EXISTS "Service role can manage all chat conversations" ON chat_conversations;

CREATE POLICY "Service role can manage all chat conversations"
ON chat_conversations
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Table: chat_messages
DROP POLICY IF EXISTS "Service role can manage all chat messages" ON chat_messages;

CREATE POLICY "Service role can manage all chat messages"
ON chat_messages
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Table: bounce_battles
DROP POLICY IF EXISTS "Service role can manage all bounce battles" ON bounce_battles;

CREATE POLICY "Service role can manage all bounce battles"
ON bounce_battles
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Table: bounce_coping_responses
DROP POLICY IF EXISTS "Service role can manage all bounce responses" ON bounce_coping_responses;

CREATE POLICY "Service role can manage all bounce responses"
ON bounce_coping_responses
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Table: bounce_events
DROP POLICY IF EXISTS "Service role can manage all bounce events" ON bounce_events;

CREATE POLICY "Service role can manage all bounce events"
ON bounce_events
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Table: bounce_pair_tips
DROP POLICY IF EXISTS "Service role can manage all bounce tips" ON bounce_pair_tips;

CREATE POLICY "Service role can manage all bounce tips"
ON bounce_pair_tips
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Table: ambition_runs
DROP POLICY IF EXISTS "Service role can manage all ambition data" ON ambition_runs;

CREATE POLICY "Service role can manage all ambition data"
ON ambition_runs
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Table: ambition_quests
DROP POLICY IF EXISTS "Service role can manage all ambition quests" ON ambition_quests;

CREATE POLICY "Service role can manage all ambition quests"
ON ambition_quests
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Table: ambition_artifacts
DROP POLICY IF EXISTS "Service role can manage all ambition artifacts" ON ambition_artifacts;

CREATE POLICY "Service role can manage all ambition artifacts"
ON ambition_artifacts
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Table: assessment_sessions
DROP POLICY IF EXISTS "Service role can manage all assessment sessions" ON assessment_sessions;

CREATE POLICY "Service role can manage all assessment sessions"
ON assessment_sessions
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Table: challenges
DROP POLICY IF EXISTS "challenges_service_role" ON challenges;

CREATE POLICY "challenges_service_role"
ON challenges
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- ============================================
-- 7. AUDIT FINAL : Vérifications
-- ============================================

-- Compter les policies restantes par table
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  -- Vérifier badges
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'badges';
  RAISE NOTICE 'badges: % policies restantes', policy_count;

  -- Vérifier Digital Medicine
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'Digital Medicine';
  RAISE NOTICE 'Digital Medicine: % policies restantes', policy_count;

  -- Vérifier abonnement_biovida
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'abonnement_biovida';
  RAISE NOTICE 'abonnement_biovida: % policies restantes', policy_count;

  -- Vérifier abonnement_fiches
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'abonnement_fiches';
  RAISE NOTICE 'abonnement_fiches: % policies restantes', policy_count;
END $$;

-- ============================================
-- RÉSUMÉ DES MODIFICATIONS
-- ============================================
/*
✅ POLICIES DUPLIQUÉES SUPPRIMÉES :
  - badges: 2 doublons supprimés (INSERT + SELECT)
  - Digital Medicine: 1 doublon supprimé
  - abonnement_biovida: 1 doublon supprimé
  - abonnement_fiches: 2 doublons supprimés
  
✅ SÉCURISATION SERVICE_ROLE :
  - 14 policies service_role avec JWT check ajouté
  
✅ DOCUMENTATION :
  - Commentaires ajoutés sur tables intentionnellement read-only
  - Comments sur policies pour clarifier intentions
  
📊 TOTAL POLICIES NETTOYÉES : 6 doublons
📊 TOTAL POLICIES SÉCURISÉES : 14+ avec JWT check
*/