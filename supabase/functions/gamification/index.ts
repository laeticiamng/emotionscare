// @ts-ignore
/**
 * gamification - Système de gamification (XP, niveaux, achievements)
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 20/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

serve(async (req) => {
  // 1. CORS check
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  // Vérification CORS stricte
  if (!corsResult.allowed) {
    console.warn('[gamification] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 2. Auth via Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.warn('[gamification] Unauthorized access attempt');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. 🛡️ Rate limiting
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'gamification',
      userId: user.id,
      limit: 20,
      windowMs: 60_000,
      description: 'Gamification operations',
    });

    if (!rateLimit.allowed) {
      console.warn('[gamification] Rate limit exceeded', { userId: user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    console.log(`[gamification] Processing for user: ${user.id}`);

    const { action, data } = await req.json();

    switch (action) {
      case 'award-xp': {
        const { amount, reason, category } = data;
        
        // Get current profile
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const currentXP = profile?.gamification_xp || 0;
        const currentLevel = profile?.gamification_level || 1;
        const newXP = currentXP + amount;
        
        // Calculate new level (100 XP per level)
        const newLevel = Math.floor(newXP / 100) + 1;
        const leveledUp = newLevel > currentLevel;

        // Update profile
        await supabaseClient
          .from('profiles')
          .update({
            gamification_xp: newXP,
            gamification_level: newLevel,
          })
          .eq('id', user.id);

        // Log XP gain
        await supabaseClient
          .from('user_xp_history')
          .insert({
            user_id: user.id,
            amount,
            reason,
            category,
            new_total: newXP,
          });

        // Check for achievements
        if (leveledUp) {
          await checkAndAwardAchievement(supabaseClient, user.id, 'level_milestone', newLevel);
        }

        return new Response(JSON.stringify({
          success: true,
          xp: newXP,
          level: newLevel,
          leveledUp,
          gained: amount,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get-stats': {
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('gamification_xp, gamification_level, gamification_streak')
          .eq('id', user.id)
          .single();

        const { data: userAchievements } = await supabaseClient
          .from('user_achievements')
          .select('*, achievements(*)')
          .eq('user_id', user.id)
          .order('unlocked_at', { ascending: false });

        const { data: badges } = await supabaseClient
          .from('badges')
          .select('*')
          .eq('user_id', user.id)
          .order('awarded_at', { ascending: false });

        const { data: xpHistory } = await supabaseClient
          .from('user_xp_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        return new Response(JSON.stringify({
          profile: {
            xp: profile?.gamification_xp || 0,
            level: profile?.gamification_level || 1,
            streak: profile?.gamification_streak || 0,
          },
          achievements: userAchievements || [],
          badges: badges || [],
          xpHistory: xpHistory || [],
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get-leaderboard': {
        const { timeframe = 'all-time', limit = 50 } = data;

        let query = supabaseClient
          .from('profiles')
          .select('id, display_name, avatar_url, gamification_xp, gamification_level')
          .order('gamification_xp', { ascending: false })
          .limit(limit);

        const { data: leaderboard } = await query;

        // Get user's rank
        const userRank = leaderboard?.findIndex((p: any) => p.id === user.id) ?? -1;

        return new Response(JSON.stringify({
          leaderboard: leaderboard || [],
          userRank: userRank + 1,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get-challenges': {
        const today = new Date().toISOString().split('T')[0];

        const { data: challenges } = await supabaseClient
          .from('daily_challenges')
          .select('*')
          .gte('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false });

        const { data: userProgress } = await supabaseClient
          .from('user_challenge_progress')
          .select('*')
          .eq('user_id', user.id)
          .in('challenge_id', challenges?.map((c: any) => c.id) || []);

        const enrichedChallenges = challenges?.map((challenge: any) => {
          const progress = userProgress?.find((p: any) => p.challenge_id === challenge.id);
          return {
            ...challenge,
            progress: progress?.progress || 0,
            completed: progress?.completed || false,
            claimed: progress?.reward_claimed || false,
          };
        });

        return new Response(JSON.stringify({
          challenges: enrichedChallenges || [],
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'complete-challenge': {
        const { challengeId } = data;

        const { data: challenge } = await supabaseClient
          .from('daily_challenges')
          .select('*')
          .eq('id', challengeId)
          .single();

        if (!challenge) {
          return new Response(JSON.stringify({ error: 'Challenge not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Mark as completed
        await supabaseClient
          .from('user_challenge_progress')
          .upsert({
            user_id: user.id,
            challenge_id: challengeId,
            progress: 100,
            completed: true,
            reward_claimed: true,
          });

        // Award XP
        const xpReward = challenge.xp_reward || 50;
        await supabaseClient.functions.invoke('gamification', {
          body: {
            action: 'award-xp',
            data: {
              amount: xpReward,
              reason: `Completed challenge: ${challenge.title}`,
              category: 'challenge',
            },
          },
        });

        return new Response(JSON.stringify({
          success: true,
          xpGained: xpReward,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Gamification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function checkAndAwardAchievement(
  supabaseClient: any,
  userId: string,
  type: string,
  value: number
) {
  const { data: achievements } = await supabaseClient
    .from('achievements')
    .select('*')
    .eq('category', type);

  for (const achievement of achievements || []) {
    const conditions = achievement.conditions || [];
    const threshold = conditions.find((c: any) => c.type === 'threshold')?.value;
    
    if (threshold && value >= threshold) {
      const { data: existing } = await supabaseClient
        .from('user_achievements')
        .select('id')
        .eq('user_id', userId)
        .eq('achievement_id', achievement.id)
        .single();

      if (!existing) {
        await supabaseClient
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
            progress: 100,
          });
      }
    }
  }
}
