// @ts-nocheck
/**
 * US-5: Context-Lens WebSocket Emotions API
 * WS /ws/emotions/{patientId}
 * 
 * Note: Supabase Edge Functions ne supportent pas les WebSocket natifs.
 * Cette fonction utilise Supabase Realtime côté client.
 * Elle sert d'endpoint de documentation et de simulation pour les tests.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-context-lens-version',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

// Mapping émotions → régions cérébrales
const EMOTION_BRAIN_MAPPINGS: Record<string, { region: string; color: string }> = {
  anxiety: { region: 'amygdala', color: '#EF4444' },
  joy: { region: 'nucleus_accumbens', color: '#10B981' },
  sadness: { region: 'prefrontal_cortex', color: '#3B82F6' },
  anger: { region: 'hypothalamus', color: '#F59E0B' },
  disgust: { region: 'insula', color: '#8B5CF6' },
  fear: { region: 'amygdala', color: '#DC2626' },
  surprise: { region: 'hippocampus', color: '#EC4899' },
};

async function validateToken(req: Request) {
  const authHeader = req.headers.get('authorization');
  const tokenParam = new URL(req.url).searchParams.get('token');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : tokenParam;
  
  if (!token) return null;
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) return null;
  return user;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const user = await validateToken(req);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Extraire patientId
    const patientIdIndex = pathParts.findIndex(p => 
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p)
    );
    
    const patientId = patientIdIndex >= 0 ? pathParts[patientIdIndex] : null;

    // GET /ws/emotions - Documentation
    if (req.method === 'GET' && !patientId) {
      return new Response(
        JSON.stringify({
          endpoint: 'WebSocket Emotions Stream',
          description: 'Real-time emotion updates for Context-Lens Pro',
          usage: {
            connect: `wss://${SUPABASE_URL.replace('https://', '')}/realtime/v1/websocket?apikey=${SUPABASE_ANON_KEY}`,
            channel: 'emotion_brain_mappings:patient_id=eq.{patientId}',
            events: ['INSERT'],
            message_format: {
              type: 'emotion_update',
              timestamp: 'ISO8601',
              patient_id: 'UUID',
              emotions: {
                anxiety: 'number (0-1)',
                joy: 'number (0-1)',
                sadness: 'number (0-1)',
                anger: 'number (0-1)',
              },
              brain_regions: [
                {
                  region: 'string',
                  emotion: 'string',
                  intensity: 'number (0-1)',
                  color: 'hex color',
                },
              ],
            },
          },
          client_example: `
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const channel = supabase
  .channel('emotions:' + patientId)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'emotion_brain_mappings',
    filter: 'patient_id=eq.' + patientId,
  }, (payload) => {
    console.log('Emotion update:', payload.new);
  })
  .subscribe();
          `.trim(),
          heartbeat_interval_ms: 30000,
          reconnect_strategy: 'exponential_backoff',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /ws/emotions/{patientId}/simulate - Pour les tests
    if (req.method === 'POST' && patientId) {
      const body = await req.json();
      const emotions = body.emotions || {
        anxiety: Math.random() * 0.5,
        joy: Math.random() * 0.8,
        sadness: Math.random() * 0.3,
        anger: Math.random() * 0.2,
        disgust: Math.random() * 0.1,
        fear: Math.random() * 0.2,
        surprise: Math.random() * 0.4,
      };

      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: req.headers.get('authorization') || '' } }
      });

      // Insérer une nouvelle lecture d'émotion (déclenche le realtime)
      const { data, error } = await supabase
        .from('emotion_brain_mappings')
        .insert({
          patient_id: patientId,
          timestamp: new Date().toISOString(),
          mappings: emotions,
        })
        .select()
        .single();

      if (error) {
        console.error('[WEBSOCKET] Simulate error:', error);
        return new Response(
          JSON.stringify({ error: 'insert_failed', message: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Mapper vers régions cérébrales
      const brainRegions = Object.entries(emotions)
        .filter(([emotion, intensity]) => (intensity as number) > 0.2 && EMOTION_BRAIN_MAPPINGS[emotion])
        .map(([emotion, intensity]) => ({
          emotion,
          region: EMOTION_BRAIN_MAPPINGS[emotion].region,
          intensity,
          color: EMOTION_BRAIN_MAPPINGS[emotion].color,
        }));

      console.log(`[WEBSOCKET] Simulated emotion update for patient ${patientId}`);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Emotion update broadcasted via Supabase Realtime',
          data: {
            id: data.id,
            patient_id: patientId,
            timestamp: data.timestamp,
            emotions,
            brain_regions: brainRegions,
          },
        }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /ws/emotions/{patientId} - Info de connexion pour ce patient
    if (req.method === 'GET' && patientId) {
      return new Response(
        JSON.stringify({
          patient_id: patientId,
          connection_info: {
            url: `wss://${SUPABASE_URL.replace('https://', '')}/realtime/v1/websocket`,
            params: {
              apikey: SUPABASE_ANON_KEY,
              token: 'YOUR_JWT_TOKEN',
            },
            channel: `emotion_brain_mappings:patient_id=eq.${patientId}`,
          },
          test_endpoint: {
            method: 'POST',
            path: `/context-lens-websocket/${patientId}/simulate`,
            description: 'Simulates an emotion update for testing',
          },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'not_found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[WEBSOCKET] Error:', error);
    return new Response(
      JSON.stringify({ error: 'server_error', message: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
