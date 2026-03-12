// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

interface SlackAlertRequest {
  errorMessage: string;
  severity: string;
  priority: string;
  category: string;
  analysis: string;
  suggestedFix: string;
  autoFixCode?: string | null;
  preventionTips?: string[];
  url?: string;
  timestamp: string;
  errorId: string;
  webhookUrl: string;
  channel?: string;
  dashboardUrl?: string;
}

const getSeverityEmoji = (severity: string): string => {
  switch (severity) {
    case 'critical': return '🔴';
    case 'high': return '🟠';
    case 'medium': return '🟡';
    case 'low': return '🟢';
    default: return '⚪';
  }
};

const getPriorityEmoji = (priority: string): string => {
  switch (priority) {
    case 'urgent': return '🚨';
    case 'high': return '⚠️';
    case 'medium': return '⏺️';
    case 'low': return '🔵';
    default: return '⚪';
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    const alertData: SlackAlertRequest = await req.json();

    if (!alertData.webhookUrl) {
      throw new Error('Slack webhook URL is required');
    }

    const dashboardUrl = alertData.dashboardUrl || 'https://app.emotionscare.com/admin/ai-monitoring';

    // Build Slack message blocks
    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${getSeverityEmoji(alertData.severity)} Alerte Critique: ${alertData.category.toUpperCase()}`,
          emoji: true
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Priorité:*\n${getPriorityEmoji(alertData.priority)} ${alertData.priority}`
          },
          {
            type: "mrkdwn",
            text: `*Gravité:*\n${getSeverityEmoji(alertData.severity)} ${alertData.severity}`
          },
          {
            type: "mrkdwn",
            text: `*Catégorie:*\n${alertData.category}`
          },
          {
            type: "mrkdwn",
            text: `*Horodatage:*\n${new Date(alertData.timestamp).toLocaleString('fr-FR')}`
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Message d'erreur:*\n\`\`\`${alertData.errorMessage}\`\`\``
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*🔍 Analyse AI:*\n${alertData.analysis}`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*💡 Solution suggérée:*\n${alertData.suggestedFix}`
        }
      }
    ];

    // Add auto-fix code if available
    if (alertData.autoFixCode) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*🔧 Code de correction:*\n\`\`\`${alertData.autoFixCode.substring(0, 500)}...\`\`\``
        }
      });
    }

    // Add prevention tips if available
    if (alertData.preventionTips && alertData.preventionTips.length > 0) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*🛡️ Conseils de prévention:*\n${alertData.preventionTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}`
        }
      });
    }

    // Add URL if available
    if (alertData.url) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*🔗 URL:* ${alertData.url}`
        }
      });
    }

    // Add action buttons
    blocks.push({
      type: "divider"
    });
    
    blocks.push({
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "📊 Voir le Dashboard",
            emoji: true
          },
          url: dashboardUrl,
          style: "primary"
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "🔍 Détails de l'erreur",
            emoji: true
          },
          url: `${dashboardUrl}?error=${alertData.errorId}`,
        }
      ]
    } as any);

    // Send to Slack
    const slackResponse = await fetch(alertData.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: alertData.channel,
        username: "EmotionsCare Monitoring",
        icon_emoji: ":robot_face:",
        blocks,
      }),
    });

    if (!slackResponse.ok) {
      const errorText = await slackResponse.text();
      console.error('Slack API error:', errorText);
      throw new Error(`Slack webhook failed: ${slackResponse.status} - ${errorText}`);
    }

    console.log('Slack alert sent successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Slack alert sent successfully' 
      }),
      {
        status: 200,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in send-slack-alert function:', error);
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
