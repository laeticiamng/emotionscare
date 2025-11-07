// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { reportData } = await req.json();
    console.log('Validating report with AI');

    // Préparer le contexte pour l'IA
    const reportContext = `
Données du rapport RGPD:
- Score de conformité: ${reportData.complianceScore}%
- Nombre de consentements: ${reportData.totalConsents}
- Consentements actifs: ${reportData.activeConsents}
- Exports en attente: ${reportData.pendingExports}
- Alertes critiques: ${reportData.criticalAlerts}
- Suppressions complétées: ${reportData.completedDeletions}
- Taux de réponse DSAR: ${reportData.dsarResponseRate}%
`;

    const systemPrompt = `Tu es un expert en conformité RGPD. Analyse le rapport et fournis:
1. Une évaluation de conformité sur 5 critères
2. Des recommandations concrètes et priorisées
3. Des actions correctives immédiates si nécessaire

Sois précis, factuel et actionnable.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: reportContext },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'validate_gdpr_report',
            description: 'Valide un rapport RGPD et retourne une analyse structurée',
            parameters: {
              type: 'object',
              properties: {
                compliance_checks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      criterion: { type: 'string' },
                      status: { type: 'string', enum: ['pass', 'warning', 'fail'] },
                      score: { type: 'number', minimum: 0, maximum: 100 },
                      details: { type: 'string' },
                    },
                    required: ['criterion', 'status', 'score', 'details'],
                  },
                },
                recommendations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      priority: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
                      category: { type: 'string' },
                      action: { type: 'string' },
                      impact: { type: 'string' },
                    },
                    required: ['title', 'priority', 'category', 'action', 'impact'],
                  },
                },
                overall_assessment: { type: 'string' },
                immediate_actions: {
                  type: 'array',
                  items: { type: 'string' },
                },
              },
              required: ['compliance_checks', 'recommendations', 'overall_assessment'],
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'validate_gdpr_report' } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requêtes atteinte, réessayez dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Crédits Lovable AI épuisés. Veuillez recharger votre compte.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('Erreur du service IA');
    }

    const aiResponse = await response.json();
    const toolCall = aiResponse.choices[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('Pas de réponse structurée de l\'IA');
    }

    const validation = JSON.parse(toolCall.function.arguments);

    // Enregistrer la validation dans la DB
    const { error: insertError } = await supabase
      .from('report_validations')
      .insert({
        report_id: reportData.reportId,
        user_id: user.id,
        compliance_checks: validation.compliance_checks,
        recommendations: validation.recommendations,
        overall_assessment: validation.overall_assessment,
        immediate_actions: validation.immediate_actions || [],
      });

    if (insertError) {
      console.error('Error saving validation:', insertError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        validation,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in validate-report-ai:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur inconnue' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
