// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { authenticateRequest } from '../_shared/auth-middleware.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: authResult.status, headers: corsHeaders }
      );
    }

    const { period = 'week', limit = 10 } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Calculer la date de début selon la période
    const now = new Date();
    const startDate = new Date();
    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate.setMonth(now.getMonth() - 3); // quarter
    }

    // Récupérer les entrées de journal
    const { data: entries, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', authResult.user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching journal entries:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch journal entries' }),
        { status: 500, headers: corsHeaders }
      );
    }

    if (!entries || entries.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            insights: {
              summary: "Pas encore d'entrées de journal pour cette période.",
              emotional_trends: [],
              recommendations: ["Commencez à tenir un journal quotidien pour mieux comprendre vos émotions."]
            },
            statistics: {
              total_entries: 0,
              period,
              start_date: startDate.toISOString(),
              end_date: now.toISOString()
            }
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Générer des insights avec OpenAI
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(
        JSON.stringify({ error: 'AI analysis not available' }),
        { status: 503, headers: corsHeaders }
      );
    }

    console.log(`📊 Generating insights for ${entries.length} journal entries`);

    // Préparer le contexte pour l'IA
    const entriesSummary = entries.map((entry, idx) => {
      const date = new Date(entry.created_at).toLocaleDateString('fr-FR');
      return `[${date}] Humeur: ${entry.mood_bucket || 'non spécifiée'}, Contenu: ${entry.summary || 'non disponible'}`;
    }).join('\n');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un psychologue expert en analyse de journaux personnels. Analyse les entrées de journal suivantes et fournis une réponse JSON structurée avec:
            {
              "summary": "Résumé global de la période analysée (2-3 phrases)",
              "emotional_trends": [
                {
                  "emotion": "nom_emotion",
                  "frequency": "haute/moyenne/basse",
                  "observation": "observation_détaillée",
                  "evolution": "amélioration/stable/détérioration"
                }
              ],
              "behavioral_patterns": [
                {
                  "pattern": "nom_pattern",
                  "description": "description_détaillée",
                  "impact": "positif/neutre/négatif"
                }
              ],
              "growth_areas": [
                {
                  "area": "domaine",
                  "progress": "description_progrès",
                  "suggestion": "conseil_pour_continuer"
                }
              ],
              "key_moments": [
                {
                  "date": "date",
                  "description": "moment_significatif",
                  "importance": "haute/moyenne"
                }
              ],
              "recommendations": ["recommandation1", "recommandation2", "recommandation3"],
              "wellbeing_score": 0-10,
              "encouraging_message": "message_personnalisé_de_soutien"
            }`
          },
          {
            role: 'user',
            content: `Analyse ces ${entries.length} entrées de journal sur une période de ${period === 'week' ? '7 jours' : period === 'month' ? '30 jours' : '90 jours'}:\n\n${entriesSummary}`
          }
        ],
        max_tokens: 2000,
        temperature: 0.5,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResult = await response.json();
    const insights = JSON.parse(aiResult.choices[0].message.content);

    console.log('✅ Insights generated successfully');

    // Calculer des statistiques supplémentaires
    const moodCounts = entries.reduce((acc, entry) => {
      const mood = entry.mood_bucket || 'unknown';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});

    const statistics = {
      total_entries: entries.length,
      period,
      start_date: startDate.toISOString(),
      end_date: now.toISOString(),
      mood_distribution: moodCounts,
      avg_entries_per_day: (entries.length / (period === 'week' ? 7 : period === 'month' ? 30 : 90)).toFixed(1)
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          insights,
          statistics,
          entries_analyzed: entries.length,
          model_used: 'gpt-4o-mini',
          timestamp: new Date().toISOString()
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Journal insights error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
