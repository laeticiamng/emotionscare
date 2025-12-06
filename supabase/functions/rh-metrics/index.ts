import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { supabase } from '../_shared/supa_client.ts';
import { json, requireRole } from '../_shared/http.ts';
import { authorizeRole } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user, status } = await authorizeRole(req, ['rh_manager']);
    if (!user) {
      return json(status, { error: 'Unauthorized' });
    }
    await requireRole(req, 'rh_manager');
    const p = new URL(req.url).searchParams;
    const team = p.get('team');
    const range = p.get('range') ?? 'w4';
    const { data, error } = await supabase
      .from('metrics_weekly_v')
      .select('*')
      .eq('team_id', team)
      .gte('week', range === 'w8'
        ? new Date(Date.now() - 56 * 86400000).toISOString()
        : new Date(Date.now() - 28 * 86400000).toISOString())
      .order('week', { ascending: true });
    if (error) {
      return json(500, { error });
    }
    return json(200, data);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error('rh-metrics error', err);
    return json(500, { error: 'server_error' });
  }
});
