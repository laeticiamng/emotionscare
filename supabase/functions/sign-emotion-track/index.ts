// @ts-nocheck
/**
 * sign-emotion-track - Signature d'URL pour tracks émotionnels
 *
 * 🔒 SÉCURISÉ: Auth user + Rate limit 30/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
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

  try {
    const { taskId } = await req.json();

    if (!taskId) {
      return new Response(
        JSON.stringify({ error: 'Missing taskId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1) Auth côté user pour récupérer le user_id
    const authHeader = req.headers.get('Authorization') ?? '';
    const anonClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } },
        auth: { persistSession: false }
      }
    );

    const { data: authData, error: authError } = await anonClient.auth.getUser();

    if (authError || !authData?.user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting per-user
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'sign-emotion-track',
      userId: authData.user.id,
      limit: 30,
      windowMs: 60_000,
      description: 'Emotion track URL signing',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    // 2) Admin client pour lire emotion_tracks
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: track, error: trackError } = await adminClient
      .from('emotion_tracks')
      .select('id, user_id, storage_path')
      .eq('task_id', taskId)
      .single();

    if (trackError || !track) {
      console.error('Track not found:', trackError);
      return new Response(
        JSON.stringify({ error: 'Track not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier que le storage_path est disponible
    if (!track.storage_path) {
      console.error('Track not ready:', track);
      return new Response(
        JSON.stringify({ error: 'Track not uploaded yet' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3) Vérifier que l'utilisateur est propriétaire
    if (track.user_id !== authData.user.id) {
      console.error('Access forbidden: user does not own this track');
      return new Response(
        JSON.stringify({ error: 'Forbidden: you do not own this track' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4) Créer une URL signée (valide 1h)
    const { data: signedData, error: signError } = await adminClient.storage
      .from('parcours-tracks')
      .createSignedUrl(track.storage_path, 60 * 60); // 1 heure

    if (signError || !signedData) {
      console.error('Failed to sign URL:', signError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate signed URL' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ url: signedData.signedUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sign-emotion-track:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
