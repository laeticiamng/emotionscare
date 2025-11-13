-- Create alert_templates table for customizable notification templates
CREATE TABLE IF NOT EXISTS public.alert_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT NOT NULL CHECK (template_type IN ('email', 'slack', 'discord')),
  
  -- Template content with variables
  subject TEXT, -- For email only
  body TEXT NOT NULL,
  
  -- Available variables documentation
  available_variables JSONB DEFAULT '["errorMessage", "severity", "priority", "category", "analysis", "suggestedFix", "autoFixCode", "preventionTips", "url", "timestamp", "errorId", "dashboardUrl"]'::jsonb,
  
  -- Metadata
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.alert_templates ENABLE ROW LEVEL SECURITY;

-- Admin users can manage templates
CREATE POLICY "Admins can view alert templates"
ON public.alert_templates FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can insert alert templates"
ON public.alert_templates FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update alert templates"
ON public.alert_templates FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete alert templates"
ON public.alert_templates FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Add template reference to alert_configurations
ALTER TABLE public.alert_configurations
ADD COLUMN email_template_id UUID REFERENCES public.alert_templates(id),
ADD COLUMN slack_template_id UUID REFERENCES public.alert_templates(id),
ADD COLUMN discord_template_id UUID REFERENCES public.alert_templates(id);

-- Create indexes
CREATE INDEX idx_alert_templates_type ON public.alert_templates(template_type);
CREATE INDEX idx_alert_templates_default ON public.alert_templates(is_default);

-- Create trigger for updated_at
CREATE TRIGGER update_alert_templates_updated_at
  BEFORE UPDATE ON public.alert_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_alert_config_updated_at();

-- Insert default templates
INSERT INTO public.alert_templates (name, description, template_type, subject, body, is_default) VALUES
(
  'Email par défaut',
  'Template email standard pour les alertes critiques',
  'email',
  '🚨 Alerte Critique: {{category}} - {{priority}}',
  '<h1>Alerte Erreur Critique</h1>
<p><strong>Message:</strong> {{errorMessage}}</p>
<p><strong>Gravité:</strong> {{severity}} | <strong>Priorité:</strong> {{priority}}</p>
<p><strong>Catégorie:</strong> {{category}}</p>
<p><strong>Date:</strong> {{timestamp}}</p>

<h2>🔍 Analyse AI</h2>
<p>{{analysis}}</p>

<h2>💡 Solution Suggérée</h2>
<p>{{suggestedFix}}</p>

{{#if autoFixCode}}
<h2>🔧 Code de Correction</h2>
<pre><code>{{autoFixCode}}</code></pre>
{{/if}}

{{#if preventionTips}}
<h2>🛡️ Conseils de Prévention</h2>
<ul>
{{#each preventionTips}}
  <li>{{this}}</li>
{{/each}}
</ul>
{{/if}}

<p><a href="{{dashboardUrl}}">Voir le Dashboard</a></p>',
  true
),
(
  'Slack par défaut',
  'Template Slack standard pour les alertes',
  'slack',
  NULL,
  '🚨 *Alerte Critique: {{category}}*

*Message:* {{errorMessage}}
*Gravité:* {{severity}} | *Priorité:* {{priority}}
*Date:* {{timestamp}}

*🔍 Analyse AI:*
{{analysis}}

*💡 Solution:*
{{suggestedFix}}

<{{dashboardUrl}}|Voir le Dashboard>',
  true
),
(
  'Discord par défaut',
  'Template Discord standard pour les alertes',
  'discord',
  NULL,
  '🚨 **Alerte Critique: {{category}}**

**Message:** {{errorMessage}}
**Gravité:** {{severity}} | **Priorité:** {{priority}}
**Date:** {{timestamp}}

**🔍 Analyse AI:**
{{analysis}}

**💡 Solution:**
{{suggestedFix}}

[Voir le Dashboard]({{dashboardUrl}})',
  true
);

-- Create view for alert analytics
CREATE OR REPLACE VIEW public.alert_analytics AS
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as total_alerts,
  COUNT(*) FILTER (WHERE resolved = true) as resolved_count,
  COUNT(*) FILTER (WHERE resolved = false) as unresolved_count,
  COUNT(*) FILTER (WHERE severity = 'critical') as critical_count,
  COUNT(*) FILTER (WHERE severity = 'high') as high_count,
  COUNT(*) FILTER (WHERE priority = 'urgent') as urgent_count,
  AVG(
    CASE 
      WHEN resolved = true AND resolved_at IS NOT NULL 
      THEN EXTRACT(EPOCH FROM (resolved_at - created_at)) / 60
      ELSE NULL 
    END
  ) as avg_resolution_time_minutes,
  category,
  COUNT(*) as category_count
FROM public.ai_monitoring_errors
GROUP BY DATE_TRUNC('day', created_at), category
ORDER BY date DESC, category_count DESC;