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

  async getMatch(matchId: string): Promise<TournamentMatch | null> {
    try {
      const { data, error } = await supabase
        .from('tournament_matches')
        .select(`
          *,
          player1:player1_id(display_name, avatar_url),
          player2:player2_id(display_name, avatar_url)
        `)
        .eq('id', matchId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching match', error as Error, 'TournamentService');
      return null;
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

  // ========== MÉTHODES ENRICHIES ==========

  async getUpcomingTournaments(): Promise<Tournament[]> {
    return this.getTournaments('upcoming');
  }

  async getActiveTournaments(): Promise<Tournament[]> {
    return this.getTournaments('in_progress');
  }

  async getRegistrationOpenTournaments(): Promise<Tournament[]> {
    return this.getTournaments('registration');
  }

  async getUserTournamentHistory(): Promise<Array<{
    tournament: Tournament;
    registration: TournamentRegistration;
    placement?: number;
  }>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('tournament_registrations')
        .select(`
          *,
          tournament:tournaments(*)
        `)
        .eq('user_id', user.id)
        .order('registration_date', { ascending: false });

      if (error) throw error;

      return (data || []).map(reg => ({
        tournament: reg.tournament as Tournament,
        registration: reg,
        placement: reg.seed_position
      }));
    } catch (error) {
      logger.error('Error fetching user tournament history', error as Error, 'TournamentService');
      return [];
    }
  }

  async getTournamentStats(tournamentId: string): Promise<{
    totalParticipants: number;
    matchesPlayed: number;
    matchesRemaining: number;
    currentRound: number;
    totalRounds: number;
  }> {
    try {
      const [participants, matches] = await Promise.all([
        this.getTournamentParticipants(tournamentId),
        this.getTournamentMatches(tournamentId)
      ]);

      const completedMatches = matches.filter(m => m.status === 'completed');
      const maxRound = Math.max(...matches.map(m => m.round_number), 0);
      const currentRound = Math.max(...completedMatches.map(m => m.round_number), 1);
      const totalRounds = Math.ceil(Math.log2(participants.length || 1));

      return {
        totalParticipants: participants.length,
        matchesPlayed: completedMatches.length,
        matchesRemaining: matches.length - completedMatches.length,
        currentRound,
        totalRounds: totalRounds || maxRound
      };
    } catch (error) {
      logger.error('Error fetching tournament stats', error as Error, 'TournamentService');
      return {
        totalParticipants: 0, matchesPlayed: 0, matchesRemaining: 0,
        currentRound: 0, totalRounds: 0
      };
    }
  }

  async getUserCurrentMatch(tournamentId: string): Promise<TournamentMatch | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('tournament_matches')
        .select(`
          *,
          player1:player1_id(display_name, avatar_url),
          player2:player2_id(display_name, avatar_url)
        `)
        .eq('tournament_id', tournamentId)
        .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
        .in('status', ['pending', 'in_progress'])
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching user current match', error as Error, 'TournamentService');
      return null;
    }
  }

  async generateBracket(tournamentId: string): Promise<boolean> {
    try {
      const participants = await this.getTournamentParticipants(tournamentId);
      if (participants.length < 2) return false;

      const shuffled = participants.sort(() => Math.random() - 0.5);
      const numRounds = Math.ceil(Math.log2(shuffled.length));
      const matches: Partial<TournamentMatch>[] = [];

      for (let i = 0; i < shuffled.length; i += 2) {
        matches.push({
          tournament_id: tournamentId,
          round_number: 1,
          match_number: Math.floor(i / 2) + 1,
          player1_id: shuffled[i]?.user_id,
          player2_id: shuffled[i + 1]?.user_id || null,
          player1_score: 0,
          player2_score: 0,
          status: 'pending'
        });
      }

      const { error } = await supabase
        .from('tournament_matches')
        .insert(matches);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error generating bracket', error as Error, 'TournamentService');
      return false;
    }
  }

  async advanceWinner(matchId: string): Promise<boolean> {
    try {
      const match = await this.getMatch(matchId);
      if (!match || !match.winner_id) return false;

      const tournament = await this.getTournamentById(match.tournament_id);
      if (!tournament) return false;

      const nextRound = match.round_number + 1;
      const nextMatchNumber = Math.ceil(match.match_number / 2);

      const { data: nextMatch } = await supabase
        .from('tournament_matches')
        .select('*')
        .eq('tournament_id', match.tournament_id)
        .eq('round_number', nextRound)
        .eq('match_number', nextMatchNumber)
        .single();

      if (!nextMatch) {
        // Create next round match
        const slot = match.match_number % 2 === 1 ? 'player1_id' : 'player2_id';
        await supabase
          .from('tournament_matches')
          .insert({
            tournament_id: match.tournament_id,
            round_number: nextRound,
            match_number: nextMatchNumber,
            [slot]: match.winner_id,
            status: 'pending'
          });
      } else {
        const slot = match.match_number % 2 === 1 ? 'player1_id' : 'player2_id';
        await supabase
          .from('tournament_matches')
          .update({ [slot]: match.winner_id })
          .eq('id', nextMatch.id);
      }

      return true;
    } catch (error) {
      logger.error('Error advancing winner', error as Error, 'TournamentService');
      return false;
    }
  }

  async forfeitMatch(matchId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const match = await this.getMatch(matchId);
      if (!match) return false;

      const winnerId = match.player1_id === user.id ? match.player2_id : match.player1_id;

      const { error } = await supabase
        .from('tournament_matches')
        .update({
          status: 'forfeit',
          winner_id: winnerId,
          completed_at: new Date().toISOString()
        })
        .eq('id', matchId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error forfeiting match', error as Error, 'TournamentService');
      return false;
    }
  }

  async getLeaderboard(tournamentId: string): Promise<Array<{
    userId: string;
    displayName: string;
    avatarUrl?: string;
    wins: number;
    losses: number;
    points: number;
    rank: number;
  }>> {
    try {
      const matches = await this.getTournamentMatches(tournamentId);
      const completedMatches = matches.filter(m => m.status === 'completed');

      const stats: Record<string, { wins: number; losses: number; displayName: string; avatarUrl?: string }> = {};

      completedMatches.forEach(match => {
        [match.player1_id, match.player2_id].filter(Boolean).forEach(playerId => {
          if (!playerId) return;
          if (!stats[playerId]) {
            const isPlayer1 = match.player1_id === playerId;
            stats[playerId] = {
              wins: 0,
              losses: 0,
              displayName: isPlayer1 ? match.player1?.display_name || 'Player' : match.player2?.display_name || 'Player',
              avatarUrl: isPlayer1 ? match.player1?.avatar_url : match.player2?.avatar_url
            };
          }
          if (match.winner_id === playerId) {
            stats[playerId].wins++;
          } else {
            stats[playerId].losses++;
          }
        });
      });

      return Object.entries(stats)
        .map(([userId, data]) => ({
          userId,
          displayName: data.displayName,
          avatarUrl: data.avatarUrl,
          wins: data.wins,
          losses: data.losses,
          points: data.wins * 100 - data.losses * 25
        }))
        .sort((a, b) => b.points - a.points)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
    } catch (error) {
      logger.error('Error generating leaderboard', error as Error, 'TournamentService');
      return [];
    }
  }

  async getRecentMatches(limit: number = 10): Promise<TournamentMatch[]> {
    try {
      const { data, error } = await supabase
        .from('tournament_matches')
        .select(`
          *,
          player1:player1_id(display_name, avatar_url),
          player2:player2_id(display_name, avatar_url)
        `)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching recent matches', error as Error, 'TournamentService');
      return [];
    }
  }

  async getUserTournamentStats(): Promise<{
    tournamentsPlayed: number;
    tournamentsWon: number;
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
    bestPlacement: number;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return {
        tournamentsPlayed: 0, tournamentsWon: 0, totalMatches: 0,
        wins: 0, losses: 0, winRate: 0, bestPlacement: 0
      };

      const { data: registrations } = await supabase
        .from('tournament_registrations')
        .select('*, tournament:tournaments(*)')
        .eq('user_id', user.id);

      const { data: matches } = await supabase
        .from('tournament_matches')
        .select('*')
        .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
        .eq('status', 'completed');

      const wins = (matches || []).filter(m => m.winner_id === user.id).length;
      const losses = (matches || []).length - wins;
      const placements = (registrations || [])
        .filter(r => r.seed_position)
        .map(r => r.seed_position as number);

      return {
        tournamentsPlayed: (registrations || []).length,
        tournamentsWon: placements.filter(p => p === 1).length,
        totalMatches: (matches || []).length,
        wins,
        losses,
        winRate: (matches || []).length > 0 ? Math.round((wins / (matches || []).length) * 100) : 0,
        bestPlacement: placements.length > 0 ? Math.min(...placements) : 0
      };
    } catch (error) {
      logger.error('Error fetching user tournament stats', error as Error, 'TournamentService');
      return {
        tournamentsPlayed: 0, tournamentsWon: 0, totalMatches: 0,
        wins: 0, losses: 0, winRate: 0, bestPlacement: 0
      };
    }
  }
}

export const tournamentService = new TournamentService();
