
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emojis, text, audio_url } = await req.json();
    
    // Construct prompt based on available input
    let prompt = "Analyse l'état émotionnel d'un professionnel de santé basé sur les éléments suivants:\n\n";
    
    if (emojis && emojis.length > 0) {
      prompt += `Emojis utilisés: ${emojis}\n\n`;
    }
    
    if (text && text.length > 0) {
      prompt += `Texte: "${text}"\n\n`;
    }
    
    if (audio_url) {
      prompt += `Un message audio a également été enregistré (non accessible pour analyse directe).\n\n`;
    }
    
    prompt += "Fournir une analyse de l'état émotionnel sous ce format:\n";
    prompt += "1. Un score numérique entre 0 et 100 (0 étant un état très négatif, 100 étant excellent)\n";
    prompt += "2. Un feedback bienveillant et professionnel de 2-3 phrases, adapté aux professionnels de santé\n";
    prompt += "3. Si le score est inférieur à 40, suggérer une micro-pause VR comme solution\n\n";
    prompt += "Format de sortie: JSON avec deux champs: 'score' (nombre) et 'ai_feedback' (string)";

    console.log('Calling OpenAI with prompt:', prompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Tu es un assistant spécialisé en bien-être et santé mentale pour les professionnels de santé.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON string from the response content
    const analysisResult = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-emotion function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      score: 50, // Fallback score
      ai_feedback: "Désolé, une erreur est survenue lors de l'analyse. Voici un feedback par défaut: Votre état émotionnel semble mitigé aujourd'hui. Prenez le temps de vous recentrer et de respirer profondément."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
