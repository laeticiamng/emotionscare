// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { authenticateRequest } from '../_shared/auth-middleware.ts';
import { supabase } from '../_shared/supa_client.ts';
import { resolveCors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { z } from '../_shared/zod.ts';

const GenerateMusicSchema = z.object({
  emotion: z.string(),
  target_energy: z.string(),
  duration_seconds: z.number().int().min(30).max(180).default(60),
  style_preferences: z.array(z.string()).optional().default([]),
  session_id: z.string().uuid().optional(),
  intensity: z.number().min(0).max(1).optional(),
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
    const parsed = GenerateMusicSchema.safeParse(payload);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...cors.headers } },
      );
    }

    const { emotion, target_energy, duration_seconds, style_preferences, session_id, intensity } = parsed.data;

    const { data, error } = await supabase
      .from('music_generation_queue')
      .insert({
        user_id: auth.user.id,
        emotion,
        intensity: intensity ?? 0.5,
        user_context: `target_energy:${target_energy}`,
        mood: target_energy,
        status: 'pending',
        metadata: {
          style_preferences,
          duration_seconds,
          session_id,
        },
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ request_id: data.id, status: data.status }),
      { headers: { 'Content-Type': 'application/json', ...cors.headers } },
    );
  } catch (error) {
    console.error('[generate-music] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message ?? 'Internal error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...cors.headers } },
    );
  }
});
