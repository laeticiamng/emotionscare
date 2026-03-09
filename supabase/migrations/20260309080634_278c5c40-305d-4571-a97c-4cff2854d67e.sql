-- Drop overly permissive public SELECT policy on verification_results
DROP POLICY IF EXISTS "Allow public read on verification_results" ON public.verification_results;

-- Create restricted policy: only authenticated users can read
CREATE POLICY "Authenticated users can read verification_results"
  ON public.verification_results
  FOR SELECT
  TO authenticated
  USING (true);