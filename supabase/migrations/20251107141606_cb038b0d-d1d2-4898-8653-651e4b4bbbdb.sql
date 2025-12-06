-- Date: 20251107
-- Migration: Scheduled Audits System
-- Système de planification automatique des audits RGPD

/* 1. TABLE: audit_schedules - Planifications d'audits */
CREATE TABLE IF NOT EXISTS public.audit_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  frequency text NOT NULL, -- daily, weekly, monthly
  day_of_week int, -- 0-6 pour hebdomadaire (0=dimanche)
  day_of_month int, -- 1-31 pour mensuel
  time_of_day time NOT NULL DEFAULT '02:00:00', -- Heure d'exécution
  is_active boolean NOT NULL DEFAULT true,
  last_run_at timestamptz,
  next_run_at timestamptz,
  alert_threshold numeric(5,2) DEFAULT 75.0, -- Score en dessous duquel alerter
  alert_recipients jsonb DEFAULT '[]', -- Liste des emails à notifier
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

/* 2. TABLE: audit_alerts - Alertes générées */
CREATE TABLE IF NOT EXISTS public.audit_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id uuid REFERENCES public.audit_schedules(id) ON DELETE SET NULL,
  audit_id uuid NOT NULL REFERENCES public.compliance_audits(id) ON DELETE CASCADE,
  alert_type text NOT NULL, -- score_drop, threshold_breach, critical_recommendation
  severity text NOT NULL DEFAULT 'warning', -- info, warning, critical
  title text NOT NULL,
  message text NOT NULL,
  previous_score numeric(5,2),
  current_score numeric(5,2),
  score_drop numeric(5,2),
  is_sent boolean NOT NULL DEFAULT false,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

