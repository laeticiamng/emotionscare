-- =====================================================
-- MODULE DICOM - Tables pour imagerie cérébrale 3D
-- EmotionsCare - Psychiatrie Augmentée
-- =====================================================

-- Table principale des scans cérébraux
CREATE TABLE public.brain_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  modality VARCHAR(10) NOT NULL CHECK (modality IN ('MRI_T1', 'MRI_T2', 'MRI_FLAIR', 'CT', 'NIfTI')),
  dimensions INTEGER[3],
  voxel_size REAL[3],
  original_file_path TEXT,
  mesh_file_path TEXT,
  thumbnail_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error', 'archived')),
  metadata JSONB DEFAULT '{}',
  is_anonymized BOOLEAN DEFAULT false,
  study_date TIMESTAMPTZ,
  series_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Régions cérébrales segmentées (Atlas AAL - 116 régions)
CREATE TABLE public.brain_regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES public.brain_scans(id) ON DELETE CASCADE NOT NULL,
  region_code VARCHAR(20) NOT NULL,
  region_name VARCHAR(100) NOT NULL,
  hemisphere VARCHAR(10) CHECK (hemisphere IN ('left', 'right', 'bilateral')),
  volume_mm3 REAL,
  default_color VARCHAR(7) NOT NULL DEFAULT '#808080',
  mesh_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mapping émotions vers régions cérébrales (Hume AI)
CREATE TABLE public.emotion_brain_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  scan_id UUID REFERENCES public.brain_scans(id) ON DELETE SET NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  mappings JSONB NOT NULL DEFAULT '{}',
  hume_session_id TEXT,
  source VARCHAR(20) DEFAULT 'hume_ai' CHECK (source IN ('hume_ai', 'manual', 'import')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Annotations et notes sur les scans
CREATE TABLE public.brain_annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES public.brain_scans(id) ON DELETE CASCADE NOT NULL,
  region_id UUID REFERENCES public.brain_regions(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  annotation_type VARCHAR(20) NOT NULL DEFAULT 'note' CHECK (annotation_type IN ('note', 'marker', 'measurement', 'highlight')),
  content TEXT NOT NULL,
  position JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sessions de visualisation pour analytics
CREATE TABLE public.brain_view_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES public.brain_scans(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  regions_viewed TEXT[] DEFAULT ARRAY[]::TEXT[],
  emotions_overlaid BOOLEAN DEFAULT false,
  export_formats TEXT[] DEFAULT ARRAY[]::TEXT[],
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.brain_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brain_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_brain_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brain_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brain_view_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour brain_scans
CREATE POLICY "Users can view their own brain scans" ON public.brain_scans
  FOR SELECT TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can insert their own brain scans" ON public.brain_scans
  FOR INSERT TO authenticated
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Users can update their own brain scans" ON public.brain_scans
  FOR UPDATE TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can delete their own brain scans" ON public.brain_scans
  FOR DELETE TO authenticated
  USING (patient_id = auth.uid());

-- RLS Policies pour brain_regions
CREATE POLICY "Users can view regions of their scans" ON public.brain_regions
  FOR SELECT TO authenticated
  USING (
    scan_id IN (SELECT id FROM public.brain_scans WHERE patient_id = auth.uid())
  );

CREATE POLICY "Users can insert regions for their scans" ON public.brain_regions
  FOR INSERT TO authenticated
  WITH CHECK (
    scan_id IN (SELECT id FROM public.brain_scans WHERE patient_id = auth.uid())
  );

-- RLS Policies pour emotion_brain_mappings
CREATE POLICY "Users can view their own emotion mappings" ON public.emotion_brain_mappings
  FOR SELECT TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can insert their own emotion mappings" ON public.emotion_brain_mappings
  FOR INSERT TO authenticated
  WITH CHECK (patient_id = auth.uid());

-- RLS Policies pour brain_annotations
CREATE POLICY "Users can view annotations on their scans" ON public.brain_annotations
  FOR SELECT TO authenticated
  USING (
    scan_id IN (SELECT id FROM public.brain_scans WHERE patient_id = auth.uid())
    OR author_id = auth.uid()
  );

CREATE POLICY "Users can insert annotations" ON public.brain_annotations
  FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update their annotations" ON public.brain_annotations
  FOR UPDATE TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Users can delete their annotations" ON public.brain_annotations
  FOR DELETE TO authenticated
  USING (author_id = auth.uid());

-- RLS Policies pour brain_view_sessions
CREATE POLICY "Users can view their own sessions" ON public.brain_view_sessions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own sessions" ON public.brain_view_sessions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own sessions" ON public.brain_view_sessions
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Indexes pour performance
CREATE INDEX idx_brain_scans_patient ON public.brain_scans(patient_id);
CREATE INDEX idx_brain_scans_status ON public.brain_scans(status);
CREATE INDEX idx_brain_regions_scan ON public.brain_regions(scan_id);
CREATE INDEX idx_emotion_mappings_patient ON public.emotion_brain_mappings(patient_id);
CREATE INDEX idx_emotion_mappings_scan ON public.emotion_brain_mappings(scan_id);
CREATE INDEX idx_brain_annotations_scan ON public.brain_annotations(scan_id);
CREATE INDEX idx_brain_view_sessions_scan ON public.brain_view_sessions(scan_id);

-- Trigger pour updated_at
CREATE TRIGGER update_brain_scans_updated_at
  BEFORE UPDATE ON public.brain_scans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brain_annotations_updated_at
  BEFORE UPDATE ON public.brain_annotations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket pour les fichiers DICOM/NIfTI
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'brain-scans',
  'brain-scans',
  false,
  524288000, -- 500 MB
  ARRAY['application/dicom', 'application/octet-stream', 'application/gzip', 'application/x-gzip', 'model/gltf-binary', 'model/gltf+json']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their brain scans" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'brain-scans' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their brain scans" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'brain-scans' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their brain scans" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'brain-scans' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );