
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    
    if (!text) {
      throw new Error('Texte requis pour l\'analyse');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: 'Tu es un expert en analyse émotionnelle. Analyse le texte fourni et retourne un objet JSON avec: emotions (array des émotions détectées avec leur intensité de 0 à 1), sentiment (positif/neutre/négatif), confidence (niveau de confiance 0-1), et suggestions (conseils pour le bien-être). Réponds uniquement en JSON valide.' 
          },
          { role: 'user', content: text }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('Pas de réponse de l\'IA');
    }

    let analysis;
    try {
      analysis = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      // Fallback si le JSON n'est pas valide
      analysis = {
        emotions: [
          { name: 'neutre', intensity: 0.5 }
        ],
        sentiment: 'neutre',
        confidence: 0.7,
        suggestions: ['Continuez à exprimer vos sentiments dans votre journal.']
      };
    }

    return new Response(JSON.stringify({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-emotion-text function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
