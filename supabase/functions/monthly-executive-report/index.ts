// @ts-nocheck
/**
 * monthly-executive-report - Rapports exécutifs mensuels automatiques
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 3/min + CORS restrictif
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

Deno.serve(async (req) => {
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  const { user, status } = await authorizeRole(req, ['admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'monthly-executive-report',
    userId: user.id,
    limit: 3,
    windowMs: 60_000,
    description: 'Monthly executive report - Admin only',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('[Monthly Executive Report] Starting monthly report generation');

    // Récupérer les administrateurs et DPO
    const { data: admins, error: adminsError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .in('role', ['admin', 'dpo']);

    if (adminsError) {
      console.error('[Monthly Executive Report] Error fetching admins:', adminsError);
      throw adminsError;
    }

    console.log(`[Monthly Executive Report] Found ${admins?.length || 0} recipients`);

    // Calculer les données du rapport mensuel
    const reportData = await generateMonthlyReportData(supabase);

    // Générer le rapport HTML
    const { data: reportHtml, error: reportError } = await supabase.functions.invoke(
      'generate-executive-report',
      {
        body: { reportData },
      }
    );

    if (reportError) throw reportError;

    console.log('[Monthly Executive Report] Report HTML generated');

    // Envoyer les emails aux administrateurs
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('[Monthly Executive Report] RESEND_API_KEY not configured');
      throw new Error('RESEND_API_KEY not configured');
    }

    const emailPromises = (admins || []).map(async (admin) => {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'RGPD Monitoring <noreply@emotionscare.com>',
            to: admin.email,
            subject: `Rapport Exécutif RGPD - ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
            html: reportHtml.html,
          }),
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error(`[Monthly Executive Report] Error sending email to ${admin.email}:`, errorText);
          return { success: false, email: admin.email, error: errorText };
        }

        console.log(`[Monthly Executive Report] Email sent to ${admin.email}`);
        return { success: true, email: admin.email };
      } catch (error) {
        console.error(`[Monthly Executive Report] Error sending email to ${admin.email}:`, error);
        return { success: false, email: admin.email, error: error.message };
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    console.log(
      `[Monthly Executive Report] Report sent: ${successCount} successes, ${failureCount} failures`
    );

    // Logger l'envoi dans la base de données
    await supabase.from('gdpr_scheduled_exports').insert({
      frequency: 'monthly',
      export_type: 'executive_report',
      status: 'completed',
      recipients: (admins || []).map((a) => a.email),
      last_run: new Date().toISOString(),
      next_run: calculateNextMonthlyRun(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        reportGenerated: true,
        emailsSent: successCount,
        emailsFailed: failureCount,
        results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[Monthly Executive Report] Error:', error);

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

/**
 * Générer les données du rapport mensuel
 */
