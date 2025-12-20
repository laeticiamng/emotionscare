// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { authenticateRequest } from '../_shared/auth-middleware.ts';
import { supabase } from '../_shared/supa_client.ts';
import { resolveCors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { z } from '../_shared/zod.ts';

const StatusSchema = z.object({
  request_id: z.string().uuid(),
});

serve(async (req) => {
  const cors = resolveCors(req);
  if (req.method === 'OPTIONS') {
    return preflightResponse(cors);
  }
  if (!cors.allowed) {
    return rejectCors(cors);
  }

  try {
    const auth = await authenticateRequest(req);
    if (auth.status !== 200 || !auth.user) {
      return new Response(JSON.stringify({ error: auth.error || 'Authentication required' }), {
        status: auth.status,
        headers: { 'Content-Type': 'application/json', ...cors.headers },
      });
    }

    const payload = await req.json();
    const parsed = StatusSchema.safeParse(payload);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...cors.headers } },
      );
    }

    const { request_id } = parsed.data;

    const { data, error } = await supabase
      .from('music_generation_queue')
      .select('*')
      .eq('id', request_id)
      .eq('user_id', auth.user.id)
      .single();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ status: data.status, track_id: data.track_id, metadata: data.metadata }),
      { headers: { 'Content-Type': 'application/json', ...cors.headers } },
    );
  } catch (error) {
    console.error('[check-music-status] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message ?? 'Internal error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...cors.headers } },
    );
  }
});
