import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { supabase } from '../_shared/supa_client.ts';
import { getUserHash, json } from '../_shared/http.ts';
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
    const { user: authUser, status } = await authorizeRole(req, ['b2c', 'b2b_user']);
    if (!authUser) {
      return json(status, { error: 'Unauthorized' });
    }
    const range = new URL(req.url).searchParams.get('range') ?? '7d';
    const jwt = req.headers.get('authorization')?.replace('Bearer ', '') || '';
    const user = getUserHash(jwt);
    const { data, error } = await supabase
      .from('metrics_weekly')
      .select('*')
      .eq('user_id_hash', user)
      .gte('ts', range === '30d'
        ? new Date(Date.now() - 30 * 86400000).toISOString()
        : new Date(Date.now() - 7 * 86400000).toISOString())
      .order('ts', { ascending: true });
    if (error) {
      return json(500, { error });
    }
    return json(200, data);
  } catch (err) {
    console.error('me-metrics error', err);
    return json(500, { error: 'server_error' });
  }
});
