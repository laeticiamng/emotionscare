/**
 * Hook pour les tournois avec brackets temps réel
 * TOP 5 #1 Éléments moins développés - Système de tournois complet
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export type TournamentStatus = 'draft' | 'registration' | 'in_progress' | 'completed' | 'cancelled';
export type MatchStatus = 'pending' | 'in_progress' | 'completed' | 'bye';
export type BracketType = 'single_elimination' | 'double_elimination' | 'round_robin';

export interface TournamentParticipant {
  id: string;
  tournament_id: string;
  user_id: string;
  display_name: string;
  avatar_emoji: string;
  seed: number;
  is_eliminated: boolean;
  current_round: number;
  total_score: number;
  wins: number;
  losses: number;
  registered_at: string;
}

export interface TournamentMatch {
  id: string;
  tournament_id: string;
  round: number;
  match_number: number;
  participant_1_id: string | null;
  participant_2_id: string | null;
  participant_1_score: number;
  participant_2_score: number;
  winner_id: string | null;
  status: MatchStatus;
  scheduled_at: string | null;
  completed_at: string | null;
  next_match_id: string | null;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  game_type: string;
  bracket_type: BracketType;
  status: TournamentStatus;
  max_participants: number;
  current_participants: number;
  entry_fee: number;
  prize_pool: number;
  starts_at: string;
  ends_at: string | null;
  created_at: string;
  rules: Record<string, unknown>;
}

export interface BracketData {
  rounds: {
    round: number;
    name: string;
    matches: TournamentMatch[];
  }[];
  totalRounds: number;
  currentRound: number;
}

export function useTournamentBrackets(tournamentId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<TournamentParticipant[]>([]);
  const [matches, setMatches] = useState<TournamentMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userParticipation, setUserParticipation] = useState<TournamentParticipant | null>(null);

  // Charger les données du tournoi
  const fetchTournamentData = useCallback(async () => {
    if (!tournamentId) return;
    setIsLoading(true);

    try {
      // Tournoi
      const { data: tournamentData, error: tError } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single();

      if (tError) throw tError;
      setTournament(tournamentData as Tournament);

      // Participants
      const { data: participantsData, error: pError } = await supabase
        .from('tournament_participants')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('seed', { ascending: true });

      if (pError) throw pError;
      setParticipants((participantsData || []) as TournamentParticipant[]);

      // User participation
      if (user) {
        const userPart = (participantsData || []).find(
          (p: TournamentParticipant) => p.user_id === user.id
        );
        setUserParticipation(userPart as TournamentParticipant || null);
      }

      // Matches
      const { data: matchesData, error: mError } = await supabase
        .from('tournament_matches')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('round', { ascending: true })
        .order('match_number', { ascending: true });

      if (mError) throw mError;
      setMatches((matchesData || []) as TournamentMatch[]);

    } catch (error) {
      logger.error('Failed to fetch tournament data', error as Error, 'TOURNAMENT');
    } finally {
      setIsLoading(false);
    }
  }, [tournamentId, user]);

  // Inscription au tournoi
  const registerForTournament = useCallback(async (displayName: string, avatarEmoji: string) => {
    if (!user || !tournamentId) return null;

    try {
      // Vérifier si déjà inscrit
      if (userParticipation) {
        toast({
          title: 'Déjà inscrit',
          description: 'Vous êtes déjà inscrit à ce tournoi',
          variant: 'destructive'
        });
        return null;
      }

      // Vérifier le nombre de participants
      if (tournament && tournament.current_participants >= tournament.max_participants) {
        toast({
          title: 'Tournoi complet',
          description: 'Le nombre maximum de participants est atteint',
          variant: 'destructive'
        });
        return null;
      }

      const { data, error } = await supabase
        .from('tournament_participants')
        .insert({
          tournament_id: tournamentId,
          user_id: user.id,
          display_name: displayName,
          avatar_emoji: avatarEmoji,
          seed: (tournament?.current_participants || 0) + 1
        })
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour le compteur
      await supabase
        .from('tournaments')
        .update({ current_participants: (tournament?.current_participants || 0) + 1 })
        .eq('id', tournamentId);

      toast({
        title: '🎮 Inscription réussie !',
        description: `Vous êtes inscrit au tournoi ${tournament?.name}`
      });

      await fetchTournamentData();
      return data as TournamentParticipant;

    } catch (error) {
      logger.error('Failed to register for tournament', error as Error, 'TOURNAMENT');
      toast({
        title: 'Erreur',
        description: 'Impossible de s\'inscrire au tournoi',
        variant: 'destructive'
      });
      return null;
    }
  }, [user, tournamentId, tournament, userParticipation, toast, fetchTournamentData]);

  // Soumettre un score
  const submitMatchScore = useCallback(async (matchId: string, score: number) => {
    if (!user) return false;

    try {
      const match = matches.find(m => m.id === matchId);
      if (!match) return false;

      const isParticipant1 = match.participant_1_id === userParticipation?.id;
      const isParticipant2 = match.participant_2_id === userParticipation?.id;

      if (!isParticipant1 && !isParticipant2) {
        toast({
          title: 'Erreur',
          description: 'Vous ne participez pas à ce match',
          variant: 'destructive'
        });
        return false;
      }

      const updateField = isParticipant1 ? 'participant_1_score' : 'participant_2_score';
      
      const { error } = await supabase
        .from('tournament_matches')
        .update({ [updateField]: score })
        .eq('id', matchId);

      if (error) throw error;

      await fetchTournamentData();
      return true;

    } catch (error) {
      logger.error('Failed to submit match score', error as Error, 'TOURNAMENT');
      return false;
    }
  }, [user, matches, userParticipation, toast, fetchTournamentData]);

  // Structure du bracket
  const bracketData = useMemo((): BracketData | null => {
    if (matches.length === 0) return null;

    const roundNames: Record<number, string> = {
      1: 'Huitièmes',
      2: 'Quarts',
      3: 'Demi-finales',
      4: 'Finale',
      5: 'Grande Finale'
    };

    const roundsMap = new Map<number, TournamentMatch[]>();
    let maxRound = 0;

    matches.forEach(match => {
      if (!roundsMap.has(match.round)) {
        roundsMap.set(match.round, []);
      }
      roundsMap.get(match.round)!.push(match);
      maxRound = Math.max(maxRound, match.round);
    });

    const currentRound = matches.reduce((max, m) => 
      m.status === 'in_progress' ? Math.max(max, m.round) : max, 0
    );

    const rounds = Array.from(roundsMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([round, roundMatches]) => ({
        round,
        name: roundNames[round] || `Tour ${round}`,
        matches: roundMatches
      }));

    return {
      rounds,
      totalRounds: maxRound,
      currentRound: currentRound || 1
    };
  }, [matches]);

  // Obtenir le participant par ID
  const getParticipant = useCallback((participantId: string | null) => {
    if (!participantId) return null;
    return participants.find(p => p.id === participantId) || null;
  }, [participants]);

  // Souscrire aux mises à jour temps réel
  useEffect(() => {
    if (!tournamentId) return;

    fetchTournamentData();

    const channel = supabase
      .channel(`tournament-${tournamentId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tournament_matches',
        filter: `tournament_id=eq.${tournamentId}`
      }, () => {
        fetchTournamentData();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tournament_participants',
        filter: `tournament_id=eq.${tournamentId}`
      }, () => {
        fetchTournamentData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tournamentId, fetchTournamentData]);

  return {
    tournament,
    participants,
    matches,
    bracketData,
    userParticipation,
    isLoading,
    isRegistered: !!userParticipation,
    registerForTournament,
    submitMatchScore,
    getParticipant,
    refresh: fetchTournamentData
  };
}

// Hook pour lister les tournois disponibles
export function useAvailableTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTournaments = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .in('status', ['registration', 'in_progress'])
        .order('starts_at', { ascending: true });

      if (error) throw error;
      setTournaments((data || []) as Tournament[]);
    } catch (error) {
      logger.error('Failed to fetch tournaments', error as Error, 'TOURNAMENT');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  return { tournaments, isLoading, refresh: fetchTournaments };
}
