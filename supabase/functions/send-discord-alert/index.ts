// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DiscordAlertRequest {
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
  username?: string;
  dashboardUrl?: string;
}

const getSeverityColor = (severity: string): number => {
  switch (severity) {
    case 'critical': return 0xFF0000; // Red
    case 'high': return 0xFF6B00; // Orange
    case 'medium': return 0xFFFF00; // Yellow
    case 'low': return 0x00FF00; // Green
    default: return 0x808080; // Gray
  }
};

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
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const alertData: DiscordAlertRequest = await req.json();

    if (!alertData.webhookUrl) {
      throw new Error('Discord webhook URL is required');
    }

    const dashboardUrl = alertData.dashboardUrl || 'https://app.emotionscare.com/admin/ai-monitoring';

    // Build Discord embed
    const embed = {
      title: `${getSeverityEmoji(alertData.severity)} Alerte Critique: ${alertData.category.toUpperCase()}`,
      description: `**Message d'erreur:**\n\`\`\`${alertData.errorMessage.substring(0, 500)}\`\`\``,
      color: getSeverityColor(alertData.severity),
      fields: [
        {
          name: `${getPriorityEmoji(alertData.priority)} Priorité`,
          value: alertData.priority,
          inline: true
        },
        {
          name: `${getSeverityEmoji(alertData.severity)} Gravité`,
          value: alertData.severity,
          inline: true
        },
        {
          name: "📁 Catégorie",
          value: alertData.category,
          inline: true
        },
        {
          name: "🔍 Analyse AI",
          value: alertData.analysis.substring(0, 1024),
          inline: false
        },
        {
          name: "💡 Solution suggérée",
          value: alertData.suggestedFix.substring(0, 1024),
          inline: false
        }
      ],
      timestamp: alertData.timestamp,
      footer: {
        text: `EmotionsCare AI Monitoring • ID: ${alertData.errorId.substring(0, 8)}`
      }
    };

    // Add auto-fix code field if available
    if (alertData.autoFixCode) {
      embed.fields.push({
        name: "🔧 Code de correction",
        value: `\`\`\`javascript\n${alertData.autoFixCode.substring(0, 500)}...\n\`\`\``,
        inline: false
      });
    }

    // Add prevention tips field if available
    if (alertData.preventionTips && alertData.preventionTips.length > 0) {
      embed.fields.push({
        name: "🛡️ Conseils de prévention",
        value: alertData.preventionTips.slice(0, 3).map((tip, i) => `${i + 1}. ${tip}`).join('\n').substring(0, 1024),
        inline: false
      });
    }

    // Add URL field if available
    if (alertData.url) {
      embed.fields.push({
        name: "🔗 URL",
        value: alertData.url,
        inline: false
      });
    }

    // Send to Discord
    const discordResponse = await fetch(alertData.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: alertData.username || "EmotionsCare Monitor",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/3649/3649407.png",
        content: `🚨 **Nouvelle alerte critique détectée** - Priorité: ${alertData.priority.toUpperCase()}`,
        embeds: [embed],
        components: [
          {
            type: 1, // Action Row
            components: [
              {
                type: 2, // Button
                style: 5, // Link button
                label: "📊 Voir le Dashboard",
                url: dashboardUrl
              },
              {
                type: 2, // Button
                style: 5, // Link button
                label: "🔍 Détails de l'erreur",
                url: `${dashboardUrl}?error=${alertData.errorId}`
              }
            ]
          }
        ]
      }),
    });

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();
      console.error('Discord API error:', errorText);
      throw new Error(`Discord webhook failed: ${discordResponse.status} - ${errorText}`);
    }

    console.log('Discord alert sent successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Discord alert sent successfully' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in send-discord-alert function:', error);
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
