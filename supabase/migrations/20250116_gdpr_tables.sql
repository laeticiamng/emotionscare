-- GDPR Compliance Tables Migration
-- Created: 2025-01-16
-- Purpose: Add tables for GDPR compliance (account deletion, consent management)

-- ============================================================================
-- 1. Account Deletion Requests Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scheduled_deletion_at TIMESTAMP WITH TIME ZONE NOT NULL,
  grace_period_days INTEGER NOT NULL DEFAULT 30,
  reason TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'cancelled', 'completed')) DEFAULT 'pending',
  cancelled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for account_deletion_requests
CREATE INDEX idx_account_deletion_user_id ON public.account_deletion_requests(user_id);
CREATE INDEX idx_account_deletion_status ON public.account_deletion_requests(status);
CREATE INDEX idx_account_deletion_scheduled ON public.account_deletion_requests(scheduled_deletion_at);

-- RLS Policies for account_deletion_requests
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Users can only view and manage their own deletion requests
CREATE POLICY "Users can view own deletion requests"
  ON public.account_deletion_requests
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own deletion requests"
  ON public.account_deletion_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deletion requests"
  ON public.account_deletion_requests
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 2. Consent Records Table (GDPR Article 7 - Conditions for consent)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL CHECK (consent_type IN (
    'terms_of_service',
    'privacy_policy',
    'data_processing',
    'marketing_emails',
    'analytics',
    'cookies',
    'third_party_sharing',
    'ai_processing',
    'medical_data'
  )),
  version TEXT NOT NULL, -- Version of the document/policy
  granted BOOLEAN NOT NULL DEFAULT false,
  granted_at TIMESTAMP WITH TIME ZONE,
  revoked_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure unique active consent per type per user
  CONSTRAINT unique_active_consent UNIQUE (user_id, consent_type, version)
);

-- Indexes for consent_records
CREATE INDEX idx_consent_user_id ON public.consent_records(user_id);
CREATE INDEX idx_consent_type ON public.consent_records(consent_type);
CREATE INDEX idx_consent_granted ON public.consent_records(granted);
CREATE INDEX idx_consent_granted_at ON public.consent_records(granted_at);

-- RLS Policies for consent_records
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

-- Users can only view and manage their own consents
CREATE POLICY "Users can view own consents"
  ON public.consent_records
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own consents"
  ON public.consent_records
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own consents"
  ON public.consent_records
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 3. User Consents Table (Simplified version for existing code compatibility)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT false,
  granted_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for user_consents
CREATE INDEX idx_user_consents_user_id ON public.user_consents(user_id);
CREATE INDEX idx_user_consents_type ON public.user_consents(type);

-- RLS Policies for user_consents
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own user_consents"
  ON public.user_consents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own user_consents"
  ON public.user_consents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own user_consents"
  ON public.user_consents
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 4. Functions and Triggers
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all GDPR tables
CREATE TRIGGER update_account_deletion_requests_updated_at
  BEFORE UPDATE ON public.account_deletion_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consent_records_updated_at
  BEFORE UPDATE ON public.consent_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_consents_updated_at
  BEFORE UPDATE ON public.user_consents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. Helper Functions for GDPR Operations
-- ============================================================================

-- Function to get active consents for a user
CREATE OR REPLACE FUNCTION get_user_active_consents(p_user_id UUID)
RETURNS TABLE (
  consent_type TEXT,
  version TEXT,
  granted BOOLEAN,
  granted_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cr.consent_type,
    cr.version,
    cr.granted,
    cr.granted_at
  FROM public.consent_records cr
  WHERE cr.user_id = p_user_id
    AND cr.granted = true
    AND cr.revoked_at IS NULL
  ORDER BY cr.granted_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has pending deletion request
CREATE OR REPLACE FUNCTION has_pending_deletion_request(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_has_pending BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM public.account_deletion_requests
    WHERE user_id = p_user_id
      AND status = 'pending'
  ) INTO v_has_pending;

  RETURN v_has_pending;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 6. Comments for Documentation
-- ============================================================================

COMMENT ON TABLE public.account_deletion_requests IS 'GDPR Article 17 - Right to Erasure. Manages account deletion requests with grace period.';
COMMENT ON TABLE public.consent_records IS 'GDPR Article 7 - Conditions for consent. Comprehensive consent management with versioning and audit trail.';
COMMENT ON TABLE public.user_consents IS 'Simplified consent table for backward compatibility with existing code.';

COMMENT ON COLUMN public.account_deletion_requests.grace_period_days IS 'Number of days before actual deletion (default: 30 days)';
COMMENT ON COLUMN public.account_deletion_requests.scheduled_deletion_at IS 'Date when the account will be permanently deleted';
COMMENT ON COLUMN public.consent_records.version IS 'Version of the policy/document user consented to';
COMMENT ON COLUMN public.consent_records.ip_address IS 'IP address from which consent was given (for audit trail)';
COMMENT ON COLUMN public.consent_records.user_agent IS 'User agent string (for audit trail)';

-- ============================================================================
-- 7. Grant Permissions
-- ============================================================================

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.account_deletion_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.consent_records TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_consents TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================================
-- Migration Complete
-- ============================================================================

-- Insert migration record
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.migrations
    WHERE migration_name = '20250116_gdpr_tables'
  ) THEN
    INSERT INTO public.migrations (migration_name, executed_at)
    VALUES ('20250116_gdpr_tables', NOW());
  END IF;
END $$;
