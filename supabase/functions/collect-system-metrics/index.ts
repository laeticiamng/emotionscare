// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Collecting system health metrics...');

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // 1. Calculate uptime (based on successful vs failed requests)
    const { data: recentAlerts } = await supabase
      .from('unified_alerts')
      .select('severity')
      .gte('created_at', oneHourAgo.toISOString());

    const totalRequests = recentAlerts?.length || 0;
    const criticalErrors = recentAlerts?.filter(a => a.severity === 'critical').length || 0;
    const uptime = totalRequests > 0 ? ((totalRequests - criticalErrors) / totalRequests) * 100 : 100;

    // 2. Calculate average response time (from escalation metrics)
    const { data: recentEscalations } = await supabase
      .from('active_escalations')
      .select('started_at, resolved_at')
      .not('resolved_at', 'is', null)
      .gte('started_at', oneHourAgo.toISOString());

    let avgResponseTime = 0;
    if (recentEscalations && recentEscalations.length > 0) {
      const responseTimes = recentEscalations.map(e => {
        const start = new Date(e.started_at).getTime();
        const end = new Date(e.resolved_at).getTime();
        return end - start;
      });
      avgResponseTime = responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length / 1000; // Convert to seconds
    }

    // 3. Calculate error rate
    const { data: allAlertsCount } = await supabase
      .from('unified_alerts')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', oneHourAgo.toISOString());

    const errorRate = totalRequests > 0 ? (criticalErrors / totalRequests) * 100 : 0;

    // 4. Calculate alerts per hour
    const alertsPerHour = totalRequests;

    // 5. Simulate CPU and memory (would need actual system metrics in production)
    const cpuUsage = Math.random() * 30 + 40; // 40-70%
    const memoryUsage = Math.random() * 20 + 50; // 50-70%

    // Insert metrics
    const metricsToInsert = [
      {
        metric_name: 'uptime_percentage',
        metric_value: uptime,
        metric_unit: '%',
        timestamp: now.toISOString(),
        metadata: { critical_errors: criticalErrors, total_requests: totalRequests }
      },
      {
        metric_name: 'avg_response_time_ms',
        metric_value: avgResponseTime,
        metric_unit: 'ms',
        timestamp: now.toISOString(),
        metadata: { sample_size: recentEscalations?.length || 0 }
      },
      {
        metric_name: 'error_rate_percentage',
        metric_value: errorRate,
        metric_unit: '%',
        timestamp: now.toISOString(),
        metadata: { critical_errors: criticalErrors, total_requests: totalRequests }
      },
      {
        metric_name: 'alerts_per_hour',
        metric_value: alertsPerHour,
        metric_unit: '',
        timestamp: now.toISOString(),
        metadata: { period: '1h' }
      },
      {
        metric_name: 'cpu_usage_percentage',
        metric_value: cpuUsage,
        metric_unit: '%',
        timestamp: now.toISOString(),
        metadata: { source: 'simulated' }
      },
      {
        metric_name: 'memory_usage_percentage',
        metric_value: memoryUsage,
        metric_unit: '%',
        timestamp: now.toISOString(),
        metadata: { source: 'simulated' }
      }
    ];

    const { error: insertError } = await supabase
      .from('system_health_metrics')
      .insert(metricsToInsert);

    if (insertError) {
      console.error('Error inserting metrics:', insertError);
      throw insertError;
    }

    // Check thresholds and send alerts if needed
    const { data: thresholds } = await supabase
      .from('system_health_thresholds')
      .select('*')
      .eq('enabled', true);

    const alerts: any[] = [];

    for (const threshold of thresholds || []) {
      const metric = metricsToInsert.find(m => m.metric_name === threshold.metric_name);
      if (!metric) continue;

      let shouldAlert = false;
      let severity: 'warning' | 'critical' = 'warning';

      const { comparison_operator, warning_threshold, critical_threshold } = threshold;
      const value = metric.metric_value;

      if (comparison_operator === 'gt') {
        if (value > critical_threshold) {
          shouldAlert = true;
          severity = 'critical';
        } else if (value > warning_threshold) {
          shouldAlert = true;
          severity = 'warning';
        }
      } else if (comparison_operator === 'lt') {
        if (value < critical_threshold) {
          shouldAlert = true;
          severity = 'critical';
        } else if (value < warning_threshold) {
          shouldAlert = true;
          severity = 'warning';
        }
      }

      if (shouldAlert) {
        alerts.push({
          metric_name: threshold.metric_name,
          value,
          threshold: severity === 'critical' ? critical_threshold : warning_threshold,
          severity,
          description: threshold.description
        });

        // Send notification
        try {
          await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
            },
            body: JSON.stringify({
              event_type: severity === 'critical' ? 'alert_critical' : 'escalation_high',
              title: `${severity === 'critical' ? '🚨' : '⚠️'} Alerte Santé Système: ${threshold.metric_name}`,
              message: `La métrique "${threshold.metric_name}" a atteint ${value.toFixed(2)}${metric.metric_unit} (seuil: ${severity === 'critical' ? critical_threshold : warning_threshold})`,
              severity,
              data: {
                'Métrique': threshold.metric_name,
                'Valeur actuelle': `${value.toFixed(2)}${metric.metric_unit}`,
                'Seuil dépassé': `${severity === 'critical' ? critical_threshold : warning_threshold}${metric.metric_unit}`,
                'Gravité': severity.toUpperCase()
              }
            })
          });
          console.log(`Alert sent for ${threshold.metric_name}`);
        } catch (notifError) {
          console.error('Failed to send alert notification:', notifError);
        }
      }
    }

    console.log(`Metrics collected: ${metricsToInsert.length}, Alerts triggered: ${alerts.length}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        metrics_collected: metricsToInsert.length,
        alerts_triggered: alerts.length,
        alerts,
        timestamp: now.toISOString()
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in collect-system-metrics function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
