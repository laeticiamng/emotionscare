-- Migration: Create user-exports storage bucket for generic exports
-- Date: 2025-11-14
-- Purpose: Support generate_export edge function for analytics, VR/Breath sessions, music history exports

-- Create user-exports storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-exports',
  'user-exports',
  false, -- Private bucket, requires authentication
  52428800, -- 50MB limit
  ARRAY['application/json', 'text/csv', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for user-exports bucket

-- Allow authenticated users to upload their own exports
CREATE POLICY "Users can upload their own exports"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-exports'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read their own exports
CREATE POLICY "Users can read their own exports"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-exports'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own exports
CREATE POLICY "Users can delete their own exports"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-exports'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow service role to manage all exports (for purge_deleted_users)
CREATE POLICY "Service role can manage all exports"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'user-exports')
WITH CHECK (bucket_id = 'user-exports');

-- Add comment for documentation
COMMENT ON TABLE storage.buckets IS 'Storage buckets for user files including GDPR exports and custom data exports';
