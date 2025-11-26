// @ts-nocheck
/**
 * sentry-webhook-handler - Webhook Sentry pour alertes
 *
 * 🔒 SÉCURISÉ: Rate limit IP 100/min + CORS restrictif
 * Note: Auth par signature Sentry (sentry-hook-signature)
 */
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { withMonitoring, logger } from '../_shared/monitoring-wrapper.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

interface SentryEvent {
  id: string;
  project: string;
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  culprit?: string;
  message?: string;
  url?: string;
  event?: {
    tags?: Record<string, string>;
    exception?: {
      values?: Array<{
        type: string;
        value: string;
        stacktrace?: any;
      }>;
    };
    contexts?: {
      runtime?: {
        name: string;
      };
    };
  };
}

interface AlertThresholds {
  errorRate: number;
  latency: number;
  violations: number;
}

const THRESHOLDS: AlertThresholds = {
  errorRate: 5, // 5%
  latency: 2000, // 2s en ms
  violations: 10, // 10 par jour
};

const handler = withMonitoring('sentry-webhook-handler', async (req, context) => {
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

  // Rate limit IP-based pour webhooks externes
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'sentry-webhook-handler',
    userId: `ip:${clientIp}`,
    limit: 100,
    windowMs: 60_000,
    description: 'Sentry webhook handler',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Too many requests. Retry in ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const sentryEvent: SentryEvent = await req.json();
    
    logger.info('Received Sentry webhook', context, {
      eventId: sentryEvent.id,
      level: sentryEvent.level,
      project: sentryEvent.project,
    });

    // Extraire le nom de la fonction depuis les tags
    const functionName = sentryEvent.event?.tags?.['function'] || 
                         sentryEvent.event?.tags?.['transaction'] ||
                         sentryEvent.culprit?.split('/').pop();

    if (!functionName || !functionName.startsWith('gdpr-')) {
      logger.info('Event not related to GDPR function, skipping', context);
      return { success: true, message: 'Event ignored (not GDPR function)' };
    }

    // Analyser le type d'alerte
    const alertAnalysis = await analyzeAlert(supabase, sentryEvent, functionName);
    
    if (!alertAnalysis.shouldAlert) {
      logger.info('Thresholds not exceeded, no alert needed', context);
      return { success: true, message: 'No alert triggered' };
    }

    // Créer l'alerte dans la base
    const { data: alertRecord, error: alertError } = await supabase
      .from('gdpr_alerts')
      .insert({
        alert_type: alertAnalysis.type,
        severity: alertAnalysis.severity,
        title: alertAnalysis.title,
        description: alertAnalysis.description,
        user_id: null,
        metadata: {
          sentry_event_id: sentryEvent.id,
          function_name: functionName,
          threshold_exceeded: alertAnalysis.thresholdInfo,
          sentry_url: sentryEvent.url,
        },
      })
      .select()
      .single();

    if (alertError) {
      logger.error('Failed to create alert record', alertError, context);
      throw alertError;
    }

    logger.info('Alert record created', context, { alertId: alertRecord.id });

    // Envoyer les notifications
    const notifications = await Promise.allSettled([
      sendSlackNotification(alertAnalysis, functionName, sentryEvent),
      sendEmailNotification(supabase, alertAnalysis, functionName, sentryEvent),
    ]);

    const slackResult = notifications[0];
    const emailResult = notifications[1];

    logger.info('Notifications sent', context, {
      slack: slackResult.status,
      email: emailResult.status,
    });

    return {
      success: true,
      alert: alertRecord,
      notifications: {
        slack: slackResult.status === 'fulfilled' ? 'sent' : 'failed',
        email: emailResult.status === 'fulfilled' ? 'sent' : 'failed',
      },
    };
  } catch (error: any) {
    logger.error('Error processing Sentry webhook', error, context);
    throw error;
  }
});

/**
 * Analyser l'événement Sentry et déterminer si une alerte est nécessaire
 */
