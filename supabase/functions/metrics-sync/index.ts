import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { metrics, user_id } = await req.json();

    // Process offline queue of metrics
    for (const metric of metrics) {
      await supabase.from('emotion_metrics').upsert({
        user_id,
        session_id: metric.session_id,
        timestamp: metric.timestamp,
        emotion_data: metric.emotion_data,
        confidence_score: metric.confidence_score,
        source: metric.source || 'offline_sync'
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed: metrics.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Metrics sync error:', error);
    return new Response(JSON.stringify({ error: 'Sync failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});