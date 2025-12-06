import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!openAIApiKey) {
    console.error('OpenAI API key not found');
    return new Response(JSON.stringify({ error: 'Service configuration error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { text, context = 'general' } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'Text content is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Moderating content for context: ${context}`);

    // Use OpenAI Moderation API
    const moderationResponse = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        model: 'text-moderation-latest'
      }),
    });

    if (!moderationResponse.ok) {
      console.error('OpenAI Moderation API error:', moderationResponse.status);
      throw new Error('Moderation service error');
    }

    const moderationData = await moderationResponse.json();
    const result = moderationData.results[0];

    const response = {
      flagged: result.flagged,
      categories: result.categories,
      category_scores: result.category_scores,
      safe: !result.flagged,
      message: result.flagged 
        ? 'Ce contenu ne respecte pas nos directives communautaires. Veuillez reformuler de manière bienveillante.'
        : 'Contenu approuvé',
      context,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-moderate function:', error);
    return new Response(JSON.stringify({ 
      error: 'Moderation service error',
      safe: false,
      message: 'Impossible de vérifier le contenu actuellement. Veuillez réessayer.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});