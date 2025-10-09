// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChallengeRequest {
  action: 'generate' | 'complete' | 'list' | 'stats';
  challengeId?: string;
  userProfile?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();

    // Récupérer les stats utilisateur
    if (body.action === 'stats') {
      const { data: challenges } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', user.id);

      const { data: achievements } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('total_xp, current_level, current_streak')
        .eq('id', user.id)
        .single();

      const stats = {
        totalChallenges: challenges?.length || 0,
        completedChallenges: challenges?.filter((c: any) => c.status === 'completed').length || 0,
        totalAchievements: achievements?.length || 0,
        totalXP: profile?.total_xp || 0,
        currentLevel: profile?.current_level || 1,
        currentStreak: profile?.current_streak || 0,
      };

      return new Response(JSON.stringify({ stats }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Lister les défis
    if (body.action === 'list') {
      const { data: challenges, error } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ challenges }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Compléter un défi
    if (body.action === 'complete') {
      const { data: challenge, error: challengeError } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('id', body.challengeId)
        .eq('user_id', user.id)
        .single();

      if (challengeError) throw challengeError;

      // Marquer comme complété
      const { error: updateError } = await supabase
        .from('user_challenges')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', body.challengeId);

      if (updateError) throw updateError;

      // Ajouter l'XP au profil
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_xp, current_level, current_streak')
        .eq('id', user.id)
        .single();

      const newXP = (profile?.total_xp || 0) + challenge.xp_reward;
      const newLevel = Math.floor(newXP / 1000) + 1;
      const newStreak = (profile?.current_streak || 0) + 1;

      await supabase
        .from('profiles')
        .update({
          total_xp: newXP,
          current_level: newLevel,
          current_streak: newStreak,
        })
        .eq('id', user.id);

      // Vérifier les achievements
      const achievements: any[] = [];
      
      if (newStreak === 7) {
        achievements.push({
          user_id: user.id,
          achievement_type: 'streak_7',
          title: 'Une semaine de régularité',
          description: '7 jours consécutifs de défis',
          xp_reward: 500,
        });
      }

      if (newLevel === 5) {
        achievements.push({
          user_id: user.id,
          achievement_type: 'level_5',
          title: 'Maître du bien-être',
          description: 'Atteindre le niveau 5',
          xp_reward: 1000,
        });
      }

      if (achievements.length > 0) {
        await supabase.from('user_achievements').insert(achievements);
      }

      return new Response(
        JSON.stringify({
          challenge,
          newXP,
          newLevel,
          newStreak,
          achievements,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Générer des défis personnalisés via IA
    if (body.action === 'generate') {
      console.log('🎮 Generating personalized challenges:', { user_id: user.id });

      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      if (!LOVABLE_API_KEY) {
        throw new Error('LOVABLE_API_KEY not configured');
      }

      // Récupérer l'historique utilisateur
      const { data: recentActivities } = await supabase
        .from('emotion_logs')
        .select('emotion_type, intensity')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: profile } = await supabase
        .from('profiles')
        .select('total_xp, current_level')
        .eq('id', user.id)
        .single();

      const systemPrompt = `Tu es un expert en gamification thérapeutique. Génère 3 défis personnalisés pour améliorer le bien-être mental de l'utilisateur.

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown) contenant:
{
  "challenges": [
    {
      "title": "titre court et motivant",
      "description": "description claire de l'objectif",
      "category": "breathing/meditation/journal/social/physical",
      "difficulty": "easy/medium/hard",
      "duration_minutes": 10,
      "xp_reward": 50,
      "instructions": ["étape 1", "étape 2", "étape 3"],
      "success_criteria": "critère de réussite mesurable",
      "motivation_message": "message encourageant personnalisé"
    }
  ]
}`;

      const userContext = `
Niveau actuel: ${profile?.current_level || 1}
XP total: ${profile?.total_xp || 0}
Émotions récentes: ${recentActivities?.map((a: any) => a.emotion_type).join(', ') || 'aucune'}
`;

      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContext }
          ],
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('❌ AI Gateway error:', aiResponse.status, errorText);
        throw new Error(`AI Gateway error: ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      const content = aiData.choices[0].message.content;

      let result;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error('Failed to parse AI response');
      }

      // Sauvegarder les défis
      const challengesToInsert = result.challenges.map((c: any) => ({
        user_id: user.id,
        title: c.title,
        description: c.description,
        category: c.category,
        difficulty: c.difficulty,
        duration_minutes: c.duration_minutes,
        xp_reward: c.xp_reward,
        challenge_config: c,
        status: 'active',
      }));

      const { data: savedChallenges, error: saveError } = await supabase
        .from('user_challenges')
        .insert(challengesToInsert)
        .select();

      if (saveError) {
        console.error('❌ Save error:', saveError);
        throw saveError;
      }

      console.log('✅ Challenges generated:', savedChallenges.length);

      return new Response(
        JSON.stringify({
          challenges: savedChallenges,
          message: 'Défis personnalisés générés avec succès',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Action non reconnue' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Erreur interne' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
