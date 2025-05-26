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

  const { user, status } = await authorizeRole(req, ['b2b_admin', 'admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const match = new URL(req.url).pathname.match(/\/org\/([^/]+)\/music\/weekly/);
  const orgId = match?.[1];
  if (!orgId || (user as any).org_id && (user as any).org_id !== orgId) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const since = new URL(req.url).searchParams.get('since') ?? "NOW() - INTERVAL '8 weeks'";

  const rows = await db
    .selectFrom('metrics_weekly_music_org')
    .selectAll()
    .where('org_id', '=', orgId)
    .where('week_start', '>=', db.raw(since))
    .execute();

  return new Response(JSON.stringify(rows), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

serve(handler);
