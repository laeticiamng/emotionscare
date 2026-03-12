// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ORIGINS = [
  'https://emotionscare.com',
  'https://www.emotionscare.com',
  'https://emotions-care.lovable.app',
  'http://localhost:5173',
];

function getCorsHeaders(req) {
  const origin = req.headers.get('origin') ?? '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

interface NotificationPayload {
  event_type: 'ab_test_significant' | 'ticket_created' | 'alert_critical' | 'escalation_high';
  title: string;
  message: string;
  data?: Record<string, any>;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    const payload: NotificationPayload = await req.json();

    console.log('Sending notification:', payload);

    // Fetch active webhooks for this event type
    const { data: webhooks, error: webhooksError } = await supabase
      .from('notification_webhooks')
      .select('*')
      .eq('enabled', true)
      .contains('events', [payload.event_type]);

    if (webhooksError) {
      console.error('Error fetching webhooks:', webhooksError);
      throw webhooksError;
    }

    if (!webhooks || webhooks.length === 0) {
      console.log('No active webhooks found for event:', payload.event_type);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No webhooks configured for this event',
          sent: 0
        }),
        {
          status: 200,
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        }
      );
    }

    // Send notification to each webhook
    const results = await Promise.allSettled(
      webhooks.map(async (webhook) => {
        const message = buildMessage(webhook.webhook_type, payload);
        
        const response = await fetch(webhook.webhook_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Webhook failed (${webhook.name}):`, errorText);
          throw new Error(`Webhook ${webhook.name} failed: ${response.status}`);
        }

        console.log(`Notification sent successfully to ${webhook.name}`);
        return { webhook: webhook.name, success: true };
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Notifications sent: ${successful} successful, ${failed} failed`,
        sent: successful,
        failed: failed,
        results: results.map(r => r.status === 'fulfilled' ? r.value : { error: r.reason.message })
      }),
      {
        status: 200,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in send-notification function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      }
    );
  }
});

function buildMessage(webhookType: 'slack' | 'discord', payload: NotificationPayload) {
  const emoji = getEmoji(payload.event_type, payload.severity);
  
  if (webhookType === 'slack') {
    return {
      text: `${emoji} ${payload.title}`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `${emoji} ${payload.title}`,
            emoji: true
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: payload.message
          }
        },
        ...(payload.data ? [
          {
            type: "section",
            fields: Object.entries(payload.data).slice(0, 10).map(([key, value]) => ({
              type: "mrkdwn",
              text: `*${key}:*\n${value}`
            }))
          }
        ] : [])
      ]
    };
  } else {
    // Discord format
    return {
      content: `${emoji} **${payload.title}**`,
      embeds: [
        {
          description: payload.message,
          color: getDiscordColor(payload.severity),
          fields: payload.data ? Object.entries(payload.data).slice(0, 25).map(([key, value]) => ({
            name: key,
            value: String(value),
            inline: true
          })) : [],
          timestamp: new Date().toISOString()
        }
      ]
    };
  }
}

function getEmoji(eventType: string, severity?: string): string {
  if (severity === 'error') return '🔴';
  if (severity === 'warning') return '🟡';
  if (severity === 'success') return '✅';
  
  switch (eventType) {
    case 'ab_test_significant':
      return '📊';
    case 'ticket_created':
      return '🎫';
    case 'alert_critical':
      return '🚨';
    case 'escalation_high':
      return '⚠️';
    default:
      return 'ℹ️';
  }
}

function getDiscordColor(severity?: string): number {
  switch (severity) {
    case 'error':
      return 0xff0000; // Red
    case 'warning':
      return 0xffa500; // Orange
    case 'success':
      return 0x00ff00; // Green
    default:
      return 0x0099ff; // Blue
  }
}
