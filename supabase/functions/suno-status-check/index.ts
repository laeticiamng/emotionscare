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
    
    const SUNO_API_KEY = Deno.env.get('SUNO_API_KEY');
    if (!SUNO_API_KEY) {
      throw new Error('SUNO_API_KEY not configured');
    }

    const startTime = Date.now();
    let isAvailable = false;
    let errorMessage = null;

    try {
      // Simple health check vers l'API Suno
      const response = await fetch('https://api.sunoapi.org/api/v1/gateway/query?ids=test', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SUNO_API_KEY}`,
        },
        signal: AbortSignal.timeout(5000), // 5s timeout
      });

      // L'API est disponible si elle répond (même avec une erreur métier)
      isAvailable = response.status !== 503 && response.status !== 502 && response.status !== 504;
      
      if (!isAvailable) {
        errorMessage = `Service unavailable: ${response.status}`;
      }
    } catch (error) {
      isAvailable = false;
      errorMessage = error.message || 'Network error';
    }

    const responseTime = Date.now() - startTime;

    // Récupérer le dernier statut
    const { data: lastStatus } = await supabase
      .from('suno_api_status')
      .select('*')
      .order('last_check', { ascending: false })
      .limit(1)
      .single();

    const consecutiveFailures = isAvailable ? 0 : (lastStatus?.consecutive_failures || 0) + 1;

    // Mettre à jour le statut dans la DB
    await supabase
      .from('suno_api_status')
      .upsert({
        id: lastStatus?.id,
        is_available: isAvailable,
        last_check: new Date().toISOString(),
        response_time_ms: responseTime,
        error_message: errorMessage,
        consecutive_failures: consecutiveFailures,
      });

    console.log(`[suno-status] Available: ${isAvailable}, Response time: ${responseTime}ms, Failures: ${consecutiveFailures}`);

    return new Response(JSON.stringify({
      success: true,
      status: {
        is_available: isAvailable,
        response_time_ms: responseTime,
        error_message: errorMessage,
        consecutive_failures: consecutiveFailures,
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[suno-status] Error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
