
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

    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const url = new URL(req.url);
    const since = url.searchParams.get('since') || '30 days';

    // Simuler des métriques musicales quotidiennes
    const dailyMetrics = Array.from({ length: 30 }, (_, i) => ({
      id: crypto.randomUUID(),
      user_id: user.id,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      listening_time: Math.floor(Math.random() * 120) + 10, // 10-130 minutes
      wellness_score: Math.floor(Math.random() * 40) + 60, // 60-100
      emotion_improved: Math.random() > 0.3,
      tracks_played: Math.floor(Math.random() * 10) + 1,
      created_at: new Date().toISOString()
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: dailyMetrics,
        user_id: user.id,
        period: since
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in music-daily-user function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
