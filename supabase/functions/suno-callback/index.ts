// @ts-nocheck
/**
 * Suno Callback Webhook - Receives callbacks from Suno API
 * Updates music generation sessions with completed tracks
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SunoCallbackPayload {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  tracks?: Array<{
    id: string;
    title: string;
    audio_url?: string;
    stream_url?: string;
    image_url?: string;
    duration?: number;
    model?: string;
    style?: string;
  }>;
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: SunoCallbackPayload = await req.json();
    console.log('[suno-callback] Received callback:', JSON.stringify(payload, null, 2));

    if (!payload.taskId) {
      return new Response(JSON.stringify({ error: 'Missing taskId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Find the music generation session by task_id
    const { data: session, error: fetchError } = await supabase
      .from('music_generation_sessions')
      .select('*')
      .eq('task_id', payload.taskId)
      .single();

    if (fetchError) {
      console.error('[suno-callback] Session not found:', fetchError);
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update session based on callback status
    const updates: Record<string, unknown> = {
      status: payload.status,
    };

    if (payload.status === 'completed' && payload.tracks?.length) {
      const track = payload.tracks[0];
      updates.result = {
        taskId: payload.taskId,
        status: 'completed',
        tracks: payload.tracks.map(t => ({
          id: t.id,
          title: t.title,
          audioUrl: t.audio_url || t.stream_url,
          imageUrl: t.image_url,
          duration: t.duration,
          model: t.model || 'V4_5',
          style: t.style || '',
        })),
      };
      updates.completed_at = new Date().toISOString();

      // Also update suno_generated_tracks cache if track exists
      if (track.audio_url || track.stream_url) {
        await supabase
          .from('suno_generated_tracks')
          .upsert({
            vinyl_id: session.emotion_badge, // Use emotion badge as vinyl identifier
            audio_url: track.audio_url || track.stream_url,
            title: track.title,
            model: track.model || 'V4_5',
            duration: track.duration || 180,
            is_fallback: false,
            generated_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          }, {
            onConflict: 'vinyl_id',
          });
      }
    }

    if (payload.status === 'failed') {
      updates.error_message = payload.error || 'Generation failed';
    }

    const { error: updateError } = await supabase
      .from('music_generation_sessions')
      .update(updates)
      .eq('id', session.id);

    if (updateError) {
      console.error('[suno-callback] Update failed:', updateError);
      return new Response(JSON.stringify({ error: 'Update failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[suno-callback] Session updated successfully:', session.id);

    return new Response(JSON.stringify({ success: true, sessionId: session.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[suno-callback] Error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
