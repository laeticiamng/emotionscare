// @ts-nocheck
/**
 * emotion-analysis - Analyse émotionnelle de texte via IA
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 30/min + CORS restrictif
 */
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authenticateRequest } from '../_shared/auth-middleware.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

serve(async (req) => {
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  try {
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: authResult.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'emotion-analysis',
      userId: authResult.user.id,
      limit: 30,
      windowMs: 60_000,
      description: 'Emotion analysis AI',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    const { text, language = 'fr' } = await req.json();
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Text is required and must be non-empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const startTime = Date.now();

    // Système prompt pour l'analyse émotionnelle
    const systemPrompt = `Tu es un expert en analyse émotionnelle spécialisé dans la détection des émotions à partir de textes.

TÂCHE : Analyser le texte fourni et identifier précisément :
- L'émotion principale dominante
- La valence (positif/négatif) sur une échelle 0-1
- L'arousal (calme/excité) sur une échelle 0-1
- Le niveau de confiance de ton analyse
- Un résumé court de l'état émotionnel
- Les 3 émotions secondaires les plus présentes avec leurs scores

ÉMOTIONS DÉTECTABLES :
Positives: joie, bonheur, excitation, enthousiasme, sérénité, calme, confiance, espoir, gratitude, fierté
Négatives: tristesse, colère, peur, anxiété, frustration, dégoût, honte, culpabilité, jalousie, mélancolie
Neutres: surprise, confusion, curiosité, neutre, pensif

RÈGLES :
- Valence: 0 = très négatif, 0.5 = neutre, 1 = très positif
- Arousal: 0 = très calme, 0.5 = modéré, 1 = très excité/agité
- Confidence: basé sur la clarté et l'intensité des marqueurs émotionnels
- Summary: 1 phrase courte décrivant l'état émotionnel global`;

    const userPrompt = `Analyse l'émotion dans ce texte : "${text}"`;

    // Call Lovable AI with structured outputs
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
          { role: 'user', content: userPrompt }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'analyze_emotion',
              description: 'Retourne l\'analyse émotionnelle structurée du texte',
              parameters: {
                type: 'object',
                properties: {
                  emotion: {
                    type: 'string',
                    description: 'Émotion principale détectée'
                  },
                  valence: {
                    type: 'number',
                    description: 'Score de valence entre 0 (négatif) et 1 (positif)',
                    minimum: 0,
                    maximum: 1
                  },
                  arousal: {
                    type: 'number',
                    description: 'Score d\'arousal entre 0 (calme) et 1 (excité)',
                    minimum: 0,
                    maximum: 1
                  },
                  confidence: {
                    type: 'number',
                    description: 'Confiance de l\'analyse entre 0 et 1',
                    minimum: 0,
                    maximum: 1
                  },
                  summary: {
                    type: 'string',
                    description: 'Résumé court de l\'état émotionnel (1 phrase)'
                  },
                  emotions: {
                    type: 'object',
                    description: 'Top 3 émotions secondaires avec scores 0-1',
                    additionalProperties: {
                      type: 'number',
                      minimum: 0,
                      maximum: 1
                    }
                  }
                },
                required: ['emotion', 'valence', 'arousal', 'confidence', 'summary', 'emotions'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'analyze_emotion' } }
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit dépassée, réessayez dans quelques instants' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Crédits insuffisants, veuillez recharger votre compte' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const error = await response.text();
      console.error('[emotion-analysis] Lovable AI error:', error);
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extraire les tool calls
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in response');
    }

    const analysisResult = JSON.parse(toolCall.function.arguments);
    
    // Validate result structure
    if (!analysisResult.emotion || typeof analysisResult.valence !== 'number') {
      throw new Error('Invalid analysis result structure');
    }

    const latencyMs = Date.now() - startTime;

    const result = {
      emotion: analysisResult.emotion,
      valence: Math.max(0, Math.min(1, analysisResult.valence)),
      arousal: Math.max(0, Math.min(1, analysisResult.arousal || 0.5)),
      confidence: Math.max(0, Math.min(1, analysisResult.confidence || 0.7)),
      summary: analysisResult.summary || `Émotion ${analysisResult.emotion} détectée`,
      emotions: analysisResult.emotions || {},
      latency_ms: latencyMs
    };

    console.log('[emotion-analysis] Success:', JSON.stringify(result));

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[emotion-analysis] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Failed to analyze text emotions'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
