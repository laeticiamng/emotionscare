
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, emotion } = await req.json();
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    const systemPrompt = `Tu es un coach en bien-être émotionnel bienveillant et professionnel. 
    Tu aides les utilisateurs à gérer leurs émotions et améliorer leur bien-être.
    ${emotion ? `L'utilisateur semble ressentir: ${emotion}` : ''}
    Réponds avec empathie et propose des conseils pratiques.
    Limite tes réponses à 200 mots maximum.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 300
      }),
    });

    const data = await response.json();
    const coachResponse = data.choices[0].message.content;

    // Générer des suggestions basées sur l'émotion
    const suggestions = generateSuggestions(emotion);

    return new Response(JSON.stringify({
      response: coachResponse,
      suggestions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-coach:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateSuggestions(emotion: string): string[] {
  const suggestionsByEmotion = {
    'joie': [
      'Partagez cette joie avec vos proches',
      'Pratiquez la gratitude',
      'Engagez-vous dans une activité créative'
    ],
    'tristesse': [
      'Prenez du temps pour vous',
      'Écoutez de la musique apaisante',
      'Parlez à quelqu\'un en qui vous avez confiance'
    ],
    'colère': [
      'Pratiquez des exercices de respiration',
      'Faites de l\'exercice physique',
      'Prenez du recul avant de réagir'
    ],
    'peur': [
      'Identifiez la source de votre peur',
      'Pratiquez la relaxation',
      'Divisez le problème en petites étapes'
    ],
    'neutre': [
      'Explorez de nouvelles activités',
      'Connectez-vous avec la nature',
      'Pratiquez la méditation'
    ]
  };

  return suggestionsByEmotion[emotion] || suggestionsByEmotion['neutre'];
}
