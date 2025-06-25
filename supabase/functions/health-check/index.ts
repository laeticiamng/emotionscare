
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Test de connectivité Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        supabase: error ? 'down' : 'up',
        openai: Deno.env.get('OPENAI_API_KEY') ? 'configured' : 'missing',
        hume: Deno.env.get('HUME_API_KEY') ? 'configured' : 'missing',
        music_api: Deno.env.get('MUSIC_API_KEY') ? 'configured' : 'missing',
        fal_ai: Deno.env.get('FAL_AI_API_KEY') ? 'configured' : 'missing'
      },
      metrics: {
        users_count: data || 0,
        uptime: process.uptime ? Math.floor(process.uptime()) : 'unknown'
      }
    };

    const statusCode = error || !Deno.env.get('OPENAI_API_KEY') ? 503 : 200;

    return new Response(
      JSON.stringify(health),
      { 
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in health-check function:', error);
    return new Response(
      JSON.stringify({ 
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
