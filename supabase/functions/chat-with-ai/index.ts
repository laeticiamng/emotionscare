
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache implementation for frequent requests (24h TTL)
const cache = new Map();
const CACHE_TTL = 86400 * 1000; // 24 hours in milliseconds

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

    // Parse request body
    const { 
      message, 
      userContext, 
      sessionId, 
      stream = false, 
      model = "gpt-4o-mini-2024-07-18", // Default to cheaper model
      temperature = 0.6, 
      max_tokens = 512, 
      top_p = 1.0,
      module = "chat",  // Default module type
      cacheEnabled = true // Enable caching by default for efficiency
    } = await req.json();
    
    console.log(`Request to OpenAI API - Module: ${module}, Model: ${model}`);
    console.log("User context:", userContext);

    // Check cache for FAQ-type questions (only for non-streaming responses)
    if (!stream && cacheEnabled && !userContext) {
      const cacheKey = `${model}:${message || ''}`;
      const cachedResponse = cache.get(cacheKey);
      
      if (cachedResponse) {
        console.log("Returning cached response");
        return new Response(JSON.stringify(cachedResponse), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Construire un prompt adapté au contexte de l'utilisateur
    const systemPrompt = userContext ? 
      `Tu es un assistant de bien-être professionnel pour les travailleurs de la santé. 
       L'utilisateur a récemment ressenti: ${userContext.recentEmotions || 'des émotions variées'}.
       Son état émotionnel actuel est évalué à: ${userContext.currentScore || 'non disponible'}/100.
       Adapte tes réponses à son contexte émotionnel, reste bienveillant et factuel. 
       Réponds toujours en français de manière précise et directe.` :
      `Tu es un assistant de bien-être professionnel pour les travailleurs de la santé. 
       Réponds toujours en français de manière précise et directe.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];
    
    // Build OpenAI request body with the specified parameters
    const requestBody = {
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: max_tokens,
      top_p: top_p,
      stream: stream
    };

    console.log("Request to OpenAI:", JSON.stringify({
      model: requestBody.model,
      messageCount: requestBody.messages.length,
      temperature: requestBody.temperature,
      stream: requestBody.stream
    }));

    // If stream is activated, handle streaming
    if (stream) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Return the stream directly
      return new Response(response.body, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        },
      });
    } else {
      // Regular non-streaming request
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

      // Cache responses if caching is enabled with proper TTL
      if (cacheEnabled) {
        const cacheKey = `${model}:${message || ''}`;
        const responseObject = { response: aiResponse, sessionId, model };
        cache.set(cacheKey, responseObject);
        
        // Set a timeout to delete from cache after TTL period
        setTimeout(() => {
          cache.delete(cacheKey);
        }, CACHE_TTL); 
      }

      // Store the message and response if sessionId is provided
      if (sessionId) {
        try {
          console.log(`Storing message in session ${sessionId}`);
          // Implementation to be developed as needed
        } catch (storageError) {
          console.error("Error storing message:", storageError);
        }
      }

      return new Response(JSON.stringify({ 
        response: aiResponse,
        sessionId: sessionId,
        model: model // Return the model used for debugging
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
