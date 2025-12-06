-- 🚨 CORRECTION URGENTE: Sécurisation des données médicales et personnelles

-- =============================================
-- 1. Suppression policies publiques dangereuses
-- =============================================
DROP POLICY IF EXISTS "digital_medicine_service_read_only" ON "Digital Medicine";
DROP POLICY IF EXISTS "abonnement_fiches_service_access" ON abonnement_fiches;
DROP POLICY IF EXISTS "Service role can manage all biovida analyses" ON biovida_analyses;
DROP POLICY IF EXISTS "Service role can manage medical data" ON biovida_analyses;

-- =============================================
-- 2. RLS strict pour biovida_analyses (données médicales)
-- =============================================

CREATE POLICY "Users can select their own medical analyses"
  ON biovida_analyses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND users.email = biovida_analyses.email
    )
  );

CREATE POLICY "Users can insert their own medical analyses"
  ON biovida_analyses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND users.email = biovida_analyses.email
    )
  );

CREATE POLICY "Users can update their own medical analyses"
  ON biovida_analyses
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND users.email = biovida_analyses.email
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND users.email = biovida_analyses.email
    )
  );

CREATE POLICY "Users can delete their own medical analyses"
  ON biovida_analyses
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND users.email = biovida_analyses.email
    )
  );

-- =============================================
-- 3. Correction colonnes manquantes (erreurs PostgreSQL logs)
-- =============================================

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'assessments' 
    AND column_name = 'submitted_at'
  ) THEN
    ALTER TABLE assessments 
    ADD COLUMN submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'journal_entries' 
    AND column_name = 'text_content'
  ) THEN
    ALTER TABLE journal_entries 
    ADD COLUMN text_content TEXT;
  END IF;
END $$;