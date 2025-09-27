
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

    const { question, category = 'general', language = 'fr' } = await req.json();
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const messages = [
      {
        role: 'system',
        content: `Tu es un assistant d'aide EmotionsCare. Réponds aux questions sur l'utilisation de l'application, le bien-être émotionnel, les fonctionnalités. Sois bienveillant, précis et pratique. Format JSON: { "answer": "réponse", "relatedTopics": ["sujet1", "sujet2"], "helpfulLinks": ["lien1", "lien2"] }`
      },
      {
        role: 'user',
        content: `Question: ${question}. Catégorie: ${category}`
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
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const helpContent = data.choices?.[0]?.message?.content || '';

    try {
      const result = JSON.parse(helpContent);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch {
      // Fallback response
      return new Response(JSON.stringify({
        answer: "Je suis là pour vous aider ! Pouvez-vous reformuler votre question ?",
        relatedTopics: ["Guide d'utilisation", "FAQ"],
        helpfulLinks: ["/help", "/faq"]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in help-center-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