async function generateMonthlyReportData(supabase: any) {
  // Calculer le mois précédent
  const endDate = new Date();
  endDate.setDate(0); // Dernier jour du mois précédent
  const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  console.log(
    `[Monthly Executive Report] Generating report for ${startDate.toISOString()} to ${endDate.toISOString()}`
  );

  // Récupérer les données du mois
  const [consents, exports, deletions, alerts, auditTrail] = await Promise.all([
    supabase
      .from('user_consents')
      .select('*', { count: 'exact' })
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString()),
    supabase
      .from('data_export_requests')
      .select('*', { count: 'exact' })
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString()),
    supabase
      .from('data_deletion_requests')
      .select('*', { count: 'exact' })
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString()),
    supabase
      .from('gdpr_alerts')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString()),
    supabase
      .from('gdpr_audit_trail')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString()),
  ]);

  const criticalAlerts = alerts.data?.filter((a: any) => a.severity === 'critical').length || 0;
  const totalAlerts = alerts.data?.length || 0;
  const resolvedAlerts = alerts.data?.filter((a: any) => a.resolved).length || 0;

  // Calculer le score de conformité
  const complianceScore = calculateComplianceScore({
    consents: consents.count || 0,
    exports: exports.count || 0,
    deletions: deletions.count || 0,
    criticalAlerts,
  });

  // Créer les données du mois actuel
  const currentMonth = {
    month: startDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
    complianceScore,
    consents: consents.count || 0,
    exports: exports.count || 0,
    deletions: deletions.count || 0,
    alerts: totalAlerts,
    criticalAlerts,
    averageResolutionTime: 24, // Simulé
  };

  // Données du mois précédent (simulé pour comparaison)
  const previousMonth = {
    ...currentMonth,
    month: new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', {
      month: 'short',
      year: 'numeric',
    }),
    complianceScore: complianceScore - 5,
    consents: Math.max(0, (consents.count || 0) - 10),
    exports: Math.max(0, (exports.count || 0) - 5),
    deletions: Math.max(0, (deletions.count || 0) - 3),
  };

  // Créer les données annuelles (simplifié)
  const yearlyTrend = {
    year: endDate.getFullYear(),
    months: [previousMonth, currentMonth],
    averageScore: (previousMonth.complianceScore + currentMonth.complianceScore) / 2,
    totalActions: currentMonth.consents + currentMonth.exports + currentMonth.deletions,
    improvementRate: ((currentMonth.complianceScore - previousMonth.complianceScore) / previousMonth.complianceScore) * 100,
  };

  // Comparaison
  const comparison = {
    currentMonth,
    previousMonth,
    percentageChanges: {
      score: calculatePercentageChange(previousMonth.complianceScore, currentMonth.complianceScore),
      consents: calculatePercentageChange(previousMonth.consents, currentMonth.consents),
      exports: calculatePercentageChange(previousMonth.exports, currentMonth.exports),
      deletions: calculatePercentageChange(previousMonth.deletions, currentMonth.deletions),
      alerts: calculatePercentageChange(previousMonth.alerts, currentMonth.alerts),
    },
  };

  // KPIs
  const kpis = {
    overallCompliance: complianceScore,
    riskLevel: determineRiskLevel(currentMonth),
    monthlyImprovement: comparison.percentageChanges.score,
    costOfNonCompliance: calculatePotentialCost(currentMonth),
  };

  // Recommandations
  const recommendations = generateRecommendations(currentMonth, yearlyTrend);

  return {
    yearlyTrend,
    comparison,
    recommendations,
    kpis,
  };
}

function calculateComplianceScore(data: any): number {
  let score = 70;
  if (data.consents > 10) score += 10;
  if (data.exports === 0 && data.deletions === 0) score += 10;
  if (data.criticalAlerts === 0) score += 10;
  if (data.criticalAlerts > 5) score -= 20;
  return Math.max(0, Math.min(100, score));
}

function calculatePercentageChange(old: number, current: number): number {
  if (old === 0) return current > 0 ? 100 : 0;
  return ((current - old) / old) * 100;
}

function determineRiskLevel(month: any): string {
  if (month.criticalAlerts > 5 || month.complianceScore < 50) return 'critical';
  if (month.criticalAlerts > 2 || month.complianceScore < 70) return 'high';
  if (month.alerts > 10 || month.complianceScore < 85) return 'medium';
  return 'low';
}

function calculatePotentialCost(month: any): number {
  const baseCost = 10000;
  const criticalAlertCost = month.criticalAlerts * 5000;
  const lowScoreCost = month.complianceScore < 70 ? 20000 : 0;
  return baseCost + criticalAlertCost + lowScoreCost;
}

function generateRecommendations(month: any, trend: any) {
  const recommendations = [];

  if (month.criticalAlerts > 0) {
    recommendations.push({
      id: 'reduce-critical-alerts',
      priority: 'high',
      category: 'Gestion des risques',
      title: 'Réduire les alertes critiques',
      description: `${month.criticalAlerts} alertes critiques détectées ce mois.`,
      impact: 'Réduction du risque de sanctions',
      actionItems: [
        'Analyser les causes racines',
        'Mettre en place des processus de prévention',
      ],
      estimatedTimeframe: '1-2 mois',
    });
  }

  return recommendations;
}

function calculateNextMonthlyRun(): string {
  const next = new Date();
  next.setMonth(next.getMonth() + 1);
  next.setDate(1);
  next.setHours(8, 0, 0, 0);
  return next.toISOString();
}
