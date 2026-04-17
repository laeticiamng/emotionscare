-- =========================================================
-- P0 RLS HARDENING — 6 critical tables
-- Audit go-live: bloque l'accès non autorisé aux cookies
-- d'auth, données médicales, GDPR DSAR, tokens GitHub.
-- =========================================================

-- 1. oic_extraction_progress — contient auth_cookies (token sensible)
ALTER TABLE public.oic_extraction_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to oic_extraction_progress" ON public.oic_extraction_progress;
DROP POLICY IF EXISTS "Service role manages oic_extraction_progress" ON public.oic_extraction_progress;
DROP POLICY IF EXISTS "Admins can read oic_extraction_progress" ON public.oic_extraction_progress;
DROP POLICY IF EXISTS "Service role full access oic_extraction_progress" ON public.oic_extraction_progress;

CREATE POLICY "Admins can read oic_extraction_progress"
ON public.oic_extraction_progress
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role full access oic_extraction_progress"
ON public.oic_extraction_progress
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 2. medilinko_consultations — données médicales accessibles en anon
ALTER TABLE public.medilinko_consultations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous read access to medilinko_consultations" ON public.medilinko_consultations;
DROP POLICY IF EXISTS "Allow anonymous insert access to medilinko_consultations" ON public.medilinko_consultations;
DROP POLICY IF EXISTS "Admins read medilinko_consultations" ON public.medilinko_consultations;
DROP POLICY IF EXISTS "Service role manages medilinko_consultations" ON public.medilinko_consultations;
DROP POLICY IF EXISTS "Authenticated insert medilinko_consultations" ON public.medilinko_consultations;

-- Lecture: admins uniquement (les patients identifiés via email/payment ne sont pas authentifiés)
CREATE POLICY "Admins read medilinko_consultations"
ON public.medilinko_consultations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Insertion: réservée aux edge functions (service_role) qui valident le paiement
CREATE POLICY "Service role manages medilinko_consultations"
ON public.medilinko_consultations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 3. dsar_requests — politique "Approvers can view all DSAR requests" était USING(true)
ALTER TABLE public.dsar_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Approvers can view all DSAR requests" ON public.dsar_requests;
DROP POLICY IF EXISTS "Admins can view all DSAR requests" ON public.dsar_requests;
DROP POLICY IF EXISTS "Admins can update all DSAR requests" ON public.dsar_requests;

CREATE POLICY "Admins can view all DSAR requests"
ON public.dsar_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all DSAR requests"
ON public.dsar_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. accessibility_report_config — contient github_token (secret)
ALTER TABLE public.accessibility_report_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view report config" ON public.accessibility_report_config;
DROP POLICY IF EXISTS "Admin manages accessibility_report_config" ON public.accessibility_report_config;
DROP POLICY IF EXISTS "Admins read accessibility_report_config" ON public.accessibility_report_config;
DROP POLICY IF EXISTS "Admins manage accessibility_report_config" ON public.accessibility_report_config;
DROP POLICY IF EXISTS "Service role accessibility_report_config" ON public.accessibility_report_config;

CREATE POLICY "Admins read accessibility_report_config"
ON public.accessibility_report_config
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage accessibility_report_config"
ON public.accessibility_report_config
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role accessibility_report_config"
ON public.accessibility_report_config
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 5. accessibility_report_history — peut contenir données sensibles dans report_data
ALTER TABLE public.accessibility_report_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view report history" ON public.accessibility_report_history;
DROP POLICY IF EXISTS "Admins read accessibility_report_history" ON public.accessibility_report_history;
DROP POLICY IF EXISTS "Service role accessibility_report_history" ON public.accessibility_report_history;

CREATE POLICY "Admins read accessibility_report_history"
ON public.accessibility_report_history
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role accessibility_report_history"
ON public.accessibility_report_history
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 6. ticket_integrations — durcir : la policy actuelle référence profiles.role
-- (anti-pattern selon mem://security/database-permission-access-pattern)
ALTER TABLE public.ticket_integrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin can manage ticket integrations" ON public.ticket_integrations;
DROP POLICY IF EXISTS "Admins manage ticket_integrations" ON public.ticket_integrations;
DROP POLICY IF EXISTS "Service role ticket_integrations" ON public.ticket_integrations;

CREATE POLICY "Admins manage ticket_integrations"
ON public.ticket_integrations
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role ticket_integrations"
ON public.ticket_integrations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
