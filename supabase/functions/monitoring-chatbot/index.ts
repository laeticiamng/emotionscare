// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();

    if (!question || typeof question !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Question requise' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Récupérer les données contextuelles pour l'IA
    const [
      escalationsResult,
      patternsResult,
      predictionsResult,
      metricsResult
    ] = await Promise.all([
      supabase.from('active_escalations').select('*').limit(20),
      supabase.from('error_patterns_history').select('*').order('occurred_at', { ascending: false }).limit(50),
      supabase.from('ml_predictions').select('*').order('predicted_at', { ascending: false }).limit(10),
      supabase.from('escalation_performance_metrics').select('*').order('metric_date', { ascending: false }).limit(7)
    ]);

    // Préparer le contexte pour l'IA
    const context = {
      active_escalations: escalationsResult.data || [],
      error_patterns: patternsResult.data || [],
      ml_predictions: predictionsResult.data || [],
      performance_metrics: metricsResult.data || []
    };

    // Construire le prompt système
    const systemPrompt = `Tu es un assistant IA expert en analyse de monitoring et d'alertes pour EmotionsCare.

Contexte des données disponibles:
- ${context.active_escalations.length} escalades actives
- ${context.error_patterns.length} patterns d'erreurs récents
- ${context.ml_predictions.length} prédictions ML
- ${context.performance_metrics.length} jours de métriques de performance

Données complètes:
${JSON.stringify(context, null, 2)}

Tu dois:
1. Analyser les données fournies
2. Répondre de manière concise et pertinente à la question
3. Fournir des insights actionnables
4. Mentionner les tendances ou anomalies importantes
5. Suggérer des actions si pertinent

Réponds en français, de manière professionnelle mais accessible.`;

    // Appeler Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY non configurée');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        max_tokens: 1000,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requêtes atteinte. Réessayez dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Crédits insuffisants. Veuillez recharger votre compte Lovable AI.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const answer = aiData.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        answer,
        context_summary: {
          active_escalations: context.active_escalations.length,
          error_patterns: context.error_patterns.length,
          ml_predictions: context.ml_predictions.length,
          metrics_days: context.performance_metrics.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Chatbot error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur interne du chatbot' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});