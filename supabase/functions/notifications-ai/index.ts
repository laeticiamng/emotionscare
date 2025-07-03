
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const messages = [
      {
        role: 'system',
        content: `Tu génères des notifications contextuelles de bien-être. Format JSON: { "notifications": [{"type": "reminder", "title": "titre", "message": "message", "priority": "high|medium|low", "category": "hydration|breathing|movement|mood"}] }`
      },
      {
        role: 'user',
        content: `Humeur: ${userMood}, Heure: ${timeOfDay}, Dernière activité: ${lastActivity}, Préférences: ${JSON.stringify(preferences)}`
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages,
        max_tokens: 400,
        temperature: 0.6,
      }),
    });

    const data = await response.json();
    const notificationsContent = data.choices?.[0]?.message?.content || '';

    try {
      const result = JSON.parse(notificationsContent);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch {
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
    }

  } catch (error) {
    console.error('Error in notifications-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
