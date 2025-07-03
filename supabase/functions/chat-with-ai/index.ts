
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory, userContext } = await req.json();

    if (!openAIApiKey) {
      // Fallback response when no API key
      return new Response(
        JSON.stringify({ 
          response: "Je suis votre coach bien-être EmotionsCare. Comment puis-je vous aider aujourd'hui ? (Mode démo - API non configurée)",
          conversationId: 'demo-' + Date.now()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build conversation context
    const systemPrompt = `Tu es un coach en bien-être empathique et professionnel pour EmotionsCare. 
    
Ton rôle :
- Écouter avec bienveillance les préoccupations émotionnelles
- Proposer des conseils pratiques et des exercices de bien-être
- Encourager sans porter de jugement
- Orienter vers des ressources appropriées si nécessaire
- Maintenir une approche positive et constructive

Style de communication :
- Chaleureux et authentique
- Utilise un langage accessible
- Pose des questions ouvertes pour approfondir
- Propose des actions concrètes
- Respecte les limites professionnelles

Contexte utilisateur : ${userContext || 'Utilisateur EmotionsCare cherchant du soutien'}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        conversationId: Date.now().toString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat-with-ai:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
