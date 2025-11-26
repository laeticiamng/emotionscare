// @ts-nocheck
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { z } from 'https://deno.land/x/zod@v3.22.2/mod.ts';
import { authorizeRole, validateJwtOrThrow, hashUser } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import db from '../_shared/db.ts';

const Body = z.object({
  steps: z.number().int().positive().max(20000),
  avg_cadence: z.number().int().min(20).max(250),
  hr_avg: z.number().int().min(40).max(250),
  joy_idx: z.number().min(0).max(1)
});

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
    route: 'neon-walk-session',
    userId: user.id,
    limit: 30,
    windowMs: 60_000,
    description: 'Neon walk session API',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      error: 'Too many requests',
      retryAfter: rateLimit.retryAfter,
    });
  }

  try {
    const jwt = req.headers.get('authorization')?.replace('Bearer ', '') || '';
    const sub = await validateJwtOrThrow(jwt);
    const user_hash = await hashUser(sub);

    const data = Body.parse(await req.json());

    const [row] = await db
      .insertInto('neon_walk_sessions')
      .values({ user_id_hash: user_hash, ts_walk: new Date(), ...data })
      .returning(['id', 'mvpa_min', 'joy_idx'])
      .execute();

    queueMicrotask(() => {
      console.log('posthog capture neon_walk_session');
    });

    return new Response(JSON.stringify({
      record_id: row.id,
      mvpa_min: row.mvpa_min,
      joy_idx: row.joy_idx
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    console.error('neon-walk-session error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
