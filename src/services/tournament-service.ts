import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface Tournament {
  id: string;
  name: string;
  description: string | null;
  tournament_type: 'weekly_xp' | 'monthly_challenge' | 'special_event';
  start_date: string;
  end_date: string;
  registration_start: string;
  registration_end: string;
  max_participants: number;
  current_participants: number;
  status: 'upcoming' | 'registration' | 'in_progress' | 'completed' | 'cancelled';
  prize_pool: any[];
  rules: Record<string, any>;
  bracket_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface TournamentRegistration {
  id: string;
  tournament_id: string;
  user_id: string;
  seed_position: number | null;
  registration_date: string;
  status: 'registered' | 'confirmed' | 'withdrawn' | 'disqualified';
}

export interface TournamentMatch {
  id: string;
  tournament_id: string;
  round_number: number;
  match_number: number;
  player1_id: string | null;
  player2_id: string | null;
  player1_score: number;
  player2_score: number;
  winner_id: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'forfeit';
  scheduled_time: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  player1?: {
    display_name: string;
    avatar_url?: string;
  };
  player2?: {
    display_name: string;
    avatar_url?: string;
  };
}

class TournamentService {
  async getTournaments(status?: Tournament['status']): Promise<Tournament[]> {
    try {
      let query = supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching tournaments', error as Error, 'TournamentService');
      return [];
    }
  }

  async getTournamentById(tournamentId: string): Promise<Tournament | null> {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching tournament', error as Error, 'TournamentService');
      return null;
    }
  }

  async registerForTournament(tournamentId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('tournament_registrations')
        .insert({
          tournament_id: tournamentId,
          user_id: user.id,
          status: 'registered',
        });

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error registering for tournament', error as Error, 'TournamentService');
      return false;
    }
  }

  async withdrawFromTournament(tournamentId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('tournament_registrations')
        .update({ status: 'withdrawn' })
        .eq('tournament_id', tournamentId)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error withdrawing from tournament', error as Error, 'TournamentService');
      return false;
    }
  }

  async getTournamentParticipants(tournamentId: string): Promise<TournamentRegistration[]> {
    try {
      const { data, error } = await supabase
        .from('tournament_registrations')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('seed_position', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching participants', error as Error, 'TournamentService');
      return [];
    }
  }

  async getTournamentMatches(tournamentId: string, round?: number): Promise<TournamentMatch[]> {
    try {
      let query = supabase
        .from('tournament_matches')
        .select(`
          *,
          player1:player1_id(display_name, avatar_url),
          player2:player2_id(display_name, avatar_url)
        `)
        .eq('tournament_id', tournamentId);

      if (round) {
        query = query.eq('round_number', round);
      }

      query = query.order('round_number', { ascending: true })
        .order('match_number', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching matches', error as Error, 'TournamentService');
      return [];
    }
  }

  async getUserMatches(tournamentId: string): Promise<TournamentMatch[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('tournament_matches')
        .select(`
          *,
          player1:player1_id(display_name, avatar_url),
          player2:player2_id(display_name, avatar_url)
        `)
        .eq('tournament_id', tournamentId)
        .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
        .order('round_number', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching user matches', error as Error, 'TournamentService');
      return [];
    }
  }

  async startMatch(matchId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tournament_matches')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .eq('id', matchId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error starting match', error as Error, 'TournamentService');
      return false;
    }
  }

  async updateMatchScore(matchId: string, player1Score: number, player2Score: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tournament_matches')
        .update({
          player1_score: player1Score,
          player2_score: player2Score,
        })
        .eq('id', matchId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error updating match score', error as Error, 'TournamentService');
      return false;
    }
  }

  async completeMatch(matchId: string, winnerId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tournament_matches')
        .update({
          status: 'completed',
          winner_id: winnerId,
          completed_at: new Date().toISOString(),
        })
        .eq('id', matchId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error completing match', error as Error, 'TournamentService');
      return false;
    }
  }

  async isUserRegistered(tournamentId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('tournament_registrations')
        .select('id')
        .eq('tournament_id', tournamentId)
        .eq('user_id', user.id)
        .in('status', ['registered', 'confirmed'])
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      logger.error('Error checking registration', error as Error, 'TournamentService');
      return false;
    }
  }

  subscribeToTournamentUpdates(tournamentId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`tournament:${tournamentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tournament_matches',
          filter: `tournament_id=eq.${tournamentId}`,
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

export const tournamentService = new TournamentService();
