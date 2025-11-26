/**
 * analyze-text - Analyse de sentiment émotionnel via Lovable AI
 *
 * 🔒 SÉCURISÉ:
 * - Authentification JWT obligatoire
 * - Rate limiting: 30 req/min
 * - CORS restrictif (ALLOWED_ORIGINS)
 * - Validation inputs
 */

import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import { z } from '../_shared/zod.ts';

// Schema de validation
const RequestSchema = z.object({
  text: z.string().min(1, 'Text required').max(5000, 'Text too long (max 5000 chars)'),
});

Deno.serve(async (req: Request) => {
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
    console.warn('[analyze-text] CORS rejected - origin not allowed');
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
      route: 'analyze-text',
      userId: authResult.user.id,
      limit: 30,
      windowMs: 60_000,
      description: 'Text sentiment analysis - Lovable AI',
    });

    if (!rateLimit.allowed) {
      console.warn('[analyze-text] Rate limit exceeded', { userId: authResult.user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop d'analyses. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    // 4. ✅ Validation du body
    const rawBody = await req.json();
    const parseResult = RequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errors = parseResult.error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return new Response(JSON.stringify({ error: `Invalid input: ${errors}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { text } = parseResult.data;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const startTime = Date.now();

    console.log(`[analyze-text] Processing for user: ${authResult.user.id}, text length: ${text.length}`);

    // Appel à Lovable AI pour analyse de sentiment
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
            content: `Tu es un expert en analyse de sentiment émotionnel. Analyse le texte et retourne UNIQUEMENT un objet JSON avec cette structure exacte:
{
  "label": "joie" | "tristesse" | "colère" | "peur" | "surprise" | "neutre",
  "sentiment": -1.0 to 1.0,
  "confidence": 0.0 to 1.0
}
- sentiment: -1 = très négatif, 0 = neutre, 1 = très positif
- confidence: niveau de certitude de l'analyse`,
          },
          {
            role: 'user',
            content: `Analyse ce texte: "${text}"`,
          },
        ],
        temperature: 0.3,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[analyze-text] Lovable AI error:', error);
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in response');
    }

    // Parse le JSON
    let emotionData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        emotionData = JSON.parse(jsonMatch[0]);
      } else {
        emotionData = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('[analyze-text] Parse error:', parseError, 'Content:', content);
      throw new Error('Failed to parse emotion data');
    }

    const latency = Date.now() - startTime;

    const result = {
      label: emotionData.label,
      sentiment: emotionData.sentiment,
      confidence: emotionData.confidence,
      timestamp: Date.now(),
      latency_ms: latency,
    };

    console.log('[analyze-text] Success:', { userId: authResult.user.id, label: result.label, latency });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[analyze-text] Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
