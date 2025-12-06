// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExtendSegmentRequest {
  runId: string;
  segmentIndex: number;
  continueAt: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { runId, segmentIndex, continueAt } = await req.json() as ExtendSegmentRequest;

    console.log(`🎵 Extension segment ${segmentIndex} pour run ${runId} à ${continueAt}s`);

    // Récupérer le segment
    const { data: segment, error: segError } = await supabase
      .from('parcours_segments')
      .select('*')
      .eq('run_id', runId)
      .eq('segment_index', segmentIndex)
      .single();

    if (segError || !segment) {
      throw new Error(`Segment non trouvé: ${segError?.message}`);
    }

    if (!segment.audio_url) {
      throw new Error('Pas d\'audio_url pour extension');
    }

    // Extraire l'audioId depuis l'URL Suno
    const audioIdMatch = segment.audio_url.match(/\/([a-f0-9-]+)\./);
    if (!audioIdMatch) {
      throw new Error('Impossible d\'extraire audioId de l\'URL');
    }
    const audioId = audioIdMatch[1];

    // Étendre la musique avec Suno
    const SUNO_API_KEY = Deno.env.get('SUNO_API_KEY');
    const SUNO_API_BASE = Deno.env.get('SUNO_API_BASE') || 'https://api.sunoapi.org';
    const PUBLIC_CALLBACK_URL = Deno.env.get('PUBLIC_CALLBACK_URL') || `${supabaseUrl}/functions/v1/parcours-xl-callback`;

    if (!SUNO_API_KEY) {
      throw new Error('SUNO_API_KEY non configurée');
    }

    const sunoPayload = {
      audioId,
      continueAt: continueAt || 120,
      model: 'V4_5',
      callBackUrl: `${PUBLIC_CALLBACK_URL}?run_id=${runId}&segment_index=${segmentIndex}`
    };

    console.log('📤 Envoi requête Suno extend:', sunoPayload);

    const sunoResponse = await fetch(`${SUNO_API_BASE}/suno-api/extend-music`, {
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
    console.log('✅ Suno extend task créée:', sunoResult);

    // Mettre à jour le segment
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
        message: 'Extension lancée'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('❌ Erreur extension:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Erreur inconnue' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
