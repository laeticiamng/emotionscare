// @ts-nocheck - ESM imports from https://esm.sh ne supportent pas les types TypeScript natifs dans Deno
/**
 * openai-embeddings - Génération d'embeddings via OpenAI
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 30/min + CORS restrictif + Validation Zod
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.20.1"
import { authenticateRequest } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import { validateRequest, createErrorResponse, EmbeddingsRequestSchema } from '../_shared/validation.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';

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
    console.warn('[openai-embeddings] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 2. 🔒 SÉCURITÉ: Authentification obligatoire
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      console.warn('[openai-embeddings] Unauthorized access attempt');
      return createErrorResponse(authResult.error || 'Authentication required', authResult.status, corsHeaders);
    }

    // 🛡️ SÉCURITÉ: Rate limiting strict (30 req/min - embeddings moins coûteux)
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'openai-embeddings',
      userId: authResult.user.id,
      limit: 30,
      windowMs: 60_000,
      description: 'OpenAI text embeddings generation'
    });

    if (!rateLimit.allowed) {
      console.warn('[openai-embeddings] Rate limit exceeded', { userId: authResult.user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes embeddings. Réessayez dans ${rateLimit.retryAfterSeconds}s.`
      });
    }

    // ✅ VALIDATION: Validation Zod des entrées
    const validation = await validateRequest(req, EmbeddingsRequestSchema);
    if (!validation.success) {
      return createErrorResponse(validation.error, validation.status, corsHeaders);
    }

    const { input, model } = validation.data;

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    console.log('Creating embedding for text length:', input.length)

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    const response = await openai.embeddings.create({
      model: model || 'text-embedding-3-small',
      input: input.trim(),
    })

    console.log('Embedding created, dimensions:', response.data[0].embedding.length)

    const result = {
      embedding: response.data[0].embedding,
      usage: response.usage ? {
        prompt_tokens: response.usage.prompt_tokens,
        total_tokens: response.usage.total_tokens
      } : undefined
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Embedding generation failed';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error('Error in openai-embeddings function:', errorMessage, errorDetails);
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})