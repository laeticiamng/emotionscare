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
    _tournamentId: string
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

  // ========== MÉTHODES ENRICHIES ==========

  async getSeasonById(seasonId: string): Promise<CompetitiveSeason | null> {
    try {
      const { data, error } = await supabase
        .from('competitive_seasons')
        .select('*')
        .eq('id', seasonId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching season', error as Error, 'SeasonService');
      return null;
    }
  }

  async getUpcomingSeason(): Promise<CompetitiveSeason | null> {
    try {
      const { data, error } = await supabase
        .from('competitive_seasons')
        .select('*')
        .eq('status', 'upcoming')
        .order('start_date', { ascending: true })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching upcoming season', error as Error, 'SeasonService');
      return null;
    }
  }

  async getSeasonProgress(): Promise<{
    daysRemaining: number;
    daysElapsed: number;
    totalDays: number;
    percentComplete: number;
  } | null> {
    try {
      const season = await this.getCurrentSeason();
      if (!season) return null;

      const start = new Date(season.start_date);
      const end = new Date(season.end_date);
      const now = new Date();

      const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const daysElapsed = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, totalDays - daysElapsed);
      const percentComplete = Math.min(100, Math.round((daysElapsed / totalDays) * 100));

      return { daysRemaining, daysElapsed, totalDays, percentComplete };
    } catch (error) {
      logger.error('Error calculating season progress', error as Error, 'SeasonService');
      return null;
    }
  }

  async getTierLeaderboard(tier: SeasonRanking['tier'], limit: number = 50): Promise<SeasonRanking[]> {
    try {
      const season = await this.getCurrentSeason();
      if (!season) return [];

      const { data, error } = await supabase
        .from('season_rankings')
        .select(`*, user:user_id(display_name, avatar_url)`)
        .eq('season_id', season.id)
        .eq('tier', tier)
        .order('total_points', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching tier leaderboard', error as Error, 'SeasonService');
      return [];
    }
  }

  async getUserSeasonStats(): Promise<{
    currentTier: SeasonRanking['tier'];
    totalPoints: number;
    rank: number;
    wins: number;
    losses: number;
    winRate: number;
    pointsToNextTier: number;
    nextTier: SeasonRanking['tier'] | null;
  } | null> {
    try {
      const season = await this.getCurrentSeason();
      if (!season) return null;

      const ranking = await this.getUserSeasonRanking(season.id);
      if (!ranking) return {
        currentTier: 'bronze', totalPoints: 0, rank: 0, wins: 0, losses: 0,
        winRate: 0, pointsToNextTier: 500, nextTier: 'silver'
      };

      const tierThresholds: Record<SeasonRanking['tier'], number> = {
        bronze: 0, silver: 500, gold: 1000, platinum: 2000,
        diamond: 3000, master: 4000, grandmaster: 5000
      };

      const tiers: SeasonRanking['tier'][] = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster'];
      const currentIndex = tiers.indexOf(ranking.tier);
      const nextTier = currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
      const pointsToNextTier = nextTier ? tierThresholds[nextTier] - ranking.total_points : 0;

      // Get rank
      const leaderboard = await this.getSeasonLeaderboard(season.id);
      const rank = leaderboard.findIndex(r => r.user_id === ranking.user_id) + 1;

      const totalMatches = ranking.wins + ranking.losses;
      const winRate = totalMatches > 0 ? Math.round((ranking.wins / totalMatches) * 100) : 0;

      return {
        currentTier: ranking.tier,
        totalPoints: ranking.total_points,
        rank,
        wins: ranking.wins,
        losses: ranking.losses,
        winRate,
        pointsToNextTier: Math.max(0, pointsToNextTier),
        nextTier
      };
    } catch (error) {
      logger.error('Error fetching user season stats', error as Error, 'SeasonService');
      return null;
    }
  }

  async claimSeasonRewards(seasonId: string): Promise<{
    success: boolean;
    rewards: SeasonReward[];
    xpEarned: number;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { success: false, rewards: [], xpEarned: 0 };

      const ranking = await this.getUserSeasonRanking(seasonId);
      if (!ranking || !ranking.final_rank) return { success: false, rewards: [], xpEarned: 0 };

      const rewards = await this.getSeasonRewards(seasonId);
      const eligibleRewards = rewards.filter(r =>
        ranking.final_rank! >= r.rank_min && ranking.final_rank! <= r.rank_max
      );

      const xpEarned = eligibleRewards
        .filter(r => r.reward_type === 'xp')
        .reduce((sum, r) => sum + r.reward_value, 0);

      return { success: true, rewards: eligibleRewards, xpEarned };
    } catch (error) {
      logger.error('Error claiming season rewards', error as Error, 'SeasonService');
      return { success: false, rewards: [], xpEarned: 0 };
    }
  }

  async getSeasonAchievements(seasonId: string): Promise<Array<{
    id: string;
    title: string;
    description: string;
    progress: number;
    target: number;
    completed: boolean;
  }>> {
    const achievements = [
      { id: 'first_win', title: 'Première victoire', description: 'Gagnez votre premier match de la saison', target: 1, type: 'wins' },
      { id: 'win_streak_3', title: 'Série de victoires', description: 'Gagnez 3 matchs consécutifs', target: 3, type: 'streak' },
      { id: 'points_100', title: 'Centurion', description: 'Accumulez 100 points', target: 100, type: 'points' },
      { id: 'points_500', title: 'Demi-millénaire', description: 'Accumulez 500 points', target: 500, type: 'points' },
      { id: 'reach_silver', title: 'Rang Argent', description: 'Atteignez le rang Argent', target: 500, type: 'tier' },
      { id: 'reach_gold', title: 'Rang Or', description: 'Atteignez le rang Or', target: 1000, type: 'tier' }
    ];

    try {
      const ranking = await this.getUserSeasonRanking(seasonId);
      if (!ranking) {
        return achievements.map(a => ({
          id: a.id, title: a.title, description: a.description,
          progress: 0, target: a.target, completed: false
        }));
      }

      return achievements.map(a => {
        let progress = 0;
        if (a.type === 'wins') progress = ranking.wins;
        else if (a.type === 'points' || a.type === 'tier') progress = ranking.total_points;
        else if (a.type === 'streak') progress = Math.min(ranking.wins, 3);

        return {
          id: a.id,
          title: a.title,
          description: a.description,
          progress,
          target: a.target,
          completed: progress >= a.target
        };
      });
    } catch (error) {
      logger.error('Error fetching season achievements', error as Error, 'SeasonService');
      return [];
    }
  }

  async getNeighborRanks(seasonId: string, range: number = 3): Promise<{
    above: SeasonRanking[];
    current: SeasonRanking | null;
    below: SeasonRanking[];
  }> {
    try {
      const current = await this.getUserSeasonRanking(seasonId);
      if (!current) return { above: [], current: null, below: [] };

      const { data: above } = await supabase
        .from('season_rankings')
        .select(`*, user:user_id(display_name, avatar_url)`)
        .eq('season_id', seasonId)
        .gt('total_points', current.total_points)
        .order('total_points', { ascending: true })
        .limit(range);

      const { data: below } = await supabase
        .from('season_rankings')
        .select(`*, user:user_id(display_name, avatar_url)`)
        .eq('season_id', seasonId)
        .lt('total_points', current.total_points)
        .order('total_points', { ascending: false })
        .limit(range);

      return {
        above: (above || []).reverse(),
        current,
        below: below || []
      };
    } catch (error) {
      logger.error('Error fetching neighbor ranks', error as Error, 'SeasonService');
      return { above: [], current: null, below: [] };
    }
  }

  async setActiveTitle(titleId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      await supabase
        .from('profiles')
        .update({ active_title_id: titleId })
        .eq('id', user.id);

      return true;
    } catch (error) {
      logger.error('Error setting active title', error as Error, 'SeasonService');
      return false;
    }
  }

  async getTierInfo(tier: SeasonRanking['tier']): Promise<{
    name: string;
    minPoints: number;
    maxPoints: number;
    color: string;
    icon: string;
    benefits: string[];
  }> {
    const tierData: Record<SeasonRanking['tier'], any> = {
      bronze: { name: 'Bronze', minPoints: 0, maxPoints: 499, color: '#CD7F32', icon: '🥉', benefits: ['Accès de base'] },
      silver: { name: 'Argent', minPoints: 500, maxPoints: 999, color: '#C0C0C0', icon: '🥈', benefits: ['Badge Argent', '+5% XP bonus'] },
      gold: { name: 'Or', minPoints: 1000, maxPoints: 1999, color: '#FFD700', icon: '🥇', benefits: ['Badge Or', '+10% XP bonus', 'Cosmétique exclusif'] },
      platinum: { name: 'Platine', minPoints: 2000, maxPoints: 2999, color: '#E5E4E2', icon: '💎', benefits: ['Badge Platine', '+15% XP bonus', 'Avatar exclusif'] },
      diamond: { name: 'Diamant', minPoints: 3000, maxPoints: 3999, color: '#B9F2FF', icon: '💠', benefits: ['Badge Diamant', '+20% XP bonus', 'Titre spécial'] },
      master: { name: 'Maître', minPoints: 4000, maxPoints: 4999, color: '#9932CC', icon: '👑', benefits: ['Badge Maître', '+25% XP bonus', 'Accès VIP'] },
      grandmaster: { name: 'Grand Maître', minPoints: 5000, maxPoints: Infinity, color: '#FF4500', icon: '🏆', benefits: ['Badge Grand Maître', '+30% XP bonus', 'Hall of Fame'] }
    };

    return tierData[tier];
  }
}

export const seasonService = new SeasonService();
