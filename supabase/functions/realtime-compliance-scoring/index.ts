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

    const { eventType, eventData } = await req.json();
    console.log('Analyzing compliance impact of event:', eventType);

    // Récupérer le score actuel
    const { data: currentScore } = await supabase
      .from('compliance_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Contexte pour l'IA
    const context = `
Événement RGPD détecté: ${eventType}
Données: ${JSON.stringify(eventData)}
Score actuel: ${currentScore?.score || 0}/100

Analyse l'impact de cet événement sur la conformité RGPD et détermine:
1. Le nouvel score de conformité (0-100)
2. L'impact de l'événement (+X ou -X points)
3. Si une alerte doit être générée (critique/warning/info)
4. Recommandations d'actions correctives si nécessaire
`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'Tu es un système d\'analyse RGPD en temps réel. Évalue l\'impact des événements sur la conformité de manière factuelle et précise.',
          },
          { role: 'user', content: context },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'update_compliance_score',
            description: 'Met à jour le score de conformité suite à un événement',
            parameters: {
              type: 'object',
              properties: {
                new_score: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100,
                  description: 'Nouveau score de conformité',
                },
                impact: {
                  type: 'number',
                  description: 'Impact de l\'événement en points (+/−)',
                },
                alert_level: {
                  type: 'string',
                  enum: ['none', 'info', 'warning', 'critical'],
                  description: 'Niveau d\'alerte à générer',
                },
                alert_message: {
                  type: 'string',
                  description: 'Message d\'alerte pour l\'utilisateur',
                },
                recommendations: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Actions correctives recommandées',
                },
                affected_areas: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Domaines de conformité affectés',
                },
              },
              required: ['new_score', 'impact', 'alert_level'],
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'update_compliance_score' } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requêtes atteinte.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Crédits épuisés.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error('AI Gateway error');
    }

    const aiResponse = await response.json();
    const toolCall = aiResponse.choices[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error('Pas de réponse structurée de l\'IA');
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    // Sauvegarder le nouveau score
    const { data: newScoreRecord } = await supabase
      .from('compliance_scores')
      .insert({
        user_id: user.id,
        score: analysis.new_score,
        previous_score: currentScore?.score || 0,
        impact: analysis.impact,
        event_type: eventType,
        event_data: eventData,
        affected_areas: analysis.affected_areas || [],
      })
      .select()
      .single();

    // Générer une alerte si nécessaire
    if (analysis.alert_level !== 'none') {
      await supabase.from('gdpr_alerts').insert({
        alert_type: 'compliance_score_change',
        severity: analysis.alert_level,
        message: analysis.alert_message || `Score modifié: ${analysis.impact > 0 ? '+' : ''}${analysis.impact} points`,
        metadata: {
          old_score: currentScore?.score || 0,
          new_score: analysis.new_score,
          impact: analysis.impact,
          recommendations: analysis.recommendations,
        },
      });

      // Déclencher les webhooks si alerte critique
      if (analysis.alert_level === 'critical') {
        await supabase.functions.invoke('trigger-webhooks', {
          body: {
            eventType: 'alert.critical',
            data: {
              alert_type: 'compliance_score_critical',
              score: analysis.new_score,
              message: analysis.alert_message,
            },
          },
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: {
          previous_score: currentScore?.score || 0,
          new_score: analysis.new_score,
          impact: analysis.impact,
          alert_level: analysis.alert_level,
          alert_message: analysis.alert_message,
          recommendations: analysis.recommendations || [],
          affected_areas: analysis.affected_areas || [],
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in realtime-compliance-scoring:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur inconnue' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
