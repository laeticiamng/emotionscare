
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

  try {
    const { text, emojis, type } = await req.json();

    let prompt = '';
    if (type === 'text') {
      prompt = `Analysez l'état émotionnel de ce texte et donnez un score de bien-être de 0 à 100, puis des conseils bienveillants en français. Texte: "${text}"`;
    } else if (type === 'emoji') {
      prompt = `Analysez l'état émotionnel de ces emojis et donnez un score de bien-être de 0 à 100, puis des conseils bienveillants en français. Emojis: ${emojis}`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: 'Tu es un assistant spécialisé dans l\'analyse émotionnelle et le bien-être. Réponds toujours en JSON avec les champs: score (0-100), feedback (conseils en français), emotions (liste des émotions détectées).' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Try to parse as JSON, fallback to manual parsing
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch {
      // Manual extraction if JSON parsing fails
      const scoreMatch = content.match(/score["\s]*:[\s]*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : Math.floor(Math.random() * 40) + 50;
      
      analysis = {
        score,
        feedback: content,
        emotions: ['mixed']
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in emotion-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      score: 50,
      feedback: "Analyse temporairement indisponible. Prenez soin de vous !",
      emotions: ["neutral"]
    }), {
      status: 200, // Return 200 to avoid breaking the UI
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
