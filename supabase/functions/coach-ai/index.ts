
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authorizeRole } from '../_shared/auth.ts';

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
    const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const { userMessage, personality, context, conversationHistory, isOpening } = await req.json();

    if (!openAIApiKey) {
      // Fallback coaching advice
      const fallbackAdvice = generateFallbackCoaching(emotionData, requestType);
      return new Response(
        JSON.stringify(fallbackAdvice),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = buildCoachingPrompt(userMessage, personality, context, conversationHistory, isOpening);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: getCoachingSystemPrompt() },
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: 600,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const coaching = data.choices[0].message.content;

    // Parse the response to extract structured coaching advice
    return new Response(JSON.stringify({ response: coaching }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in coach-ai:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function getCoachingSystemPrompt(): string {
  return `Tu es un coach en bien-être expert et empathique pour EmotionsCare. 

Ton expertise :
- Psychologie positive et gestion des émotions
- Techniques de mindfulness et méditation
- Gestion du stress et de l'anxiété
- Développement personnel et résilience
- Exercices pratiques de bien-être

Ta mission :
- Analyser l'état émotionnel de l'utilisateur
- Proposer des conseils personnalisés et bienveillants
- Suggérer des exercices pratiques adaptés
- Encourager positivement sans minimiser les difficultés
- Fournir des ressources concrètes

Format de réponse attendu :
{
  "analysis": "Analyse empathique de l'état émotionnel",
  "recommendations": [
    {
      "title": "Titre de la recommandation",
      "description": "Description détaillée",
      "duration": "Durée estimée",
      "difficulty": "Facile/Moyen/Avancé"
    }
  ],
  "encouragement": "Message d'encouragement personnalisé",
  "resources": ["Ressource 1", "Ressource 2"]
}

Réponds toujours en français avec bienveillance et professionnalisme.`;
}

function buildCoachingPrompt(userMessage: string, personality: any, context: any, history: any[], isOpening: boolean): string {
  if (isOpening) {
    return `Tu es ${personality.name} avec une approche ${personality.approach}. 
    Commence une conversation d'accueil chaleureuse selon ton style ${personality.tone}.
    Objectif de la conversation: ${context.conversationGoal}.`;
  }

  let prompt = `Tu es ${personality.name} avec les spécialités: ${personality.specialties.join(', ')}.
  
Message utilisateur: "${userMessage}"
État émotionnel: ${context.userMood}
Niveau de stress: ${Math.round(context.stressLevel * 100)}%

${history.length > 0 ? `Historique récent: ${JSON.stringify(history)}` : ''}

Réponds avec empathie selon ton approche ${personality.approach} et ton ton ${personality.tone}.`;

  return prompt;
}

function parseCoachingResponse(response: string): any {
  try {
    // Try to parse as JSON first
    return JSON.parse(response);
  } catch {
    // If not JSON, create structured response from text
    return {
      analysis: "Votre état émotionnel mérite attention et bienveillance.",
      recommendations: [
        {
          title: "Respiration consciente",
          description: "Prenez quelques minutes pour vous concentrer sur votre respiration. Inspirez profondément par le nez, retenez 4 secondes, puis expirez lentement par la bouche.",
          duration: "5-10 minutes",
          difficulty: "Facile"
        }
      ],
      encouragement: response.substring(0, 200) + "...",
      resources: ["Guide de méditation", "Exercices de relaxation", "Techniques de mindfulness"]
    };
  }
}

function generateFallbackCoaching(emotionData: any, requestType: string): any {
  const score = emotionData?.score || 50;
  const emotion = emotionData?.primaryEmotion || 'neutral';
  
  let analysis = "Je perçois votre état émotionnel actuel et je suis là pour vous accompagner.";
  let recommendations = [];
  
  if (score < 40) {
    analysis = "Il semble que vous traversiez une période difficile. C'est normal et vous n'êtes pas seul(e).";
    recommendations = [
      {
        title: "Technique de respiration 4-7-8",
        description: "Inspirez 4 secondes, retenez 7 secondes, expirez 8 secondes. Répétez 4 fois.",
        duration: "3-5 minutes",
        difficulty: "Facile"
      },
      {
        title: "Écriture expressive",
        description: "Prenez 10 minutes pour écrire librement vos pensées et émotions.",
        duration: "10 minutes",
        difficulty: "Facile"
      }
    ];
  } else if (score > 70) {
    analysis = "Votre état émotionnel semble positif ! C'est le moment idéal pour consolider ce bien-être.";
    recommendations = [
      {
        title: "Gratitude quotidienne",
        description: "Notez 3 choses pour lesquelles vous êtes reconnaissant(e) aujourd'hui.",
        duration: "5 minutes",
        difficulty: "Facile"
      },
      {
        title: "Méditation de la joie",
        description: "Concentrez-vous sur cette émotion positive et laissez-la se diffuser dans votre corps.",
        duration: "10 minutes",
        difficulty: "Moyen"
      }
    ];
  } else {
    analysis = "Votre état émotionnel semble équilibré. Profitons de cette stabilité pour renforcer votre bien-être.";
    recommendations = [
      {
        title: "Scan corporel",
        description: "Parcourez mentalement votre corps de la tête aux pieds, en relâchant les tensions.",
        duration: "15 minutes",
        difficulty: "Moyen"
      }
    ];
  }
  
  return {
    analysis,
    recommendations,
    encouragement: "Chaque pas vers le bien-être compte. Vous êtes sur la bonne voie !",
    resources: [
      "Guide de techniques de relaxation",
      "Exercices de mindfulness",
      "Ressources de développement personnel"
    ]
  };
}
