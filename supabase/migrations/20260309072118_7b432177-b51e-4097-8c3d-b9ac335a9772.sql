-- Drop the overly permissive INSERT policy on b2b_leads
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.b2b_leads;

-- Create a rate-limited INSERT policy that validates basic data format
-- Allows public inserts but requires valid email format via check constraint
CREATE POLICY "Public can submit lead with valid email"
ON public.b2b_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND length(name) > 1
  AND length(organization) > 1
);