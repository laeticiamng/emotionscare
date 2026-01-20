/**
 * Service pour Boss Grit (Bounce Battles)
 * Module de résilience et stratégies de coping
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type {
  BounceBattle,
  CopingResponse,
  BattleMode,
  BounceEventType,
  BounceEventData,
  BattleStats,
  BattleHistory
} from './types';

// ============================================================================
// SCORING CONFIGURATION
// ============================================================================

/**
 * Configuration des questions de coping par catégorie
 */
const COPING_CATEGORIES: Record<string, string[]> = {
  problem_focused: ['q1', 'q2', 'q5', 'q8'],
  emotion_focused: ['q3', 'q6', 'q9'],
  social_support: ['q4', 'q7', 'q10']
};

/**
 * Poids des catégories pour le score global
 */
const CATEGORY_WEIGHTS: Record<string, number> = {
  problem_focused: 0.4,
  emotion_focused: 0.35,
  social_support: 0.25
};

/**
 * Badges de bataille
 */
const BATTLE_BADGES = {
  FIRST_BATTLE: 'first_battle',
  QUICK_THINKER: 'quick_thinker',
  RESILIENCE_MASTER: 'resilience_master',
  CONSISTENT_WARRIOR: 'consistent_warrior',
  PERFECT_SCORE: 'perfect_score',
  CHALLENGE_CHAMPION: 'challenge_champion'
} as const;

// ============================================================================
// SCORE RESULT TYPE
// ============================================================================

export interface BattleScoreResult {
  totalScore: number;
  categoryScores: Record<string, number>;
  resilenceIndex: number;
  strengths: string[];
  areasForGrowth: string[];
  badgesEarned: string[];
}

// ============================================================================
// MAIN SERVICE
// ============================================================================

export class BossGritService {
  /**
   * Créer une nouvelle bataille
   */
  static async createBattle(
    userId: string,
    mode: BattleMode = 'standard'
  ): Promise<BounceBattle> {
    const { data, error } = await supabase
      .from('bounce_battles')
      .insert({
        user_id: userId,
        mode,
        status: 'created'
      })
      .select()
      .single();

    if (error) {
      logger.error('boss_grit:create_battle_failed', { error: error.message }, 'BOSS_GRIT');
      throw error;
    }

    logger.info('boss_grit:battle_created', { battleId: data.id, mode }, 'BOSS_GRIT');
    return data;
  }

  /**
   * Démarrer une bataille
   */
  static async startBattle(battleId: string): Promise<void> {
    const { error } = await supabase
      .from('bounce_battles')
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .eq('id', battleId);

    if (error) {
      logger.error('boss_grit:start_battle_failed', { battleId, error: error.message }, 'BOSS_GRIT');
      throw error;
    }

    // Log event
    await this.logEvent(battleId, 'battle_started');
    logger.info('boss_grit:battle_started', { battleId }, 'BOSS_GRIT');
  }

  /**
   * Enregistrer une réponse de coping
   */
  static async saveCopingResponse(
    battleId: string,
    questionId: string,
    responseValue: number
  ): Promise<void> {
    // Validate response value
    if (responseValue < 1 || responseValue > 10) {
      throw new Error('Response value must be between 1 and 10');
    }

    const { error } = await supabase
      .from('bounce_coping_responses')
      .insert({
        battle_id: battleId,
        question_id: questionId,
        response_value: responseValue
      });

    if (error) {
      logger.error('boss_grit:save_response_failed', { battleId, questionId, error: error.message }, 'BOSS_GRIT');
      throw error;
    }

    // Log event
    await this.logEvent(battleId, 'question_answered', {
      question_id: questionId,
      value: responseValue
    });
  }

  /**
   * Enregistrer un événement
   */
  static async logEvent(
    battleId: string,
    eventType: BounceEventType,
    eventData?: BounceEventData
  ): Promise<void> {
    const { error } = await supabase
      .from('bounce_events')
      .insert({
        battle_id: battleId,
        event_type: eventType,
        timestamp: Date.now(),
        event_data: eventData || {}
      });

    if (error) {
      // Don't throw for event logging failures
      logger.warn('boss_grit:log_event_failed', { battleId, eventType, error: error.message }, 'BOSS_GRIT');
    }
  }

