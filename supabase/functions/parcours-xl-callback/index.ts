// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Récupérer les paramètres de l'URL
    const url = new URL(req.url);
    const runId = url.searchParams.get('run_id');
    const segmentIndex = parseInt(url.searchParams.get('segment_index') || '0');

    // Récupérer le body du callback Suno
    const callbackData = await req.json();
    console.log('📥 Callback Suno reçu:', { runId, segmentIndex, callbackData });

    const { taskId, callbackType, status, data: sunoData } = callbackData;

    // Mettre à jour le segment selon le type de callback
    if (callbackType === 'first' && sunoData?.audioUrl) {
      // Premier stream disponible (preview rapide)
      console.log('⚡ First stream disponible:', sunoData.audioUrl);
      
      await supabase
        .from('parcours_segments')
        .update({
          stream_url: sunoData.audioUrl,
          status: 'streaming'
        })
        .eq('run_id', runId)
        .eq('segment_index', segmentIndex);

    } else if (callbackType === 'complete' && sunoData?.audioUrl) {
      // Audio final complet
      console.log('✅ Audio complet disponible:', sunoData.audioUrl);
      
      await supabase
        .from('parcours_segments')
        .update({
          audio_url: sunoData.audioUrl,
          stream_url: sunoData.streamUrl || sunoData.audioUrl,
          lyrics: sunoData.lyrics || null,
          status: 'completed'
        })
        .eq('run_id', runId)
        .eq('segment_index', segmentIndex);

      // Vérifier si tous les segments sont complétés
      const { data: segments } = await supabase
        .from('parcours_segments')
        .select('status')
        .eq('run_id', runId);

      const allCompleted = segments?.every((s: any) => s.status === 'completed');
      
      if (allCompleted) {
        console.log('🎉 Tous les segments complétés pour le run', runId);
        await supabase
          .from('parcours_runs')
          .update({ status: 'ready' })
          .eq('id', runId);
      }

    } else if (callbackType === 'error') {
      console.error('❌ Erreur callback Suno:', sunoData);
      
      await supabase
        .from('parcours_segments')
        .update({ status: 'failed' })
        .eq('run_id', runId)
        .eq('segment_index', segmentIndex);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Callback traité' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('❌ Erreur callback:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Erreur inconnue' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
