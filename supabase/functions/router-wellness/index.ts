// @ts-nocheck
/**
 * ROUTER WELLNESS - Super-routeur Bien-être consolidé
 * Regroupe: meditation-api, activities-api, breathing-exercises, journal, etc.
 * 
 * Actions disponibles:
 * - meditation-start: Démarrer méditation
 * - meditation-complete: Terminer méditation
 * - activity-log: Logger une activité
 * - activity-history: Historique des activités
 * - breathing-start: Démarrer exercice respiration
 * - breathing-complete: Terminer exercice respiration
 * - journal-create: Créer entrée journal
 * - journal-list: Liste du journal
 * - mood-log: Logger l'humeur
 * - mood-history: Historique humeur
 * - streak: Obtenir la série
 * - goals: Objectifs utilisateur
 * - recommendations: Recommandations
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RouterRequest {
  action: string;
  payload: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return errorResponse('Authorization required', 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return errorResponse('Invalid token', 401);
    }

    const body: RouterRequest = await req.json();
    const { action, payload = {} } = body;

    if (!action) {
      return errorResponse('Action is required', 400);
    }

    console.log(`[router-wellness] Action: ${action}, User: ${user.id}`);

    switch (action) {
      case 'meditation-start':
        return await handleMeditationStart(payload, user, supabase);
      
      case 'meditation-complete':
        return await handleMeditationComplete(payload, user, supabase);
      
      case 'activity-log':
        return await handleActivityLog(payload, user, supabase);
      
      case 'activity-history':
        return await handleActivityHistory(payload, user, supabase);
      
      case 'breathing-start':
        return await handleBreathingStart(payload, user, supabase);
      
      case 'breathing-complete':
        return await handleBreathingComplete(payload, user, supabase);
      
      case 'journal-create':
        return await handleJournalCreate(payload, user, supabase);
      
      case 'journal-list':
        return await handleJournalList(payload, user, supabase);
      
      case 'mood-log':
        return await handleMoodLog(payload, user, supabase);
      
      case 'mood-history':
        return await handleMoodHistory(payload, user, supabase);
      
      case 'streak':
        return await handleStreak(user, supabase);
      
      case 'goals':
        return await handleGoals(payload, user, supabase);
      
      case 'recommendations':
        return await handleRecommendations(user, supabase);

      default:
        return errorResponse(`Unknown action: ${action}`, 400);
    }

  } catch (error) {
    console.error('[router-wellness] Error:', error);
    return errorResponse(error.message ?? 'Internal error', 500);
  }
});

// ============ HANDLERS ============

async function handleMeditationStart(payload: any, user: any, supabase: any): Promise<Response> {
  const { type = 'guided', duration = 10, theme } = payload;

  const { data: session, error } = await supabase
    .from('meditation_sessions')
    .insert({
      user_id: user.id,
      type,
      duration_planned: duration,
      theme,
      started_at: new Date().toISOString(),
      status: 'in_progress',
    })
    .select()
    .single();

  if (error) {
    return errorResponse('Failed to start meditation', 500);
  }

  return successResponse({ session });
}

async function handleMeditationComplete(payload: any, user: any, supabase: any): Promise<Response> {
  const { sessionId, actualDuration, rating, notes, moodAfter } = payload;

  if (!sessionId) {
    return errorResponse('Session ID is required', 400);
  }

  const { error } = await supabase
    .from('meditation_sessions')
    .update({
      duration_actual: actualDuration,
      rating,
      notes,
      mood_after: moodAfter,
      completed_at: new Date().toISOString(),
      status: 'completed',
    })
    .eq('id', sessionId)
    .eq('user_id', user.id);

  if (error) {
    return errorResponse('Failed to complete meditation', 500);
  }

  // Update streak
  await updateStreak(user.id, supabase, 'meditation');

  return successResponse({ completed: true });
}

async function handleActivityLog(payload: any, user: any, supabase: any): Promise<Response> {
  const { activityId, duration, rating, notes, moodBefore, moodAfter } = payload;

  const { data: session, error } = await supabase
    .from('activity_sessions')
    .insert({
      user_id: user.id,
      activity_id: activityId,
      duration_seconds: duration,
      rating,
      notes,
      mood_before: moodBefore,
      mood_after: moodAfter,
      started_at: new Date().toISOString(),
      completed: true,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return errorResponse('Failed to log activity', 500);
  }

  await updateStreak(user.id, supabase, 'activity');

  return successResponse({ session });
}

async function handleActivityHistory(payload: any, user: any, supabase: any): Promise<Response> {
  const { limit = 20, offset = 0 } = payload;

  const { data: activities, error } = await supabase
    .from('activity_sessions')
    .select('*, activities(title, category, icon)')
    .eq('user_id', user.id)
    .order('started_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return errorResponse('Failed to fetch history', 500);
  }

  return successResponse({ activities: activities || [] });
}

async function handleBreathingStart(payload: any, user: any, supabase: any): Promise<Response> {
  const { pattern = '4-7-8', duration = 5 } = payload;

  const { data: session, error } = await supabase
    .from('breathing_sessions')
    .insert({
      user_id: user.id,
      pattern,
      duration_planned: duration,
      started_at: new Date().toISOString(),
      status: 'in_progress',
    })
    .select()
    .single();

  if (error) {
    return errorResponse('Failed to start breathing exercise', 500);
  }

  return successResponse({ session });
}

async function handleBreathingComplete(payload: any, user: any, supabase: any): Promise<Response> {
  const { sessionId, actualDuration, rating, heartRateBefore, heartRateAfter } = payload;

  if (!sessionId) {
    return errorResponse('Session ID is required', 400);
  }

  const { error } = await supabase
    .from('breathing_sessions')
    .update({
      duration_actual: actualDuration,
      rating,
      heart_rate_before: heartRateBefore,
      heart_rate_after: heartRateAfter,
      completed_at: new Date().toISOString(),
      status: 'completed',
    })
    .eq('id', sessionId)
    .eq('user_id', user.id);

  if (error) {
    return errorResponse('Failed to complete breathing exercise', 500);
  }

  await updateStreak(user.id, supabase, 'breathing');

  return successResponse({ completed: true });
}

async function handleJournalCreate(payload: any, user: any, supabase: any): Promise<Response> {
  const { title, content, mood, tags = [], isPrivate = true } = payload;

  if (!content) {
    return errorResponse('Content is required', 400);
  }

  const { data: entry, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: user.id,
      title,
      content,
      mood,
      tags,
      is_private: isPrivate,
    })
    .select()
    .single();

  if (error) {
    return errorResponse('Failed to create journal entry', 500);
  }

  await updateStreak(user.id, supabase, 'journal');

  return successResponse({ entry });
}

async function handleJournalList(payload: any, user: any, supabase: any): Promise<Response> {
  const { limit = 20, offset = 0, search } = payload;

  let query = supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.ilike('content', `%${search}%`);
  }

  const { data: entries, error } = await query;

  if (error) {
    return errorResponse('Failed to fetch journal entries', 500);
  }

  return successResponse({ entries: entries || [] });
}

async function handleMoodLog(payload: any, user: any, supabase: any): Promise<Response> {
  const { mood, intensity = 5, notes, context = [] } = payload;

  if (!mood) {
    return errorResponse('Mood is required', 400);
  }

  const { data: entry, error } = await supabase
    .from('mood_entries')
    .insert({
      user_id: user.id,
      mood,
      intensity,
      notes,
      context_tags: context,
    })
    .select()
    .single();

  if (error) {
    return errorResponse('Failed to log mood', 500);
  }

  return successResponse({ entry });
}

async function handleMoodHistory(payload: any, user: any, supabase: any): Promise<Response> {
  const { days = 30 } = payload;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: entries, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    return errorResponse('Failed to fetch mood history', 500);
  }

  // Calculer les stats
  const moods = entries || [];
  const avgIntensity = moods.length > 0
    ? moods.reduce((sum: number, m: any) => sum + (m.intensity || 5), 0) / moods.length
    : 5;

  const moodCounts: Record<string, number> = {};
  moods.forEach((m: any) => {
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
  });

  return successResponse({
    entries: moods,
    stats: {
      avgIntensity,
      moodCounts,
      totalEntries: moods.length,
    },
  });
}

async function handleStreak(user: any, supabase: any): Promise<Response> {
  const { data: streak } = await supabase
    .from('activity_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return successResponse({
    streak: streak || {
      current_streak: 0,
      longest_streak: 0,
      total_activities: 0,
    },
  });
}

async function handleGoals(payload: any, user: any, supabase: any): Promise<Response> {
  const { action: goalAction } = payload;

  if (goalAction === 'list') {
    const { data: goals } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('active', true);

    return successResponse({ goals: goals || [] });
  }

  if (goalAction === 'create') {
    const { type, target, deadline } = payload;

    const { data: goal, error } = await supabase
      .from('user_goals')
      .insert({
        user_id: user.id,
        type,
        target_value: target,
        deadline,
        current_value: 0,
        active: true,
      })
      .select()
      .single();

    if (error) {
      return errorResponse('Failed to create goal', 500);
    }

    return successResponse({ goal });
  }

  return errorResponse('Invalid goal action', 400);
}

async function handleRecommendations(user: any, supabase: any): Promise<Response> {
  // Récupérer les activités récentes
  const { data: recentActivities } = await supabase
    .from('activity_sessions')
    .select('activity_id, rating')
    .eq('user_id', user.id)
    .order('started_at', { ascending: false })
    .limit(10);

  // Récupérer les humeurs récentes
  const { data: recentMoods } = await supabase
    .from('mood_entries')
    .select('mood')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Générer des recommandations basées sur les données
  const recommendations = [];

  const dominantMood = recentMoods?.[0]?.mood;
  if (dominantMood === 'anxious' || dominantMood === 'stressed') {
    recommendations.push({
      type: 'breathing',
      title: 'Exercice de respiration 4-7-8',
      reason: 'Recommandé pour réduire l\'anxiété',
    });
  }

  if (!recentActivities || recentActivities.length < 3) {
    recommendations.push({
      type: 'activity',
      title: 'Commencer une méditation guidée',
      reason: 'Établir une routine bien-être',
    });
  }

  recommendations.push({
    type: 'journal',
    title: 'Écrire dans votre journal',
    reason: 'Favorise la réflexion et le bien-être',
  });

  return successResponse({ recommendations });
}

// ============ HELPERS ============

async function updateStreak(userId: string, supabase: any, type: string): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: streak } = await supabase
      .from('activity_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!streak) {
      await supabase
        .from('activity_streaks')
        .insert({
          user_id: userId,
          current_streak: 1,
          longest_streak: 1,
          last_activity_date: today,
          total_activities: 1,
        });
      return;
    }

    const lastDate = streak.last_activity_date;
    const lastDateTime = new Date(lastDate).getTime();
    const todayTime = new Date(today).getTime();
    const dayDiff = (todayTime - lastDateTime) / (1000 * 60 * 60 * 24);

    let newStreak = streak.current_streak;
    if (dayDiff === 1) {
      newStreak += 1;
    } else if (dayDiff > 1) {
      newStreak = 1;
    }

    await supabase
      .from('activity_streaks')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, streak.longest_streak),
        last_activity_date: today,
        total_activities: (streak.total_activities || 0) + 1,
      })
      .eq('user_id', userId);
  } catch (error) {
    console.error('[router-wellness] Streak update error:', error);
  }
}

function successResponse(data: any): Response {
  return new Response(JSON.stringify({ success: true, ...data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
