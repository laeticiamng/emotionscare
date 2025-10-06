// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const url = new URL(req.url);
    const payload = await req.json().catch(() => ({}));

    // Extraire taskId depuis QS (prioritaire) ou body (fallback)
    const qsTask = url.searchParams.get('taskId');
    const bodyTask = payload?.data?.task_id || payload?.taskId || payload?.task_id;
    const taskId = qsTask || bodyTask;

    if (!taskId) {
      console.error('❌ No taskId in callback - QS:', qsTask, 'Body:', bodyTask);
      return new Response(
        JSON.stringify({ error: 'taskId required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    console.log('🎵 Emotion music callback received:', {
      taskId,
      source: qsTask ? 'querystring' : 'body',
      payload: JSON.stringify(payload).substring(0, 200)
    });

    // Déterminer stage + URLs (compat snake_case ET camelCase)
    const stage = payload?.data?.callbackType || payload?.stage || payload?.callbackType || 'unknown';
    const streamUrl = payload?.data?.stream_url || payload?.data?.streamAudioUrl || 
                     payload?.streamUrl || payload?.stream_url;
    const audioUrl = payload?.data?.audio_url || payload?.data?.audioUrl || 
                    payload?.downloadUrl || payload?.audio_url;
    const duration = payload?.data?.duration || payload?.duration;

    // Vérifier idempotence
    const { data: existing } = await supabase
      .from('suno_callbacks')
      .select('id, callback_type')
      .eq('task_id', taskId)
      .eq('callback_type', stage)
      .maybeSingle();

    if (existing) {
      console.log('⏭️ Callback already processed:', taskId, stage);
      return new Response(
        JSON.stringify({ ok: true, duplicate: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Stocker callback en DB
    const { error: dbError } = await supabase
      .from('suno_callbacks')
      .insert({
        task_id: taskId,
        callback_type: ['text', 'first', 'complete', 'error'].includes(stage) ? stage : 'text',
        status: 'success',
        metadata: {
          ...payload,
          normalized: { streamUrl, audioUrl, duration },
          received_at: new Date().toISOString()
        }
      });

    if (dbError) {
      console.error('❌ Database error:', dbError);
    } else {
      console.log('✅ Callback stored:', stage);
    }

    // Si complete → télécharger et uploader en Storage privé
    if (audioUrl && stage === 'complete') {
      console.log('📥 Downloading final audio from:', audioUrl);
      
      try {
        const audioResp = await fetch(audioUrl);
        if (audioResp.ok) {
          const bytes = new Uint8Array(await audioResp.arrayBuffer());
          const filePath = `runs/emotion/${taskId}.mp3`;
          
          console.log('📤 Uploading to Storage:', filePath, '(',bytes.length, 'bytes)');
          
          const { error: uploadErr } = await supabase.storage
            .from('parcours-tracks')
            .upload(filePath, bytes, {
              contentType: 'audio/mpeg',
              upsert: true
            });

          if (!uploadErr) {
            console.log('✅ Audio uploaded, updating emotion_tracks');
            
            // Upsert emotion_tracks
            const { error: trackErr } = await supabase
              .from('emotion_tracks')
              .upsert({
                task_id: taskId,
                storage_path: filePath,
                duration_seconds: duration,
                metadata: {
                  audio_url: audioUrl,
                  completed_at: new Date().toISOString(),
                  uploaded: true
                }
              }, {
                onConflict: 'task_id'
              });

            if (trackErr) {
              console.error('❌ Error updating emotion_tracks:', trackErr);
            } else {
              console.log('✅ emotion_tracks updated for', taskId);
            }
          } else {
            console.error('❌ Upload error:', uploadErr);
          }
        } else {
          console.error('❌ Failed to download audio:', audioResp.status);
        }
      } catch (err) {
        console.error('❌ Audio download/upload error:', err);
      }
    }

    return new Response(
      JSON.stringify({ ok: true, taskId, stage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    );

  } catch (error) {
    console.error('❌ Callback fatal error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
