/**
 * openai-transcribe - Transcription audio via OpenAI Whisper
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 20/min + CORS restrictif + Validation
 */

// @ts-nocheck
import OpenAI from "https://esm.sh/openai@4.20.1"
import { authenticateRequest } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import { createErrorResponse } from '../_shared/validation.ts';
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
    console.warn('[openai-transcribe] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 🔒 SÉCURITÉ: Authentification obligatoire
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      console.warn('[openai-transcribe] Unauthorized access attempt');
      return createErrorResponse(authResult.error || 'Authentication required', authResult.status, corsHeaders);
    }

    // 🛡️ SÉCURITÉ: Rate limiting strict (20 req/min - Whisper transcription)
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'openai-transcribe',
      userId: authResult.user.id,
      limit: 20,
      windowMs: 60_000,
      description: 'OpenAI Whisper transcription'
    });

    if (!rateLimit.allowed) {
      console.warn('[openai-transcribe] Rate limit exceeded', { userId: authResult.user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de transcriptions. Réessayez dans ${rateLimit.retryAfterSeconds}s.`
      });
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    const formData = await req.formData()
    const audioFile = formData.get('audio') as File
    
    // ✅ VALIDATION: Vérification du fichier audio
    if (!audioFile) {
      return createErrorResponse('Audio file is required', 400, corsHeaders);
    }

    if (audioFile.size > 25 * 1024 * 1024) {
      return createErrorResponse('Audio file too large (max 25MB)', 400, corsHeaders);
    }

    const allowedTypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/mp4'];
    if (!allowedTypes.includes(audioFile.type)) {
      return createErrorResponse(`Invalid audio format. Allowed: ${allowedTypes.join(', ')}`, 400, corsHeaders);
    }

    console.log('Transcribing audio file:', audioFile.name, 'Size:', audioFile.size)

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "fr", // French by default, can be made configurable
      response_format: "json",
      temperature: 0.0, // More deterministic for transcription
    })

    console.log('Transcription completed:', transcription.text?.substring(0, 100) + '...')

    const response = {
      text: transcription.text,
      language: transcription.language || 'fr'
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Transcription failed';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error('Error in openai-transcribe function:', errorMessage, errorDetails);
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