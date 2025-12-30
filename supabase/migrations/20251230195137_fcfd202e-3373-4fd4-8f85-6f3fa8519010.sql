-- Create consent_records table for GDPR compliance
CREATE TABLE IF NOT EXISTS public.consent_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  consent_version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
  audio_consent BOOLEAN DEFAULT FALSE,
  video_consent BOOLEAN DEFAULT FALSE,
  emotion_analysis_consent BOOLEAN DEFAULT FALSE,
  data_storage_consent BOOLEAN DEFAULT TRUE,
  data_sharing_consent BOOLEAN DEFAULT FALSE,
  analytics_consent BOOLEAN DEFAULT TRUE,
  marketing_consent BOOLEAN DEFAULT FALSE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

-- RLS policies for consent_records
CREATE POLICY "Users can view their own consent records"
  ON public.consent_records
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consent records"
  ON public.consent_records
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_consent_records_user_id ON public.consent_records(user_id);
CREATE INDEX idx_consent_records_created_at ON public.consent_records(created_at DESC);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_consent_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_consent_records_updated_at
  BEFORE UPDATE ON public.consent_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_consent_records_updated_at();