import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { currentMood, gritLevel, completedQuests } = await req.json();
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    // Calculate mood level for quest difficulty
    const moodLevel = currentMood ? (currentMood.valence + currentMood.arousal) / 2 : 0.5;
    
    let questData;

    if (openaiApiKey) {
      // Generate personalized quest using OpenAI
      const prompt = `Generate a personalized "grit quest" for someone with:
      - Mood level: ${moodLevel.toFixed(2)} (0=low energy, 1=high energy)
      - Grit level: ${gritLevel}
      - Completed quests: ${completedQuests}
      
      The quest should be a JSON object with:
      - title: Epic RPG-style title
      - description: Warm, encouraging description
      - difficulty: "Douce", "Modérée", or "Épique" based on mood
      - tasks: Array of 3-5 achievable tasks with id, text, completed:false, xp (25-150)
      - totalXP: Sum of all task XP
      - icon: one of "heart", "target", "crown", "sword", "shield", "zap"
      - theme: "restoration", "balance", or "conquest"
      
      Make it personal, achievable, and inspiring. Use French language.`;

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
                content: 'You are a motivational quest designer creating personalized grit challenges. Respond with valid JSON only.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.8,
            max_tokens: 800
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const questJson = data.choices[0].message.content;
          questData = JSON.parse(questJson);
        } else {
          throw new Error('OpenAI API call failed');
        }
      } catch (openaiError) {
        console.error('OpenAI error:', openaiError);
        questData = generateFallbackQuest(moodLevel, gritLevel);
      }
    } else {
      questData = generateFallbackQuest(moodLevel, gritLevel);
    }

    // Store quest generation
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      
      if (user) {
        await supabase.from('activity_logs').insert({
          user_id: user.id,
          route: '/boss-level-grit',
          page_key: 'grit_quest_generated',
          context: {
            quest_difficulty: questData.difficulty,
            quest_title: questData.title,
            mood_level: moodLevel,
            grit_level: gritLevel
          }
        });
      }
    }

    return new Response(JSON.stringify({ 
      quest: questData,
      generated_with: openaiApiKey ? 'openai' : 'fallback'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in grit-challenge function:', error);
    
    // Fallback quest in case of error
    const fallbackQuest = {
      title: "Le Réveil du Guerrier",
      description: "Une quête simple pour reprendre confiance et avancer pas à pas.",
      difficulty: "Douce",
      tasks: [
        { id: 1, text: "Prendre 3 respirations profondes", completed: false, xp: 25 },
        { id: 2, text: "Faire quelque chose qui vous fait sourire", completed: false, xp: 35 },
        { id: 3, text: "Accomplir une petite tâche", completed: false, xp: 40 }
      ],
      totalXP: 100,
      icon: "heart",
      theme: "restoration"
    };

    return new Response(JSON.stringify({ 
      quest: fallbackQuest,
      generated_with: 'emergency_fallback'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateFallbackQuest(moodLevel: number, gritLevel: number) {
  if (moodLevel < 0.3) {
    return {
      title: "L'Éveil du Guerrier Doux",
      description: "Aujourd'hui, votre mission est de retrouver votre force intérieure par petites victoires.",
      difficulty: "Douce",
      tasks: [
        { id: 1, text: "Prendre 5 respirations profondes", completed: false, xp: 25 },
        { id: 2, text: "Écouter une chanson qui vous inspire", completed: false, xp: 30 },
        { id: 3, text: "Accomplir une petite tâche reportée", completed: false, xp: 50 }
      ],
      totalXP: 105,
      icon: "heart",
      theme: "restoration"
    };
  } else if (moodLevel < 0.7) {
    return {
      title: `Le Défi de l'Équilibre (Niveau ${gritLevel})`,
      description: "Vous êtes prêt(e) pour des défis modérés qui renforcent votre persévérance.",
      difficulty: "Modérée",
      tasks: [
        { id: 1, text: "Planifier votre journée avec 3 objectifs", completed: false, xp: 40 },
        { id: 2, text: "Faire 15 minutes d'activité physique", completed: false, xp: 60 },
        { id: 3, text: "Apprendre quelque chose de nouveau", completed: false, xp: 50 },
        { id: 4, text: "Aider quelqu'un d'autre", completed: false, xp: 70 }
      ],
      totalXP: 220,
      icon: "target",
      theme: "balance"
    };
  } else {
    return {
      title: `La Conquête du Boss Final (Maître ${gritLevel})`,
      description: "Votre énergie est au maximum ! Relevez un défi ambitieux qui marquera cette journée.",
      difficulty: "Épique",
      tasks: [
        { id: 1, text: "Sortir de votre zone de confort", completed: false, xp: 100 },
        { id: 2, text: "Terminer un projet important", completed: false, xp: 150 },
        { id: 3, text: "Inspirer ou motiver 3 personnes", completed: false, xp: 120 },
        { id: 4, text: "Planifier un objectif à long terme", completed: false, xp: 80 }
      ],
      totalXP: 450,
      icon: "crown",
      theme: "conquest"
    };
  }
}