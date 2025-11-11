// @ts-nocheck
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChallengeTemplate {
  type: string;
  objective: string;
  rewardType: string;
  rewardValue: any;
  profiles: string[];
}

const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  {
    type: 'visit',
    objective: 'Visite 3 attractions de la zone Sérénité',
    rewardType: 'badge_boost',
    rewardValue: { boost: 0.2 },
    profiles: ['stress', 'calm']
  },
  {
    type: 'streak',
    objective: 'Médite pendant 5 jours consécutifs',
    rewardType: 'theme_unlock',
    rewardValue: { themeId: 'ocean' },
    profiles: ['stress', 'calm']
  },
  {
    type: 'visit',
    objective: 'Explore 4 attractions de la zone Énergie',
    rewardType: 'badge_boost',
    rewardValue: { boost: 0.25 },
    profiles: ['energy']
  },
  {
    type: 'time_spent',
    objective: 'Passe 15 minutes dans Flash Glow',
    rewardType: 'avatar_unlock',
    rewardValue: { avatarId: 'energy-warrior' },
    profiles: ['energy']
  },
  {
    type: 'visit',
    objective: 'Crée dans 3 attractions créatives différentes',
    rewardType: 'theme_unlock',
    rewardValue: { themeId: 'aurora' },
    profiles: ['creativity']
  },
  {
    type: 'zone_complete',
    objective: 'Complète la zone Quartier Créatif',
    rewardType: 'avatar_unlock',
    rewardValue: { avatarId: 'creative-soul' },
    profiles: ['creativity']
  },
  {
    type: 'social',
    objective: 'Participe à 3 discussions communautaires',
    rewardType: 'badge_boost',
    rewardValue: { boost: 0.3 },
    profiles: ['social']
  },
  {
    type: 'visit',
    objective: 'Visite toutes les attractions sociales',
    rewardType: 'avatar_unlock',
    rewardValue: { avatarId: 'social-butterfly' },
    profiles: ['social']
  },
  {
    type: 'streak',
    objective: 'Visite le parc 7 jours d\'affilée',
    rewardType: 'theme_unlock',
    rewardValue: { themeId: 'golden' },
    profiles: ['all']
  },
  {
    type: 'visit',
    objective: 'Découvre 5 nouvelles attractions',
    rewardType: 'badge_boost',
    rewardValue: { boost: 0.15 },
    profiles: ['all']
  }
];

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const today = new Date().toISOString().split('T')[0];

    console.log(`Generating daily challenges for ${today}`);

    const { data: existingChallenges, error: checkError } = await supabaseClient
      .from('daily_challenges')
      .select('id')
      .eq('challenge_date', today);

    if (checkError) {
      throw checkError;
    }

    if (existingChallenges && existingChallenges.length > 0) {
      console.log('Challenges already exist for today');
      return new Response(
        JSON.stringify({ message: 'Challenges already exist for today', count: existingChallenges.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const challengesToCreate = [];
    const profiles = ['stress', 'energy', 'creativity', 'calm', 'social', 'all'];

    for (const profile of profiles) {
      const availableTemplates = CHALLENGE_TEMPLATES.filter(t => t.profiles.includes(profile));
      
      const shuffled = availableTemplates.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 2);

      for (const template of selected) {
        challengesToCreate.push({
          challenge_date: today,
          type: template.type,
          objective: template.objective,
          reward_type: template.rewardType,
          reward_value: template.rewardValue,
          emotional_profile: profile
        });
      }
    }

    const { data: insertedChallenges, error: insertError } = await supabaseClient
      .from('daily_challenges')
      .insert(challengesToCreate)
      .select();

    if (insertError) {
      throw insertError;
    }

    console.log(`Created ${insertedChallenges?.length || 0} challenges`);

    return new Response(
      JSON.stringify({
        success: true,
        challenges: insertedChallenges,
        count: insertedChallenges?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error: any) {
    console.error('Error generating challenges:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
