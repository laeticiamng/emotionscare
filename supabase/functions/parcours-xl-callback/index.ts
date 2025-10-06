// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

// Helper : uploader l'audio vers Supabase Storage et retourner le path
async function uploadToStorage(
  supabase: any,
  runId: string,
  segmentId: string,
  audioUrl: string
): Promise<string | null> {
  try {
    console.log('📥 Downloading audio from Suno...');
    const response = await fetch(audioUrl);
    
    if (!response.ok) {
      console.error('Failed to download audio:', response.statusText);
      return null;
    }

    const audioBuffer = await response.arrayBuffer();
    const filePath = `runs/${runId}/${segmentId}.mp3`;

    console.log('📤 Uploading to Storage:', filePath);
    const { error: uploadError } = await supabase.storage
      .from('parcours-tracks')
      .upload(filePath, new Uint8Array(audioBuffer), {
        contentType: 'audio/mpeg',
        upsert: true
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return null;
    }

    return filePath; // Retourne le path, pas l'URL signée
  } catch (error) {
    console.error('Exception during upload:', error);
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
    const payload = await req.json();
    
    if (!segmentId || !token) {
      console.error('❌ Missing segment or token');
      return new Response('Bad Request', { status: 400, headers: corsHeaders });
    }

    console.log('🎵 Suno callback received:', {
      segmentId,
      stage: payload.stage,
      stream: !!payload.streamUrl,
      final: !!payload.downloadUrl
    });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Vérifier le token (anti-rejeu)
    const { data: segment, error: fetchError } = await supabase
      .from('parcours_segments')
      .select('id, run_id, callback_token, status, metadata')
      .eq('id', segmentId)
      .single();

    if (fetchError || !segment || segment.callback_token !== token) {
      console.error('❌ Invalid segment or token mismatch');
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    // Idempotence stricte : vérifier la progression d'état AVANT toute écriture
    const statusOrder = { queued: 0, generating: 1, first: 2, complete: 3, failed: 99 } as const;
    const prevStatus = (segment.status ?? 'queued') as keyof typeof statusOrder;
    const nextStatus = (payload.stage ?? 'generating') as keyof typeof statusOrder;
    
    if (statusOrder[nextStatus] <= statusOrder[prevStatus]) {
      console.log('⏭️ Callback already processed or regression, skipping:', {
        prev: prevStatus,
        next: nextStatus
      });
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Handler pour 'first' : preview_url disponible
    if (payload.stage === 'first' && payload.streamUrl) {
      const { error: updateError } = await supabase
        .from('parcours_segments')
        .update({
          status: 'first',
          preview_url: payload.streamUrl,
          metadata: {
            ...segment.metadata,
            first_received_at: new Date().toISOString()
          }
        })
        .eq('id', segmentId);

      if (updateError) {
        console.error('❌ Failed to update segment (first):', updateError);
      } else {
        console.log('✅ Preview URL saved for segment', segmentId);
      }
      
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Handler pour 'complete' : télécharger et uploader vers Storage
    if (payload.stage === 'complete' && payload.downloadUrl) {
      // Uploader vers Storage et récupérer le path
      const storagePath = await uploadToStorage(
        supabase,
        segment.run_id,
        segmentId,
        payload.downloadUrl
      );

      const updateData: any = {
        status: 'complete',
        duration_seconds: payload.duration || null,
        callback_token: null, // Invalider le token après complete (single-use)
        metadata: {
          ...segment.metadata,
          suno_download_url: payload.downloadUrl ?? null, // Garder l'URL pour debug/forensics
          complete_received_at: new Date().toISOString()
        }
      };

      if (storagePath) {
        updateData.storage_path = storagePath;
        console.log('✅ Audio uploaded to Storage:', storagePath);
      } else {
        // Fallback : stocker l'URL directe de Suno (expire rapidement)
        updateData.final_url = payload.downloadUrl;
        console.warn('⚠️ Storage upload failed, using direct URL');
      }

      const { error: updateError } = await supabase
        .from('parcours_segments')
        .update(updateData)
        .eq('id', segmentId);

      if (updateError) {
        console.error('❌ Failed to update segment (complete):', updateError);
      }

      // Vérifier si tous les segments sont complete pour marquer le run 'ready'
      const { data: allSegments } = await supabase
        .from('parcours_segments')
        .select('status')
        .eq('run_id', segment.run_id);

      const allComplete = allSegments?.every(s => s.status === 'complete');
      
      if (allComplete) {
        await supabase
          .from('parcours_runs')
          .update({ status: 'ready' })
          .eq('id', segment.run_id);
        
        console.log('🎉 All segments complete, run marked as ready');
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Handler pour 'error'
    if (payload.stage === 'error') {
      const { error: updateError } = await supabase
        .from('parcours_segments')
        .update({
          status: 'failed',
          metadata: {
            ...segment.metadata,
            error: payload.error || 'Unknown error',
            error_received_at: new Date().toISOString()
          }
        })
        .eq('id', segmentId);

      if (updateError) {
        console.error('❌ Failed to update segment (error):', updateError);
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Stage non reconnu (ex: 'text') - no-op propre
    console.log('⚠️ Unknown callback stage (no-op):', payload.stage);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error processing callback:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
