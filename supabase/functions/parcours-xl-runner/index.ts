// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: invoke avec retry pour gérer les 429/5xx de Suno
async function invokeWithRetry(supabase: any, functionName: string, body: any, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, { body });
      
      if (!error) {
        return { data, error: null };
      }
      
      // Retry sur 429 ou 5xx
      const shouldRetry = 
        error.message?.includes('429') || 
        error.status?.toString().startsWith('5');
      
      if (shouldRetry && attempt < maxRetries - 1) {
        const backoffMs = 2000 * (attempt + 1); // 2s, 4s, 6s
        console.log(`⏳ Retry ${attempt + 1}/${maxRetries} after ${backoffMs}ms`);
        await delay(backoffMs);
        continue;
      }
      
      return { data: null, error };
    } catch (err) {
      if (attempt < maxRetries - 1) {
        await delay(2000 * (attempt + 1));
        continue;
      }
      return { data: null, error: err };
    }
  }
  
  return { data: null, error: new Error('Max retries exceeded') };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { runId } = await req.json();
    
    if (!runId) {
      return new Response(
        JSON.stringify({ error: 'Missing runId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🏃 Starting runner for run:', runId);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Récupérer tous les segments de ce run
    const { data: segments, error: fetchError } = await supabase
      .from('parcours_segments')
      .select('id, segment_index, status, duration_seconds')
      .eq('run_id', runId)
      .order('segment_index', { ascending: true });

    if (fetchError || !segments) {
      console.error('Failed to fetch segments:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch segments' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📦 Found ${segments.length} segments to process`);

    // Traiter chaque segment séquentiellement (respect quota Suno: 20 req/10s)
    for (const segment of segments) {
      // Skip si déjà complete
      if (segment.status === 'complete') {
        console.log(`✅ Segment ${segment.segment_index} already complete, skipping`);
        continue;
      }

      console.log(`🎵 Generating segment ${segment.segment_index}...`);

      // Lancer la génération avec retry automatique (429/5xx)
      const { data: generateData, error: generateError } = await invokeWithRetry(
        supabase,
        'parcours-xl-generate',
        { runId, segmentIndex: segment.segment_index }
      );

      if (generateError) {
        console.error(`❌ Failed to generate segment ${segment.segment_index}:`, generateError);
        continue;
      }

      // Attendre que le segment soit 'complete' (timeout 5 min)
      const startTime = Date.now();
      const timeout = 5 * 60 * 1000; // 5 minutes
      let isComplete = false;

      while (Date.now() - startTime < timeout) {
        const { data: currentSegment } = await supabase
          .from('parcours_segments')
          .select('status, storage_path, final_url')
          .eq('id', segment.id)
          .single();

        if (currentSegment?.status === 'complete') {
          console.log(`✅ Segment ${segment.segment_index} completed`);
          isComplete = true;
          break;
        }

        if (currentSegment?.status === 'failed') {
          console.error(`❌ Segment ${segment.segment_index} failed`);
          break;
        }

        // Poll every 2.5s
        await delay(2500);
      }

      if (!isComplete) {
        console.warn(`⚠️ Segment ${segment.segment_index} timed out`);
      }
    }

    // Calculer la durée totale
    const { data: finalSegments } = await supabase
      .from('parcours_segments')
      .select('duration_seconds')
      .eq('run_id', runId);

    const totalDuration = finalSegments?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) || 0;
    console.log(`📊 Total duration: ${totalDuration}s (${Math.floor(totalDuration / 60)}min)`);

    // Si < 18 min (1080s), on pourrait appeler Extend sur le dernier segment
    // (à implémenter si besoin)
    if (totalDuration < 1080) {
      console.log('⚠️ Total duration < 18min, consider using Extend');
    }

    return new Response(
      JSON.stringify({ 
        ok: true, 
        totalDuration,
        segmentsProcessed: segments.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Runner error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
