// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('[queue-worker] Starting processing cycle');

    // Vérifier le statut de l'API
    const { data: apiStatus } = await supabase
      .from('suno_api_status')
      .select('*')
      .order('last_check', { ascending: false })
      .limit(1)
      .single();

    if (!apiStatus?.is_available) {
      console.log('[queue-worker] API unavailable, skipping processing');
      return new Response(JSON.stringify({ 
        success: false,
        message: 'API unavailable' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Récupérer les éléments en attente (max 5 à la fois)
    const { data: queueItems, error: fetchError } = await supabase
      .from('music_generation_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(5);

    if (fetchError) {
      throw fetchError;
    }

    if (!queueItems || queueItems.length === 0) {
      console.log('[queue-worker] No items to process');
      return new Response(JSON.stringify({ 
        success: true,
        processed: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[queue-worker] Processing ${queueItems.length} items`);
    let processed = 0;

    for (const item of queueItems) {
      try {
        // Marquer comme en cours
        await supabase
          .from('music_generation_queue')
          .update({ 
            status: 'processing',
            started_at: new Date().toISOString()
          })
          .eq('id', item.id);

        // Appeler emotion-music-ai
        const { data: musicData, error: musicError } = await supabase.functions.invoke('emotion-music-ai', {
          body: {
            emotion: item.emotion,
            intensity: item.intensity,
            userContext: item.user_context,
            mood: item.mood,
            skipQueue: true, // Important: éviter la boucle infinie
          }
        });

        if (musicError) {
          throw musicError;
        }

        if (!musicData?.success) {
          throw new Error(musicData?.error || 'Generation failed');
        }

        // Marquer comme complété
        await supabase
          .from('music_generation_queue')
          .update({ 
            status: 'completed',
            track_id: musicData.track?.id,
            completed_at: new Date().toISOString()
          })
          .eq('id', item.id);

        processed++;
        console.log(`[queue-worker] ✅ Processed item ${item.id}`);

        // Attendre un peu entre chaque génération (rate limiting)
        await delay(2000);

      } catch (error: any) {
        console.error(`[queue-worker] ❌ Failed item ${item.id}:`, error);

        const newRetryCount = item.retry_count + 1;
        const shouldRetry = newRetryCount < item.max_retries;

        await supabase
          .from('music_generation_queue')
          .update({ 
            status: shouldRetry ? 'pending' : 'failed',
            retry_count: newRetryCount,
            error_message: error.message,
            ...(shouldRetry ? {} : { completed_at: new Date().toISOString() })
          })
          .eq('id', item.id);
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      processed 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('[queue-worker] Error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
