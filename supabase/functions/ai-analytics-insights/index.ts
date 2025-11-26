// @ts-nocheck
/**
 * ai-analytics-insights - Génération d'insights IA
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 10/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

serve(async (req) => {
  // 1. CORS check
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  // Vérification CORS stricte
  if (!corsResult.allowed) {
    console.warn('[ai-analytics-insights] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 2. Auth via Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      console.warn('[ai-analytics-insights] Unauthorized access attempt');
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 3. 🛡️ Rate limiting (AI coûteux)
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'ai-analytics-insights',
      userId: user.id,
      limit: 10,
      windowMs: 60_000,
      description: 'AI analytics insights generation',
    });

    if (!rateLimit.allowed) {
      console.warn('[ai-analytics-insights] Rate limit exceeded', { userId: user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    console.log(`[ai-analytics-insights] Processing for user: ${user.id}`);

    const { action, period = '30', analysisType = 'comprehensive' } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY non configurée');
    }

    // Récupérer les données émotionnelles de l'utilisateur
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const { data: emotionData, error: emotionError } = await supabaseClient
      .from('emotion_scans')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (emotionError) {
      console.error('Erreur récupération émotions:', emotionError);
    }

    // Récupérer les évaluations cliniques
    const { data: assessmentData, error: assessmentError } = await supabaseClient
      .from('assessments')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (assessmentError) {
      console.error('Erreur récupération évaluations:', assessmentError);
    }

    // Préparer le contexte pour l'IA
    const emotionSummary = emotionData?.map(e => ({
      date: e.created_at,
      emotion: e.emotion_type || e.primary_emotion,
      confidence: e.confidence || 0.8,
      context: e.context
    })) || [];

    const assessmentSummary = assessmentData?.map(a => ({
      date: a.created_at,
      instrument: a.instrument,
      score: a.score_json
    })) || [];

    const systemPrompt = `Tu es un assistant d'analyse psychologique et émotionnelle expert. 
Analyse les données émotionnelles et cliniques de l'utilisateur pour fournir des insights personnalisés.

Contexte:
- Période d'analyse: ${period} jours
- Type d'analyse: ${analysisType}

Données émotionnelles: ${emotionSummary.length} scans
Données cliniques: ${assessmentSummary.length} évaluations

Fournis une analyse structurée avec:
1. **Vue d'ensemble** - Tendances générales observées
2. **Patterns émotionnels** - Cycles, déclencheurs, évolutions
3. **Insights prédictifs** - Risques potentiels et opportunités
4. **Recommandations** - Actions concrètes personnalisées
5. **Objectifs suggérés** - Plans d'amélioration à court/moyen terme`;

    const userPrompt = `Voici les données à analyser:

ÉMOTIONS (${emotionSummary.length} entrées):
${JSON.stringify(emotionSummary.slice(0, 50), null, 2)}

ÉVALUATIONS CLINIQUES (${assessmentSummary.length} entrées):
${JSON.stringify(assessmentSummary.slice(0, 20), null, 2)}

Génère une analyse ${analysisType} détaillée et actionnable.`;

    // Appel à Lovable AI
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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Erreur Lovable AI:', errorText);
      throw new Error(`Erreur Lovable AI: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const analysisText = aiData.choices[0].message.content;

    // Sauvegarder l'analyse
    const { data: savedAnalysis, error: saveError } = await supabaseClient
      .from('ai_analytics_reports')
      .insert({
        user_id: user.id,
        analysis_type: analysisType,
        period_days: parseInt(period),
        report_content: analysisText,
        data_points: emotionSummary.length + assessmentSummary.length,
        insights_generated: 5,
        metadata: {
          emotionCount: emotionSummary.length,
          assessmentCount: assessmentSummary.length,
          generatedAt: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (saveError) {
      console.error('Erreur sauvegarde analyse:', saveError);
    }

    return new Response(JSON.stringify({
      success: true,
      analysis: analysisText,
      reportId: savedAnalysis?.id,
      dataPoints: {
        emotions: emotionSummary.length,
        assessments: assessmentSummary.length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur dans ai-analytics-insights:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Erreur lors de la génération des insights'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
