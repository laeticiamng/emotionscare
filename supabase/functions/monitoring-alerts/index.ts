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
      console.error('CRITICAL ALERT:', {
        message: alert.message,
        context: alert.context,
        timestamp: alert.timestamp,
      });

      // Send Slack notification
      const slackWebhook = Deno.env.get('SLACK_WEBHOOK_URL');
      if (slackWebhook) {
        try {
          await fetch(slackWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: `🚨 *${alert.severity.toUpperCase()} ALERT*`,
              blocks: [
                {
                  type: 'header',
                  text: { type: 'plain_text', text: `🚨 ${alert.severity.toUpperCase()} Alert` }
                },
                {
                  type: 'section',
                  text: { type: 'mrkdwn', text: `*Message:* ${alert.message}` }
                },
                {
                  type: 'section',
                  fields: [
                    { type: 'mrkdwn', text: `*Timestamp:*\n${alert.timestamp}` },
                    { type: 'mrkdwn', text: `*Severity:*\n${alert.severity}` }
                  ]
                },
                ...(alert.context ? [{
                  type: 'section',
                  text: { type: 'mrkdwn', text: `*Context:*\n\`\`\`${JSON.stringify(alert.context, null, 2)}\`\`\`` }
                }] : [])
              ]
            })
          });
          console.log('Slack notification sent');
        } catch (slackError) {
          console.error('Slack notification failed:', slackError);
        }
      }

      // Send Discord notification
      const discordWebhook = Deno.env.get('DISCORD_WEBHOOK_URL');
      if (discordWebhook) {
        try {
          await fetch(discordWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              embeds: [{
                title: `🚨 ${alert.severity.toUpperCase()} Alert`,
                description: alert.message,
                color: alert.severity === 'critical' ? 0xFF0000 : 0xFFA500,
                fields: [
                  { name: 'Severity', value: alert.severity, inline: true },
                  { name: 'Timestamp', value: alert.timestamp, inline: true },
                  ...(alert.context ? [{ name: 'Context', value: `\`\`\`json\n${JSON.stringify(alert.context, null, 2)}\`\`\`` }] : [])
                ],
                timestamp: new Date().toISOString()
              }]
            })
          });
          console.log('Discord notification sent');
        } catch (discordError) {
          console.error('Discord notification failed:', discordError);
        }
      }

      // Send email notification for critical alerts
      if (alert.severity === 'critical') {
        const adminEmail = Deno.env.get('ADMIN_ALERT_EMAIL');
        if (adminEmail) {
          try {
            await supabase.functions.invoke('send-notification-email', {
              body: {
                to: adminEmail,
                subject: `[CRITICAL] ${alert.message.slice(0, 50)}...`,
                html: `
                  <h2>🚨 Critical Alert</h2>
                  <p><strong>Message:</strong> ${alert.message}</p>
                  <p><strong>Timestamp:</strong> ${alert.timestamp}</p>
                  ${alert.context ? `<pre>${JSON.stringify(alert.context, null, 2)}</pre>` : ''}
                `,
                text: `Critical Alert\n\nMessage: ${alert.message}\nTimestamp: ${alert.timestamp}\n${alert.context ? JSON.stringify(alert.context, null, 2) : ''}`
              }
            });
            console.log('Email notification sent');
          } catch (emailError) {
            console.error('Email notification failed:', emailError);
          }
        }
      }
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
