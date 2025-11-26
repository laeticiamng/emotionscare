// @ts-nocheck
/**
 * monitoring-alerts - Gestion des alertes de monitoring
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 30/min + CORS restrictif
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

interface Alert {
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  context?: Record<string, any>;
  timestamp: string;
}

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
    route: 'monitoring-alerts',
    userId: user.id,
    limit: 30,
    windowMs: 60_000,
    description: 'Monitoring alerts - Admin only',
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

    const alert: Alert = await req.json();

    // Validate alert
    if (!alert.severity || !alert.message) {
      return new Response(
        JSON.stringify({ error: 'Invalid alert format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store alert in database
    const { error: insertError } = await supabase
      .from('monitoring_alerts')
      .insert({
        severity: alert.severity,
        message: alert.message,
        context: alert.context || {},
        timestamp: alert.timestamp,
        resolved: false,
      });

    if (insertError) {
      throw insertError;
    }

    // Log alert
    console.log(`[Alert] ${alert.severity.toUpperCase()}: ${alert.message}`, alert.context);

    // Send notifications for critical alerts
    if (alert.severity === 'critical' || alert.severity === 'error') {
      // In production, send to Slack, email, etc.
      console.error('CRITICAL ALERT:', {
        message: alert.message,
        context: alert.context,
        timestamp: alert.timestamp,
      });

      // Could integrate with:
      // - Slack webhook
      // - Email service
      // - PagerDuty
      // - Discord webhook
    }

    // Check for alert patterns (e.g., too many errors)
    const recentAlertsCount = await supabase
      .from('monitoring_alerts')
      .select('*', { count: 'exact', head: true })
      .gte('timestamp', new Date(Date.now() - 300000).toISOString()) // Last 5 minutes
      .eq('severity', 'error');

    if (recentAlertsCount.count && recentAlertsCount.count > 10) {
      console.error('HIGH ERROR RATE DETECTED:', {
        count: recentAlertsCount.count,
        period: '5 minutes',
      });

      // Could trigger additional escalation
    }

    return new Response(
      JSON.stringify({ success: true, alertId: alert.timestamp }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Monitoring alerts error:', error);

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
