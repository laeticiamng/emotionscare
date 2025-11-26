// @ts-nocheck
/**
 * parcours-xl-extend - Extension de segments audio Suno
 *
 * 🔒 SÉCURISÉ: Auth user + Rate limit 5/min + CORS restrictif
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

interface ExtendSegmentRequest {
  runId: string;
  segmentIndex: number;
  continueAt: number;
}

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
    route: 'parcours-xl-extend',
    userId: user.id,
    limit: 5,
    windowMs: 60_000,
    description: 'Suno audio extension',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { runId, segmentIndex, continueAt } = await req.json() as ExtendSegmentRequest;

    console.log(`🎵 Extension segment ${segmentIndex} pour run ${runId} à ${continueAt}s`);

    // Récupérer le segment
    const { data: segment, error: segError } = await supabase
      .from('parcours_segments')
      .select('*')
      .eq('run_id', runId)
      .eq('segment_index', segmentIndex)
      .single();

    if (segError || !segment) {
      throw new Error(`Segment non trouvé: ${segError?.message}`);
    }

    if (!segment.audio_url) {
      throw new Error('Pas d\'audio_url pour extension');
    }

    // Extraire l'audioId depuis l'URL Suno
    const audioIdMatch = segment.audio_url.match(/\/([a-f0-9-]+)\./);
    if (!audioIdMatch) {
      throw new Error('Impossible d\'extraire audioId de l\'URL');
    }
    const audioId = audioIdMatch[1];

    // Étendre la musique avec Suno
    const SUNO_API_KEY = Deno.env.get('SUNO_API_KEY');
    const SUNO_API_BASE = Deno.env.get('SUNO_API_BASE') || 'https://api.sunoapi.org';
    const PUBLIC_CALLBACK_URL = Deno.env.get('PUBLIC_CALLBACK_URL') || `${supabaseUrl}/functions/v1/parcours-xl-callback`;

    if (!SUNO_API_KEY) {
      throw new Error('SUNO_API_KEY non configurée');
    }

    const sunoPayload = {
      audioId,
      continueAt: continueAt || 120,
      model: 'V4_5',
      callBackUrl: `${PUBLIC_CALLBACK_URL}?run_id=${runId}&segment_index=${segmentIndex}`
    };

    console.log('📤 Envoi requête Suno extend:', sunoPayload);

    const sunoResponse = await fetch(`${SUNO_API_BASE}/suno-api/extend-music`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sunoPayload),
    });

    if (!sunoResponse.ok) {
      const errorText = await sunoResponse.text();
      throw new Error(`Suno API Error: ${sunoResponse.status} - ${errorText}`);
    }

    const sunoResult = await sunoResponse.json();
    console.log('✅ Suno extend task créée:', sunoResult);

    // Mettre à jour le segment
    await supabase
      .from('parcours_segments')
      .update({
        suno_task_id: sunoResult.taskId,
        status: 'generating'
      })
      .eq('id', segment.id);

    return new Response(
      JSON.stringify({
        success: true,
        taskId: sunoResult.taskId,
        segmentIndex,
        message: 'Extension lancée'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('❌ Erreur extension:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Erreur inconnue' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
