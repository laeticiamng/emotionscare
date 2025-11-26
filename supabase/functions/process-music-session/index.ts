// @ts-nocheck
/**
 * process-music-session - Génération de musique thérapeutique via Suno
 *
 * 🔒 SÉCURISÉ: Auth user + Rate limit 5/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from '../_shared/supabase.ts';
import { authorizeRole } from '../_shared/auth.ts';
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

  const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'process-music-session',
    userId: user.id,
    limit: 5,
    windowMs: 60_000,
    description: 'Music session generation via Suno',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const { sessionId, presetId, metadata } = await req.json();

    if (!sessionId || !presetId) {
      throw new Error('sessionId and presetId are required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Obtener el preset configuration
    const { data: preset, error: presetError } = await supabase
      .from('session_presets')
      .select('*')
      .eq('id', presetId)
      .single();

    if (presetError || !preset) {
      throw new Error(`Preset not found: ${presetId}`);
    }

    // 2. Obtener la sesión
    const { data: session, error: sessionError } = await supabase
      .from('music_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    // 3. Actualizar estado a 'processing'
    await supabase
      .from('music_sessions')
      .update({ status: 'processing' })
      .eq('id', sessionId);

    // 4. Generar prompt basado en preset y metadata
    const prompt = generatePrompt(preset, metadata);

    // 5. Llamar a Suno API para generar música
    const sunoApiKey = Deno.env.get('SUNO_API_KEY');
    if (!sunoApiKey) {
      throw new Error('SUNO_API_KEY not configured');
    }

    const generateResponse = await fetch('https://api.suno.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sunoApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        make_instrumental: preset.cfg_json?.instrumental ?? true,
        model_version: 'v3.5',
        wait_audio: false
      })
    });

    if (!generateResponse.ok) {
      throw new Error(`Suno API error: ${generateResponse.status}`);
    }

    const generateResult = await generateResponse.json();
    const trackIds = generateResult.clips?.map((clip: any) => clip.id) || [];

    if (trackIds.length === 0) {
      throw new Error('No tracks generated');
    }

    // 6. Polling para verificar el estado de generación
    const maxAttempts = 30; // 30 intentos = 5 minutos (cada 10 segundos)
    let attempts = 0;
    let audioUrl = null;
    let duration = 0;

    while (attempts < maxAttempts && !audioUrl) {
      // Esperar 10 segundos entre cada intento
      await new Promise(resolve => setTimeout(resolve, 10000));

      const statusResponse = await fetch(`https://api.suno.ai/v1/generate/${trackIds[0]}`, {
        headers: {
          'Authorization': `Bearer ${sunoApiKey}`,
        }
      });

      if (statusResponse.ok) {
        const statusResult = await statusResponse.json();

        if (statusResult.status === 'complete' && statusResult.audio_url) {
          audioUrl = statusResult.audio_url;
          duration = statusResult.duration || 0;
          break;
        } else if (statusResult.status === 'error') {
          throw new Error('Suno generation failed');
        }
      }

      attempts++;
    }

    if (!audioUrl) {
      throw new Error('Music generation timeout');
    }

    // 7. Actualizar la sesión con la URL y completar
    await supabase
      .from('music_sessions')
      .update({
        status: 'completed',
        artifact_url: audioUrl,
        duration_sec: duration,
        ts_end: new Date().toISOString(),
        metadata: {
          ...metadata,
          suno_track_ids: trackIds,
          suno_prompt: prompt
        }
      })
      .eq('id', sessionId);

    return new Response(JSON.stringify({
      success: true,
      data: {
        sessionId,
        audioUrl,
        duration,
        trackIds
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-music-session:', error);
    const err = error as Error;

    // Intentar marcar la sesión como failed
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { sessionId } = await req.json();

        if (sessionId) {
          await supabase
            .from('music_sessions')
            .update({
              status: 'failed',
              ts_end: new Date().toISOString(),
              metadata: { error: err.message }
            })
            .eq('id', sessionId);
        }
      }
    } catch (updateError) {
      console.error('Failed to update session status:', updateError);
    }

    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

/**
 * Genera un prompt para Suno basado en el preset y metadata
 */
function generatePrompt(preset: any, metadata: any): string {
  const cfg = preset.cfg_json || {};

  // Elementos del prompt
  const mood = metadata?.mood || cfg.mood || 'calm';
  const intensity = metadata?.intensity || cfg.intensity || 'medium';
  const tempo = cfg.tempo || 'medium';
  const instruments = cfg.instruments?.join(', ') || 'piano, strings';

  // Construir el prompt
  return `Therapeutic ${mood} music with ${intensity} intensity, ${tempo} tempo, featuring ${instruments}. Healing and calming soundscape.`;
}
