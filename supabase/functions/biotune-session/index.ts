import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { z } from 'https://deno.land/x/zod@v3.22.2/mod.ts';
import { authorizeRole, validateJwtOrThrow, hashUser } from '../_shared/auth.ts';
import db from '../_shared/db.ts';

const Body = z.object({
  duration_s: z.number().int().positive().max(900),
  bpm_target: z.number().int().min(40).max(180),
  hrv_pre: z.number().int().min(5).max(300),
  hrv_post: z.number().int().min(5).max(300),
  energy_mode: z.enum(['calm', 'energize'])
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
      .insertInto('biotune_sessions')
      .values({ user_id_hash: user_hash, ts_start: new Date(), ...data })
      .returning(['id', 'rmssd_delta', 'coherence'])
      .execute();

    queueMicrotask(() => {
      console.log('posthog capture biotune_session');
    });

    return new Response(JSON.stringify({
      record_id: row.id,
      rmssd_delta: row.rmssd_delta,
      coherence: row.coherence
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 422, headers: { 'Content-Type': 'application/json' } });
    }
    console.error('biotune-session error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
