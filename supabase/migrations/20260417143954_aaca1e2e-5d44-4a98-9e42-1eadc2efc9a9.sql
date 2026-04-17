-- =========================================================
-- SWEEP P0/P1 — verrouillage final
-- =========================================================

-- 1. webhook_endpoints — fuite de secret_key
DROP POLICY IF EXISTS "Authenticated users can view webhook endpoints" ON public.webhook_endpoints;

CREATE POLICY "Users can view their own webhook endpoints"
ON public.webhook_endpoints
FOR SELECT
TO authenticated
USING (created_by = auth.uid());

-- 2. unified_alerts — données vulnérabilités exposées au public
DROP POLICY IF EXISTS "Allow public read access to unified_alerts" ON public.unified_alerts;
DROP POLICY IF EXISTS "Admins can view unified_alerts" ON public.unified_alerts;

CREATE POLICY "Admins can view unified_alerts"
ON public.unified_alerts
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. urgegpt_protocols — accès anonyme lecture+écriture sur protocoles médicaux
DROP POLICY IF EXISTS "Allow anonymous insert access to urgegpt_protocols" ON public.urgegpt_protocols;
DROP POLICY IF EXISTS "Allow anonymous read access to urgegpt_protocols" ON public.urgegpt_protocols;
DROP POLICY IF EXISTS "Authenticated users read urgegpt_protocols" ON public.urgegpt_protocols;
DROP POLICY IF EXISTS "Admins manage urgegpt_protocols" ON public.urgegpt_protocols;
DROP POLICY IF EXISTS "Service role manages urgegpt_protocols" ON public.urgegpt_protocols;

CREATE POLICY "Authenticated users read urgegpt_protocols"
ON public.urgegpt_protocols
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins manage urgegpt_protocols"
ON public.urgegpt_protocols
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages urgegpt_protocols"
ON public.urgegpt_protocols
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 4. generated_music_tracks — purge des dev policies anonymes
DROP POLICY IF EXISTS "dev_read_all_tracks" ON public.generated_music_tracks;
DROP POLICY IF EXISTS "dev_update_tracks" ON public.generated_music_tracks;
DROP POLICY IF EXISTS "dev_insert_tracks" ON public.generated_music_tracks;

-- 5. ab_test_results — retrait lecture publique
DROP POLICY IF EXISTS "Users can view AB test results" ON public.ab_test_results;
DROP POLICY IF EXISTS "Admins can view AB test results" ON public.ab_test_results;

CREATE POLICY "Admins can view AB test results"
ON public.ab_test_results
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 6. alert_score_history — retrait lecture publique
DROP POLICY IF EXISTS "Allow public read access to alert_score_history" ON public.alert_score_history;
DROP POLICY IF EXISTS "Admins can view alert_score_history" ON public.alert_score_history;

CREATE POLICY "Admins can view alert_score_history"
ON public.alert_score_history
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 7. storage.objects — ecos-documents upload sans contrôle d'identité
DROP POLICY IF EXISTS "Allow admin uploads to ecos-documents" ON storage.objects;

CREATE POLICY "Admins upload to ecos-documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'ecos-documents'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);
