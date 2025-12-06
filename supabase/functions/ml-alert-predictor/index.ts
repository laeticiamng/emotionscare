// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Fetch historical alert data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: historicalAlerts, error: alertsError } = await supabase
      .from('unified_alerts')
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (alertsError) throw alertsError;

    // Fetch error patterns
    const { data: errorPatterns, error: patternsError } = await supabase
      .from('error_patterns_history')
      .select('*')
      .gte('occurred_at', thirtyDaysAgo.toISOString())
      .order('occurred_at', { ascending: false });

    if (patternsError) throw patternsError;

    // Fetch escalation performance metrics
    const { data: performanceMetrics, error: metricsError } = await supabase
      .from('escalation_performance_metrics')
      .select('*')
      .order('metric_date', { ascending: false })
      .limit(30);

    if (metricsError) throw metricsError;

    // Prepare data for ML analysis
    const analysisData = {
      totalAlerts: historicalAlerts?.length || 0,
      errorPatterns: errorPatterns?.slice(0, 100) || [],
      performanceMetrics: performanceMetrics || [],
      alertsByContext: groupBy(historicalAlerts || [], 'context'),
      alertsBySeverity: groupBy(historicalAlerts || [], 'severity'),
      recentTrends: calculateTrends(historicalAlerts || []),
    };

    // Call Lovable AI for ML predictions
    const systemPrompt = `Tu es un expert en machine learning spécialisé dans l'analyse prédictive des alertes système et l'optimisation des règles d'escalade.

Analyse les données historiques et fournis:
1. Prédictions des alertes pour les prochains 7 jours (types, fréquences, contextes probables)
2. Patterns récurrents détectés avec probabilités
3. Recommandations d'ajustement des règles d'escalade basées sur les performances
4. Score de confiance pour chaque prédiction (0-1)
5. Actions préventives suggérées

Retourne une analyse structurée avec des métriques concrètes.`;

    const userPrompt = `Données historiques (30 derniers jours):
- Total alertes: ${analysisData.totalAlerts}
- Alertes par contexte: ${JSON.stringify(analysisData.alertsByContext)}
- Alertes par sévérité: ${JSON.stringify(analysisData.alertsBySeverity)}
- Tendances récentes: ${JSON.stringify(analysisData.recentTrends)}
- Patterns d'erreurs: ${JSON.stringify(analysisData.errorPatterns.slice(0, 20))}
- Métriques de performance: ${JSON.stringify(analysisData.performanceMetrics.slice(0, 10))}

Fournis:
1. Prédictions pour les 7 prochains jours (alertes attendues par jour/type/sévérité)
2. Patterns récurrents avec probabilités d'occurrence
3. Règles d'escalade à ajuster (délais optimaux, niveaux, destinataires)
4. Score de confiance global (0-1)
5. Actions préventives prioritaires`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      throw new Error("AI Gateway request failed");
    }

    const aiData = await aiResponse.json();
    const predictions = aiData.choices?.[0]?.message?.content || "";

    // Store ML predictions
    const { error: insertError } = await supabase
      .from('ml_predictions')
      .insert({
        prediction_type: 'alert_forecast',
        prediction_data: {
          analysis: predictions,
          historicalData: {
            totalAlerts: analysisData.totalAlerts,
            dateRange: {
              from: thirtyDaysAgo.toISOString(),
              to: new Date().toISOString()
            }
          },
          trends: analysisData.recentTrends,
        },
        confidence_score: 0.85, // Could be extracted from AI response
        model_version: 'v1.0-gemini-2.5',
        context: 'automated_prediction',
      });

    if (insertError) {
      console.error('Failed to store prediction:', insertError);
    }

    console.log('[ML Predictor] Analysis completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        predictions,
        metadata: {
          analyzedAlerts: analysisData.totalAlerts,
          analyzedPatterns: analysisData.errorPatterns.length,
          timestamp: new Date().toISOString(),
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("ML Predictor error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper functions
function groupBy(array: any[], key: string): Record<string, number> {
  return array.reduce((acc, item) => {
    const value = item[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function calculateTrends(alerts: any[]): any {
  const last7Days = alerts.filter(a => {
    const date = new Date(a.created_at);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return date >= sevenDaysAgo;
  });

  const previous7Days = alerts.filter(a => {
    const date = new Date(a.created_at);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return date >= fourteenDaysAgo && date < sevenDaysAgo;
  });

  return {
    last7Days: last7Days.length,
    previous7Days: previous7Days.length,
    trend: last7Days.length - previous7Days.length,
    trendPercentage: previous7Days.length > 0 
      ? ((last7Days.length - previous7Days.length) / previous7Days.length * 100).toFixed(2)
      : 'N/A'
  };
}