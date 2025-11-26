// @ts-nocheck
/**
 * gdpr-compliance-score - Score de conformité RGPD
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 10/min + CORS restrictif
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { withMonitoring, logger } from '../_shared/monitoring-wrapper.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

interface ComplianceMetrics {
  consentRate: number;
  exportProcessingSpeed: number;
  deletionProcessingSpeed: number;
  criticalAlertsCount: number;
  overdueExportsCount: number;
  overdueDeletionsCount: number;
}

interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  impact: number;
}

/**
 * Calculate GDPR compliance score based on multiple metrics
 */
function calculateComplianceScore(metrics: ComplianceMetrics): {
  score: number;
  breakdown: Record<string, number>;
  recommendations: Recommendation[];
} {
  const weights = {
    consentRate: 0.20,           // 20%
    exportSpeed: 0.25,            // 25%
    deletionSpeed: 0.25,          // 25%
    alerts: 0.15,                 // 15%
    overdueCompliance: 0.15,      // 15%
  };

  // Calculate individual scores (0-100)
  const scores = {
    consentRate: Math.min(100, metrics.consentRate),
    exportSpeed: Math.max(0, 100 - (metrics.exportProcessingSpeed * 10)),
    deletionSpeed: Math.max(0, 100 - (metrics.deletionProcessingSpeed * 10)),
    alerts: Math.max(0, 100 - (metrics.criticalAlertsCount * 20)),
    overdueCompliance: Math.max(0, 100 - ((metrics.overdueExportsCount + metrics.overdueDeletionsCount) * 15)),
  };

  // Calculate weighted total score
  const totalScore = Math.round(
    scores.consentRate * weights.consentRate +
    scores.exportSpeed * weights.exportSpeed +
    scores.deletionSpeed * weights.deletionSpeed +
    scores.alerts * weights.alerts +
    scores.overdueCompliance * weights.overdueCompliance
  );

  // Generate recommendations based on weak points
  const recommendations: Recommendation[] = [];

  if (scores.consentRate < 70) {
    recommendations.push({
      id: 'consent_rate',
      priority: 'high',
      category: 'Consentements',
      title: 'Améliorer le taux de consentements',
      description: `Votre taux de consentement est de ${metrics.consentRate.toFixed(1)}%. Assurez-vous que vos formulaires de consentement sont clairs et accessibles.`,
      impact: 20,
    });
  }

  if (scores.exportSpeed < 70) {
    recommendations.push({
      id: 'export_speed',
      priority: 'high',
      category: 'Exports',
      title: 'Accélérer le traitement des exports',
      description: `Le délai moyen de traitement des exports est de ${metrics.exportProcessingSpeed.toFixed(1)} jours. La RGPD recommande 30 jours maximum.`,
      impact: 25,
    });
  }

  if (scores.deletionSpeed < 70) {
    recommendations.push({
      id: 'deletion_speed',
      priority: 'high',
      category: 'Suppressions',
      title: 'Accélérer le traitement des suppressions',
      description: `Le délai moyen de suppression est de ${metrics.deletionProcessingSpeed.toFixed(1)} jours. Automatisez ce processus pour respecter les délais RGPD.`,
      impact: 25,
    });
  }

  if (metrics.criticalAlertsCount > 0) {
    recommendations.push({
      id: 'critical_alerts',
      priority: 'high',
      category: 'Alertes',
      title: 'Résoudre les alertes critiques',
      description: `Vous avez ${metrics.criticalAlertsCount} alerte(s) critique(s) non résolue(s). Traitez-les immédiatement pour maintenir la conformité.`,
      impact: 15,
    });
  }

  if (metrics.overdueExportsCount > 0 || metrics.overdueDeletionsCount > 0) {
    const total = metrics.overdueExportsCount + metrics.overdueDeletionsCount;
    recommendations.push({
      id: 'overdue_requests',
      priority: 'high',
      category: 'Délais',
      title: 'Traiter les demandes en retard',
      description: `${total} demande(s) dépassent les délais légaux (${metrics.overdueExportsCount} exports, ${metrics.overdueDeletionsCount} suppressions). Action immédiate requise.`,
      impact: 15,
    });
  }

  // Add positive recommendations if score is high
  if (totalScore >= 90) {
    recommendations.push({
      id: 'excellent_compliance',
      priority: 'low',
      category: 'Conformité',
      title: 'Excellente conformité RGPD',
      description: 'Votre organisation maintient un excellent niveau de conformité. Continuez ces bonnes pratiques.',
      impact: 0,
    });
  } else if (totalScore >= 75) {
    recommendations.push({
      id: 'good_compliance',
      priority: 'low',
      category: 'Conformité',
      title: 'Bonne conformité RGPD',
      description: 'Votre conformité est satisfaisante. Concentrez-vous sur les points d\'amélioration identifiés.',
      impact: 0,
    });
  }

  // Sort recommendations by priority and impact
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.impact - a.impact;
  });

  return {
    score: totalScore,
    breakdown: scores,
    recommendations: recommendations.slice(0, 5), // Top 5 recommendations
  };
}

