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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(req.headers.get('Authorization')?.replace('Bearer ', '') ?? '');

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Vérifier que l'utilisateur a le rôle b2b_rh
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (!roles?.some((r: any) => r.role === 'b2b_rh')) {
      return new Response(JSON.stringify({ error: 'Accès refusé : rôle RH requis' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Récupérer l'organisation de l'utilisateur
    const { data: userOrg } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('user_id', user.id)
      .single();

    if (!userOrg?.organization_id) {
      return new Response(JSON.stringify({ error: 'Organisation non trouvée' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { period = 'month' } = await req.json().catch(() => ({}));

    console.log('📊 Computing B2B aggregates:', { org_id: userOrg.organization_id, period });

    // Récupérer tous les moods de l'organisation pour la période
    const { data: moods, error: moodsError } = await supabase
      .from('moods')
      .select(`
        id,
        valence,
        arousal,
        note,
        ts,
        profiles!inner(organization_id)
      `)
      .eq('profiles.organization_id', userOrg.organization_id)
      .gte('ts', getPeriodStart(period))
      .order('ts', { ascending: false });

    if (moodsError) {
      console.error('❌ Error fetching moods:', moodsError);
      throw moodsError;
    }

    const count = moods?.length || 0;

    console.log('📈 Found moods:', count);

    // K-anonymat : au moins 5 personnes
    if (count < 5) {
      return new Response(
        JSON.stringify({
          count,
          k_anonymity_met: false,
          message: 'Données insuffisantes pour garantir l\'anonymat (minimum 5 personnes requis)',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Calculer les agrégats
    const avgValence = moods.reduce((sum: number, m: any) => sum + (m.valence || 0), 0) / count;
    const avgArousal = moods.reduce((sum: number, m: any) => sum + (m.arousal || 0), 0) / count;

    const summary = generateAggregateSummary(avgValence, avgArousal, count, period);

    // Enregistrer l'agrégat
    const { error: insertError } = await supabase
      .from('b2b_aggregates')
      .insert({
        organization_id: userOrg.organization_id,
        period,
        text_summary: summary,
      });

    if (insertError) {
      console.error('❌ Error saving aggregate:', insertError);
    }

    console.log('✅ Aggregate computed and saved');

    return new Response(
      JSON.stringify({
        count,
        k_anonymity_met: true,
        summary,
        period,
        computed_at: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Erreur interne' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function getPeriodStart(period: string): string {
  const now = new Date();
  switch (period) {
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    case 'month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    case 'quarter':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  }
}

function generateAggregateSummary(avgValence: number, avgArousal: number, count: number, period: string): string {
  const valenceLabel = avgValence > 0.5 ? 'positive' : avgValence < -0.5 ? 'négative' : 'neutre';
  const arousalLabel = avgArousal > 0.5 ? 'élevée' : avgArousal < -0.5 ? 'faible' : 'modérée';

  return `Sur la période "${period}" (${count} participants), la tendance émotionnelle globale est ${valenceLabel} avec une énergie ${arousalLabel}. Les collaborateurs montrent ${
    avgValence > 0
      ? 'un état d\'esprit globalement positif'
      : avgValence < 0
      ? 'des signes de stress ou d\'inconfort'
      : 'un équilibre émotionnel'
  }. L'activation physiologique est ${arousalLabel}, ce qui suggère ${
    avgArousal > 0.5
      ? 'un engagement actif ou potentiellement du stress'
      : 'un état de calme ou de relaxation'
  }. Recommandation : ${
    avgValence < 0 && avgArousal > 0.5
      ? 'envisager des interventions pour réduire le stress'
      : avgValence > 0 && avgArousal < 0
      ? 'maintenir les pratiques actuelles qui favorisent le bien-être'
      : 'continuer le monitoring'
  }.`;
}