  /**
   * Calculer le score de la bataille
   */
  static async calculateBattleScore(battleId: string): Promise<BattleScoreResult> {
    // Fetch responses
    const responses = await this.fetchResponses(battleId);

    if (responses.length === 0) {
      return {
        totalScore: 0,
        categoryScores: {},
        resilenceIndex: 0,
        strengths: [],
        areasForGrowth: [],
        badgesEarned: []
      };
    }

    // Group responses by category
    const categoryResponses: Record<string, number[]> = {
      problem_focused: [],
      emotion_focused: [],
      social_support: []
    };

    responses.forEach(response => {
      for (const [category, questions] of Object.entries(COPING_CATEGORIES)) {
        if (questions.includes(response.question_id)) {
          categoryResponses[category].push(response.response_value);
          break;
        }
      }
    });

    // Calculate category scores (0-100)
    const categoryScores: Record<string, number> = {};
    for (const [category, values] of Object.entries(categoryResponses)) {
      if (values.length > 0) {
        const avgValue = values.reduce((sum, v) => sum + v, 0) / values.length;
        categoryScores[category] = Math.round((avgValue / 10) * 100);
      } else {
        categoryScores[category] = 0;
      }
    }

    // Calculate weighted total score
    let totalScore = 0;
    for (const [category, weight] of Object.entries(CATEGORY_WEIGHTS)) {
      totalScore += (categoryScores[category] || 0) * weight;
    }
    totalScore = Math.round(totalScore);

    // Calculate resilience index (composite metric)
    const avgResponse = responses.reduce((sum, r) => sum + r.response_value, 0) / responses.length;
    const responseVariance = responses.reduce((sum, r) => sum + Math.pow(r.response_value - avgResponse, 2), 0) / responses.length;
    const consistency = Math.max(0, 100 - (responseVariance * 10)); // Lower variance = higher consistency

    const resilenceIndex = Math.round((totalScore * 0.7) + (consistency * 0.3));

    // Identify strengths and areas for growth
    const strengths: string[] = [];
    const areasForGrowth: string[] = [];

    const categoryLabels: Record<string, string> = {
      problem_focused: 'Résolution de problèmes',
      emotion_focused: 'Gestion des émotions',
      social_support: 'Soutien social'
    };

    for (const [category, score] of Object.entries(categoryScores)) {
      if (score >= 70) {
        strengths.push(categoryLabels[category]);
      } else if (score < 50) {
        areasForGrowth.push(categoryLabels[category]);
      }
    }

    // Calculate badges earned
    const badgesEarned = await this.calculateBadges(battleId, totalScore, responses);

    return {
      totalScore,
      categoryScores,
      resilenceIndex,
      strengths,
      areasForGrowth,
      badgesEarned
    };
  }

  /**
   * Calculer les badges gagnés
   */
  private static async calculateBadges(
    battleId: string,
    totalScore: number,
    _responses: CopingResponse[]
  ): Promise<string[]> {
    const badges: string[] = [];

    // Fetch battle info
    const { data: battle } = await supabase
      .from('bounce_battles')
      .select('user_id, mode, duration_seconds')
      .eq('id', battleId)
      .single();

    if (!battle) return badges;

    // Fetch user's battle count
    const { count: battleCount } = await supabase
      .from('bounce_battles')
      .select('id', { count: 'exact' })
      .eq('user_id', battle.user_id)
      .eq('status', 'completed');

    // First battle
    if (battleCount === 1) {
      badges.push(BATTLE_BADGES.FIRST_BATTLE);
    }

    // Quick thinker (completed in under 2 minutes)
    if (battle.duration_seconds && battle.duration_seconds < 120) {
      badges.push(BATTLE_BADGES.QUICK_THINKER);
    }

    // Perfect score
    if (totalScore >= 95) {
      badges.push(BATTLE_BADGES.PERFECT_SCORE);
    }

    // Resilience master (score >= 80)
    if (totalScore >= 80) {
      badges.push(BATTLE_BADGES.RESILIENCE_MASTER);
    }

    // Challenge champion (completed challenge mode)
    if (battle.mode === 'challenge' && totalScore >= 70) {
      badges.push(BATTLE_BADGES.CHALLENGE_CHAMPION);
    }

    // Consistent warrior (10+ battles completed)
    if (battleCount && battleCount >= 10) {
      badges.push(BATTLE_BADGES.CONSISTENT_WARRIOR);
    }

    return badges;
  }

