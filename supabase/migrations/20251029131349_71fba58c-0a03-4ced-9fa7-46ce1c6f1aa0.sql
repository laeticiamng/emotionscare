-- Add RLS policies for clinical_optins table to allow authenticated users to manage their own consent

-- Policy for SELECT: users can view their own consent records
CREATE POLICY "Users can view their own consent records"
ON public.clinical_optins
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy for INSERT: users can create their own consent records
CREATE POLICY "Users can insert their own consent records"
ON public.clinical_optins
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for UPDATE: users can update their own consent records (for revocation)
CREATE POLICY "Users can update their own consent records"
ON public.clinical_optins
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);