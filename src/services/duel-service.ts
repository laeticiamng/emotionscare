import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface Duel {
  id: string;
  challenger_id: string;
  challenged_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  duel_type: 'xp_race' | 'quest_sprint' | 'streak_battle';
  duration_hours: number;
  challenger_score: number;
  challenged_score: number;
  winner_id: string | null;
  reward_xp: number;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  challenger?: {
    id: string;
    display_name: string;
    avatar_url?: string;
  };
  challenged?: {
    id: string;
    display_name: string;
    avatar_url?: string;
  };
}

class DuelService {
  async challengeUser(
    challengedId: string,
    duelType: Duel['duel_type'],
    durationHours: number = 24
  ): Promise<Duel | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_duels')
        .insert({
          challenger_id: user.id,
          challenged_id: challengedId,
          duel_type: duelType,
          duration_hours: durationHours,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error creating duel', error as Error, 'DuelService');
      return null;
    }
  }

  async respondToDuel(duelId: string, accept: boolean): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const updateData: any = {
        status: accept ? 'accepted' : 'declined',
      };

      if (accept) {
        updateData.started_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('user_duels')
        .update(updateData)
        .eq('id', duelId)
        .eq('challenged_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error responding to duel', error as Error, 'DuelService');
      return false;
    }
  }

  async getUserDuels(): Promise<Duel[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_duels')
        .select(`
          *,
          challenger:challenger_id(id, display_name, avatar_url),
          challenged:challenged_id(id, display_name, avatar_url)
        `)
        .or(`challenger_id.eq.${user.id},challenged_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching user duels', error as Error, 'DuelService');
      return [];
    }
  }

  async updateDuelScore(duelId: string, score: number): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get duel to check user role
      const { data: duel, error: fetchError } = await supabase
        .from('user_duels')
        .select('*')
        .eq('id', duelId)
        .single();

      if (fetchError) throw fetchError;

      const isChallenger = duel.challenger_id === user.id;
      const updateField = isChallenger ? 'challenger_score' : 'challenged_score';

      const { error } = await supabase
        .from('user_duels')
        .update({ [updateField]: score })
        .eq('id', duelId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error updating duel score', error as Error, 'DuelService');
      return false;
    }
  }

  async completeDuel(duelId: string): Promise<boolean> {
    try {
      const { data: duel, error: fetchError } = await supabase
        .from('user_duels')
        .select('*')
        .eq('id', duelId)
        .single();

      if (fetchError) throw fetchError;

      const winnerId = duel.challenger_score > duel.challenged_score
        ? duel.challenger_id
        : duel.challenged_id;

      const { error } = await supabase
        .from('user_duels')
        .update({
          status: 'completed',
          winner_id: winnerId,
          completed_at: new Date().toISOString(),
        })
        .eq('id', duelId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error completing duel', error as Error, 'DuelService');
      return false;
    }
  }

  // ========== MÉTHODES ENRICHIES ==========

  async getActiveDuels(): Promise<Duel[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_duels')
        .select(`
          *,
          challenger:challenger_id(id, display_name, avatar_url),
          challenged:challenged_id(id, display_name, avatar_url)
        `)
        .or(`challenger_id.eq.${user.id},challenged_id.eq.${user.id}`)
        .in('status', ['pending', 'accepted'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching active duels', error as Error, 'DuelService');
      return [];
    }
  }

  async getPendingChallenges(): Promise<Duel[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_duels')
        .select(`
          *,
          challenger:challenger_id(id, display_name, avatar_url)
        `)
        .eq('challenged_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching pending challenges', error as Error, 'DuelService');
      return [];
    }
  }

  async getDuelHistory(limit: number = 20): Promise<Duel[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_duels')
        .select(`
          *,
          challenger:challenger_id(id, display_name, avatar_url),
          challenged:challenged_id(id, display_name, avatar_url)
        `)
        .or(`challenger_id.eq.${user.id},challenged_id.eq.${user.id}`)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching duel history', error as Error, 'DuelService');
      return [];
    }
  }

  async getDuelStats(): Promise<{
    totalDuels: number;
    wins: number;
    losses: number;
    winRate: number;
    totalXpEarned: number;
    currentStreak: number;
    bestStreak: number;
    favoriteType: Duel['duel_type'] | null;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return {
        totalDuels: 0, wins: 0, losses: 0, winRate: 0, totalXpEarned: 0,
        currentStreak: 0, bestStreak: 0, favoriteType: null
      };

      const { data: duels } = await supabase
        .from('user_duels')
        .select('*')
        .or(`challenger_id.eq.${user.id},challenged_id.eq.${user.id}`)
        .eq('status', 'completed');

      const completed = duels || [];
      const wins = completed.filter(d => d.winner_id === user.id).length;
      const losses = completed.length - wins;
      const totalXp = completed
        .filter(d => d.winner_id === user.id)
        .reduce((sum, d) => sum + (d.reward_xp || 0), 0);

      // Calculate streak
      const sorted = completed.sort((a, b) =>
        new Date(b.completed_at || 0).getTime() - new Date(a.completed_at || 0).getTime()
      );
      let currentStreak = 0;
      let bestStreak = 0;
      let tempStreak = 0;

      for (const duel of sorted) {
        if (duel.winner_id === user.id) {
          tempStreak++;
          if (currentStreak === 0 || currentStreak === tempStreak - 1) {
            currentStreak = tempStreak;
          }
          bestStreak = Math.max(bestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }

      // Favorite type
      const typeCounts: Record<string, number> = {};
      completed.forEach(d => {
        typeCounts[d.duel_type] = (typeCounts[d.duel_type] || 0) + 1;
      });
      const [favoriteType] = Object.entries(typeCounts)
        .sort((a, b) => b[1] - a[1])[0] || [null];

      return {
        totalDuels: completed.length,
        wins,
        losses,
        winRate: completed.length > 0 ? Math.round((wins / completed.length) * 100) : 0,
        totalXpEarned: totalXp,
        currentStreak,
        bestStreak,
        favoriteType: favoriteType as Duel['duel_type'] | null
      };
    } catch (error) {
      logger.error('Error fetching duel stats', error as Error, 'DuelService');
      return {
        totalDuels: 0, wins: 0, losses: 0, winRate: 0, totalXpEarned: 0,
        currentStreak: 0, bestStreak: 0, favoriteType: null
      };
    }
  }

  async cancelDuel(duelId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_duels')
        .update({ status: 'cancelled' })
        .eq('id', duelId)
        .eq('challenger_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error cancelling duel', error as Error, 'DuelService');
      return false;
    }
  }

  async getDuelById(duelId: string): Promise<Duel | null> {
    try {
      const { data, error } = await supabase
        .from('user_duels')
        .select(`
          *,
          challenger:challenger_id(id, display_name, avatar_url),
          challenged:challenged_id(id, display_name, avatar_url)
        `)
        .eq('id', duelId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching duel', error as Error, 'DuelService');
      return null;
    }
  }

  async getRemainingTime(duelId: string): Promise<number> {
    try {
      const duel = await this.getDuelById(duelId);
      if (!duel || !duel.started_at) return 0;

      const startTime = new Date(duel.started_at).getTime();
      const endTime = startTime + (duel.duration_hours * 60 * 60 * 1000);
      const remaining = endTime - Date.now();

      return Math.max(0, Math.floor(remaining / 1000));
    } catch (error) {
      logger.error('Error calculating remaining time', error as Error, 'DuelService');
      return 0;
    }
  }

  async claimReward(duelId: string): Promise<{ success: boolean; xp: number }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { success: false, xp: 0 };

      const duel = await this.getDuelById(duelId);
      if (!duel || duel.winner_id !== user.id) return { success: false, xp: 0 };

      const xp = duel.reward_xp || 50;
      return { success: true, xp };
    } catch (error) {
      logger.error('Error claiming reward', error as Error, 'DuelService');
      return { success: false, xp: 0 };
    }
  }

  async getRecentOpponents(limit: number = 5): Promise<Array<{ id: string; display_name: string; avatar_url?: string; duels: number }>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: duels } = await supabase
        .from('user_duels')
        .select(`
          challenger_id,
          challenged_id,
          challenger:challenger_id(id, display_name, avatar_url),
          challenged:challenged_id(id, display_name, avatar_url)
        `)
        .or(`challenger_id.eq.${user.id},challenged_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(50);

      const opponentCounts: Record<string, { info: any; count: number }> = {};

      (duels || []).forEach(d => {
        const opponentId = d.challenger_id === user.id ? d.challenged_id : d.challenger_id;
        const opponentInfo = d.challenger_id === user.id ? d.challenged : d.challenger;

        if (!opponentCounts[opponentId]) {
          opponentCounts[opponentId] = { info: opponentInfo, count: 0 };
        }
        opponentCounts[opponentId].count++;
      });

      return Object.entries(opponentCounts)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, limit)
        .map(([id, { info, count }]) => ({
          id,
          display_name: info?.display_name || 'Unknown',
          avatar_url: info?.avatar_url,
          duels: count
        }));
    } catch (error) {
      logger.error('Error fetching recent opponents', error as Error, 'DuelService');
      return [];
    }
  }

  subscribeToDuel(duelId: string, callback: (payload: any) => void): () => void {
    const channel = supabase
      .channel(`duel:${duelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_duels',
          filter: `id=eq.${duelId}`,
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

export const duelService = new DuelService();
