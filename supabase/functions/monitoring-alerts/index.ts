// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Alert {
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  context?: Record<string, any>;
  timestamp: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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
