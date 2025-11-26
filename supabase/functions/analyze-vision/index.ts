/**
 * analyze-vision - Analyse d'expressions faciales via Lovable AI (Gemini)
 *
 * 🔒 SÉCURISÉ:
 * - Authentification JWT obligatoire
 * - Rate limiting: 15 req/min
 * - CORS restrictif (ALLOWED_ORIGINS)
 * - Validation inputs
 */

import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import { z } from '../_shared/zod.ts';

// Schema de validation
const RequestSchema = z.object({
  imageBase64: z.string().min(100, 'Image data required'),
});

Deno.serve(async (req) => {
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
    console.warn('[analyze-vision] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 2. 🔒 Authentification obligatoire
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      await logUnauthorizedAccess(req, authResult.error || 'Authentication failed');
      return new Response(JSON.stringify({ error: authResult.error || 'Authentication required' }), {
        status: authResult.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. 🛡️ Rate limiting
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'analyze-vision',
      userId: authResult.user.id,
      limit: 15,
      windowMs: 60_000,
      description: 'Vision analysis - Lovable AI',
    });

    if (!rateLimit.allowed) {
      console.warn('[analyze-vision] Rate limit exceeded', { userId: authResult.user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop d'analyses. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    // 4. ✅ Validation du body
    const rawBody = await req.json();
    const parseResult = RequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errors = parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return new Response(JSON.stringify({ error: `Invalid input: ${errors}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { imageBase64 } = parseResult.data;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const startTime = Date.now();

    console.log(`[analyze-vision] Processing for user: ${authResult.user.id}`);

    // Appel à Lovable AI (Gemini 2.5 Flash) pour analyse vision
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en analyse d'expressions faciales avec une expertise en diversité morphologique et culturelle.

IMPORTANT - DIVERSITÉ MORPHOLOGIQUE :
Tu dois analyser les expressions faciales en tenant compte de la grande diversité des traits du visage selon les origines ethniques :
- Morphologies asiatiques : traits plus fins, forme des yeux spécifique, structure osseuse caractéristique
- Morphologies africaines : diversité entre Afrique subsaharienne et Afrique du Nord, structure du visage, traits prononcés
- Morphologies européennes : grande variété (Nord, Sud, Est, Ouest)
- Morphologies amérindiennes, moyen-orientales, océaniennes, etc.
- Métissages et variantes individuelles

Chaque morphologie exprime les émotions différemment. Par exemple :
- Les plis du front varient selon la structure osseuse
- L'ouverture des yeux diffère selon la forme naturelle
- Les rides et expressions musculaires sont culturellement et morphologiquement diverses

CONSIGNES D'ANALYSE :
1. Analyse les micro-expressions UNIVERSELLES (contraction sourcils, ouverture yeux, tension bouche)
2. Ne te base PAS sur des stéréotypes morphologiques
3. Tiens compte que certaines expressions neutres peuvent sembler différentes selon l'origine
4. Concentre-toi sur les CHANGEMENTS d'expression plutôt que sur l'apparence au repos

Retourne UNIQUEMENT un objet JSON avec cette structure exacte:
{
  "label": "joie" | "tristesse" | "colère" | "peur" | "surprise" | "dégoût" | "neutre" | "calme" | "anxiété" | "stress" | "excitation" | "ennui" | "confusion" | "concentration" | "détermination" | "fatigue" | "satisfaction" | "fierté" | "nostalgie" | "admiration" | "amusement" | "contentement" | "sérénité" | "frustration" | "honte" | "espoir" | "gratitude" | "enthousiasme" | "inquiétude" | "mélancolie" | "irritation" | "émerveillement" | "embarras" | "désir" | "culpabilité" | "jalousie" | "envie" | "mépris" | "déception" | "soulagement" | "tendresse" | "inspiration" | "extase" | "torpeur" | "tourment" | "crainte" | "apathie" | "ravissement",
  "scores": {
    "emotion1": 0.0-1.0,
    "emotion2": 0.0-1.0,
    ...
  }
}
Le label doit être l'émotion dominante détectée. Dans scores, inclure les 3-5 émotions les plus présentes avec leurs scores de confiance. Sois précis, nuancé et culturellement inclusif dans ta détection.`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyse cette expression faciale et retourne uniquement le JSON demandé, sans texte supplémentaire.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64,
                },
              },
            ],
          },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[analyze-vision] Lovable AI error:', error);
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in response');
    }

    // Parse le JSON de la réponse
    let emotionData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        emotionData = JSON.parse(jsonMatch[0]);
      } else {
        emotionData = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('[analyze-vision] Parse error:', parseError, 'Content:', content);
      throw new Error('Failed to parse emotion data');
    }

    const latency = Date.now() - startTime;

    // Calculer la confiance moyenne
    const scores = emotionData.scores as Record<string, number>;
    const scoreValues = Object.values(scores) as number[];
    const maxScore = Math.max(...scoreValues);
    const avgOtherScores = (scoreValues.reduce((a, b) => a + b, 0) - maxScore) / 6;
    const confidence = maxScore - avgOtherScores;

    const result = {
      label: emotionData.label,
      scores: emotionData.scores,
      confidence: Math.max(0, Math.min(1, confidence)),
      timestamp: Date.now(),
      latency_ms: latency,
    };

    console.log('[analyze-vision] Success:', { userId: authResult.user.id, label: result.label, latency });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[analyze-vision] Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
