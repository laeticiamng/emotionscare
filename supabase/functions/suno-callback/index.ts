// @ts-nocheck
/**
 * Suno Callback Webhook - Receives callbacks from Suno API
 * Updates music generation sessions with completed tracks
 * Broadcasts to frontend via Supabase Realtime
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SunoCallbackPayload {
  taskId: string;
  callbackType?: 'text' | 'first' | 'complete' | 'error';
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'SUCCESS' | 'TEXT_SUCCESS' | 'FIRST_SUCCESS';
  data?: {
    title?: string;
    audioUrl?: string;
    audio_url?: string;
    streamUrl?: string;
    stream_url?: string;
    imageUrl?: string;
    image_url?: string;
    duration?: number;
    model?: string;
    style?: string;
  };
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

    // Normalize status from Suno API
    const rawStatus = payload.status || payload.callbackType;
    const isComplete = rawStatus === 'completed' || rawStatus === 'complete' || 
                       rawStatus === 'SUCCESS' || rawStatus === 'TEXT_SUCCESS' || 
                       rawStatus === 'FIRST_SUCCESS';
    const isFailed = rawStatus === 'failed' || rawStatus === 'error';
    const normalizedStatus = isComplete ? 'completed' : isFailed ? 'failed' : 'processing';

    // Extract audio URL from various formats
    const audioUrl = payload.data?.audioUrl || payload.data?.audio_url || 
                     payload.data?.streamUrl || payload.data?.stream_url ||
                     payload.tracks?.[0]?.audio_url || payload.tracks?.[0]?.stream_url;
    const imageUrl = payload.data?.imageUrl || payload.data?.image_url ||
                     payload.tracks?.[0]?.image_url;
    const duration = payload.data?.duration || payload.tracks?.[0]?.duration;
    const title = payload.data?.title || payload.tracks?.[0]?.title;

    // Insert into suno_callbacks table for realtime notification
    const callbackType = isComplete ? 'complete' : isFailed ? 'error' : 
                        (payload.callbackType || 'processing');
    
    const { error: insertError } = await supabase
      .from('suno_callbacks')
      .insert({
        task_id: payload.taskId,
        callback_type: callbackType,
        status: normalizedStatus,
        metadata: {
          audioUrl: audioUrl,
          imageUrl: imageUrl,
          duration: duration,
          title: title,
          model: payload.data?.model || payload.tracks?.[0]?.model,
          style: payload.data?.style || payload.tracks?.[0]?.style,
        }
      });

    if (insertError) {
      console.error('[suno-callback] Failed to insert callback:', insertError);
    } else {
      console.log('[suno-callback] Inserted callback for realtime:', payload.taskId);
    }

    // Try to update music_generation_sessions if exists
    const { data: session } = await supabase
      .from('music_generation_sessions')
      .select('id, emotion_badge')
      .eq('task_id', payload.taskId)
      .maybeSingle();

    if (session) {
      const updates: Record<string, unknown> = {
        status: normalizedStatus,
      };

      if (isComplete && audioUrl) {
        updates.result = {
          taskId: payload.taskId,
          status: 'completed',
          tracks: [{
            id: payload.taskId,
            title: title || 'Generated Track',
            audioUrl: audioUrl,
            imageUrl: imageUrl,
            duration: duration,
            model: payload.data?.model || 'V4_5',
            style: payload.data?.style || '',
          }],
        };
        updates.completed_at = new Date().toISOString();

        // Update suno_generated_tracks cache
        await supabase
          .from('suno_generated_tracks')
          .upsert({
            vinyl_id: session.emotion_badge,
            audio_url: audioUrl,
            title: title || 'Generated Track',
            model: payload.data?.model || 'V4_5',
            duration: duration || 180,
            is_fallback: false,
            generated_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          }, {
            onConflict: 'vinyl_id',
          });
      }

      if (isFailed) {
        updates.error_message = payload.error || 'Generation failed';
      }

      await supabase
        .from('music_generation_sessions')
        .update(updates)
        .eq('id', session.id);

      console.log('[suno-callback] Session updated:', session.id);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      taskId: payload.taskId,
      status: normalizedStatus,
      hasAudio: !!audioUrl 
    }), {
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
