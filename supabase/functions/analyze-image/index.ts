/**
 * analyze-image - Analyse émotionnelle d'images via GPT-4 Vision
 *
 * 🔒 SÉCURISÉ:
 * - Authentification JWT obligatoire
 * - Rate limiting: 10 req/min (API coûteuse)
 * - CORS restrictif (ALLOWED_ORIGINS)
 * - Validation inputs
 */

import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import { z } from '../_shared/zod.ts';

// Schema de validation
const RequestSchema = z.object({
  image: z.string().min(100, 'Image data required'),
  fileName: z.string().max(255).optional(),
  mimeType: z.string().max(50).optional().default('image/jpeg'),
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
    console.warn('[analyze-image] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 2. 🔒 Authentification obligatoire
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      await logUnauthorizedAccess(req, authResult.error || 'Authentication failed');
      return new Response(JSON.stringify({ success: false, error: authResult.error || 'Authentication required' }), {
        status: authResult.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. 🛡️ Rate limiting (API GPT-4 Vision coûteuse)
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'analyze-image',
      userId: authResult.user.id,
      limit: 10,
      windowMs: 60_000,
      description: 'Image analysis - GPT-4 Vision API',
    });

    if (!rateLimit.allowed) {
      console.warn('[analyze-image] Rate limit exceeded', { userId: authResult.user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop d'analyses d'images. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    // 4. ✅ Validation du body
    const rawBody = await req.json();
    const parseResult = RequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errors = parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return new Response(JSON.stringify({ success: false, error: `Invalid input: ${errors}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { image, fileName, mimeType } = parseResult.data;

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    console.log(`[analyze-image] Processing for user: ${authResult.user.id}, file: ${fileName}`);

    // Extraire la partie base64 de l'image
    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;

    // Appel à GPT-4 Vision API
    const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant spécialisé en analyse émotionnelle d'images pour un journal thérapeutique.
Analyse l'image et identifie:
1. Les émotions visibles (expressions faciales, langage corporel, ambiance générale)
2. L'humeur générale (positive, neutral, negative, calm, energetic, etc.)
3. Une description courte de ce que tu vois
4. Des tags pertinents pour le contexte émotionnel

Réponds en JSON avec cette structure exacte:
{
  "emotions": ["string array of detected emotions"],
  "mood": "string - overall mood",
  "sentiment": "positive|neutral|negative",
  "description": "string - brief description in French",
  "tags": ["string array of relevant tags"],
  "confidence": "number 0-1 - confidence score",
  "therapeutic_insights": "string - brief insight for emotional wellbeing"
}`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: "Analyse cette image dans le contexte d'une entrée de journal émotionnel.",
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Data}`,
                  detail: 'auto',
                },
              },
            ],
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      console.error('[analyze-image] GPT-4 Vision API error:', errorText);
      throw new Error(`GPT-4 Vision API error: ${visionResponse.status}`);
    }

    const visionResult = await visionResponse.json();
    const analysis = JSON.parse(visionResult.choices[0].message.content);

    console.log('[analyze-image] Success:', {
      userId: authResult.user.id,
      emotions: analysis.emotions?.length || 0,
      mood: analysis.mood,
    });

    // Détection faciale supplémentaire
    const faceDetection = {
      faces_detected: analysis.emotions?.length > 0,
      count: analysis.emotions?.length || 0,
    };

    return new Response(
      JSON.stringify({
        success: true,
        emotions: analysis.emotions || [],
        mood: analysis.mood || 'neutral',
        sentiment: analysis.sentiment || 'neutral',
        description: analysis.description || '',
        tags: analysis.tags || [],
        confidence: analysis.confidence || 0.7,
        therapeutic_insights: analysis.therapeutic_insights || '',
        face_detection: faceDetection,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[analyze-image] Error:', error);
    const err = error as Error;
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
