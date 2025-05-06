
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
    if (!openAIApiKey) {
      console.error("OpenAI API key not configured");
      throw new Error("OpenAI API key is not configured");
    }

    const { message, userContext, sessionId, stream = false } = await req.json();
    
    console.log("Received request with message:", message);
    console.log("User context:", userContext);
    console.log("Session ID:", sessionId);

    // Construire un prompt adapté au contexte de l'utilisateur
    const systemPrompt = userContext ? 
      `Tu es un assistant de bien-être professionnel pour les travailleurs de la santé. 
       L'utilisateur a récemment ressenti: ${userContext.recentEmotions || 'des émotions variées'}.
       Son état émotionnel actuel est évalué à: ${userContext.currentScore || 'non disponible'}/100.
       Adapte tes réponses à son contexte émotionnel, reste bienveillant et factuel. 
       Réponds toujours en français de manière précise et directe.` :
      `Tu es un assistant de bien-être professionnel pour les travailleurs de la santé. 
       Réponds toujours en français de manière précise et directe.`;

    console.log("System prompt:", systemPrompt);
    
    const requestBody = {
      model: 'gpt-4', // Utilisation de GPT-4 standard comme demandé
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.6, // Température équilibrée comme recommandé
      max_tokens: 1024, // Pour des réponses complètes
      stream: stream // Support du streaming si demandé
    };

    // Si stream est activé, gérer différemment la réponse
    if (stream) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Retourner directement le flux de la réponse
      return new Response(response.body, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        },
      });
    } else {
      // Traitement normal pour les réponses non streamées
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("OpenAI response received");

      if (!data.choices || data.choices.length === 0) {
        console.error("No choices returned from OpenAI:", data);
        throw new Error('No response from OpenAI');
      }

      const aiResponse = data.choices[0].message.content.trim();
      console.log("Formatted AI response received");

      // Stocker le message et la réponse si un sessionId est fourni
      if (sessionId) {
        try {
          // Cette partie pourrait être étendue pour stocker les messages dans une table Supabase
          console.log(`Storing message in session ${sessionId}`);
          // Implémentation à développer selon les besoins
        } catch (storageError) {
          console.error("Error storing message:", storageError);
          // Ne pas bloquer la réponse en cas d'erreur de stockage
        }
      }

      return new Response(JSON.stringify({ 
        response: aiResponse,
        sessionId: sessionId
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
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
