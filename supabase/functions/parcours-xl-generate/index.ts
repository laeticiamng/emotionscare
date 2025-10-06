// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

// URL publique de callback (doit être accessible par Suno)
const CALLBACK_BASE = 'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/parcours-xl-callback';

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
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    const { runId, segmentIndex } = await req.json() as GenerateSegmentRequest;

    console.log(`[generate] 🎵 Generating segment ${segmentIndex} for run ${runId}`);

    // Récupérer le run et le segment
    const { data: run, error: runError } = await supabase
      .from('parcours_runs')
      .select('*')
      .eq('id', runId)
      .single();

    if (runError || !run) {
      throw new Error(`Run not found: ${runError?.message}`);
    }

    const { data: segment, error: segError } = await supabase
      .from('parcours_segments')
      .select('*')
      .eq('run_id', runId)
      .eq('segment_index', segmentIndex)
      .single();

    if (segError || !segment) {
      throw new Error(`Segment not found: ${segError?.message}`);
    }

    // Vérifier la clé API Suno
    const SUNO_API_KEY = Deno.env.get('SUNO_API_KEY');
    if (!SUNO_API_KEY) {
      throw new Error('SUNO_API_KEY not configured');
    }

    // Construire l'URL de callback avec le token anti-rejeu
    const callbackUrl = `${CALLBACK_BASE}?segment=${segment.id}&token=${segment.callback_token}`;

    // Préparer le payload Suno (endpoint correct selon la doc)
    const sunoPayload = {
      customMode: false, // Pour MVP, on utilise le mode simple
      instrumental: true, // Pas de paroles générées
      model: 'V4_5',
      prompt: segment.prompt, // Max 500 chars en mode non-custom
      callBackUrl: callbackUrl
    };

    console.log(`[generate] 📤 Calling Suno API with prompt: ${segment.prompt.substring(0, 50)}...`);

    // Appel API Suno (endpoint correct : /api/v1/generate)
    const sunoResponse = await fetch('https://api.sunoapi.org/api/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sunoPayload),
    });

    if (!sunoResponse.ok) {
      const errorText = await sunoResponse.text();
      console.error(`[generate] Suno API Error: ${sunoResponse.status} - ${errorText}`);
      
      // Marquer le segment comme failed
      await supabase
        .from('parcours_segments')
        .update({ 
          status: 'failed',
          metadata: {
            ...segment.metadata,
            error: `Suno API ${sunoResponse.status}: ${errorText}`
          }
        })
        .eq('id', segment.id);
      
      throw new Error(`Suno API Error: ${sunoResponse.status} - ${errorText}`);
    }

    const sunoResult = await sunoResponse.json();
    console.log(`[generate] ✅ Suno task created:`, sunoResult);

    // Mettre à jour le segment avec le task_id
    await supabase
      .from('parcours_segments')
      .update({
        suno_task_id: sunoResult?.data?.taskId || sunoResult?.taskId,
        status: 'generating',
        metadata: {
          ...segment.metadata,
          suno_response: sunoResult,
          generated_at: new Date().toISOString()
        }
      })
      .eq('id', segment.id);

    return new Response(
      JSON.stringify({
        success: true,
        taskId: sunoResult?.data?.taskId || sunoResult?.taskId,
        segmentIndex,
        message: 'Generation started, waiting for Suno callbacks (first ~40s, complete ~2-3min)'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('[generate] ❌ Error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