  /**
   * Compléter une bataille avec calcul de score
   */
  static async completeBattle(
    battleId: string,
    durationSeconds: number
  ): Promise<{
    battle: BounceBattle;
    score: BattleScoreResult;
  }> {
    // Calculate score first
    const score = await this.calculateBattleScore(battleId);

    // Update battle with completion info
    const { data, error } = await supabase
      .from('bounce_battles')
      .update({
        status: 'completed',
        duration_seconds: durationSeconds,
        ended_at: new Date().toISOString(),
        // Store score data as JSON
        score_data: {
          total_score: score.totalScore,
          category_scores: score.categoryScores,
          resilience_index: score.resilenceIndex,
          badges_earned: score.badgesEarned
        }
      })
      .eq('id', battleId)
      .select()
      .single();

    if (error) {
      logger.error('boss_grit:complete_battle_failed', { battleId, error: error.message }, 'BOSS_GRIT');
      throw error;
    }

    // Log completion event
    await this.logEvent(battleId, 'battle_completed', {
      value: score.totalScore,
      metadata: {
        duration_seconds: durationSeconds,
        badges: score.badgesEarned
      }
    });

    // Log achievement unlocks
    for (const badge of score.badgesEarned) {
      await this.logEvent(battleId, 'achievement_unlocked', {
        achievement_id: badge
      });
    }

    logger.info('boss_grit:battle_completed', {
      battleId,
      totalScore: score.totalScore,
      badgesEarned: score.badgesEarned.length
    }, 'BOSS_GRIT');

    return { battle: data, score };
  }

  /**
   * Annuler une bataille
   */
  static async cancelBattle(battleId: string): Promise<void> {
    const { error } = await supabase
      .from('bounce_battles')
      .update({
        status: 'cancelled',
        ended_at: new Date().toISOString()
      })
      .eq('id', battleId);

    if (error) {
      logger.error('boss_grit:cancel_battle_failed', { battleId, error: error.message }, 'BOSS_GRIT');
      throw error;
    }

    await this.logEvent(battleId, 'battle_abandoned');
    logger.info('boss_grit:battle_cancelled', { battleId }, 'BOSS_GRIT');
  }

  /**
   * Récupérer l'historique
   */
  static async fetchHistory(userId: string, limit: number = 20): Promise<BounceBattle[]> {
    const { data, error } = await supabase
      .from('bounce_battles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      logger.error('boss_grit:fetch_history_failed', { userId, error: error.message }, 'BOSS_GRIT');
      throw error;
    }

    return data || [];
  }

