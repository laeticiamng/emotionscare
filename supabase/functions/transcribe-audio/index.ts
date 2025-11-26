/**
 * transcribe-audio - Transcription audio via OpenAI Whisper
 *
 * 🔒 SÉCURISÉ:
 * - Authentification JWT obligatoire
 * - Rate limiting: 10 req/min (API coûteuse)
 * - CORS restrictif (ALLOWED_ORIGINS)
 * - Validation taille fichier
 */

import { secureHandler, type SecureContext } from '../_shared/secure-handler.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB max pour Whisper

// @ts-ignore - Deno.serve available at runtime in Edge Functions
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
    console.warn('[transcribe-audio] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 2. 🔒 Authentification obligatoire
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      await logUnauthorizedAccess(req, authResult.error || 'Authentication failed');
      return new Response(
        JSON.stringify({ success: false, error: authResult.error || 'Authentication required' }),
        { status: authResult.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. 🛡️ Rate limiting strict (API Whisper coûteuse)
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'transcribe-audio',
      userId: authResult.user.id,
      limit: 10,
      windowMs: 60_000,
      description: 'Audio transcription - OpenAI Whisper API',
    });

    if (!rateLimit.allowed) {
      console.warn('[transcribe-audio] Rate limit exceeded', { userId: authResult.user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de transcriptions. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // 4. Parse multipart form data
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const language = (formData.get('language') as string) || 'fr';
    const duration = formData.get('duration') as string;

    if (!audioFile) {
      return new Response(
        JSON.stringify({ success: false, error: 'No audio file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. ✅ Validation taille fichier
    if (audioFile.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ success: false, error: 'Audio file too large (max 25MB)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 6. ✅ Validation type MIME
    const allowedTypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/flac'];
    if (!allowedTypes.some((t) => audioFile.type.startsWith(t.split('/')[0]))) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid audio format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[transcribe-audio] Processing: ${audioFile.name}, size: ${audioFile.size} bytes, user: ${authResult.user.id}`);

    // 7. Préparer requête Whisper
    const audioBlob = await audioFile.arrayBuffer();
    const whisperFormData = new FormData();
    whisperFormData.append('file', new Blob([audioBlob], { type: audioFile.type }), audioFile.name);
    whisperFormData.append('model', 'whisper-1');
    whisperFormData.append('language', language);
    whisperFormData.append('response_format', 'json');

    const prompt =
      language === 'fr'
        ? "Transcription d'une entrée de journal émotionnel. Émotion, sentiment, bien-être."
        : 'Emotional journal entry transcription. Emotion, feeling, wellbeing.';
    whisperFormData.append('prompt', prompt);

    // 8. Appel API Whisper
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: whisperFormData,
    });

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text();
      console.error('[transcribe-audio] Whisper API error:', errorText);
      throw new Error(`Whisper API error: ${whisperResponse.status}`);
    }

    const whisperResult = await whisperResponse.json();

    console.log('[transcribe-audio] Transcription successful:', {
      textLength: whisperResult.text?.length || 0,
      userId: authResult.user.id,
    });

    // 9. Analyse émotionnelle optionnelle
    let emotionalAnalysis = null;

    if (whisperResult.text && whisperResult.text.length > 10) {
      try {
        const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  'Tu es un assistant spécialisé en analyse émotionnelle. Analyse le texte et identifie les émotions principales. Réponds en JSON avec: emotion (string), intensity (0-1), sentiment (positive/neutral/negative), keywords (array).',
              },
              {
                role: 'user',
                content: whisperResult.text,
              },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3,
          }),
        });

        if (analysisResponse.ok) {
          const analysisResult = await analysisResponse.json();
          emotionalAnalysis = JSON.parse(analysisResult.choices[0].message.content);
        }
      } catch (analysisError) {
        console.error('[transcribe-audio] Emotional analysis failed:', analysisError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        text: whisperResult.text,
        transcription: whisperResult.text,
        language: whisperResult.language || language,
        duration: parseFloat(duration || '0'),
        emotional_analysis: emotionalAnalysis,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[transcribe-audio] Error:', error);
    const err = error as Error;
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || 'Transcription failed',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