/* 3. TABLE: audit_notifications - Historique des notifications */
CREATE TABLE IF NOT EXISTS public.audit_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid NOT NULL REFERENCES public.audit_alerts(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  notification_type text NOT NULL, -- email, webhook, in_app
  status text NOT NULL DEFAULT 'pending', -- pending, sent, failed
  sent_at timestamptz,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

/* 4. INDEX pour performances */
CREATE INDEX IF NOT EXISTS idx_audit_schedules_active ON public.audit_schedules(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_audit_schedules_next_run ON public.audit_schedules(next_run_at) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_audit_alerts_audit ON public.audit_alerts(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_alerts_sent ON public.audit_alerts(is_sent) WHERE is_sent = false;
CREATE INDEX IF NOT EXISTS idx_audit_notifications_alert ON public.audit_notifications(alert_id);

/* 5. RLS Policies */
ALTER TABLE public.audit_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view audit schedules" 
  ON public.audit_schedules FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage audit schedules" 
  ON public.audit_schedules FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view audit alerts" 
  ON public.audit_alerts FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can view audit notifications" 
  ON public.audit_notifications FOR SELECT 
  TO authenticated USING (true);

/* 6. Trigger pour updated_at */
CREATE TRIGGER trigger_update_audit_schedules_updated_at
  BEFORE UPDATE ON public.audit_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_consent_updated_at();

/* 7. Fonction: Calculer la prochaine exécution */
CREATE OR REPLACE FUNCTION public.calculate_next_audit_run(
  p_frequency text,
  p_day_of_week int,
  p_day_of_month int,
  p_time_of_day time
)
RETURNS timestamptz AS $$
DECLARE
  v_now timestamptz := now();
  v_next_run timestamptz;
  v_target_time timestamptz;
BEGIN
  CASE p_frequency
    WHEN 'daily' THEN
      -- Prochaine occurrence à l'heure spécifiée
      v_target_time := date_trunc('day', v_now) + p_time_of_day;
      IF v_target_time <= v_now THEN
        v_target_time := v_target_time + INTERVAL '1 day';
      END IF;
      v_next_run := v_target_time;
      
    WHEN 'weekly' THEN
      -- Prochain jour de la semaine spécifié
      v_target_time := date_trunc('day', v_now) + p_time_of_day;
      v_next_run := v_target_time + ((p_day_of_week - EXTRACT(DOW FROM v_now)::int + 7) % 7) * INTERVAL '1 day';
      IF v_next_run <= v_now THEN
        v_next_run := v_next_run + INTERVAL '7 days';
      END IF;
      
    WHEN 'monthly' THEN
      -- Prochain jour du mois spécifié
      v_target_time := date_trunc('month', v_now) + (p_day_of_month - 1) * INTERVAL '1 day' + p_time_of_day;
      IF v_target_time <= v_now THEN
        v_target_time := date_trunc('month', v_now + INTERVAL '1 month') + (p_day_of_month - 1) * INTERVAL '1 day' + p_time_of_day;
      END IF;
      v_next_run := v_target_time;
      
    ELSE
      v_next_run := v_now + INTERVAL '1 day';
  END CASE;
  
  RETURN v_next_run;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

/* 8. Fonction: Mettre à jour next_run_at automatiquement */
CREATE OR REPLACE FUNCTION public.update_schedule_next_run()
RETURNS TRIGGER AS $$
BEGIN
  NEW.next_run_at := public.calculate_next_audit_run(
    NEW.frequency,
    NEW.day_of_week,
    NEW.day_of_month,
    NEW.time_of_day
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_schedule_next_run
  BEFORE INSERT OR UPDATE OF frequency, day_of_week, day_of_month, time_of_day, is_active
  ON public.audit_schedules
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION public.update_schedule_next_run();

/* 9. Fonction: Détecter les baisses de score */
CREATE OR REPLACE FUNCTION public.detect_score_drops(p_audit_id uuid)
RETURNS void AS $$
DECLARE
  v_current_audit record;
  v_previous_audit record;
  v_score_drop numeric;
  v_schedule_id uuid;
  v_threshold numeric;
BEGIN
  -- Récupérer l'audit actuel
  SELECT * INTO v_current_audit
  FROM public.compliance_audits
  WHERE id = p_audit_id;
  
  -- Récupérer l'audit précédent
  SELECT * INTO v_previous_audit
  FROM public.compliance_audits
  WHERE id != p_audit_id
    AND status = 'completed'
  ORDER BY audit_date DESC
  LIMIT 1;
  
  -- Si pas d'audit précédent, rien à faire
  IF v_previous_audit IS NULL THEN
    RETURN;
  END IF;
  
  -- Calculer la baisse de score
  v_score_drop := v_previous_audit.overall_score - v_current_audit.overall_score;
  
  -- Récupérer les schedules actifs
  FOR v_schedule_id, v_threshold IN 
    SELECT id, alert_threshold
    FROM public.audit_schedules
    WHERE is_active = true
  LOOP
    -- Alerte si baisse significative (> 5 points)
    IF v_score_drop > 5 THEN
      INSERT INTO public.audit_alerts (
        schedule_id,
        audit_id,
        alert_type,
        severity,
        title,
        message,
        previous_score,
        current_score,
        score_drop
      ) VALUES (
        v_schedule_id,
        p_audit_id,
        'score_drop',
        CASE 
          WHEN v_score_drop >= 15 THEN 'critical'
          WHEN v_score_drop >= 10 THEN 'warning'
          ELSE 'info'
        END,
        'Baisse du score de conformité',
        format('Le score de conformité a baissé de %.1f points (de %.1f à %.1f)', 
               v_score_drop, v_previous_audit.overall_score, v_current_audit.overall_score),
        v_previous_audit.overall_score,
        v_current_audit.overall_score,
        v_score_drop
      );
    END IF;
    
    -- Alerte si en dessous du seuil
    IF v_current_audit.overall_score < v_threshold AND v_previous_audit.overall_score >= v_threshold THEN
      INSERT INTO public.audit_alerts (
        schedule_id,
        audit_id,
        alert_type,
        severity,
        title,
        message,
        previous_score,
        current_score,
        score_drop
      ) VALUES (
        v_schedule_id,
        p_audit_id,
        'threshold_breach',
        'critical',
        'Seuil de conformité franchi',
        format('Le score de conformité (%.1f) est passé sous le seuil défini (%.1f)', 
               v_current_audit.overall_score, v_threshold),
        v_previous_audit.overall_score,
        v_current_audit.overall_score,
        v_score_drop
      );
    END IF;
  END LOOP;
  
  -- Alerte pour les recommandations critiques
  IF EXISTS (
    SELECT 1 FROM public.compliance_recommendations
    WHERE audit_id = p_audit_id AND severity = 'critical'
  ) THEN
    INSERT INTO public.audit_alerts (
      audit_id,
      alert_type,
      severity,
      title,
      message,
      current_score
    ) VALUES (
      p_audit_id,
      'critical_recommendation',
      'critical',
      'Recommandations critiques détectées',
      format('L''audit a identifié %s recommandation(s) critique(s) nécessitant une action immédiate',
             (SELECT COUNT(*) FROM public.compliance_recommendations 
              WHERE audit_id = p_audit_id AND severity = 'critical')),
      v_current_audit.overall_score
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/* 10. Trigger: Détecter les baisses de score après chaque audit */
CREATE OR REPLACE FUNCTION public.trigger_detect_score_drops()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    PERFORM public.detect_score_drops(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_score_detection
  AFTER INSERT OR UPDATE ON public.compliance_audits
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_detect_score_drops();

/* 11. Fonction: Obtenir les planifications dues */
CREATE OR REPLACE FUNCTION public.get_due_audit_schedules()
RETURNS TABLE (
  schedule_id uuid,
  schedule_name text,
  frequency text,
  last_run timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id,
    name,
    audit_schedules.frequency,
    last_run_at
  FROM public.audit_schedules
  WHERE is_active = true
    AND (next_run_at IS NULL OR next_run_at <= now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;