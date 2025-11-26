/**
 * suno-music - Generation de musique therapeutique via Suno API
 *
 * 🔒 SÉCURISÉ:
 * - Authentification JWT obligatoire
 * - Rate limiting: 5 req/min (API tres coûteuse)
 * - CORS restrictif (ALLOWED_ORIGINS)
 * - Validation inputs
 */

import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import { z } from '../_shared/zod.ts';

// Schema de validation
const RequestSchema = z.object({
  action: z.enum(['start', 'status']),
  prompt: z.string().max(500).optional(),
  mood: z.string().max(50).optional(),
  sessionId: z.string().uuid().optional(),
  trackIds: z.array(z.string()).max(10).optional(),
});

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
    console.warn('[suno-music] CORS rejected - origin not allowed');
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

    // 3. 🛡️ Rate limiting strict (API Suno tres coûteuse)
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'suno-music',
      userId: authResult.user.id,
      limit: 5,
      windowMs: 60_000,
      description: 'Music generation - Suno API',
    });

    if (!rateLimit.allowed) {
      console.warn('[suno-music] Rate limit exceeded', { userId: authResult.user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de générations musicales. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    // 4. ✅ Validation du body
    const rawBody = await req.json();
    const parseResult = RequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errors = parseResult.error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return new Response(
        JSON.stringify({ success: false, error: `Invalid input: ${errors}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, prompt, mood, sessionId, trackIds } = parseResult.data;
    const sunoApiKey = Deno.env.get('SUNO_API_KEY');

    if (!sunoApiKey) {
      throw new Error('SUNO_API_KEY not configured');
    }

    console.log(`[suno-music] Processing action: ${action}, user: ${authResult.user.id}`);

    let result;

    switch (action) {
      case 'start':
        // Generate new music track
        const generateResponse = await fetch('https://api.suno.ai/v1/generate', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sunoApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: prompt || `therapeutic music for ${mood || 'calm'} mood`,
            make_instrumental: true,
            model_version: 'v3.5',
            wait_audio: false,
          }),
        });

        if (!generateResponse.ok) {
          const errorText = await generateResponse.text();
          console.error('[suno-music] Suno API error:', generateResponse.status, errorText);
          throw new Error(`Suno API error: ${generateResponse.status}`);
        }

        result = await generateResponse.json();
        break;

      case 'status':
        if (!trackIds || trackIds.length === 0) {
          return new Response(
            JSON.stringify({ success: false, error: 'trackIds required for status check' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check generation status
        const statusResponse = await fetch(`https://api.suno.ai/v1/generate/${trackIds[0]}`, {
          headers: {
            Authorization: `Bearer ${sunoApiKey}`,
          },
        });

        if (!statusResponse.ok) {
          throw new Error(`Suno API error: ${statusResponse.status}`);
        }

        result = await statusResponse.json();
        break;

      default:
        return new Response(
          JSON.stringify({ success: false, error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        sessionId,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[suno-music] Error:', error);
    const err = error as Error;
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || 'Music generation failed',
        fallback: {
          tracks: [
            { id: 'fallback-calm', url: '/audio/fallback-calm.mp3', mood: 'calm' },
            { id: 'fallback-energize', url: '/audio/fallback-energize.mp3', mood: 'energize' },
          ],
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
