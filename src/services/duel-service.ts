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
}

export const duelService = new DuelService();
