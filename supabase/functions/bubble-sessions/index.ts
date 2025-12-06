import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { z } from '../_shared/zod.ts';
import { supabase } from '../_shared/supa_client.ts';
import { json } from '../_shared/http.ts';
import { authorizeRole } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Schema for start action
const StartSessionSchema = z.object({
  action: z.literal('start'),
  gameMode: z.enum(['relax', 'energize', 'focus']).optional(),
  targetHeartRate: z.number().min(40).max(200).optional(),
  difficulty: z.number().min(1).max(10).optional(),
});

// Schema for end action
const EndSessionSchema = z.object({
  action: z.literal('end'),
  score: z.number().min(0).optional(),
  duration: z.number().min(0).optional(),
  averageHeartRate: z.number().min(30).max(220).optional(),
  biometrics: z.object({
    hrv: z.number().optional(),
    stressLevel: z.number().optional(),
    coherenceLevel: z.number().optional(),
  }).optional(),
});

const ActionSchema = z.discriminatedUnion('action', [StartSessionSchema, EndSessionSchema]);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user']);
    if (!user) {
      return json(status, { error: 'Unauthorized' });
    }

    const body = await req.json();
    const parsed = ActionSchema.safeParse(body);
    
    if (!parsed.success) {
      return json(400, { error: parsed.error.errors });
    }

    if (parsed.data.action === 'start') {
      // Create a new session
      const { data, error } = await supabase
        .from('bubble_beat_sessions')
        .insert({
          user_id: user.id,
          difficulty: parsed.data.gameMode || 'focus',
          score: 0,
          bubbles_popped: 0,
          duration_seconds: 0,
        })
        .select('id')
        .single();

      if (error) {
        console.error('bubble-sessions start error', error);
        return json(500, { error: error.message });
      }

      return json(201, { id: data.id, message: 'Session started' });
    } else {
      // End/complete session - just log success, actual update done via service
      return json(200, { 
        message: 'Session ended',
        score: parsed.data.score,
        duration: parsed.data.duration 
      });
    }
  } catch (err) {
    console.error('bubble-sessions error', err);
    return json(500, { error: 'server_error' });
  }
});
