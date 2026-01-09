// @ts-nocheck
/**
 * Edge function pour générer les rapports mensuels B2B
 * Produit un résumé textuel et des métriques agrégées
 */
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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { org_id, month } = await req.json();

    if (!org_id) {
      return new Response(
        JSON.stringify({ error: 'org_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate month boundaries
    const targetMonth = month ? new Date(month + '-01') : new Date();
    targetMonth.setDate(1);
    targetMonth.setHours(0, 0, 0, 0);
    
    const monthEnd = new Date(targetMonth);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    const monthStr = targetMonth.toISOString().slice(0, 7); // YYYY-MM

    // Fetch weekly aggregates for the month
    const { data: weeklyData, error: weeklyError } = await supabase
      .from('org_weekly_aggregates')
      .select('*')
      .eq('org_id', org_id)
      .gte('week_start', targetMonth.toISOString())
      .lt('week_start', monthEnd.toISOString());

    if (weeklyError) throw weeklyError;

    // Fetch org info
    const { data: orgData } = await supabase
      .from('organizations')
      .select('name, max_seats')
      .eq('id', org_id)
      .single();

    // Calculate monthly metrics
    const totalSessions = weeklyData?.reduce((sum, w) => sum + (w.total_sessions || 0), 0) || 0;
    const avgWeeklyUsers = weeklyData?.length 
      ? Math.round(weeklyData.reduce((sum, w) => sum + (w.unique_users || 0), 0) / weeklyData.length)
      : 0;
    const avgSessionDuration = weeklyData?.length
      ? Math.round(weeklyData.reduce((sum, w) => sum + (w.avg_session_duration || 0), 0) / weeklyData.length)
      : 0;

    // Aggregate pathway distribution
    const pathwayTotals: Record<string, number> = {};
    weeklyData?.forEach(w => {
      const dist = w.pathway_distribution as Record<string, number> || {};
      Object.entries(dist).forEach(([key, val]) => {
        pathwayTotals[key] = (pathwayTotals[key] || 0) + val;
      });
    });

    // Calculate adoption rate
    const maxSeats = orgData?.max_seats || 100;
    const adoptionRate = Math.round((avgWeeklyUsers / maxSeats) * 100);

    // Generate narrative
    const narrative = generateNarrative({
      orgName: orgData?.name || 'Votre organisation',
      month: getMonthName(targetMonth),
      totalSessions,
      avgWeeklyUsers,
      avgSessionDuration,
      adoptionRate,
      topPathway: getTopPathway(pathwayTotals),
    });

    // Create report
    const report = {
      org_id,
      period: monthStr,
      title: `Rapport bien-être - ${getMonthName(targetMonth)} ${targetMonth.getFullYear()}`,
      report_type: 'monthly',
      narrative,
      metrics: {
        total_sessions: totalSessions,
        avg_weekly_users: avgWeeklyUsers,
        avg_session_duration: avgSessionDuration,
        adoption_rate: adoptionRate,
        pathway_distribution: pathwayTotals,
      },
      content: {
        summary: narrative,
        key_insights: generateInsights(totalSessions, adoptionRate, avgSessionDuration),
        recommendations: generateRecommendations(adoptionRate, avgSessionDuration),
      },
      generated_at: new Date().toISOString(),
    };

    // Save report
    const { data: savedReport, error: saveError } = await supabase
      .from('b2b_reports')
      .upsert(report, { onConflict: 'org_id,period' })
      .select()
      .single();

    if (saveError) throw saveError;

    return new Response(
      JSON.stringify({ success: true, report: savedReport }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Report generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getMonthName(date: Date): string {
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return months[date.getMonth()];
}

function getTopPathway(pathways: Record<string, number>): string {
  const entries = Object.entries(pathways);
  if (entries.length === 0) return 'Détente musicale';
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

interface NarrativeParams {
  orgName: string;
  month: string;
  totalSessions: number;
  avgWeeklyUsers: number;
  avgSessionDuration: number;
  adoptionRate: number;
  topPathway: string;
}

function generateNarrative(params: NarrativeParams): string {
  const { orgName, month, totalSessions, avgWeeklyUsers, avgSessionDuration, adoptionRate, topPathway } = params;

  let narrative = `En ${month}, les équipes de ${orgName} ont réalisé ${totalSessions} sessions de bien-être sur EmotionsCare. `;
  
  if (adoptionRate >= 50) {
    narrative += `Avec un taux d'adoption de ${adoptionRate}%, l'engagement est excellent. `;
  } else if (adoptionRate >= 25) {
    narrative += `Le taux d'adoption de ${adoptionRate}% montre un intérêt croissant pour le bien-être collectif. `;
  } else {
    narrative += `Le taux d'adoption de ${adoptionRate}% suggère un potentiel de développement. `;
  }

  narrative += `En moyenne, ${avgWeeklyUsers} collaborateurs ont utilisé l'outil chaque semaine, `;
  narrative += `avec des sessions d'environ ${avgSessionDuration} minutes. `;
  narrative += `Le parcours "${topPathway}" reste le plus apprécié. `;

  narrative += `\n\nRappel : Ces données sont entièrement anonymisées et ne permettent pas d'identifier les utilisateurs individuels.`;

  return narrative;
}

function generateInsights(totalSessions: number, adoptionRate: number, avgDuration: number): string[] {
  const insights: string[] = [];

  if (totalSessions > 100) {
    insights.push('Fort engagement collectif avec plus de 100 sessions ce mois');
  }
  
  if (adoptionRate >= 40) {
    insights.push('Taux d\'adoption supérieur à la moyenne des organisations');
  }

  if (avgDuration >= 10) {
    insights.push('Sessions approfondies favorisant une vraie pause régénératrice');
  } else if (avgDuration >= 5) {
    insights.push('Micro-pauses bien intégrées dans le quotidien');
  }

  if (insights.length === 0) {
    insights.push('Données en cours de collecte pour des insights plus détaillés');
  }

  return insights;
}

function generateRecommendations(adoptionRate: number, avgDuration: number): string[] {
  const recommendations: string[] = [];

  if (adoptionRate < 30) {
    recommendations.push('Communiquer sur l\'existence d\'EmotionsCare lors des réunions d\'équipe');
    recommendations.push('Proposer des sessions découverte guidées');
  }

  if (avgDuration < 5) {
    recommendations.push('Encourager des sessions plus longues pour un effet durable');
  }

  recommendations.push('Rappeler que l\'utilisation reste volontaire et confidentielle');

  return recommendations;
}
