// @ts-nocheck
// Migrated to Lovable AI Gateway
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const emotionComments: Record<string, string[]> = {
  joy: [
    "Tu rayonnes ✨",
    "Cette énergie positive ! 🌟",
    "Ton sourire illumine tout 😊",
    "Pure joie de vivre ! 🌈"
  ],
  calm: [
    "Zen attitude 🧘‍♀️",
    "Cette sérénité te va bien ☁️",
    "Peaceful vibes 🕊️",
    "Dans ta bulle de calme 💙"
  ],
  sad: [
    "Petite baisse de moral ? 💙",
    "On souffle ensemble ? 🌸",
    "Ça va passer, courage 🤗",
    "Prends soin de toi 🌺"
  ],
  anger: [
    "On respire profondément ? 🌬️",
    "Évacue cette tension 💨",
    "Pause détente recommandée 🌿",
    "Transform cette énergie ⚡"
  ],
  fear: [
    "Tout va bien se passer 🌱",
    "Tu es plus fort que ça 💪",
    "Une étape à la fois 🪶",
    "Courage, tu y arriveras 🌟"
  ],
  surprise: [
    "Quelle surprise ! 🎉",
    "Eyes wide open ! 👀",
    "L'effet wow en action ✨",
    "Moment inattendu ! 🎈"
  ],
  neutral: [
    "Mode contemplation 🤔",
    "Dans tes pensées... 💭",
    "Zen et concentré 📿",
    "Moment de pause 🌅"
  ]
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emotion, context } = await req.json();
    
    if (!emotion || !emotionComments[emotion]) {
      throw new Error('Invalid emotion provided');
    }

    // Select random comment for the emotion
    const comments = emotionComments[emotion];
    const randomComment = comments[Math.floor(Math.random() * comments.length)];
    
    let finalComment = randomComment;
    
    // If we have context, try to generate more contextual comments with Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (context && LOVABLE_API_KEY && Math.random() < 0.3) { // 30% chance for AI-generated
      try {
        const contextPrompt = {
          work: "dans un contexte professionnel, reste motivant mais adapté au travail",
          study: "dans un contexte d'étude, encourage l'apprentissage",
          chill: "dans un contexte de détente, reste décontracté"
        }[context] || "";

        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { 
                role: 'system', 
                content: `Tu es un coach bienveillant qui donne des commentaires ultra-courts (max 4 mots + 1 emoji) sur les émotions. ${contextPrompt}. Reste positif et inspirant.`
              },
              { 
                role: 'user', 
                content: `L'utilisateur ressent: ${emotion}` 
              }
            ],
            max_tokens: 20,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiComment = data.choices?.[0]?.message?.content?.trim();
          if (aiComment && aiComment.length < 30) {
            finalComment = aiComment;
          }
        }
      } catch (aiError) {
        console.log('[face-filter-comment] AI generation failed, using fallback:', aiError);
      }
    }

    return new Response(
      JSON.stringify({ text: finalComment }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[face-filter-comment] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
