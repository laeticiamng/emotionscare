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

    const { imageUrl, prompt, genre = 'aventure' } = await req.json();
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const messages = [
      {
        role: 'system',
        content: `Tu es un créateur d'histoires interactives. Génère une histoire courte en français avec des choix multiples basée sur l'image et le prompt fournis. Format JSON requis: { "title": "titre", "chapters": [{"text": "contenu", "choices": ["choix1", "choix2"]}] }`
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: `Genre: ${genre}. Prompt: ${prompt}` },
          ...(imageUrl ? [{ type: 'image_url', image_url: { url: imageUrl } }] : [])
        ]
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
        max_tokens: 800,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const storyContent = data.choices?.[0]?.message?.content || '';

    try {
      const story = JSON.parse(storyContent);
      return new Response(JSON.stringify({ story }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch {
      // Fallback si parsing JSON échoue
      return new Response(JSON.stringify({
        story: {
          title: "Histoire générée",
          chapters: [{
            text: storyContent,
            choices: ["Continuer l'aventure", "Recommencer"]
          }]
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in story-synth-lab function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
