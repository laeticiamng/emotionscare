/**
 * Tournaments Feature
 *
 * Tournament brackets, registrations, and competitive features.
 * @module features/tournaments
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// ============================================================================
// TYPES
// ============================================================================

export type TournamentStatus = 'upcoming' | 'registering' | 'in_progress' | 'completed' | 'cancelled';
export type TournamentType = 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
export type MatchStatus = 'pending' | 'in_progress' | 'completed';

export interface Tournament {
  id: string;
  name: string;
  description: string;
  type: TournamentType;
  status: TournamentStatus;
  max_participants: number;
  current_participants: number;
  entry_fee_points: number;
  prize_pool: number;
  challenge_type: string;
  starts_at: string;
  ends_at: string;
  registration_deadline: string;
  rules: string[];
  created_at: string;
}

export interface TournamentParticipant {
  id: string;
  tournament_id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  seed?: number;
  eliminated: boolean;
  final_rank?: number;
  registered_at: string;
}

export interface TournamentMatch {
  id: string;
  tournament_id: string;
  round: number;
  match_number: number;
  participant1_id?: string;
  participant2_id?: string;
  participant1_score?: number;
  participant2_score?: number;
  winner_id?: string;
  status: MatchStatus;
  scheduled_at?: string;
  completed_at?: string;
}

export interface TournamentBracket {
  tournament: Tournament;
  participants: TournamentParticipant[];
  matches: TournamentMatch[];
  currentRound: number;
  totalRounds: number;
}

// ============================================================================
// SERVICE
// ============================================================================

export const tournamentsService = {
  /**
   * Récupérer tous les tournois
   */
  async getTournaments(status?: TournamentStatus): Promise<Tournament[]> {
    let query = supabase
      .from('tournaments')
      .select('*')
      .order('starts_at', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Récupérer un tournoi par ID
   */
  async getTournament(id: string): Promise<Tournament | null> {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  /**
   * Récupérer le bracket complet d'un tournoi
   */
  async getTournamentBracket(tournamentId: string): Promise<TournamentBracket | null> {
    const tournament = await this.getTournament(tournamentId);
    if (!tournament) return null;

    const [participantsResult, matchesResult] = await Promise.all([
      supabase
        .from('tournament_participants')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('seed', { ascending: true }),
      supabase
        .from('tournament_matches')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('round', { ascending: true })
        .order('match_number', { ascending: true })
    ]);

    if (participantsResult.error) throw participantsResult.error;
    if (matchesResult.error) throw matchesResult.error;

    const totalRounds = Math.ceil(Math.log2(tournament.max_participants));
    const currentRound = matchesResult.data?.filter(m => m.status === 'in_progress')[0]?.round || 1;

    return {
      tournament,
      participants: participantsResult.data || [],
      matches: matchesResult.data || [],
      currentRound,
      totalRounds
    };
  },

  /**
   * S'inscrire à un tournoi
   */
  async registerForTournament(
    tournamentId: string,
    userId: string,
    displayName: string,
    avatarUrl?: string
  ): Promise<TournamentParticipant> {
    // Vérifier si déjà inscrit
    const { data: existing } = await supabase
      .from('tournament_participants')
      .select('id')
      .eq('tournament_id', tournamentId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      throw new Error('Déjà inscrit à ce tournoi');
    }

    // Vérifier si le tournoi accepte les inscriptions
    const tournament = await this.getTournament(tournamentId);
    if (!tournament) throw new Error('Tournoi non trouvé');
    if (tournament.status !== 'registering') throw new Error('Les inscriptions sont fermées');
    if (tournament.current_participants >= tournament.max_participants) {
      throw new Error('Tournoi complet');
    }

    // Inscrire le participant
    const { data, error } = await supabase
      .from('tournament_participants')
      .insert({
        tournament_id: tournamentId,
        user_id: userId,
        display_name: displayName,
        avatar_url: avatarUrl,
        eliminated: false
      })
      .select()
      .single();

    if (error) throw error;

    // Mettre à jour le compteur
    await supabase
      .from('tournaments')
      .update({ current_participants: tournament.current_participants + 1 })
      .eq('id', tournamentId);

    return data;
  },

  /**
   * Se désinscrire d'un tournoi
   */
  async unregisterFromTournament(tournamentId: string, userId: string): Promise<void> {
    const tournament = await this.getTournament(tournamentId);
    if (!tournament) throw new Error('Tournoi non trouvé');
    if (tournament.status !== 'registering') {
      throw new Error('Impossible de se désinscrire, le tournoi a commencé');
    }

    const { error } = await supabase
      .from('tournament_participants')
      .delete()
      .eq('tournament_id', tournamentId)
      .eq('user_id', userId);

    if (error) throw error;

    await supabase
      .from('tournaments')
      .update({ current_participants: Math.max(0, tournament.current_participants - 1) })
      .eq('id', tournamentId);
  },

  /**
   * Vérifier si un utilisateur est inscrit
   */
  async isRegistered(tournamentId: string, userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('tournament_participants')
      .select('id')
      .eq('tournament_id', tournamentId)
      .eq('user_id', userId)
      .single();

    return !!data;
  },

  /**
   * Récupérer les tournois d'un utilisateur
   */
  async getUserTournaments(userId: string): Promise<Tournament[]> {
    const { data: participations, error: pError } = await supabase
      .from('tournament_participants')
      .select('tournament_id')
      .eq('user_id', userId);

    if (pError) throw pError;
    if (!participations || participations.length === 0) return [];

    const tournamentIds = participations.map(p => p.tournament_id);

    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .in('id', tournamentIds)
      .order('starts_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Générer le bracket initial
   */
  async generateBracket(tournamentId: string): Promise<TournamentMatch[]> {
    const { data: participants } = await supabase
      .from('tournament_participants')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('registered_at', { ascending: true });

    if (!participants || participants.length < 2) {
      throw new Error('Pas assez de participants');
    }

    // Shuffle et assigner les seeds
    const shuffled = participants.sort(() => Math.random() - 0.5);
    for (let i = 0; i < shuffled.length; i++) {
      await supabase
        .from('tournament_participants')
        .update({ seed: i + 1 })
        .eq('id', shuffled[i].id);
    }

    // Créer les matches du premier tour
    const matches: Partial<TournamentMatch>[] = [];
    const numMatches = Math.floor(shuffled.length / 2);

    for (let i = 0; i < numMatches; i++) {
      matches.push({
        tournament_id: tournamentId,
        round: 1,
        match_number: i + 1,
        participant1_id: shuffled[i * 2]?.id,
        participant2_id: shuffled[i * 2 + 1]?.id,
        status: 'pending'
      });
    }

    const { data, error } = await supabase
      .from('tournament_matches')
      .insert(matches)
      .select();

    if (error) throw error;
    return data || [];
  }
};

// ============================================================================
// HOOKS
// ============================================================================

export function useTournaments(status?: TournamentStatus) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTournaments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tournamentsService.getTournaments(status);
      setTournaments(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    loadTournaments();
  }, [loadTournaments]);

  return { tournaments, loading, error, refresh: loadTournaments };
}

export function useTournament(tournamentId: string) {
  const { user } = useAuth();
  const [bracket, setBracket] = useState<TournamentBracket | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTournament = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const bracketData = await tournamentsService.getTournamentBracket(tournamentId);
      setBracket(bracketData);

      if (user) {
        const registered = await tournamentsService.isRegistered(tournamentId, user.id);
        setIsRegistered(registered);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [tournamentId, user]);

  const register = useCallback(async (displayName: string, avatarUrl?: string) => {
    if (!user) throw new Error('Non authentifié');
    await tournamentsService.registerForTournament(tournamentId, user.id, displayName, avatarUrl);
    setIsRegistered(true);
    await loadTournament();
  }, [tournamentId, user, loadTournament]);

  const unregister = useCallback(async () => {
    if (!user) throw new Error('Non authentifié');
    await tournamentsService.unregisterFromTournament(tournamentId, user.id);
    setIsRegistered(false);
    await loadTournament();
  }, [tournamentId, user, loadTournament]);

  useEffect(() => {
    loadTournament();
  }, [loadTournament]);

  return {
    bracket,
    tournament: bracket?.tournament,
    participants: bracket?.participants || [],
    matches: bracket?.matches || [],
    isRegistered,
    loading,
    error,
    register,
    unregister,
    refresh: loadTournament
  };
}

export function useUserTournaments() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    tournamentsService.getUserTournaments(user.id)
      .then(setTournaments)
      .finally(() => setLoading(false));
  }, [user]);

  return { tournaments, loading };
}

// ============================================================================
// COMPONENTS
// ============================================================================

export { TournamentBracketView } from '@/components/tournaments/TournamentBracketView';
export { TournamentRegistration } from '@/components/tournaments/TournamentRegistration';

// Re-export from component index
export * from '@/components/tournaments';
