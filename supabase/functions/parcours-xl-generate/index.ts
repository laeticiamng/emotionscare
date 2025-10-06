// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateSegmentRequest {
  runId: string;
  segmentIndex: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { runId, segmentIndex } = await req.json() as GenerateSegmentRequest;

    console.log(`🎵 Génération segment ${segmentIndex} pour run ${runId}`);

    // Récupérer le run et le segment
    const { data: run, error: runError } = await supabase
      .from('parcours_runs')
      .select('*')
      .eq('id', runId)
      .single();

    if (runError || !run) {
      throw new Error(`Run non trouvée: ${runError?.message}`);
    }

    const { data: segment, error: segError } = await supabase
      .from('parcours_segments')
      .select('*')
      .eq('run_id', runId)
      .eq('segment_index', segmentIndex)
      .single();

    if (segError || !segment) {
      throw new Error(`Segment non trouvé: ${segError?.message}`);
    }

    // Récupérer le preset depuis metadata (ou depuis YAML si implémenté)
    const presetKey = run.preset_key;
    
    // TODO: Charger le YAML preset complet
    // Pour MVP, on simule avec des données basiques
    const musicConfig = {
      bpm: 70,
      mode: 'dorian',
      style: 'lofi chill',
      instrumental: true,
      durationSeconds: segment.end_seconds - segment.start_seconds
    };

    // Générer la musique avec Suno
    const SUNO_API_KEY = Deno.env.get('SUNO_API_KEY');
    const SUNO_API_BASE = Deno.env.get('SUNO_API_BASE') || 'https://api.sunoapi.org';
    const PUBLIC_CALLBACK_URL = Deno.env.get('PUBLIC_CALLBACK_URL') || `${supabaseUrl}/functions/v1/parcours-xl-callback`;

    if (!SUNO_API_KEY) {
      throw new Error('SUNO_API_KEY non configurée');
    }

    const sunoPayload = {
      customMode: true,
      instrumental: musicConfig.instrumental,
      title: segment.title,
      style: musicConfig.style,
      model: 'V4_5',
      durationSeconds: musicConfig.durationSeconds,
      callBackUrl: `${PUBLIC_CALLBACK_URL}?run_id=${runId}&segment_index=${segmentIndex}`
    };

    console.log('📤 Envoi requête Suno:', sunoPayload);

    const sunoResponse = await fetch(`${SUNO_API_BASE}/api/v1/music`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sunoPayload),
    });

    if (!sunoResponse.ok) {
      const errorText = await sunoResponse.text();
      throw new Error(`Suno API Error: ${sunoResponse.status} - ${errorText}`);
    }

    const sunoResult = await sunoResponse.json();
    console.log('✅ Suno task créée:', sunoResult);

    // Mettre à jour le segment avec le task_id
    await supabase
      .from('parcours_segments')
      .update({
        suno_task_id: sunoResult.taskId,
        status: 'generating'
      })
      .eq('id', segment.id);

    return new Response(
      JSON.stringify({
        success: true,
        taskId: sunoResult.taskId,
        segmentIndex,
        message: 'Génération lancée'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('❌ Erreur génération:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Erreur inconnue' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
