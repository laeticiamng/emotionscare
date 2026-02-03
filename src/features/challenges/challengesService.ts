/**
 * Service pour la gestion des challenges
 */

import { supabase } from '@/integrations/supabase/client';

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  challenge_type: string;
  target_value: number;
  xp_reward: number;
  badge_reward: string | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  challenge_type: string;
  target_value: number;
  xp_reward: number;
  is_active: boolean;
  created_at: string;
}

export interface ChallengeProgress {
  challenge_id: string;
  user_id: string;
  current_value: number;
  completed: boolean;
  completed_at: string | null;
}

export interface ChallengeStats {
  totalCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalXpEarned: number;
  badgesEarned: string[];
}

export class ChallengesService {
  /**
   * Récupérer les défis hebdomadaires actifs
   */
  static async getActiveWeeklyChallenges(): Promise<WeeklyChallenge[]> {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('weekly_challenges')
      .select('*')
      .eq('is_active', true)
      .lte('starts_at', now)
      .gte('ends_at', now)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as WeeklyChallenge[];
  }

  /**
   * Récupérer les défis quotidiens actifs
   */
  static async getActiveDailyChallenges(): Promise<DailyChallenge[]> {
    const { data, error } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as DailyChallenge[];
  }

  /**
   * Récupérer la progression de l'utilisateur
   */
  static async getUserProgress(userId: string): Promise<Map<string, ChallengeProgress>> {
    const { data, error } = await supabase
      .from('user_weekly_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    const progressMap = new Map<string, ChallengeProgress>();
    (data || []).forEach((p: ChallengeProgress) => {
      progressMap.set(p.challenge_id, p);
    });

    return progressMap;
  }

  /**
   * Mettre à jour la progression
   */
  static async updateProgress(
    userId: string,
    challengeId: string,
    increment: number = 1
  ): Promise<ChallengeProgress> {
    // Récupérer la progression actuelle
    const { data: existing } = await supabase
      .from('user_weekly_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('challenge_id', challengeId)
      .single();

    const currentValue = (existing?.current_value || 0) + increment;

    // Récupérer le challenge pour vérifier la complétion
    const { data: challenge } = await supabase
      .from('weekly_challenges')
      .select('target_value')
      .eq('id', challengeId)
      .single();

    const completed = challenge ? currentValue >= challenge.target_value : false;

    if (existing) {
      // Mettre à jour
      const { data, error } = await supabase
        .from('user_weekly_progress')
        .update({
          current_value: currentValue,
          completed,
          completed_at: completed ? new Date().toISOString() : null
        })
        .eq('user_id', userId)
        .eq('challenge_id', challengeId)
        .select()
        .single();

      if (error) throw error;
      return data as ChallengeProgress;
    } else {
      // Créer
      const { data, error } = await supabase
        .from('user_weekly_progress')
        .insert({
          user_id: userId,
          challenge_id: challengeId,
          current_value: currentValue,
          completed,
          completed_at: completed ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) throw error;
      return data as ChallengeProgress;
    }
  }

  /**
   * Réclamer la récompense d'un challenge complété
   */
  static async claimReward(
    userId: string,
    challengeId: string
  ): Promise<{ xp: number; badge: string | null }> {
    // Vérifier que le challenge est complété
    const { data: progress } = await supabase
      .from('user_weekly_progress')
      .select('completed, completed_at')
      .eq('user_id', userId)
      .eq('challenge_id', challengeId)
      .single();

    if (!progress?.completed) {
      throw new Error('Challenge not completed');
    }

    if (progress.completed_at) {
      throw new Error('Reward already claimed');
    }

    // Récupérer les récompenses
    const { data: challenge } = await supabase
      .from('weekly_challenges')
      .select('xp_reward, badge_reward')
      .eq('id', challengeId)
      .single();

    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Marquer comme réclamé
    await supabase
      .from('user_weekly_progress')
      .update({ completed_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('challenge_id', challengeId);

    // Ajouter XP à l'utilisateur
    await supabase.rpc('add_user_xp', {
      p_user_id: userId,
      p_xp_amount: challenge.xp_reward,
      p_source: 'challenge'
    });

    return {
      xp: challenge.xp_reward,
      badge: challenge.badge_reward
    };
  }

  /**
   * Récupérer les challenges complétés
   */
  static async getCompletedChallenges(userId: string): Promise<WeeklyChallenge[]> {
    const { data, error } = await supabase
      .from('user_weekly_progress')
      .select(`
        challenge_id,
        completed_at,
        weekly_challenges (*)
      `)
      .eq('user_id', userId)
      .eq('completed', true);

    if (error) throw error;

    return (data || [])
      .map((p: any) => p.weekly_challenges)
      .filter(Boolean) as WeeklyChallenge[];
  }

  /**
   * Obtenir les statistiques des challenges
   */
  static async getChallengeStats(userId: string): Promise<ChallengeStats> {
    const { data: progress, error } = await supabase
      .from('user_weekly_progress')
      .select(`
        completed,
        completed_at,
        weekly_challenges (xp_reward, badge_reward)
      `)
      .eq('user_id', userId);

    if (error) throw error;

    const completed = (progress || []).filter((p: any) => p.completed);
    const totalXpEarned = completed.reduce((sum: number, p: any) => {
      return sum + (p.weekly_challenges?.xp_reward || 0);
    }, 0);

    const badgesEarned = completed
      .map((p: any) => p.weekly_challenges?.badge_reward)
      .filter(Boolean);

    // Calculer le streak (simplifié)
    const sortedCompleted = completed
      .filter((p: any) => p.completed_at)
      .sort((a: any, b: any) => 
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
      );

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < sortedCompleted.length; i++) {
      const current = new Date(sortedCompleted[i].completed_at);
      const prev = i > 0 ? new Date(sortedCompleted[i - 1].completed_at) : null;

      if (prev) {
        const diff = Math.abs(current.getTime() - prev.getTime());
        const daysDiff = diff / (1000 * 60 * 60 * 24);

        if (daysDiff <= 7) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);
    currentStreak = tempStreak;

    return {
      totalCompleted: completed.length,
      currentStreak,
      longestStreak,
      totalXpEarned,
      badgesEarned
    };
  }

  /**
   * Créer un défi personnalisé
   */
  static async createCustomChallenge(
    userId: string,
    challenge: {
      title: string;
      description: string;
      challenge_type: string;
      target_value: number;
      duration_days: number;
    }
  ): Promise<WeeklyChallenge> {
    const starts_at = new Date().toISOString();
    const ends_at = new Date(
      Date.now() + challenge.duration_days * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data, error } = await supabase
      .from('weekly_challenges')
      .insert({
        ...challenge,
        starts_at,
        ends_at,
        is_active: true,
        xp_reward: Math.round(challenge.target_value * 10),
        created_by: userId
      })
      .select()
      .single();

    if (error) throw error;
    return data as WeeklyChallenge;
  }
}
