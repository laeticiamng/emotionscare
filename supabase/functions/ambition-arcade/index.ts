// @ts-nocheck
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

    const { goal, timeframe = '30', difficulty = 'medium' } = await req.json();
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const messages = [
      {
        role: 'system',
        content: `Tu es un coach gamification. Décompose l'objectif en niveaux gamifiés avec points, badges et milestones. Réponds en JSON: { "levels": [{"name": "Level 1", "description": "desc", "points": 100, "tasks": ["tâche1", "tâche2"]}], "totalPoints": 1000, "badges": ["badge1", "badge2"] }`
      },
      {
        role: 'user',
        content: `Objectif: ${goal}. Délai: ${timeframe} jours. Difficulté: ${difficulty}`
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
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const gameContent = data.choices?.[0]?.message?.content || '';

    try {
      const gameStructure = JSON.parse(gameContent);
      return new Response(JSON.stringify({ gameStructure }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch {
      // Fallback structure
      return new Response(JSON.stringify({
        gameStructure: {
          levels: [
            { name: "Niveau 1", description: "Commencer", points: 100, tasks: ["Première étape"] },
            { name: "Niveau 2", description: "Progresser", points: 200, tasks: ["Continuer"] }
          ],
          totalPoints: 500,
          badges: ["Débutant", "Motivé"]
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in ambition-arcade function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