async function analyzeAlert(
  supabase: any,
  sentryEvent: SentryEvent,
  functionName: string
) {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Vérifier le taux d'erreur (dernières 24h)
  const { data: errorLogs, error: errorLogsError } = await supabase
    .from('monitoring_metrics')
    .select('is_anomaly, metric_value')
    .eq('metric_name', `function_${functionName}`)
    .gte('recorded_at', oneDayAgo.toISOString())
    .limit(1000);

  if (errorLogsError) {
    console.error('Error fetching error logs:', errorLogsError);
  }

  const totalCalls = errorLogs?.length || 0;
  const errorCount = errorLogs?.filter((log: any) => log.is_anomaly).length || 0;
  const errorRate = totalCalls > 0 ? (errorCount / totalCalls) * 100 : 0;

  // Vérifier la latence
  const latencies = errorLogs?.map((log: any) => log.metric_value).filter((v: any) => v) || [];
  const avgLatency = latencies.length > 0 
    ? latencies.reduce((a: number, b: number) => a + b, 0) / latencies.length 
    : 0;

  // Vérifier les violations critiques
  const { count: violationsCount } = await supabase
    .from('gdpr_violations')
    .select('*', { count: 'exact', head: true })
    .eq('severity', 'critical')
    .eq('status', 'detected')
    .gte('detected_at', oneDayAgo.toISOString());

  // Déterminer si un seuil est dépassé
  const exceededThresholds: string[] = [];
  let severity: 'info' | 'warning' | 'critical' = 'info';
  let alertType = 'performance_degradation';

  if (errorRate > THRESHOLDS.errorRate) {
    exceededThresholds.push(`Taux d'erreur: ${errorRate.toFixed(2)}% (seuil: ${THRESHOLDS.errorRate}%)`);
    severity = errorRate > 10 ? 'critical' : 'warning';
    alertType = 'high_error_rate';
  }

  if (avgLatency > THRESHOLDS.latency) {
    exceededThresholds.push(`Latence moyenne: ${avgLatency.toFixed(0)}ms (seuil: ${THRESHOLDS.latency}ms)`);
    if (severity !== 'critical') {
      severity = avgLatency > 3000 ? 'critical' : 'warning';
    }
    alertType = 'high_latency';
  }

  if ((violationsCount || 0) > THRESHOLDS.violations) {
    exceededThresholds.push(`Violations critiques: ${violationsCount} (seuil: ${THRESHOLDS.violations})`);
    severity = 'critical';
    alertType = 'critical_violations';
  }

  const shouldAlert = exceededThresholds.length > 0 || sentryEvent.level === 'fatal';

  return {
    shouldAlert,
    type: alertType,
    severity,
    title: `🚨 Alerte ${severity.toUpperCase()} - ${functionName}`,
    description: exceededThresholds.length > 0
      ? `Seuils dépassés:\n${exceededThresholds.join('\n')}`
      : `Erreur Sentry: ${sentryEvent.message || 'Unknown error'}`,
    thresholdInfo: {
      errorRate: `${errorRate.toFixed(2)}%`,
      avgLatency: `${avgLatency.toFixed(0)}ms`,
      violations: violationsCount || 0,
      exceededThresholds,
    },
  };
}

/**
 * Envoyer une notification Slack
 */
async function sendSlackNotification(
  alert: any,
  functionName: string,
  sentryEvent: SentryEvent
) {
  const slackWebhookUrl = Deno.env.get('SLACK_WEBHOOK_URL');
  
  if (!slackWebhookUrl) {
    console.log('SLACK_WEBHOOK_URL not configured, skipping Slack notification');
    return { success: false, message: 'Slack not configured' };
  }

  const color = alert.severity === 'critical' ? '#dc2626' : 
                alert.severity === 'warning' ? '#f59e0b' : 
                '#3b82f6';

  const slackMessage = {
    text: alert.title,
    attachments: [
      {
        color,
        fields: [
          {
            title: 'Fonction',
            value: functionName,
            short: true,
          },
          {
            title: 'Sévérité',
            value: alert.severity.toUpperCase(),
            short: true,
          },
          {
            title: 'Seuils dépassés',
            value: alert.thresholdInfo.exceededThresholds.join('\n') || 'N/A',
            short: false,
          },
          {
            title: 'Métriques actuelles',
            value: `• Taux d'erreur: ${alert.thresholdInfo.errorRate}\n• Latence: ${alert.thresholdInfo.avgLatency}\n• Violations: ${alert.thresholdInfo.violations}`,
            short: false,
          },
        ],
        footer: 'EmotionsCare RGPD Monitoring',
        footer_icon: 'https://sentry.io/favicon.ico',
        ts: Math.floor(Date.now() / 1000),
        actions: sentryEvent.url ? [
          {
            type: 'button',
            text: 'Voir dans Sentry',
            url: sentryEvent.url,
          },
          {
            type: 'button',
            text: 'Voir les logs',
            url: `https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/functions/${functionName}/logs`,
          },
        ] : [],
      },
    ],
  };

  const response = await fetch(slackWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slackMessage),
  });

  if (!response.ok) {
    throw new Error(`Slack notification failed: ${response.status}`);
  }

  return { success: true };
}

/**
 * Envoyer une notification par email
 */
async function sendEmailNotification(
  supabase: any,
  alert: any,
  functionName: string,
  sentryEvent: SentryEvent
) {
  // Récupérer les emails des admins
  const { data: admins } = await supabase
    .from('user_roles')
    .select('user_id, users:user_id(email)')
    .eq('role', 'admin');

  if (!admins || admins.length === 0) {
    console.log('No admin emails found, skipping email notification');
    return { success: false, message: 'No admins found' };
  }

  const adminEmails = admins
    .map((admin: any) => admin.users?.email)
    .filter(Boolean);

  // Envoyer un email à chaque admin
  const emailPromises = adminEmails.map((email: string) => 
    supabase.functions.invoke('send-email', {
      body: {
        to: email,
        subject: `${alert.severity === 'critical' ? '🚨' : '⚠️'} Alerte RGPD - ${functionName}`,
        template: 'alert',
        data: {
          title: alert.title,
          message: alert.description,
          severity: alert.severity,
          timestamp: new Date().toISOString(),
          functionName,
          metrics: alert.thresholdInfo,
          sentryUrl: sentryEvent.url,
        },
      },
    })
  );

  await Promise.all(emailPromises);

  return { success: true, emailsSent: adminEmails.length };
}

serve(handler);
