// @ts-nocheck
/**
 * face-filter-comment - Génération de commentaires émotionnels
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 30/min + CORS restrictif
 */
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authenticateRequest } from '../_shared/auth-middleware.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  try {
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: authResult.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'face-filter-comment',
      userId: authResult.user.id,
      limit: 30,
      windowMs: 60_000,
      description: 'Face filter comment generation',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    const { emotion, context } = await req.json();
    
    if (!emotion || !emotionComments[emotion]) {
      throw new Error('Invalid emotion provided');
    }

    // Select random comment for the emotion
    const comments = emotionComments[emotion];
    const randomComment = comments[Math.floor(Math.random() * comments.length)];
    
    // For now, return the pre-defined comment
    // Later could enhance with OpenAI for context-aware comments
    let finalComment = randomComment;
    
    // If we have context and OpenAI key, we could generate more contextual comments
    if (context && openAIApiKey && Math.random() < 0.3) { // 30% chance for AI-generated
      try {
        const contextPrompt = {
          work: "dans un contexte professionnel, reste motivant mais adapté au travail",
          study: "dans un contexte d'étude, encourage l'apprentissage",
          chill: "dans un contexte de détente, reste décontracté"
        }[context] || "";

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
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
            temperature: 0.7
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiComment = data.choices[0]?.message?.content?.trim();
          if (aiComment && aiComment.length < 30) {
            finalComment = aiComment;
          }
        }
      } catch (aiError) {
        console.log('AI generation failed, using fallback:', aiError);
        // Keep the random comment as fallback
      }
    }

    return new Response(
      JSON.stringify({ text: finalComment }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in face-filter-comment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
