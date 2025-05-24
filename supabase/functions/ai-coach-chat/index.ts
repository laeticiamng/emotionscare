
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { message, conversation_history } = await req.json();
    
    if (!message) {
      throw new Error('Message requis');
    }

    console.log('Coach chat message:', message);

    // Construire l'historique pour le contexte
    const messages = [
      { 
        role: 'system', 
        content: `Tu es un coach en bien-être émotionnel bienveillant et professionnel. Tu aides les utilisateurs à:
        - Comprendre leurs émotions
        - Développer leur intelligence émotionnelle
        - Gérer le stress et l'anxiété
        - Améliorer leur bien-être mental
        
        Réponds toujours en français, avec empathie et de manière constructive. Pose des questions pour mieux comprendre la situation si nécessaire. Limite tes réponses à 150 mots maximum.`
      }
    ];

    // Ajouter l'historique récent si disponible
    if (conversation_history && Array.isArray(conversation_history)) {
      conversation_history.forEach(msg => {
        if (msg.role && msg.content) {
          messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          });
        }
      });
    }

    // Ajouter le message actuel
    messages.push({ role: 'user', content: message });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices || data.choices.length === 0) {
      throw new Error('Pas de réponse du coach IA');
    }

    const coachResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({
      success: true,
      response: coachResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-coach-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false,
      response: 'Désolé, je rencontre des difficultés techniques. Pouvez-vous reformuler votre question ?'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
