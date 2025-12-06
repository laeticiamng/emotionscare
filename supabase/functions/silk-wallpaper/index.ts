import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { SilkSchema } from '../_shared/schemas.ts';
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
    const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user']);
    if (!user) {
      return json(status, { error: 'Unauthorized' });
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
