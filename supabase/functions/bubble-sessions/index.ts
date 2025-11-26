// @ts-nocheck
/**
 * bubble-sessions - Sessions de bulles émotionnelles
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 20/min + CORS restrictif
 */
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { BubbleSchema } from '../_shared/schemas.ts';
import { supabase } from '../_shared/supa_client.ts';
import { getUserHash } from '../_shared/http.ts';
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

  try {
    const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user']);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'bubble-sessions',
      userId: user.id,
      limit: 20,
      windowMs: 60_000,
      description: 'Bubble sessions API',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    const jwt = req.headers.get('authorization')?.replace('Bearer ', '') || '';
    const userHash = getUserHash(jwt);
    const body = await req.json();
    const parsed = BubbleSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.errors }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const { data, error } = await supabase
      .from('bubble_sessions')
      .insert({ ...parsed.data, user_id_hash: userHash })
      .select('id')
      .single();
    if (error) {
      return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ id: data.id }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('bubble-sessions error', err);
    return new Response(JSON.stringify({ error: 'server_error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
