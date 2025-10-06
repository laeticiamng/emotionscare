// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Idempotence tracking
const processedCallbacks = new Set<string>();

// Helper: Upload audio to Storage and get signed URL
async function uploadToStorage(
  supabase: any,
  runId: string,
  segmentId: string,
  audioUrl: string
): Promise<string | null> {
  try {
    console.log(`[storage] Downloading audio from ${audioUrl}`);
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      console.error('[storage] Failed to download audio:', audioResponse.status);
      return null;
    }

    const audioBuffer = await audioResponse.arrayBuffer();
    const filePath = `${runId}/${segmentId}.mp3`;

    console.log(`[storage] Uploading to parcours-tracks/${filePath}`);
    const { error: uploadError } = await supabase.storage
      .from('parcours-tracks')
      .upload(filePath, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('[storage] Upload error:', uploadError);
      return null;
    }

    // Create signed URL (valid for 7 days)
    const { data: signedData, error: signError } = await supabase.storage
      .from('parcours-tracks')
      .createSignedUrl(filePath, 7 * 24 * 60 * 60);

    if (signError || !signedData) {
      console.error('[storage] Signed URL error:', signError);
      return null;
    }

    console.log(`[storage] ✅ Uploaded and signed: ${filePath}`);
    return signedData.signedUrl;
  } catch (error) {
    console.error('[storage] Fatal error:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const segmentId = url.searchParams.get('segment');
    const token = url.searchParams.get('token');

    if (!segmentId || !token) {
      console.error('[callback] Missing segment or token');
      return new Response(
        JSON.stringify({ error: 'segment and token required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = await req.json();
    console.log(`[callback] Received stage: ${payload.stage} for segment: ${segmentId}`);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    // Idempotence check
    const idempotencyKey = `${segmentId}-${payload.stage}`;
    if (processedCallbacks.has(idempotencyKey)) {
      console.log(`[callback] ⏭️ Already processed: ${idempotencyKey}`);
      return new Response(
        JSON.stringify({ ok: true, skipped: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier le token (anti-replay)
    const { data: segment, error: fetchError } = await supabase
      .from('parcours_segments')
      .select('*')
      .eq('id', segmentId)
      .eq('callback_token', token)
      .single();

    if (fetchError || !segment) {
      console.error('[callback] Invalid segment or token', fetchError);
      return new Response(
        JSON.stringify({ error: 'Invalid segment or token' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark as processed
    processedCallbacks.add(idempotencyKey);

    // Mettre à jour selon le stage Suno
    const stage = payload.stage; // 'text' | 'first' | 'complete' | 'error'
    
    const updateData: any = {
      metadata: {
        ...segment.metadata,
        last_callback: payload,
        last_callback_at: new Date().toISOString()
      }
    };

    // FIRST: l'audio streaming est dispo (~30-40s) - on peut commencer à jouer
    if (stage === 'first' && payload.streamUrl) {
      console.log(`[callback] ⚡ First audio ready for segment ${segmentId}: ${payload.streamUrl}`);
      updateData.status = 'first';
      updateData.preview_url = payload.streamUrl;
    } 
    // COMPLETE: l'audio final est prêt (2-3 min) - on upload vers Storage et génère URL signée
    else if (stage === 'complete' && payload.downloadUrl) {
      console.log(`[callback] ✅ Final audio ready for segment ${segmentId}: ${payload.downloadUrl}`);
      
      // Upload to Storage and get signed URL
      const signedUrl = await uploadToStorage(
        supabase,
        segment.run_id,
        segmentId,
        payload.downloadUrl
      );

      updateData.status = 'complete';
      updateData.final_url = signedUrl || payload.downloadUrl; // Fallback to direct URL if upload fails
      
      if (payload.duration) {
        updateData.duration_seconds = payload.duration;
      }

      if (signedUrl) {
        updateData.metadata.storage_uploaded = true;
        updateData.metadata.storage_path = `${segment.run_id}/${segmentId}.mp3`;
      }
    }
    // ERROR: quelque chose a planté
    else if (stage === 'error') {
      console.error(`[callback] ❌ Generation failed for segment ${segmentId}:`, payload);
      updateData.status = 'failed';
      updateData.metadata.error = payload.error || 'Unknown error';
    }

    const { error: updateError } = await supabase
      .from('parcours_segments')
      .update(updateData)
      .eq('id', segmentId);

    if (updateError) {
      console.error('[callback] Update error:', updateError);
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier si tous les segments du run sont complete
    if (stage === 'complete') {
      const { data: run } = await supabase
        .from('parcours_runs')
        .select('id, status')
        .eq('id', segment.run_id)
        .single();

      if (run) {
        const { data: allSegments } = await supabase
          .from('parcours_segments')
          .select('status')
          .eq('run_id', run.id);

        const allComplete = allSegments?.every(s => s.status === 'complete');
        if (allComplete && run.status !== 'ready') {
          console.log(`[callback] 🎉 All segments complete for run ${run.id}, marking as ready`);
          await supabase
            .from('parcours_runs')
            .update({ status: 'ready' })
            .eq('id', run.id);
        }
      }
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[callback] Fatal error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
