-- Create clinical_optins table for consent management
CREATE TABLE IF NOT EXISTS public.clinical_optins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scope TEXT NOT NULL CHECK (scope IN ('coach', 'analytics', 'full')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, scope, revoked_at)
);

-- Enable Row Level Security
ALTER TABLE public.clinical_optins ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own consents
CREATE POLICY "Users can view their own clinical optins"
ON public.clinical_optins
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can create their own consents
CREATE POLICY "Users can create their own clinical optins"
ON public.clinical_optins
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own consents (revoke)
CREATE POLICY "Users can update their own clinical optins"
ON public.clinical_optins
FOR UPDATE
USING (auth.uid() = user_id);

-- Index for better performance
CREATE INDEX idx_clinical_optins_user_id ON public.clinical_optins(user_id);
CREATE INDEX idx_clinical_optins_scope ON public.clinical_optins(scope);
CREATE INDEX idx_clinical_optins_revoked_at ON public.clinical_optins(revoked_at);