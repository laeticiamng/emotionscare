// @ts-nocheck - ESM imports from https://esm.sh ne supportent pas les types TypeScript natifs dans Deno
/**
 * openai-moderate - Modération de contenu via OpenAI
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 50/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.20.1"
import { authenticateRequest } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import { validateRequest, createErrorResponse, ModerationRequestSchema } from '../_shared/validation.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';

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
    // 🔒 SÉCURITÉ: Authentification obligatoire
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      console.warn('[openai-moderate] Unauthorized access attempt');
      return createErrorResponse(authResult.error || 'Authentication required', authResult.status, corsHeaders);
    }

    // 🛡️ SÉCURITÉ: Rate limiting strict (50 req/min - moderation est gratuit mais on limite)
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'openai-moderate',
      userId: authResult.user.id,
      limit: 50,
      windowMs: 60_000,
      description: 'OpenAI content moderation'
    });

    if (!rateLimit.allowed) {
      console.warn('[openai-moderate] Rate limit exceeded', { userId: authResult.user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes modération. Réessayez dans ${rateLimit.retryAfterSeconds}s.`
      });
    }

    // ✅ VALIDATION: Validation Zod des entrées
    const validation = await validateRequest(req, ModerationRequestSchema);
    if (!validation.success) {
      return createErrorResponse(validation.error, validation.status, corsHeaders);
    }

    const { input } = validation.data;

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    console.log('Moderating content length:', input.length)

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    const moderation = await openai.moderations.create({
      input: input,
    })

    const result = moderation.results[0]

    console.log('Moderation completed, flagged:', result.flagged)

    const response = {
      flagged: result.flagged,
      categories: result.categories,
      category_scores: result.category_scores
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Moderation check failed';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error('Error in openai-moderate function:', errorMessage, errorDetails);
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