// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { userId } = await req.json();

    // Récupérer les données de conformité récentes
    const { data: complianceScores } = await supabase
      .from('compliance_scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: violations } = await supabase
      .from('security_test_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: webhookLogs } = await supabase
      .from('webhook_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    // Préparer le contexte pour l'IA
    const context = {
      recentScores: complianceScores?.map((s: any) => ({ score: s.score, date: s.created_at })) || [],
      violations: violations?.map((v: any) => ({ severity: v.overall_score, vulnerabilities: v.vulnerabilities })) || [],
      webhookActivity: webhookLogs?.length || 0,
    };

    // Appeler Lovable AI pour générer des prédictions et recommandations
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
            content: 'Tu es un expert RGPD qui analyse les données de conformité et génère des prédictions stratégiques et recommandations pour le comité exécutif.'
          },
          {
            role: 'user',
            content: `Analyse ces données de conformité RGPD:
            
Scores récents: ${JSON.stringify(context.recentScores)}
Violations détectées: ${JSON.stringify(context.violations)}
Activité webhooks: ${context.webhookActivity} événements

Génère:
1. Une prédiction des risques RGPD pour les 30 prochains jours (faible/moyen/élevé)
2. Le score de conformité global actuel (0-100)
3. 3 recommandations stratégiques prioritaires pour le comité exécutif
4. Les 3 KPIs les plus critiques à surveiller

Format JSON strict:
{
  "riskPrediction": "faible|moyen|élevé",
  "currentScore": 85,
  "recommendations": ["rec1", "rec2", "rec3"],
  "criticalKPIs": ["kpi1", "kpi2", "kpi3"],
  "trend": "improving|stable|degrading"
}`
          }
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_executive_insights",
            description: "Génère des insights exécutifs RGPD",
            parameters: {
              type: "object",
              properties: {
                riskPrediction: { type: "string", enum: ["faible", "moyen", "élevé"] },
                currentScore: { type: "number", minimum: 0, maximum: 100 },
                recommendations: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
                criticalKPIs: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
                trend: { type: "string", enum: ["improving", "stable", "degrading"] }
              },
              required: ["riskPrediction", "currentScore", "recommendations", "criticalKPIs", "trend"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_executive_insights" } }
      })
    });

    if (!aiResponse.ok) {
      throw new Error(`Lovable AI error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices[0]?.message?.tool_calls?.[0];
    const insights = toolCall ? JSON.parse(toolCall.function.arguments) : null;

    if (!insights) {
      throw new Error('No insights generated');
    }

    // Sauvegarder les KPIs
    const { data: savedKPI, error: kpiError } = await supabase
      .from('executive_kpis')
      .insert({
        user_id: userId,
        current_score: insights.currentScore,
        risk_prediction: insights.riskPrediction,
        recommendations: insights.recommendations,
        critical_kpis: insights.criticalKPIs,
        trend: insights.trend,
      })
      .select()
      .single();

    if (kpiError) throw kpiError;

    console.log('✅ Executive insights generated:', insights);

    return new Response(
      JSON.stringify({ success: true, insights: savedKPI }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Executive dashboard error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
