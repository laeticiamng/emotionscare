// @ts-nocheck

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  total_score: number;
  weekly_score: number;
  monthly_score: number;
  rank?: number;
  weekly_rank?: number;
  monthly_rank?: number;
  last_updated: string;
}

class LeaderboardService {
  async getGlobalLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    try {
      const { data, error } = await supabase
        .from('music_leaderboard')
        .select('*')
        .order('total_score', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Ajouter les rangs
      return (data || []).map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
    } catch (error) {
      logger.error('Erreur lors de la récupération du leaderboard global', error as Error, 'LeaderboardService');
      return [];
    }
  }

  async getWeeklyLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    try {
      const { data, error } = await supabase
        .from('music_leaderboard')
        .select('*')
        .order('weekly_score', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((entry, index) => ({
        ...entry,
        weekly_rank: index + 1
      }));
    } catch (error) {
      logger.error('Erreur lors de la récupération du leaderboard hebdomadaire', error as Error, 'LeaderboardService');
      return [];
    }
  }

  async getMonthlyLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    try {
      const { data, error } = await supabase
        .from('music_leaderboard')
        .select('*')
        .order('monthly_score', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((entry, index) => ({
        ...entry,
        monthly_rank: index + 1
      }));
    } catch (error) {
      logger.error('Erreur lors de la récupération du leaderboard mensuel', error as Error, 'LeaderboardService');
      return [];
    }
  }

  async getUserRank(): Promise<{ global?: number; weekly?: number; monthly?: number } | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: userEntry } = await supabase
        .from('music_leaderboard')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!userEntry) return null;

      // Calculer le rang global
      const { count: globalRank } = await supabase
        .from('music_leaderboard')
        .select('*', { count: 'exact', head: true })
        .gt('total_score', userEntry.total_score);

      // Calculer le rang hebdomadaire
      const { count: weeklyRank } = await supabase
        .from('music_leaderboard')
        .select('*', { count: 'exact', head: true })
        .gt('weekly_score', userEntry.weekly_score);

      // Calculer le rang mensuel
      const { count: monthlyRank } = await supabase
        .from('music_leaderboard')
        .select('*', { count: 'exact', head: true })
        .gt('monthly_score', userEntry.monthly_score);

      return {
        global: (globalRank || 0) + 1,
        weekly: (weeklyRank || 0) + 1,
        monthly: (monthlyRank || 0) + 1
      };
    } catch (error) {
      logger.error('Erreur lors de la récupération du rang utilisateur', error as Error, 'LeaderboardService');
      return null;
    }
  }
}

export const leaderboardService = new LeaderboardService();
