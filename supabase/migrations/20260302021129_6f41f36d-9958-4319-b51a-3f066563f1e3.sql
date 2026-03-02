
CREATE TABLE public.b2b_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT NOT NULL,
  employee_count TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.b2b_leads ENABLE ROW LEVEL SECURITY;

-- Only insert allowed (no read/update/delete from client)
CREATE POLICY "Anyone can submit a lead"
  ON public.b2b_leads
  FOR INSERT
  WITH CHECK (true);
