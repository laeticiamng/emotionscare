
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

    // Vérifier les permissions admin/rh
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'b2b_admin', 'rh_manager'].includes(profile.role)) {
      throw new Error('Insufficient permissions');
    }

    const url = new URL(req.url);
    const orgId = url.pathname.split('/')[2]; // /org/:orgId/music/weekly
    const since = url.searchParams.get('since') || '8 weeks';

    // Simuler des métriques organisationnelles hebdomadaires
    const weeklyOrgMetrics = Array.from({ length: 8 }, (_, i) => ({
      id: crypto.randomUUID(),
      organization_id: orgId,
      week_start: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      total_users: Math.floor(Math.random() * 50) + 20,
      active_users: Math.floor(Math.random() * 30) + 15,
      avg_listening_time: Math.floor(Math.random() * 60) + 30, // 30-90 minutes
      avg_wellness_score: Math.floor(Math.random() * 20) + 70, // 70-90
      total_sessions: Math.floor(Math.random() * 200) + 100,
      improvement_rate: (Math.random() * 0.3 + 0.6).toFixed(2), // 60-90%
      created_at: new Date().toISOString()
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: weeklyOrgMetrics,
        organization_id: orgId,
        period: since,
        summary: {
          total_active_users: weeklyOrgMetrics[0]?.active_users || 0,
          avg_improvement: weeklyOrgMetrics[0]?.improvement_rate || '0.75'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in music-weekly-org function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
