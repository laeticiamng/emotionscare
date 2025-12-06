-- Table pour stocker les configurations d'exports planifiés
CREATE TABLE IF NOT EXISTS public.gdpr_scheduled_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6),
  day_of_month INT CHECK (day_of_month BETWEEN 1 AND 31),
  time TIME NOT NULL DEFAULT '09:00:00',
  format TEXT NOT NULL CHECK (format IN ('csv', 'json', 'pdf')),
  admin_emails TEXT[] NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour rechercher les exports actifs à exécuter
CREATE INDEX idx_scheduled_exports_active_next ON public.gdpr_scheduled_exports(is_active, next_run_at);
CREATE INDEX idx_scheduled_exports_org ON public.gdpr_scheduled_exports(org_id);

-- RLS policies - authenticated users can manage their scheduled exports
ALTER TABLE public.gdpr_scheduled_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view scheduled exports"
  ON public.gdpr_scheduled_exports
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert scheduled exports"
  ON public.gdpr_scheduled_exports
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "Users can update their own scheduled exports"
  ON public.gdpr_scheduled_exports
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own scheduled exports"
  ON public.gdpr_scheduled_exports
  FOR DELETE
  USING (auth.uid() = created_by);

-- Fonction pour calculer le prochain run
CREATE OR REPLACE FUNCTION public.calculate_next_run(
  p_frequency TEXT,
  p_day_of_week INT,
  p_day_of_month INT,
  p_time TIME
) RETURNS TIMESTAMPTZ AS $$
DECLARE
  v_now TIMESTAMPTZ := now();
  v_next TIMESTAMPTZ;
BEGIN
  IF p_frequency = 'daily' THEN
    v_next := date_trunc('day', v_now) + p_time;
    IF v_next <= v_now THEN
      v_next := v_next + INTERVAL '1 day';
    END IF;
  ELSIF p_frequency = 'weekly' THEN
    v_next := date_trunc('week', v_now) + (p_day_of_week || ' days')::INTERVAL + p_time;
    IF v_next <= v_now THEN
      v_next := v_next + INTERVAL '1 week';
    END IF;
  ELSIF p_frequency = 'monthly' THEN
    v_next := date_trunc('month', v_now) + ((p_day_of_month - 1) || ' days')::INTERVAL + p_time;
    IF v_next <= v_now THEN
      v_next := date_trunc('month', v_now) + INTERVAL '1 month' + ((p_day_of_month - 1) || ' days')::INTERVAL + p_time;
    END IF;
  END IF;
  
  RETURN v_next;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour calculer next_run_at automatiquement
CREATE OR REPLACE FUNCTION public.update_scheduled_export_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.next_run_at := public.calculate_next_run(
    NEW.frequency,
    NEW.day_of_week,
    NEW.day_of_month,
    NEW.time
  );
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_scheduled_export_next_run
  BEFORE INSERT OR UPDATE OF frequency, day_of_week, day_of_month, time
  ON public.gdpr_scheduled_exports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_scheduled_export_timestamp();