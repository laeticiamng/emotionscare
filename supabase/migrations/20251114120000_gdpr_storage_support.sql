-- Migration: Add GDPR storage support for DSAR exports
-- Created: 2025-11-14
-- Description: Create storage bucket for GDPR exports and add storage_path column to dsar_requests

-- Create storage bucket for GDPR exports
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gdpr-exports',
  'gdpr-exports',
  false, -- Private bucket
  10485760, -- 10MB max file size
  ARRAY['application/json']
)
ON CONFLICT (id) DO NOTHING;

-- Add storage_path column to dsar_requests table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dsar_requests'
    AND column_name = 'storage_path'
  ) THEN
    ALTER TABLE dsar_requests ADD COLUMN storage_path TEXT;
  END IF;
END $$;

-- Create RLS policies for gdpr-exports bucket
-- Only allow authenticated users to access their own exports
CREATE POLICY "Users can download their own GDPR exports"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'gdpr-exports'
  AND auth.uid()::text = (string_to_array(name, '-'))[2]
);

-- Service role can upload exports
CREATE POLICY "Service role can upload GDPR exports"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gdpr-exports'
  AND auth.role() = 'service_role'
);

-- Service role can delete old exports (for cleanup)
CREATE POLICY "Service role can delete GDPR exports"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gdpr-exports'
  AND auth.role() = 'service_role'
);

-- Add comment to document the column
COMMENT ON COLUMN dsar_requests.storage_path IS 'Path to the GDPR export file in Supabase Storage (gdpr-exports bucket)';
