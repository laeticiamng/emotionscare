// @ts-nocheck
/**
 * Alert Notifier - Système d'alertes Slack/Email
 * Envoie des notifications automatiques pour les seuils RGPD critiques
 */

import { Sentry } from './monitoring-wrapper.ts';

interface AlertPayload {
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  context?: Record<string, any>;
  functionName?: string;
  timestamp?: string;
}

interface SlackMessage {
  text: string;
  blocks: any[];
}

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

/**
 * Envoie une alerte Slack
 */
export async function sendSlackAlert(alert: AlertPayload): Promise<void> {
  const webhookUrl = Deno.env.get('SLACK_WEBHOOK_URL');
  
  if (!webhookUrl) {
    console.warn('[Alert] SLACK_WEBHOOK_URL not configured, skipping Slack notification');
    return;
  }

  const color = getColorForSeverity(alert.severity);
  const emoji = getEmojiForSeverity(alert.severity);

  const slackMessage: SlackMessage = {
    text: `${emoji} ${alert.title}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${emoji} ${alert.title}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: alert.message,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `*Fonction:* ${alert.functionName || 'N/A'} | *Sévérité:* ${alert.severity.toUpperCase()} | *Date:* ${alert.timestamp || new Date().toISOString()}`,
          },
        ],
      },
    ],
  };

  // Ajouter contexte si présent
  if (alert.context && Object.keys(alert.context).length > 0) {
    slackMessage.blocks.push({
      type: 'section',
      fields: Object.entries(alert.context).map(([key, value]) => ({
        type: 'mrkdwn',
        text: `*${key}:*\n${JSON.stringify(value, null, 2)}`,
      })),
    });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackMessage),
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status}`);
    }

    console.log('[Alert] Slack notification sent successfully');
  } catch (error) {
    console.error('[Alert] Failed to send Slack notification:', error);
    
    // Reporter à Sentry
    if (Sentry) {
      Sentry.captureException(error, {
        contexts: {
          alert: alert,
        },
      });
    }
  }
}

/**
 * Envoie une alerte Email via edge function
 */
export async function sendEmailAlert(alert: AlertPayload): Promise<void> {
  const emailTo = Deno.env.get('ALERT_EMAIL_TO');
  
  if (!emailTo) {
    console.warn('[Alert] ALERT_EMAIL_TO not configured, skipping email notification');
    return;
  }

  try {
    // Utiliser edge function send-email avec templates professionnels
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey || '',
      },
      body: JSON.stringify({
        to: emailTo,
        subject: `[${alert.severity.toUpperCase()}] ${alert.title}`,
        template: 'alert',
        data: {
          title: alert.title,
          message: alert.message,
          metrics: alert.context,
          actionUrl: `${supabaseUrl}/dashboard/compliance`,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Email API error: ${response.status} - ${errorText}`);
    }

    console.log('[Alert] Email notification sent successfully');
  } catch (error) {
    console.error('[Alert] Failed to send email notification:', error);
    
    // Reporter à Sentry
    if (Sentry) {
      Sentry.captureException(error, {
        contexts: {
          alert: alert,
        },
      });
    }
  }
}

/**
 * Envoie une alerte via tous les canaux configurés
 */
export async function sendAlert(alert: AlertPayload): Promise<void> {
  alert.timestamp = alert.timestamp || new Date().toISOString();

  console.log(`[Alert] Sending ${alert.severity} alert: ${alert.title}`);

  // Envoyer en parallèle
  await Promise.allSettled([
    sendSlackAlert(alert),
    sendEmailAlert(alert),
  ]);

  // Reporter à Sentry si critique ou erreur
  if (alert.severity === 'critical' || alert.severity === 'error') {
    if (Sentry) {
      Sentry.captureMessage(alert.title, {
        level: alert.severity === 'critical' ? 'fatal' : 'error',
        contexts: {
          alert: {
            message: alert.message,
            context: alert.context,
            functionName: alert.functionName,
          },
        },
      });
    }
  }
}

/**
 * Vérifie si un seuil RGPD est dépassé et envoie une alerte
 */
export async function checkComplianceThreshold(
  metricName: string,
  value: number,
  threshold: number,
  functionName: string,
  context?: Record<string, any>
): Promise<void> {
  if (value > threshold) {
    const severity = value > threshold * 1.5 ? 'critical' : 'warning';
    
    await sendAlert({
      severity,
      title: `Seuil RGPD dépassé: ${metricName}`,
      message: `La métrique "${metricName}" a atteint ${value}, dépassant le seuil de ${threshold}.`,
      functionName,
      context: {
        metricName,
        value,
        threshold,
        ...context,
      },
    });
  }
}

// Helpers

function getColorForSeverity(severity: string): string {
  switch (severity) {
    case 'critical': return '#DC2626';
    case 'error': return '#F59E0B';
    case 'warning': return '#FBBF24';
    case 'info': return '#3B82F6';
    default: return '#6B7280';
  }
}

function getEmojiForSeverity(severity: string): string {
  switch (severity) {
    case 'critical': return '🚨';
    case 'error': return '❌';
    case 'warning': return '⚠️';
    case 'info': return 'ℹ️';
    default: return '📊';
  }
}

function generateEmailHTML(alert: AlertPayload): string {
  const color = getColorForSeverity(alert.severity);
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${alert.title}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: ${color}; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">${getEmojiForSeverity(alert.severity)} ${alert.title}</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="margin: 0 0 15px 0; font-size: 16px;">${alert.message}</p>
    
    <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
      <p style="margin: 0; font-size: 14px; color: #6b7280;">
        <strong>Fonction:</strong> ${alert.functionName || 'N/A'}<br>
        <strong>Sévérité:</strong> ${alert.severity.toUpperCase()}<br>
        <strong>Date:</strong> ${alert.timestamp || new Date().toISOString()}
      </p>
    </div>
    
    ${alert.context && Object.keys(alert.context).length > 0 ? `
    <div style="background: white; padding: 15px; border-radius: 6px;">
      <h3 style="margin: 0 0 10px 0; font-size: 16px;">Contexte:</h3>
      <pre style="background: #f3f4f6; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${JSON.stringify(alert.context, null, 2)}</pre>
    </div>
    ` : ''}
    
    <p style="margin: 20px 0 0 0; font-size: 12px; color: #9ca3af;">
      Cette alerte a été générée automatiquement par le système de monitoring EmotionsCare.
    </p>
  </div>
</body>
</html>
  `;
}
