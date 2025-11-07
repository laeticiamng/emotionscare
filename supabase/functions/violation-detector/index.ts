// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DetectionRequest {
  action: 'analyze' | 'scan' | 'predict';
  context?: Record<string, any>;
}

interface ViolationData {
  violation_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affected_data_types: string[];
  affected_users_count: number;
  risk_score: number;
  ml_confidence: number;
  metadata: Record<string, any>;
}

interface AlertData {
  alert_type: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  risk_indicators: Record<string, any>;
  recommendations: string[];
  predicted_impact: string;
  confidence_score: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, context }: DetectionRequest = await req.json();

    console.log(`Violation detector action: ${action}`);

    // Récupérer les données système pour l'analyse
    const systemData = await gatherSystemData(supabase);

    // Appeler Lovable AI pour la détection ML
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en conformité RGPD et en détection de violations de données. 
Analyse les données système et détecte les violations potentielles, les anomalies et les risques.
Fournis des alertes proactives basées sur les patterns détectés.`
          },
          {
            role: 'user',
            content: `Analyse les données système suivantes et détecte les violations RGPD potentielles:

Données système:
${JSON.stringify(systemData, null, 2)}

Action demandée: ${action}
Contexte additionnel: ${JSON.stringify(context || {}, null, 2)}

Retourne une analyse détaillée avec:
1. Violations détectées (avec type, sévérité, description, données affectées, nombre d'utilisateurs, score de risque 0-100)
2. Alertes proactives (avec type, sévérité, message, indicateurs de risque, recommandations, impact prédit)
3. Score de confiance ML pour chaque détection (0-100)
4. Métriques d'anomalies détectées

Format JSON structuré.`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your Lovable AI workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;

    // Parser la réponse AI
    const analysis = parseAIResponse(aiContent);

    // Enregistrer les violations détectées
    const violations = [];
    if (analysis.violations && analysis.violations.length > 0) {
      for (const violation of analysis.violations) {
        const { data: insertedViolation, error: violationError } = await supabase
          .from('gdpr_violations')
          .insert({
            violation_type: violation.type,
            severity: violation.severity,
            title: violation.title,
            description: violation.description,
            affected_data_types: violation.affected_data_types || [],
            affected_users_count: violation.affected_users_count || 0,
            risk_score: violation.risk_score || 50,
            ml_confidence: violation.confidence || 75,
            status: 'detected',
            metadata: violation.metadata || {},
          })
          .select()
          .single();

        if (violationError) {
          console.error('Error inserting violation:', violationError);
        } else {
          violations.push(insertedViolation);
        }
      }
    }

    // Créer les alertes proactives
    const alerts = [];
    if (analysis.alerts && analysis.alerts.length > 0) {
      for (const alert of analysis.alerts) {
        const { data: insertedAlert, error: alertError } = await supabase
          .from('violation_alerts')
          .insert({
            alert_type: alert.type,
            severity: alert.severity,
            title: alert.title,
            message: alert.message,
            risk_indicators: alert.risk_indicators || {},
            recommendations: alert.recommendations || [],
            predicted_impact: alert.predicted_impact || '',
            confidence_score: alert.confidence || 75,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours
          })
          .select()
          .single();

        if (alertError) {
          console.error('Error inserting alert:', alertError);
        } else {
          alerts.push(insertedAlert);
        }
      }
    }

    // Enregistrer les métriques
    if (analysis.metrics && analysis.metrics.length > 0) {
      for (const metric of analysis.metrics) {
        await supabase.from('monitoring_metrics').insert({
          metric_name: metric.name,
          metric_value: metric.value,
          metric_unit: metric.unit || '',
          threshold_value: metric.threshold,
          is_anomaly: metric.is_anomaly || false,
          metadata: metric.metadata || {},
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        violations,
        alerts,
        metrics: analysis.metrics || [],
        analysis_summary: analysis.summary || {},
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in violation-detector:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function gatherSystemData(supabase: any) {
  // Récupérer les données système pour l'analyse
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Violations récentes
  const { data: recentViolations } = await supabase
    .from('gdpr_violations')
    .select('*')
    .gte('detected_at', sevenDaysAgo.toISOString())
    .order('detected_at', { ascending: false });

  // Audits récents
  const { data: recentAudits } = await supabase
    .from('compliance_audits')
    .select('*')
    .gte('audit_date', sevenDaysAgo.toISOString())
    .order('audit_date', { ascending: false })
    .limit(5);

  // Demandes DSAR récentes
  const { data: recentDSAR } = await supabase
    .from('dsar_requests')
    .select('*')
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: false });

  // Métriques récentes
  const { data: recentMetrics } = await supabase
    .from('monitoring_metrics')
    .select('*')
    .gte('recorded_at', sevenDaysAgo.toISOString())
    .order('recorded_at', { ascending: false })
    .limit(100);

  // Statistiques utilisateurs
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // Consentements récents
  const { data: recentConsents } = await supabase
    .from('user_consents')
    .select('*')
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: false })
    .limit(50);

  return {
    timestamp: now.toISOString(),
    period: '7_days',
    violations: {
      recent: recentViolations?.length || 0,
      data: recentViolations?.slice(0, 10) || [],
    },
    audits: {
      count: recentAudits?.length || 0,
      latest_score: recentAudits?.[0]?.overall_score || null,
      data: recentAudits || [],
    },
    dsar_requests: {
      count: recentDSAR?.length || 0,
      pending: recentDSAR?.filter((r: any) => r.status === 'pending').length || 0,
      overdue: recentDSAR?.filter((r: any) => r.status === 'pending' && new Date(r.legal_deadline) < now).length || 0,
    },
    metrics: recentMetrics || [],
    users: {
      total: userCount || 0,
    },
    consents: {
      recent: recentConsents?.length || 0,
      revoked: recentConsents?.filter((c: any) => !c.consent_given).length || 0,
    },
  };
}

function parseAIResponse(content: string) {
  try {
    // Tenter de parser directement le JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Sinon, construire une structure par défaut
    return {
      violations: [],
      alerts: [],
      metrics: [],
      summary: { raw_content: content },
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return {
      violations: [],
      alerts: [],
      metrics: [],
      summary: { error: 'Failed to parse AI response', raw_content: content },
    };
  }
}
