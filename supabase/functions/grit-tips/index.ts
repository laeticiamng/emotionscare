// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TipsRequest {
  quest_id: string;
  context?: {
    elapsed_time?: number;
    pause_count?: number;
    frustration_level?: number;
    current_task?: string;
  };
}

const FALLBACK_TIPS_BY_CONTEXT: Record<string, string[]> = {
  early: [
    "🎯 Concentre-toi sur le premier objectif uniquement",
    "🌬️ Prends 3 respirations profondes pour te recentrer",
    "💪 Tu as déjà fait le premier pas, c'est le plus important !"
  ],
  frustrated: [
    "🧘 Pause mentale : ferme les yeux 5 secondes",
    "💭 Rappelle-toi pourquoi tu as commencé ce défi",
    "🌈 Chaque difficulté est une opportunité de grandir"
  ],
  midway: [
    "⏰ Tu es à mi-chemin, continue sur cette lancée !",
    "🎵 Un peu de musique peut booster ta motivation",
    "📝 Divise la tâche restante en micro-étapes"
  ],
  final: [
    "🏁 La ligne d'arrivée est proche, sprint final !",
    "🌟 Visualise ta réussite, elle est à portée de main",
    "🔥 Tu as déjà accompli l'essentiel, termine en beauté !"
  ],
  default: [
    "💫 Reste présent dans le moment",
    "🌿 Respire profondément si le stress monte",
    "💖 Sois bienveillant envers toi-même"
  ]
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quest_id, context }: TipsRequest = await req.json();
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    let tips: string[];
    
    // Determine context category
    const elapsedTime = context?.elapsed_time || 0;
    const frustrationLevel = context?.frustration_level || 0;
    
    let contextType = 'default';
    if (frustrationLevel > 0.6) {
      contextType = 'frustrated';
    } else if (elapsedTime < 60) {
      contextType = 'early';
    } else if (elapsedTime > 180) {
      contextType = 'final';
    } else {
      contextType = 'midway';
    }
    
    if (openaiApiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `Tu es un coach motivationnel bienveillant. Génère 3 conseils courts et encourageants pour quelqu'un qui fait un défi de résilience.
                
Contexte:
- Temps écoulé: ${elapsedTime} secondes
- Niveau de frustration: ${Math.round(frustrationLevel * 100)}%
- Type de moment: ${contextType}

Réponds en JSON avec un tableau "tips" de 3 strings courtes (max 50 caractères chacune).
Utilise des emojis pour rendre les conseils visuels.
Sois chaleureux et encourageant.`
              }
            ],
            temperature: 0.7,
            max_tokens: 200
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0].message.content;
          const parsed = JSON.parse(content);
          tips = parsed.tips || FALLBACK_TIPS_BY_CONTEXT[contextType];
        } else {
          tips = FALLBACK_TIPS_BY_CONTEXT[contextType];
        }
      } catch (e) {
        console.error('OpenAI tips error:', e);
        tips = FALLBACK_TIPS_BY_CONTEXT[contextType];
      }
    } else {
      tips = FALLBACK_TIPS_BY_CONTEXT[contextType];
    }

    return new Response(JSON.stringify({
      tips,
      context_type: contextType,
      quest_id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in grit-tips:', error);
    
    return new Response(JSON.stringify({
      tips: FALLBACK_TIPS_BY_CONTEXT.default,
      context_type: 'default',
      error: error.message
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
