-- Create the missing med_mng_generation_logs table
CREATE TABLE IF NOT EXISTS public.med_mng_generation_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  generation_type text NOT NULL,
  prompt text,
  response_data jsonb DEFAULT '{}',
  generation_time_ms integer,
  status text DEFAULT 'pending',
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.med_mng_generation_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own generation logs" 
ON public.med_mng_generation_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generation logs" 
ON public.med_mng_generation_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all generation logs" 
ON public.med_mng_generation_logs 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_med_mng_generation_logs_user_id ON public.med_mng_generation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_med_mng_generation_logs_created_at ON public.med_mng_generation_logs(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_med_mng_generation_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_med_mng_generation_logs_updated_at
  BEFORE UPDATE ON public.med_mng_generation_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_med_mng_generation_logs_updated_at();