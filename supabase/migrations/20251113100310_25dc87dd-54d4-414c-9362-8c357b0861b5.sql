-- Create privacy_policies table for GDPR compliance
CREATE TABLE IF NOT EXISTS public.privacy_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  version TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  summary TEXT,
  effective_date TIMESTAMPTZ NOT NULL,
  is_current BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create policy_acceptances table to track user acceptances
CREATE TABLE IF NOT EXISTS public.policy_acceptances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  policy_id UUID NOT NULL REFERENCES public.privacy_policies(id) ON DELETE CASCADE,
  policy_version TEXT NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  UNIQUE(user_id, policy_id)
);

-- Create policy_changes table to track modifications
CREATE TABLE IF NOT EXISTS public.policy_changes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_id UUID NOT NULL REFERENCES public.privacy_policies(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES auth.users(id),
  change_type TEXT NOT NULL CHECK (change_type IN ('created', 'updated', 'published', 'archived')),
  change_description TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.privacy_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_changes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for privacy_policies
-- Everyone can read published current policies
CREATE POLICY "Anyone can view current published policies"
ON public.privacy_policies
FOR SELECT
USING (is_current = true AND status = 'published');

-- Admins can manage all policies
CREATE POLICY "Admins can manage all policies"
ON public.privacy_policies
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'manager')
  )
);

-- RLS Policies for policy_acceptances
-- Users can view their own acceptances
CREATE POLICY "Users can view their own policy acceptances"
ON public.policy_acceptances
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own acceptances
CREATE POLICY "Users can accept policies"
ON public.policy_acceptances
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all acceptances
CREATE POLICY "Admins can view all policy acceptances"
ON public.policy_acceptances
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'manager')
  )
);

-- RLS Policies for policy_changes
-- Admins can view all changes
CREATE POLICY "Admins can view policy changes"
ON public.policy_changes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'manager')
  )
);

-- Admins can log changes
CREATE POLICY "Admins can log policy changes"
ON public.policy_changes
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'manager')
  )
);

-- Create indexes for better performance
CREATE INDEX idx_privacy_policies_current ON public.privacy_policies(is_current, status);
CREATE INDEX idx_privacy_policies_version ON public.privacy_policies(version);
CREATE INDEX idx_policy_acceptances_user ON public.policy_acceptances(user_id);
CREATE INDEX idx_policy_acceptances_policy ON public.policy_acceptances(policy_id);
CREATE INDEX idx_policy_changes_policy ON public.policy_changes(policy_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_privacy_policy_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
CREATE TRIGGER update_privacy_policies_updated_at
BEFORE UPDATE ON public.privacy_policies
FOR EACH ROW
EXECUTE FUNCTION public.update_privacy_policy_updated_at();

-- Insert initial privacy policy
INSERT INTO public.privacy_policies (version, content, summary, effective_date, is_current, status)
VALUES (
  '1.0.0',
  'EmotionsCare Privacy Policy v1.0.0

1. Data Collection
We collect emotional data, usage statistics, and personal information to provide personalized wellness services.

2. Data Usage
Your data is used to improve your experience and provide AI-powered recommendations.

3. Data Storage
All data is securely stored and encrypted on Supabase infrastructure.

4. Your Rights
You have the right to access, modify, or delete your data at any time.

5. Contact
For privacy concerns, contact: privacy@emotionscare.com',
  'Initial privacy policy establishing data collection and usage terms.',
  now(),
  true,
  'published'
) ON CONFLICT (version) DO NOTHING;