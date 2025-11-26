// @ts-nocheck
/**
 * silk-wallpaper - Fonds d'écran Silk génératifs
 *
 * 🔒 SÉCURISÉ: Auth user + Rate limit 30/min + CORS restrictif
 */
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { SilkSchema } from '../_shared/schemas.ts';
import { supabase } from '../_shared/supa_client.ts';
import { getUserHash, json } from '../_shared/http.ts';
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
      return json(status, { error: 'Unauthorized' });
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'silk-wallpaper',
      userId: user.id,
      limit: 30,
      windowMs: 60_000,
      description: 'Silk wallpaper generation',
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
    const parsed = SilkSchema.safeParse(body);
    if (!parsed.success) {
      return json(400, { error: parsed.error.errors });
    }
    const { data, error } = await supabase
      .from('silk_wallpaper')
      .insert({ ...parsed.data, user_id_hash: userHash })
      .select('id')
      .single();
    if (error) {
      return json(500, { error });
    }
    return json(201, { id: data.id });
  } catch (err) {
    console.error('silk-wallpaper error', err);
    return json(500, { error: 'server_error' });
  }
});
