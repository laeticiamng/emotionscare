/**
 * Edge Function: Emotional API
 *
 * API unifiée pour toutes les opérations émotionnelles backend
 * Endpoints pour achievements, stats, insights, patterns, trends
 *
 * @version 1.0.0
 * @created 2025-11-14
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface Achievement {
  id: string;
  user_id: string;
  achievement_id: string;
  achievement_title: string;
  achievement_description?: string;
  category: 'scan' | 'streak' | 'journey' | 'mastery' | 'social' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  xp_reward: number;
  unlocked_at: string;
  progress: number;
  metadata?: Record<string, any>;
}

interface EmotionalStats {
  user_id: string;
  total_scans: number;
  total_journal_entries: number;
  emotions_discovered: string[];
  favorite_emotion?: string;
  average_mood_score: number;
  average_valence: number;
  average_arousal: number;
  emotional_variability: number;
  days_active: number;
  first_activity_date?: string;
  last_activity_date?: string;
  level: number;
  xp: number;
  next_level_xp: number;
  total_xp_earned: number;
  current_streak: number;
  longest_streak: number;
  last_check_in?: string;
  total_check_ins: number;
  scan_types_used: string[];
}

interface Pattern {
  id: string;
  user_id: string;
  pattern_type: 'recurring' | 'seasonal' | 'contextual' | 'triggered';
  emotion: string;
  frequency: number;
  confidence: number;
  time_of_day?: 'morning' | 'afternoon' | 'evening' | 'night';
  day_of_week?: number;
  description: string;
}

interface Insight {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: 'positive' | 'neutral' | 'warning' | 'tip';
  category: 'trend' | 'pattern' | 'suggestion' | 'achievement';
  confidence: number;
  priority: number;
  is_read: boolean;
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function createResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function createErrorResponse(message: string, status = 400) {
  return createResponse({ error: message }, status);
}

// ═══════════════════════════════════════════════════════════
// HANDLERS
// ═══════════════════════════════════════════════════════════

/**
 * GET /achievements
 * Récupérer les achievements d'un utilisateur
 */
async function handleGetAchievements(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('emotional_achievements')
    .select('*')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });

  if (error) throw error;

  return createResponse({ achievements: data || [] });
}

/**
 * GET /stats
 * Récupérer les statistiques émotionnelles d'un utilisateur
 */
async function handleGetStats(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('emotional_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  // Si pas de stats, initialiser
  if (!data) {
    const { data: newStats, error: insertError } = await supabase
      .from('emotional_stats')
      .insert({ user_id: userId })
      .select()
      .single();

    if (insertError) throw insertError;

    return createResponse({ stats: newStats });
  }

  return createResponse({ stats: data });
}

/**
 * GET /dashboard
 * Récupérer le dashboard complet d'un utilisateur
 */
async function handleGetDashboard(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('emotional_dashboard_summary')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  return createResponse({ dashboard: data || null });
}

/**
 * GET /patterns
 * Récupérer les patterns émotionnels actifs
 */
async function handleGetPatterns(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('emotional_patterns')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('confidence', { ascending: false })
    .limit(10);

  if (error) throw error;

  return createResponse({ patterns: data || [] });
}

/**
 * GET /insights
 * Récupérer les insights émotionnels
 */
async function handleGetInsights(supabase: any, userId: string, params: URLSearchParams) {
  const unreadOnly = params.get('unreadOnly') === 'true';

  let query = supabase
    .from('emotional_insights')
    .select('*')
    .eq('user_id', userId)
    .eq('is_dismissed', false)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  if (unreadOnly) {
    query = query.eq('is_read', false);
  }

  const { data, error } = await query.limit(20);

  if (error) throw error;

  return createResponse({ insights: data || [] });
}

/**
 * PATCH /insights/:id/read
 * Marquer un insight comme lu
 */
async function handleMarkInsightAsRead(supabase: any, userId: string, insightId: string) {
  const { data, error } = await supabase
    .from('emotional_insights')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('id', insightId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;

  return createResponse({ insight: data });
}

/**
 * GET /trends
 * Récupérer les tendances émotionnelles
 */
async function handleGetTrends(supabase: any, userId: string, params: URLSearchParams) {
  const period = params.get('period') || 'week';

  const { data, error } = await supabase
    .from('emotional_trends')
    .select('*')
    .eq('user_id', userId)
    .eq('period_comparison', period)
    .order('period_start', { ascending: false })
    .limit(10);

  if (error) throw error;

  return createResponse({ trends: data || [] });
}

/**
 * POST /check-achievements
 * Forcer la vérification des achievements pour un utilisateur
 */
async function handleCheckAchievements(supabase: any, userId: string) {
  const { error } = await supabase.rpc('check_and_unlock_achievements', {
    p_user_id: userId,
  });

  if (error) throw error;

  // Récupérer les achievements débloqués
  const { data: achievements } = await supabase
    .from('emotional_achievements')
    .select('*')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });

  return createResponse({
    message: 'Achievements checked',
    achievements: achievements || [],
  });
}

