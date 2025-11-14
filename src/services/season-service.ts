import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface CompetitiveSeason {
  id: string;
  season_number: number;
  name: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'ended';
  rewards_distributed: boolean;
  created_at: string;
}

export interface SeasonRanking {
  id: string;
  season_id: string;
  user_id: string;
  total_points: number;
  wins: number;
  losses: number;
  tournaments_played: number;
  final_rank: number | null;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster';
  user?: {
    display_name: string;
    avatar_url?: string;
  };
}

export interface SeasonReward {
  id: string;
  season_id: string;
  rank_min: number;
  rank_max: number;
  reward_type: 'xp' | 'cosmetic' | 'title' | 'badge';
  reward_value: number;
  reward_data: Record<string, any>;
  created_at: string;
}

export interface HonoraryTitle {
  id: string;
  user_id: string;
  season_id: string;
  title_name: string;
  title_description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  granted_at: string;
}

class SeasonService {
  async getCurrentSeason(): Promise<CompetitiveSeason | null> {
    try {
      const { data, error } = await supabase
        .from('competitive_seasons')
        .select('*')
        .eq('status', 'active')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching current season', error as Error, 'SeasonService');
      return null;
    }
  }

  async getSeasonHistory(): Promise<CompetitiveSeason[]> {
    try {
      const { data, error } = await supabase
        .from('competitive_seasons')
        .select('*')
        .order('season_number', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching season history', error as Error, 'SeasonService');
      return [];
    }
  }

  async getUserSeasonRanking(seasonId: string): Promise<SeasonRanking | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('season_rankings')
        .select(`
          *,
          user:user_id(display_name, avatar_url)
        `)
        .eq('season_id', seasonId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching user season ranking', error as Error, 'SeasonService');
      return null;
    }
  }

  async getSeasonLeaderboard(
    seasonId: string,
    limit: number = 100
  ): Promise<SeasonRanking[]> {
    try {
      const { data, error } = await supabase
        .from('season_rankings')
        .select(`
          *,
          user:user_id(display_name, avatar_url)
        `)
        .eq('season_id', seasonId)
        .order('total_points', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching season leaderboard', error as Error, 'SeasonService');
      return [];
    }
  }

  async updateUserPoints(seasonId: string, pointsDelta: number): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get current ranking
      const { data: ranking } = await supabase
        .from('season_rankings')
        .select('*')
        .eq('season_id', seasonId)
        .eq('user_id', user.id)
        .single();

      const newPoints = (ranking?.total_points || 0) + pointsDelta;
      const newTier = this.calculateTier(newPoints);

      const { error } = await supabase
        .from('season_rankings')
        .upsert({
          season_id: seasonId,
          user_id: user.id,
          total_points: newPoints,
          tier: newTier,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error updating user points', error as Error, 'SeasonService');
      return false;
    }
  }

  async recordMatchResult(
    seasonId: string,
    won: boolean,
    tournamentId: string
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: ranking } = await supabase
        .from('season_rankings')
        .select('*')
        .eq('season_id', seasonId)
        .eq('user_id', user.id)
        .single();

      const { error } = await supabase
        .from('season_rankings')
        .upsert({
          season_id: seasonId,
          user_id: user.id,
          wins: (ranking?.wins || 0) + (won ? 1 : 0),
          losses: (ranking?.losses || 0) + (won ? 0 : 1),
          tournaments_played: (ranking?.tournaments_played || 0) + 1,
          total_points: (ranking?.total_points || 0) + (won ? 100 : 25),
          tier: this.calculateTier((ranking?.total_points || 0) + (won ? 100 : 25)),
        });

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error recording match result', error as Error, 'SeasonService');
      return false;
    }
  }

  async getSeasonRewards(seasonId: string): Promise<SeasonReward[]> {
    try {
      const { data, error } = await supabase
        .from('season_rewards')
        .select('*')
        .eq('season_id', seasonId)
        .order('rank_min', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching season rewards', error as Error, 'SeasonService');
      return [];
    }
  }

  async getUserHonoraryTitles(): Promise<HonoraryTitle[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('honorary_titles')
        .select('*')
        .eq('user_id', user.id)
        .order('granted_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching honorary titles', error as Error, 'SeasonService');
      return [];
    }
  }

  private calculateTier(points: number): SeasonRanking['tier'] {
    if (points >= 5000) return 'grandmaster';
    if (points >= 4000) return 'master';
    if (points >= 3000) return 'diamond';
    if (points >= 2000) return 'platinum';
    if (points >= 1000) return 'gold';
    if (points >= 500) return 'silver';
    return 'bronze';
  }
}

export const seasonService = new SeasonService();
