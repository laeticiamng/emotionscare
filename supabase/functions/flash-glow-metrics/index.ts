import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const {
        duration_s,
        label,
        glow_type = 'energy',
        intensity = 75,
        result = 'completed',
        metadata = {}
      } = body;

      console.log('Flash Glow session:', {
        user_id: user.id,
        duration_s,
        label,
        glow_type,
        intensity,
        result
      });

      // Enregistrer les métriques dans Supabase
      const { error: insertError } = await supabase
        .from('user_metrics')
        .insert({
          user_id: user.id,
          metric_type: 'flash_glow',
          value: duration_s,
          metadata: {
            glow_type,
            intensity,
            result,
            label,
            ...metadata
          },
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error inserting flash glow metrics:', insertError);
        return new Response(JSON.stringify({ error: 'Failed to save metrics' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Retourner une réponse de succès avec recommandation
      let recommendation = '';
      if (label === 'gain') {
        recommendation = 'Excellent ! Votre énergie rayonne ✨';
      } else if (label === 'léger') {
        recommendation = 'Progrès en douceur, continuez 🌟';
      } else {
        recommendation = 'Chaque glow compte, félicitations 💫';
      }

      return new Response(JSON.stringify({
        success: true,
        message: recommendation,
        next_session_in: '4h'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'GET') {
      // Récupérer les statistiques Flash Glow de l'utilisateur
      const { data: metrics, error: metricsError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .eq('metric_type', 'flash_glow')
        .order('created_at', { ascending: false })
        .limit(10);

      if (metricsError) {
        console.error('Error fetching flash glow metrics:', metricsError);
        return new Response(JSON.stringify({ error: 'Failed to fetch metrics' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const totalSessions = metrics?.length || 0;
      const avgDuration = metrics?.length 
        ? Math.round(metrics.reduce((sum, m) => sum + (m.value || 0), 0) / metrics.length)
        : 0;

      return new Response(JSON.stringify({
        total_sessions: totalSessions,
        avg_duration: avgDuration,
        recent_sessions: metrics?.slice(0, 5) || []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Error in flash-glow-metrics function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});