/**
 * POST /generate-insights
 * Générer des insights automatiques pour un utilisateur
 */
async function handleGenerateInsights(supabase: any, userId: string) {
  // Récupérer les stats
  const { data: stats } = await supabase
    .from('emotional_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!stats) {
    return createErrorResponse('No stats found for user', 404);
  }

  const insights: Partial<Insight>[] = [];

  // Insight sur la tendance positive
  if (stats.average_mood_score > 70) {
    insights.push({
      user_id: userId,
      title: 'Tendance Positive Détectée 🎉',
      description: `Votre humeur moyenne est de ${stats.average_mood_score.toFixed(1)}/100, ce qui est excellent !`,
      type: 'positive',
      category: 'trend',
      confidence: 0.9,
      priority: 8,
      is_read: false,
    });
  }

  // Insight sur la stabilité
  if (stats.emotional_variability < 15) {
    insights.push({
      user_id: userId,
      title: 'Équilibre Émotionnel Stable ✅',
      description: 'Félicitations ! Vous maintenez une belle stabilité émotionnelle.',
      type: 'positive',
      category: 'achievement',
      confidence: 0.9,
      priority: 7,
      is_read: false,
    });
  } else if (stats.emotional_variability > 30) {
    insights.push({
      user_id: userId,
      title: 'Émotions Fluctuantes',
      description: 'Vos émotions varient beaucoup. La méditation pourrait vous aider à trouver plus de stabilité.',
      type: 'tip',
      category: 'suggestion',
      confidence: 0.75,
      priority: 6,
      is_read: false,
    });
  }

  // Insight sur le streak
  if (stats.current_streak >= 7) {
    insights.push({
      user_id: userId,
      title: 'Constance Remarquable ! 🔥',
      description: `Vous avez maintenu un streak de ${stats.current_streak} jours. Continue !`,
      type: 'positive',
      category: 'achievement',
      confidence: 1.0,
      priority: 9,
      is_read: false,
    });
  }

  // Insérer les insights
  if (insights.length > 0) {
    const { data, error } = await supabase
      .from('emotional_insights')
      .insert(insights)
      .select();

    if (error) throw error;

    return createResponse({
      message: `${insights.length} insights generated`,
      insights: data,
    });
  }

  return createResponse({ message: 'No new insights to generate', insights: [] });
}

/**
 * GET /leaderboard
 * Récupérer le classement général
 */
async function handleGetLeaderboard(supabase: any, params: URLSearchParams) {
  const limit = parseInt(params.get('limit') || '10', 10);

  const { data, error } = await supabase
    .from('emotional_leaderboard')
    .select('*')
    .limit(limit);

  if (error) throw error;

  return createResponse({ leaderboard: data || [] });
}

// ═══════════════════════════════════════════════════════════
// ROUTER
// ═══════════════════════════════════════════════════════════

async function handleRequest(req: Request) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Créer client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Vérifier l'authentification
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Parser URL
    const url = new URL(req.url);
    const pathname = url.pathname;
    const params = url.searchParams;
    const method = req.method;

    // Router
    if (method === 'GET' && pathname === '/achievements') {
      return await handleGetAchievements(supabaseClient, user.id);
    }

    if (method === 'GET' && pathname === '/stats') {
      return await handleGetStats(supabaseClient, user.id);
    }

    if (method === 'GET' && pathname === '/dashboard') {
      return await handleGetDashboard(supabaseClient, user.id);
    }

    if (method === 'GET' && pathname === '/patterns') {
      return await handleGetPatterns(supabaseClient, user.id);
    }

    if (method === 'GET' && pathname === '/insights') {
      return await handleGetInsights(supabaseClient, user.id, params);
    }

    if (method === 'PATCH' && pathname.startsWith('/insights/') && pathname.endsWith('/read')) {
      const insightId = pathname.split('/')[2];
      return await handleMarkInsightAsRead(supabaseClient, user.id, insightId);
    }

    if (method === 'GET' && pathname === '/trends') {
      return await handleGetTrends(supabaseClient, user.id, params);
    }

    if (method === 'POST' && pathname === '/check-achievements') {
      return await handleCheckAchievements(supabaseClient, user.id);
    }

    if (method === 'POST' && pathname === '/generate-insights') {
      return await handleGenerateInsights(supabaseClient, user.id);
    }

    if (method === 'GET' && pathname === '/leaderboard') {
      return await handleGetLeaderboard(supabaseClient, params);
    }

    return createErrorResponse('Not found', 404);
  } catch (error: any) {
    console.error('Error:', error);
    return createErrorResponse(error.message || 'Internal server error', 500);
  }
}

// ═══════════════════════════════════════════════════════════
// SERVE
// ═══════════════════════════════════════════════════════════

serve(handleRequest);