  /**
   * Récupérer l'historique avec pagination et filtres
   */
  static async fetchHistoryPaginated(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      mode?: BattleMode;
      status?: 'completed' | 'cancelled' | 'all';
    } = {}
  ): Promise<BattleHistory> {
    const { limit = 20, offset = 0, mode, status = 'all' } = options;

    let query = supabase
      .from('bounce_battles')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (mode) {
      query = query.eq('mode', mode);
    }

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    const battles = data || [];
    const completedBattles = battles.filter(b => b.status === 'completed');

    return {
      battles,
      total_count: count || 0,
      completion_rate: battles.length > 0
        ? (completedBattles.length / battles.length) * 100
        : 0,
      average_duration: completedBattles.length > 0
        ? completedBattles.reduce((sum, b) => sum + (b.duration_seconds || 0), 0) / completedBattles.length
        : 0
    };
  }

  /**
   * Récupérer les réponses d'une bataille
   */
  static async fetchResponses(battleId: string): Promise<CopingResponse[]> {
    const { data, error } = await supabase
      .from('bounce_coping_responses')
      .select('*')
      .eq('battle_id', battleId)
      .order('created_at', { ascending: true });

    if (error) {
      logger.error('boss_grit:fetch_responses_failed', { battleId, error: error.message }, 'BOSS_GRIT');
      throw error;
    }

    return data || [];
  }

  /**
   * Obtenir les statistiques complètes de l'utilisateur
   */
  static async getStats(userId: string): Promise<BattleStats> {
    // Fetch all battles
    const { data: battles, error: battlesError } = await supabase
      .from('bounce_battles')
      .select('*')
      .eq('user_id', userId);

    if (battlesError) throw battlesError;

    const allBattles = battles || [];
    const completedBattles = allBattles.filter(b => b.status === 'completed');

    // Fetch all responses for this user's battles
    const battleIds = allBattles.map(b => b.id);
    let totalResponses = 0;
    let totalResponseValue = 0;

    if (battleIds.length > 0) {
      const { data: responses, error: responsesError } = await supabase
        .from('bounce_coping_responses')
        .select('response_value')
        .in('battle_id', battleIds);

      if (!responsesError && responses) {
        totalResponses = responses.length;
        totalResponseValue = responses.reduce((sum, r) => sum + r.response_value, 0);
      }
    }

    // Calculate modes played
    const modesPlayed = allBattles.reduce((acc, b) => {
      acc[b.mode as BattleMode] = (acc[b.mode as BattleMode] || 0) + 1;
      return acc;
    }, {} as Record<BattleMode, number>);

    // Calculate milestones reached from events
    let milestonesCount = 0;
    if (battleIds.length > 0) {
      const { count } = await supabase
        .from('bounce_events')
        .select('id', { count: 'exact' })
        .in('battle_id', battleIds)
        .eq('event_type', 'milestone_reached');
      milestonesCount = count || 0;
    }

    // Find best time
    const durations = completedBattles
      .map(b => b.duration_seconds)
      .filter((d): d is number => d !== null && d !== undefined);

    return {
      user_id: userId,
      total_battles: allBattles.length,
      completed_battles: completedBattles.length,
      completion_rate: allBattles.length > 0
        ? (completedBattles.length / allBattles.length) * 100
        : 0,
      average_duration_seconds: durations.length > 0
        ? durations.reduce((sum, d) => sum + d, 0) / durations.length
        : 0,
      best_time_seconds: durations.length > 0
        ? Math.min(...durations)
        : 0,
      total_questions_answered: totalResponses,
      average_response_value: totalResponses > 0
        ? totalResponseValue / totalResponses
        : 0,
      modes_played: modesPlayed,
      milestones_reached: milestonesCount,
      last_battle_date: allBattles[0]?.created_at || ''
    };
  }

  /**
   * Obtenir les tendances de résilience
   */
  static async getResilienceTrends(
    userId: string,
    periodDays: number = 30
  ): Promise<{
    scores: Array<{ date: string; score: number }>;
    trend: 'improving' | 'stable' | 'declining';
    averageScore: number;
    improvement: number;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const { data: battles } = await supabase
      .from('bounce_battles')
      .select('created_at, score_data')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    type BattleWithScore = { created_at: string; score_data?: { total_score?: number } };
    const scores = ((battles || []) as BattleWithScore[])
      .filter(b => b.score_data?.total_score !== undefined)
      .map(b => ({
        date: b.created_at.split('T')[0],
        score: b.score_data!.total_score!
      }));

    if (scores.length === 0) {
      return {
        scores: [],
        trend: 'stable',
        averageScore: 0,
        improvement: 0
      };
    }

    const averageScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;

    // Calculate trend
    const firstHalf = scores.slice(0, Math.ceil(scores.length / 2));
    const secondHalf = scores.slice(Math.ceil(scores.length / 2));

    const firstHalfAvg = firstHalf.reduce((sum, s) => sum + s.score, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.length > 0
      ? secondHalf.reduce((sum, s) => sum + s.score, 0) / secondHalf.length
      : firstHalfAvg;

    const improvement = secondHalfAvg - firstHalfAvg;
    let trend: 'improving' | 'stable' | 'declining';

    if (improvement > 5) {
      trend = 'improving';
    } else if (improvement < -5) {
      trend = 'declining';
    } else {
      trend = 'stable';
    }

    return {
      scores,
      trend,
      averageScore: Math.round(averageScore),
      improvement: Math.round(improvement)
    };
  }
}
