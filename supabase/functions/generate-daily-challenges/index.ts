import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Challenge {
  title: string;
  description: string;
  category: 'emotional' | 'physical' | 'mental' | 'social';
  difficulty: 'facile' | 'moyen' | 'difficile';
  points: number;
  target_value: number;
  expires_at: string;
  type: 'count' | 'duration' | 'completion';
}

const challengeTemplates = {
  emotional: [
    {
      title: "Détection Émotionnelle",
      description: "Identifiez {target} émotions différentes aujourd'hui",
      points: 30,
      type: 'count' as const,
      target_range: [3, 7]
    },
    {
      title: "Gestion du Stress",
      description: "Pratiquez {target} minutes de relaxation",
      points: 40,
      type: 'duration' as const,
      target_range: [10, 30]
    },
    {
      title: "Journal Émotionnel",
      description: "Rédigez {target} entrées dans votre journal",
      points: 25,
      type: 'count' as const,
      target_range: [1, 3]
    }
  ],
  physical: [
    {
      title: "Respiration Consciente",
      description: "Effectuez {target} sessions de respiration guidée",
      points: 35,
      type: 'count' as const,
      target_range: [2, 5]
    },
    {
      title: "Mouvement Corporel",
      description: "Bougez pendant {target} minutes",
      points: 50,
      type: 'duration' as const,
      target_range: [15, 45]
    }
  ],
  mental: [
    {
      title: "Méditation Quotidienne",
      description: "Méditez pendant {target} minutes",
      points: 45,
      type: 'duration' as const,
      target_range: [5, 20]
    },
    {
      title: "Focus Mental",
      description: "Complétez {target} exercices de concentration",
      points: 30,
      type: 'count' as const,
      target_range: [1, 3]
    }
  ],
  social: [
    {
      title: "Connexion Sociale",
      description: "Interagissez avec {target} membres de la communauté",
      points: 40,
      type: 'count' as const,
      target_range: [2, 5]
    },
    {
      title: "Partage d'Expérience",
      description: "Partagez {target} posts ou commentaires",
      points: 35,
      type: 'count' as const,
      target_range: [1, 3]
    }
  ]
};

function generateRandomChallenge(category: keyof typeof challengeTemplates, difficulty: 'facile' | 'moyen' | 'difficile'): Challenge {
  const templates = challengeTemplates[category];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  const difficultyMultiplier = {
    facile: 0.7,
    moyen: 1.0,
    difficile: 1.4
  };
  
  const baseTarget = template.target_range[0] + 
    Math.floor(Math.random() * (template.target_range[1] - template.target_range[0] + 1));
  
  const target = Math.floor(baseTarget * difficultyMultiplier[difficulty]);
  const points = Math.floor(template.points * difficultyMultiplier[difficulty]);
  
  // Expire à 23h59 du jour même
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(23, 59, 59, 999);
  
  return {
    title: template.title,
    description: template.description.replace('{target}', target.toString()),
    category,
    difficulty,
    points,
    target_value: target,
    expires_at: tomorrow.toISOString(),
    type: template.type
  };
}

function getUserDifficultyPreference(userLevel: number): 'facile' | 'moyen' | 'difficile' {
  if (userLevel < 5) return 'facile';
  if (userLevel < 15) return 'moyen';
  return 'difficile';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id, user_level = 1, preferred_categories = [] } = await req.json();

    if (!user_id) {
      throw new Error('user_id is required');
    }

    // Déterminer la difficulté basée sur le niveau
    const difficulty = getUserDifficultyPreference(user_level);
    
    // Générer 3 défis quotidiens
    const categories: (keyof typeof challengeTemplates)[] = preferred_categories.length > 0 
      ? preferred_categories 
      : ['emotional', 'physical', 'mental', 'social'];
    
    const selectedCategories = categories
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const challenges: Challenge[] = selectedCategories.map(category => 
      generateRandomChallenge(category, difficulty)
    );

    // Supprimer les anciens défis non complétés de l'utilisateur
    await supabaseClient
      .from('challenges')
      .delete()
      .eq('user_id', user_id)
      .eq('completed', false)
      .lt('expires_at', new Date().toISOString());

    // Insérer les nouveaux défis
    const challengesToInsert = challenges.map(challenge => ({
      ...challenge,
      user_id,
      progress: 0,
      completed: false,
      created_at: new Date().toISOString()
    }));

    const { data: insertedChallenges, error: insertError } = await supabaseClient
      .from('challenges')
      .insert(challengesToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting challenges:', insertError);
      throw insertError;
    }

    console.log(`Generated ${challenges.length} daily challenges for user ${user_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        challenges: insertedChallenges,
        message: `Generated ${challenges.length} daily challenges`,
        difficulty_level: difficulty
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-daily-challenges function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});