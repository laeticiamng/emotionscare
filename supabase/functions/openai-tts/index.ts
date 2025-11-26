/**
 * openai-tts - Synthèse vocale via OpenAI TTS
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 15/min + CORS restrictif + Validation Zod
 */

// @ts-nocheck
import OpenAI from "https://esm.sh/openai@4.20.1"
import { authenticateRequest } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import { validateRequest, createErrorResponse, TTSRequestSchema } from '../_shared/validation.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';

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
    console.warn('[openai-tts] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 🔒 SÉCURITÉ: Authentification obligatoire
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      console.warn('[openai-tts] Unauthorized access attempt');
      return createErrorResponse(authResult.error || 'Authentication required', authResult.status, corsHeaders);
    }

    // 🛡️ SÉCURITÉ: Rate limiting strict (15 req/min - TTS generation)
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'openai-tts',
      userId: authResult.user.id,
      limit: 15,
      windowMs: 60_000,
      description: 'OpenAI Text-to-Speech generation'
    });

    if (!rateLimit.allowed) {
      console.warn('[openai-tts] Rate limit exceeded', { userId: authResult.user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes TTS. Réessayez dans ${rateLimit.retryAfterSeconds}s.`
      });
    }

    // ✅ VALIDATION: Validation Zod des entrées
    const validation = await validateRequest(req, TTSRequestSchema);
    if (!validation.success) {
      return createErrorResponse(validation.error, validation.status, corsHeaders);
    }

    const { text, voice, model } = validation.data;

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    console.log('TTS request for text length:', text.length, 'voice:', voice)

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    const response = await openai.audio.speech.create({
      model: model || 'tts-1',
      voice: voice || 'alloy',
      input: text,
      response_format: 'mp3',
    })

    // Convert response to array buffer
    const arrayBuffer = await response.arrayBuffer()
    
    // Convert to base64
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    )

    console.log('TTS completed, audio size:', arrayBuffer.byteLength)

    const result = {
      audioContent: base64Audio
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'TTS generation failed';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error('Error in openai-tts function:', errorMessage, errorDetails);
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