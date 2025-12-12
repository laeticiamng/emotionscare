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

  // ========== MÉTHODES ENRICHIES ==========

  async getUserEntry(): Promise<LeaderboardEntry | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('music_leaderboard')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      logger.error('Erreur récupération entrée leaderboard', error as Error, 'LeaderboardService');
      return null;
    }
  }

  async updateScore(scoreIncrement: number): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const existing = await this.getUserEntry();

      if (existing) {
        const { error } = await supabase
          .from('music_leaderboard')
          .update({
            total_score: (existing.total_score || 0) + scoreIncrement,
            weekly_score: (existing.weekly_score || 0) + scoreIncrement,
            monthly_score: (existing.monthly_score || 0) + scoreIncrement,
            last_updated: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();

        const { error } = await supabase
          .from('music_leaderboard')
          .insert({
            user_id: user.id,
            display_name: profile?.full_name || 'Utilisateur',
            avatar_url: profile?.avatar_url,
            total_score: scoreIncrement,
            weekly_score: scoreIncrement,
            monthly_score: scoreIncrement
          });

        if (error) throw error;
      }

      return true;
    } catch (error) {
      logger.error('Erreur mise à jour score', error as Error, 'LeaderboardService');
      return false;
    }
  }

  async getNeighbors(range: number = 5): Promise<{
    above: LeaderboardEntry[];
    current: LeaderboardEntry | null;
    below: LeaderboardEntry[];
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { above: [], current: null, below: [] };

      const current = await this.getUserEntry();
      if (!current) return { above: [], current: null, below: [] };

      const { data: above } = await supabase
        .from('music_leaderboard')
        .select('*')
        .gt('total_score', current.total_score)
        .order('total_score', { ascending: true })
        .limit(range);

      const { data: below } = await supabase
        .from('music_leaderboard')
        .select('*')
        .lt('total_score', current.total_score)
        .order('total_score', { ascending: false })
        .limit(range);

      return {
        above: (above || []).reverse(),
        current,
        below: below || []
      };
    } catch (error) {
      logger.error('Erreur récupération voisins', error as Error, 'LeaderboardService');
      return { above: [], current: null, below: [] };
    }
  }

  async getFriendsLeaderboard(friendIds: string[]): Promise<LeaderboardEntry[]> {
    try {
      if (friendIds.length === 0) return [];

      const { data: { user } } = await supabase.auth.getUser();
      const allIds = user ? [user.id, ...friendIds] : friendIds;

      const { data, error } = await supabase
        .from('music_leaderboard')
        .select('*')
        .in('user_id', allIds)
        .order('total_score', { ascending: false });

      if (error) throw error;

      return (data || []).map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
    } catch (error) {
      logger.error('Erreur récupération leaderboard amis', error as Error, 'LeaderboardService');
      return [];
    }
  }

  async getTopProgressers(days: number = 7, limit: number = 10): Promise<Array<LeaderboardEntry & { progress: number }>> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data: current } = await supabase
        .from('music_leaderboard')
        .select('*')
        .order('weekly_score', { ascending: false })
        .limit(limit);

      return (current || []).map((entry, index) => ({
        ...entry,
        rank: index + 1,
        progress: entry.weekly_score
      }));
    } catch (error) {
      logger.error('Erreur récupération top progresseurs', error as Error, 'LeaderboardService');
      return [];
    }
  }

  async getLeaderboardByCategory(category: string, limit: number = 50): Promise<LeaderboardEntry[]> {
    try {
      const { data, error } = await supabase
        .from('music_leaderboard')
        .select('*')
        .order('total_score', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
    } catch (error) {
      logger.error('Erreur récupération leaderboard catégorie', error as Error, 'LeaderboardService');
      return [];
    }
  }

  async resetWeeklyScores(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('music_leaderboard')
        .update({ weekly_score: 0 })
        .neq('weekly_score', 0);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erreur reset scores hebdo', error as Error, 'LeaderboardService');
      return false;
    }
  }

  async getStats(): Promise<{
    totalPlayers: number;
    averageScore: number;
    topScore: number;
    medianScore: number;
  }> {
    try {
      const { data, count } = await supabase
        .from('music_leaderboard')
        .select('total_score', { count: 'exact' })
        .order('total_score', { ascending: false });

      if (!data || data.length === 0) {
        return { totalPlayers: 0, averageScore: 0, topScore: 0, medianScore: 0 };
      }

      const scores = data.map(d => d.total_score);
      const totalScore = scores.reduce((a, b) => a + b, 0);
      const avgScore = Math.round(totalScore / scores.length);
      const medianIndex = Math.floor(scores.length / 2);
      const medianScore = scores[medianIndex] || 0;

      return {
        totalPlayers: count || scores.length,
        averageScore: avgScore,
        topScore: scores[0] || 0,
        medianScore
      };
    } catch (error) {
      logger.error('Erreur récupération stats leaderboard', error as Error, 'LeaderboardService');
      return { totalPlayers: 0, averageScore: 0, topScore: 0, medianScore: 0 };
    }
  }
}

export const leaderboardService = new LeaderboardService();