const handler = withMonitoring('gdpr-compliance-score', async (req, context) => {
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

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'gdpr-compliance-score',
      userId: user.id,
      limit: 10,
      windowMs: 60_000,
      description: 'GDPR compliance score API',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    logger.info('Calculating GDPR compliance score for user', context, { userId: user.id });

    // Fetch consents data
    const { data: consents, error: consentsError } = await supabaseClient
      .from('user_consents')
      .select('consent_type, granted, created_at');

    if (consentsError) {
      logger.warn('Error fetching consents', context, consentsError);
    }

    const totalUsers = consents?.length || 1;
    const grantedConsents = consents?.filter(c => c.granted).length || 0;
    const consentRate = (grantedConsents / totalUsers) * 100;

    // Fetch export requests
    const { data: exports, error: exportsError } = await supabaseClient
      .from('data_export_requests')
      .select('created_at, finished_at, status');

    if (exportsError) {
      logger.warn('Error fetching exports', context, exportsError);
    }

    const completedExports = exports?.filter(e => e.status === 'completed' && e.finished_at) || [];
    const exportProcessingTimes = completedExports.map(e => {
      const created = new Date(e.created_at);
      const finished = new Date(e.finished_at);
      return (finished.getTime() - created.getTime()) / (1000 * 60 * 60 * 24); // days
    });
    const exportProcessingSpeed = exportProcessingTimes.length > 0
      ? exportProcessingTimes.reduce((a, b) => a + b, 0) / exportProcessingTimes.length
      : 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const overdueExports = exports?.filter(e => 
      e.status === 'pending' && new Date(e.created_at) < thirtyDaysAgo
    ).length || 0;

    // Fetch deletion requests from audit logs
    const { data: deletions, error: deletionsError } = await supabaseClient
      .from('audit_logs')
      .select('occurred_at, details')
      .eq('event', 'data_deletion_requested');

    if (deletionsError) {
      logger.warn('Error fetching deletions', context, deletionsError);
    }

    const completedDeletions = deletions?.filter(d => d.details?.status === 'completed') || [];
    const deletionProcessingTimes = completedDeletions.map(d => {
      if (d.details?.completed_at) {
        const created = new Date(d.occurred_at);
        const finished = new Date(d.details.completed_at);
        return (finished.getTime() - created.getTime()) / (1000 * 60 * 60 * 24); // days
      }
      return 0;
    }).filter(t => t > 0);
    const deletionProcessingSpeed = deletionProcessingTimes.length > 0
      ? deletionProcessingTimes.reduce((a, b) => a + b, 0) / deletionProcessingTimes.length
      : 0;

    const overdueDeletions = deletions?.filter(d => 
      d.details?.status === 'pending' && new Date(d.occurred_at) < thirtyDaysAgo
    ).length || 0;

    // Fetch critical alerts
    const { data: alerts, error: alertsError } = await supabaseClient
      .from('gdpr_alerts')
      .select('severity, resolved_at')
      .eq('severity', 'critical')
      .is('resolved_at', null);

    if (alertsError) {
      logger.warn('Error fetching alerts', context, alertsError);
    }

    const criticalAlertsCount = alerts?.length || 0;

    // Calculate compliance score
    const metrics: ComplianceMetrics = {
      consentRate,
      exportProcessingSpeed,
      deletionProcessingSpeed,
      criticalAlertsCount,
      overdueExportsCount: overdueExports,
      overdueDeletionsCount: overdueDeletions,
    };

    const result = calculateComplianceScore(metrics);

    logger.info('Compliance score calculated', context, { 
      score: result.score, 
      recommendations: result.recommendations.length 
    });

    return {
      score: result.score,
      breakdown: result.breakdown,
      recommendations: result.recommendations,
      metrics,
      calculatedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    logger.error('Error calculating compliance score', error, context);
    throw error;
  }
});

Deno.serve(handler);
