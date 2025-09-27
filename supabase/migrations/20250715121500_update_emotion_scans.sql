-- Harmonisation de la table emotion_scans avec l'analyse IA

-- Renommer les colonnes historiques pour refléter le nouveau modèle
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'emotion_scans' AND column_name = 'description'
  ) THEN
    ALTER TABLE public.emotion_scans RENAME COLUMN description TO summary;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'emotion_scans' AND column_name = 'emotion'
  ) THEN
    ALTER TABLE public.emotion_scans RENAME COLUMN emotion TO mood;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'emotion_scans' AND column_name = 'scan_data'
  ) THEN
    ALTER TABLE public.emotion_scans RENAME COLUMN scan_data TO emotions;
  END IF;
END $$;

-- Adapter les colonnes numériques et tableaux
ALTER TABLE public.emotion_scans
  ALTER COLUMN confidence TYPE numeric(5, 2) USING (confidence::numeric),
  ALTER COLUMN confidence SET DEFAULT 0;

ALTER TABLE public.emotion_scans
  ALTER COLUMN recommendations TYPE text[]
  USING (CASE WHEN recommendations IS NULL THEN ARRAY[]::text[] ELSE recommendations END),
  ALTER COLUMN recommendations SET DEFAULT ARRAY[]::text[];

ALTER TABLE public.emotion_scans
  ALTER COLUMN emotions TYPE jsonb USING COALESCE(emotions, '{}'::jsonb),
  ALTER COLUMN emotions SET DEFAULT '{}'::jsonb;

-- Nouvelles colonnes de persistance
ALTER TABLE public.emotion_scans
  ADD COLUMN IF NOT EXISTS scan_type text DEFAULT 'text',
  ADD COLUMN IF NOT EXISTS insights text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS emotional_balance numeric(5, 2),
  ADD COLUMN IF NOT EXISTS summary text,
  ALTER COLUMN user_id DROP NOT NULL;

-- Nettoyage des anciennes colonnes inutilisées
ALTER TABLE public.emotion_scans
  DROP COLUMN IF EXISTS dominant_emotion,
  DROP COLUMN IF EXISTS confidence_score,
  DROP COLUMN IF EXISTS notes;

-- Initialisation des valeurs existantes
UPDATE public.emotion_scans
SET
  scan_type = COALESCE(scan_type, 'text'),
  insights = COALESCE(insights, ARRAY[]::text[]),
  emotional_balance = COALESCE(emotional_balance, 50);

-- Calcul automatique de l'équilibre émotionnel lorsqu'il est possible
UPDATE public.emotion_scans
SET emotional_balance = sub.normalized_balance
FROM (
  SELECT
    id,
    LEAST(100, GREATEST(0,
      ROUND((
        (
          COALESCE((payload -> 'scores' ->> 'joie')::numeric, 0) +
          COALESCE((payload -> 'scores' ->> 'confiance')::numeric, 0) +
          COALESCE((payload -> 'scores' ->> 'anticipation')::numeric, 0) +
          COALESCE((payload -> 'scores' ->> 'surprise')::numeric, 0)
        ) - (
          COALESCE((payload -> 'scores' ->> 'tristesse')::numeric, 0) +
          COALESCE((payload -> 'scores' ->> 'colere')::numeric, 0) +
          COALESCE((payload -> 'scores' ->> 'peur')::numeric, 0) +
          COALESCE((payload -> 'scores' ->> 'degout')::numeric, 0)
        ) + 40
      ) / 80 * 100)
    )) AS normalized_balance
  FROM (
    SELECT id, emotions -> 'scores' AS payload
    FROM public.emotion_scans
  ) s
  WHERE payload IS NOT NULL
) AS sub
WHERE public.emotion_scans.id = sub.id;

COMMENT ON COLUMN public.emotion_scans.summary IS 'Résumé textuel du scan émotionnel.';
COMMENT ON COLUMN public.emotion_scans.emotions IS 'Payload JSON contenant les scores, le contexte et l\'historique.';
COMMENT ON COLUMN public.emotion_scans.emotional_balance IS 'Indice d\'équilibre émotionnel normalisé (0-100).';

-- S'assurer que la politique RLS reste en place
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'emotion_scans'
      AND policyname = 'Users can manage their own emotion scans'
  ) THEN
    CREATE POLICY "Users can manage their own emotion scans" ON public.emotion_scans
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
