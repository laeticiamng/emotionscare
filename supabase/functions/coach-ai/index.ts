
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
    const { emotionData, userProfile, requestType } = await req.json();

    if (!openAIApiKey) {
      // Fallback coaching advice
      const fallbackAdvice = generateFallbackCoaching(emotionData, requestType);
      return new Response(
        JSON.stringify(fallbackAdvice),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = buildCoachingPrompt(emotionData, userProfile, requestType);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: getCoachingSystemPrompt() },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const coaching = data.choices[0].message.content;

    // Parse the response to extract structured coaching advice
    const structuredCoaching = parseCoachingResponse(coaching);

    return new Response(
      JSON.stringify(structuredCoaching),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

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

function buildCoachingPrompt(emotionData: any, userProfile: any, requestType: string): string {
  let prompt = `Analyse émotionnelle récente :
- Score global : ${emotionData.score || 'Non disponible'}
- Émotion principale : ${emotionData.primaryEmotion || 'Non identifiée'}
- Contexte : ${emotionData.text || 'Expression non verbale'}

`;

  if (userProfile) {
    prompt += `Profil utilisateur :
- Nom : ${userProfile.name || 'Non précisé'}
- Objectifs : ${userProfile.goals || 'Non définis'}
- Préférences : ${userProfile.preferences || 'Non spécifiées'}

`;
  }

  switch (requestType) {
    case 'immediate_support':
      prompt += 'L\'utilisateur a besoin d\'un soutien immédiat. Propose des techniques de gestion émotionnelle rapides et efficaces.';
      break;
    case 'long_term_coaching':
      prompt += 'L\'utilisateur cherche un accompagnement à long terme. Propose un plan de développement personnel progressif.';
      break;
    case 'stress_management':
      prompt += 'L\'utilisateur souhaite des techniques spécifiques de gestion du stress. Concentre-toi sur des méthodes anti-stress.';
      break;
    case 'mood_improvement':
      prompt += 'L\'utilisateur veut améliorer son humeur. Propose des activités et exercices pour cultiver les émotions positives.';
      break;
    default:
      prompt += 'Fournis un coaching général adapté à l\'état émotionnel actuel de l\'utilisateur.';
  }

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
