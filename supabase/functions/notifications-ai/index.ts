// @ts-nocheck
// Migrated to Lovable AI Gateway
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authorizeRole } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { userMood, timeOfDay, lastActivity, preferences = {} } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Tu génères des notifications contextuelles de bien-être.`
          },
          {
            role: 'user',
            content: `Humeur: ${userMood}, Heure: ${timeOfDay}, Dernière activité: ${lastActivity}, Préférences: ${JSON.stringify(preferences)}`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'generate_notifications',
              description: 'Génère des notifications de bien-être',
              parameters: {
                type: 'object',
                properties: {
                  notifications: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        type: { type: 'string', enum: ['reminder', 'suggestion', 'encouragement'] },
                        title: { type: 'string' },
                        message: { type: 'string' },
                        priority: { type: 'string', enum: ['high', 'medium', 'low'] },
                        category: { type: 'string', enum: ['hydration', 'breathing', 'movement', 'mood', 'rest'] }
                      },
                      required: ['type', 'title', 'message', 'priority', 'category']
                    }
                  }
                },
                required: ['notifications'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'generate_notifications' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall) {
      try {
        const result = JSON.parse(toolCall.function.arguments);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch {
        // Fallback
      }
    }

    // Fallback notifications
    return new Response(JSON.stringify({
      notifications: [
        {
          type: "reminder",
          title: "Pause bien-être",
          message: "Il est temps de prendre une pause et de respirer profondément.",
          priority: "medium",
          category: "breathing"
        }
      ]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[notifications-ai] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
