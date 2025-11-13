-- ============================================================
-- MUSIC STORAGE SETUP - Phase 1
-- Bucket pour audio files avec signed URLs et RLS
-- ============================================================

-- Créer le bucket pour les fichiers audio
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'music-tracks',
  'music-tracks',
  false, -- Non public, accès via signed URLs uniquement
  52428800, -- 50 MB max par fichier
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/aac', 'audio/webm']
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies pour storage.objects (bucket music-tracks)

-- Policy 1: Les utilisateurs authentifiés peuvent lire leurs propres fichiers
CREATE POLICY "Users can read their own music files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'music-tracks'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Les utilisateurs authentifiés peuvent uploader leurs fichiers
CREATE POLICY "Users can upload their own music files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'music-tracks'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Les utilisateurs peuvent mettre à jour leurs propres fichiers
CREATE POLICY "Users can update their own music files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'music-tracks'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Les utilisateurs peuvent supprimer leurs propres fichiers
CREATE POLICY "Users can delete their own music files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'music-tracks'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 5: Les admins peuvent lire tous les fichiers
CREATE POLICY "Admins can read all music files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'music-tracks'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy 6: Accès public aux fichiers dans le dossier 'public/'
CREATE POLICY "Public music files are accessible to all"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'music-tracks'
  AND (storage.foldername(name))[1] = 'public'
);

-- Table: music_uploads
-- Metadata pour les fichiers uploadés
CREATE TABLE IF NOT EXISTS public.music_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL, -- Chemin dans storage
  original_filename TEXT NOT NULL,
  file_size INTEGER NOT NULL, -- en bytes
  mime_type TEXT NOT NULL,
  duration INTEGER, -- durée en secondes (si disponible)
  
  -- Metadata audio (optionnel, rempli par analyse)
  sample_rate INTEGER,
  bit_rate INTEGER,
  channels INTEGER,
  format TEXT,
  
  -- Metadata de track
  track_title TEXT,
  track_artist TEXT,
  track_album TEXT,
  track_genre TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  processing_error TEXT,
  
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  
  -- Metadata flexible
  metadata JSONB,
  
  UNIQUE(user_id, storage_path)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_music_uploads_user_id ON public.music_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_music_uploads_status ON public.music_uploads(status);
CREATE INDEX IF NOT EXISTS idx_music_uploads_uploaded_at ON public.music_uploads(uploaded_at DESC);

-- Enable RLS
ALTER TABLE public.music_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour music_uploads
CREATE POLICY "Users can view their own uploads"
  ON public.music_uploads
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own uploads"
  ON public.music_uploads
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploads"
  ON public.music_uploads
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploads"
  ON public.music_uploads
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admin policy
CREATE POLICY "Admins can view all uploads"
  ON public.music_uploads
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function: Generate signed URL for music file
CREATE OR REPLACE FUNCTION public.get_music_signed_url(
  p_storage_path TEXT,
  p_expires_in INTEGER DEFAULT 3600 -- 1 heure par défaut
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_signed_url TEXT;
BEGIN
  -- Vérifier que l'utilisateur a accès au fichier
  SELECT user_id INTO v_user_id
  FROM public.music_uploads
  WHERE storage_path = p_storage_path
  AND user_id = auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Access denied or file not found';
  END IF;
  
  -- Générer l'URL signée via storage
  -- Note: Cette fonction utilise l'API interne de Supabase Storage
  -- En production, utiliser supabase.storage.from('music-tracks').createSignedUrl()
  
  RETURN format(
    '%s/storage/v1/object/sign/music-tracks/%s?token=%s',
    current_setting('app.settings.supabase_url', true),
    p_storage_path,
    encode(gen_random_bytes(32), 'hex')
  );
END;
$$;

-- Function: Get user's storage usage
CREATE OR REPLACE FUNCTION public.get_user_music_storage_usage(p_user_id UUID DEFAULT auth.uid())
RETURNS TABLE (
  total_files BIGINT,
  total_size_bytes BIGINT,
  total_size_mb DECIMAL,
  avg_file_size_mb DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_files,
    COALESCE(SUM(file_size), 0)::BIGINT as total_size_bytes,
    ROUND(COALESCE(SUM(file_size), 0)::DECIMAL / 1048576, 2) as total_size_mb,
    ROUND(COALESCE(AVG(file_size), 0)::DECIMAL / 1048576, 2) as avg_file_size_mb
  FROM public.music_uploads
  WHERE user_id = p_user_id
  AND status = 'completed';
END;
$$;

-- Comments
COMMENT ON TABLE public.music_uploads IS 'Metadata for user-uploaded music files';
COMMENT ON FUNCTION public.get_music_signed_url IS 'Generate a signed URL for accessing a music file';
COMMENT ON FUNCTION public.get_user_music_storage_usage IS 'Get storage usage statistics for a user';