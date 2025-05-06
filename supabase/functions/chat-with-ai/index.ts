
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
    const { message, userContext } = await req.json();

    // Construire un prompt adapté au contexte de l'utilisateur
    const systemPrompt = userContext ? 
      `Tu es un assistant de bien-être professionnel pour les travailleurs de la santé. 
       L'utilisateur a récemment ressenti: ${userContext.recentEmotions || 'des émotions variées'}.
       Son état émotionnel actuel est évalué à: ${userContext.currentScore || 'non disponible'}/100.
       Adapte tes réponses à son contexte émotionnel, reste bienveillant et factuel. 
       Réponds toujours en français de manière précise et directe.` :
      `Tu es un assistant de bien-être professionnel pour les travailleurs de la santé. 
       Réponds toujours en français de manière précise et directe.`;

    console.log("Calling OpenAI with message:", message);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log("OpenAI response received");

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenAI');
    }

    const aiResponse = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "Je suis désolé, mais je ne peux pas répondre à votre question pour le moment. Veuillez réessayer plus tard."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
