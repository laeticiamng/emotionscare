import { serve } from 'std/server';
import db from '../_shared/db.ts';
import { authorizeRole } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

export async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const since = new URL(req.url).searchParams.get('since') ?? "NOW() - INTERVAL '30 days'";

  const rows = await db
    .selectFrom('biotune_daily_metrics')
    .selectAll()
    .where('user_id_hash', '=', user.id)
    .where('date', '>=', db.raw(since))
    .unionAll(
      db.selectFrom('neon_walk_daily_metrics')
        .selectAll()
        .where('user_id_hash', '=', user.id)
        .where('date', '>=', db.raw(since))
    )
    .execute();

  return new Response(JSON.stringify(rows), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

serve(handler);
