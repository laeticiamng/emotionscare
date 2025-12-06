// @ts-nocheck
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { z } from 'https://deno.land/x/zod@v3.22.2/mod.ts';
import { authorizeRole, validateJwtOrThrow, hashUser } from '../_shared/auth.ts';
import db from '../_shared/db.ts';

const Body = z.object({
  steps: z.number().int().positive().max(20000),
  avg_cadence: z.number().int().min(20).max(250),
  hr_avg: z.number().int().min(40).max(250),
  joy_idx: z.number().min(0).max(1)
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok');
  }

  const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status, headers: { 'Content-Type': 'application/json' } });
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
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 422, headers: { 'Content-Type': 'application/json' } });
    }
    console.error('neon-walk-session error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
