// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { taskId } = await req.json();
    
    if (!taskId) {
      return new Response(
        JSON.stringify({ error: 'taskId required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }
    
    const SUNO_API_KEY = Deno.env.get('SUNO_API_KEY');
    if (!SUNO_API_KEY) {
      throw new Error('SUNO_API_KEY not configured');
    }

    console.log('🔍 Polling Suno status for task:', taskId);

    // Poll l'API Suno
    const url = `https://api.sunoapi.org/api/v1/generate/record-info?taskId=${encodeURIComponent(taskId)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Suno poll error:', errorText);
      throw new Error(`Suno API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Suno status:', JSON.stringify(data).substring(0, 500));

    // Parser les deux formats (snake_case ET camelCase)
    let stage = null;
    let streamUrl = null;
    let downloadUrl = null;
    let duration = null;

    if (data.code === 200 && data.data) {
      const status = data.data.status;
      const response = data.data.response;
      
      // Si status = SUCCESS et qu'on a des sunoData
      if (status === 'SUCCESS' && response?.sunoData && Array.isArray(response.sunoData)) {
        const firstTrack = response.sunoData[0];
        
        if (firstTrack) {
          // Priorité aux URLs Suno directes (sourceAudioUrl) sinon fallback
          downloadUrl = firstTrack.sourceAudioUrl || firstTrack.audio_url || firstTrack.audioUrl;
          streamUrl = firstTrack.sourceStreamAudioUrl || firstTrack.stream_url || firstTrack.streamAudioUrl;
          duration = firstTrack.duration;
          
          if (downloadUrl) {
            stage = 'complete';
            
            // Si complete, télécharger et uploader
            const supabase = createClient(
              Deno.env.get('SUPABASE_URL')!,
              Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
            );

            try {
              console.log('📥 Downloading final audio from poll:', downloadUrl);
              const audioResp = await fetch(downloadUrl);
              
              if (audioResp.ok) {
                const bytes = new Uint8Array(await audioResp.arrayBuffer());
                const filePath = `runs/emotion/${taskId}.mp3`;
                
                console.log('📤 Uploading to Storage from poll:', filePath);
                
                const { error: uploadErr } = await supabase.storage
                  .from('parcours-tracks')
                  .upload(filePath, bytes, {
                    contentType: 'audio/mpeg',
                    upsert: true
                  });

                if (!uploadErr) {
                  console.log('✅ Audio uploaded from poll, updating emotion_tracks');
                  
                  await supabase
                    .from('emotion_tracks')
                    .upsert({
                      task_id: taskId,
                      storage_path: filePath,
                      duration_seconds: duration,
                      metadata: {
                        audio_url: downloadUrl,
                        completed_at: new Date().toISOString(),
                        uploaded_via_poll: true
                      }
                    }, {
                      onConflict: 'task_id'
                    });
                  
                  console.log('✅ emotion_tracks updated from poll for', taskId);
                } else {
                  console.error('❌ Upload error from poll:', uploadErr);
                }
              }
            } catch (err) {
              console.error('❌ Error during poll upload:', err);
            }
          } else if (streamUrl) {
            stage = 'first';
          } else {
            stage = 'processing';
          }
        }
      } else if (status === 'PENDING' || status === 'PROCESSING') {
        stage = 'processing';
      } else if (status === 'FAILED') {
        stage = 'error';
      }
    }

    console.log('📦 Formatted response:', { stage, streamUrl, downloadUrl, duration });

    return new Response(
      JSON.stringify({
        taskId,
        stage,
        streamUrl,
        downloadUrl,
        duration,
        rawData: data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error polling Suno:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
