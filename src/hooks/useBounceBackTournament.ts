/**
 * Hook pour le mode tournoi Bounce Back Battle
 * TOP 5 #5 Modules - Système de tournois de résilience
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export type TournamentPhase = 'registration' | 'warmup' | 'active' | 'finals' | 'completed';

export interface BounceBackPlayer {
  id: string;
  user_id: string;
  display_name: string;
  avatar_emoji: string;
  resilience_score: number;
  rounds_won: number;
  current_streak: number;
  best_comeback: number;
  is_eliminated: boolean;
  joined_at: string;
}

export interface BounceBackRound {
  id: string;
  tournament_id: string;
  round_number: number;
  challenge_type: 'reframe' | 'breathe' | 'affirmation' | 'gratitude' | 'action';
  challenge_prompt: string;
  time_limit_seconds: number;
  started_at: string | null;
  ended_at: string | null;
  participants_count: number;
  completions_count: number;
}

export interface RoundSubmission {
  id: string;
  round_id: string;
  player_id: string;
  response: string;
  score: number;
  time_taken_seconds: number;
  submitted_at: string;
}

export interface BounceBackTournament {
  id: string;
  name: string;
  description: string;
  phase: TournamentPhase;
  max_players: number;
  current_round: number;
  total_rounds: number;
  prize_xp: number;
  starts_at: string;
  created_at: string;
}

const CHALLENGE_TYPES: Record<string, { emoji: string; label: string; description: string }> = {
  reframe: { 
    emoji: '🔄', 
    label: 'Recadrage', 
    description: 'Transformez une pensée négative en opportunité' 
  },
  breathe: { 
    emoji: '🌬️', 
    label: 'Respiration', 
    description: 'Complétez un exercice de respiration' 
  },
  affirmation: { 
    emoji: '💪', 
    label: 'Affirmation', 
    description: 'Créez une affirmation positive puissante' 
  },
  gratitude: { 
    emoji: '🙏', 
    label: 'Gratitude', 
    description: 'Exprimez votre gratitude' 
  },
  action: { 
    emoji: '⚡', 
    label: 'Action', 
    description: 'Définissez une action concrète' 
  }
};

export function useBounceBackTournament(tournamentId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [tournament, setTournament] = useState<BounceBackTournament | null>(null);
  const [players, setPlayers] = useState<BounceBackPlayer[]>([]);
  const [rounds, setRounds] = useState<BounceBackRound[]>([]);
  const [currentRound, setCurrentRound] = useState<BounceBackRound | null>(null);
  const [myPlayer, setMyPlayer] = useState<BounceBackPlayer | null>(null);
  const [mySubmissions, setMySubmissions] = useState<RoundSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Charger les données du tournoi
  const fetchTournamentData = useCallback(async () => {
    if (!tournamentId) return;
    setIsLoading(true);

    try {
      // Tournoi
      const { data: tournamentData, error: tError } = await supabase
        .from('bounce_back_tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single();

      if (tError) throw tError;
      setTournament(tournamentData as BounceBackTournament);

      // Joueurs
      const { data: playersData, error: pError } = await supabase
        .from('bounce_back_players')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('resilience_score', { ascending: false });

      if (pError) throw pError;
      setPlayers((playersData || []) as BounceBackPlayer[]);

      // Mon profil joueur
      if (user) {
        const myP = (playersData || []).find((p: BounceBackPlayer) => p.user_id === user.id);
        setMyPlayer(myP || null);
      }

      // Rounds
      const { data: roundsData, error: rError } = await supabase
        .from('bounce_back_rounds')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('round_number', { ascending: true });

      if (rError) throw rError;
      setRounds((roundsData || []) as BounceBackRound[]);

      // Round actuel
      const activeRound = (roundsData || []).find(
        (r: BounceBackRound) => r.started_at && !r.ended_at
      );
      setCurrentRound(activeRound || null);

      // Mes soumissions
      if (user) {
        const { data: submissionsData } = await supabase
          .from('bounce_back_submissions')
          .select('*')
          .eq('player_id', myPlayer?.id || 'none');

        setMySubmissions((submissionsData || []) as RoundSubmission[]);
      }

    } catch (error) {
      logger.error('Failed to fetch tournament data', error as Error, 'BOUNCE_BACK');
    } finally {
      setIsLoading(false);
    }
  }, [tournamentId, user, myPlayer?.id]);

  // Rejoindre le tournoi
  const joinTournament = useCallback(async (displayName: string, avatarEmoji: string) => {
    if (!user || !tournamentId || !tournament) return null;

    if (myPlayer) {
      toast({
        title: 'Déjà inscrit',
        description: 'Vous participez déjà à ce tournoi'
      });
      return null;
    }

    if (players.length >= tournament.max_players) {
      toast({
        title: 'Tournoi complet',
        description: 'Le nombre maximum de participants est atteint',
        variant: 'destructive'
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('bounce_back_players')
        .insert({
          tournament_id: tournamentId,
          user_id: user.id,
          display_name: displayName,
          avatar_emoji: avatarEmoji
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: '🎮 Inscrit au tournoi !',
        description: `Bienvenue dans ${tournament.name}`
      });

      await fetchTournamentData();
      return data as BounceBackPlayer;

    } catch (error) {
      logger.error('Failed to join tournament', error as Error, 'BOUNCE_BACK');
      toast({
        title: 'Erreur',
        description: 'Impossible de rejoindre le tournoi',
        variant: 'destructive'
      });
      return null;
    }
  }, [user, tournamentId, tournament, myPlayer, players, toast, fetchTournamentData]);

  // Soumettre une réponse au round
  const submitResponse = useCallback(async (response: string, timeTaken: number) => {
    if (!user || !currentRound || !myPlayer) return null;

    // Vérifier si déjà soumis
    const alreadySubmitted = mySubmissions.find(s => s.round_id === currentRound.id);
    if (alreadySubmitted) {
      toast({
        title: 'Déjà soumis',
        description: 'Vous avez déjà répondu à ce round'
      });
      return null;
    }

    try {
      // Calculer le score
      const baseScore = 100;
      const timeBonus = Math.max(0, (currentRound.time_limit_seconds - timeTaken) * 0.5);
      const lengthBonus = Math.min(50, response.length * 0.1);
      const score = Math.round(baseScore + timeBonus + lengthBonus);

      const { data, error } = await supabase
        .from('bounce_back_submissions')
        .insert({
          round_id: currentRound.id,
          player_id: myPlayer.id,
          response,
          score,
          time_taken_seconds: timeTaken
        })
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour le score du joueur
      await supabase
        .from('bounce_back_players')
        .update({
          resilience_score: myPlayer.resilience_score + score
        })
        .eq('id', myPlayer.id);

      toast({
        title: '✅ Réponse soumise !',
        description: `+${score} points de résilience`
      });

      await fetchTournamentData();
      return data as RoundSubmission;

    } catch (error) {
      logger.error('Failed to submit response', error as Error, 'BOUNCE_BACK');
      toast({
        title: 'Erreur',
        description: 'Impossible de soumettre la réponse',
        variant: 'destructive'
      });
      return null;
    }
  }, [user, currentRound, myPlayer, mySubmissions, toast, fetchTournamentData]);

  // Timer pour le round actuel
  useEffect(() => {
    if (!currentRound || !currentRound.started_at) {
      setTimeRemaining(0);
      return;
    }

    const startTime = new Date(currentRound.started_at).getTime();
    const endTime = startTime + currentRound.time_limit_seconds * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [currentRound]);

  // Classement en temps réel
  const leaderboard = useMemo(() => {
    return [...players]
      .filter(p => !p.is_eliminated)
      .sort((a, b) => b.resilience_score - a.resilience_score);
  }, [players]);

  // Mon rang
  const myRank = useMemo(() => {
    if (!myPlayer) return 0;
    return leaderboard.findIndex(p => p.id === myPlayer.id) + 1;
  }, [leaderboard, myPlayer]);

  // A-t-on soumis pour le round actuel ?
  const hasSubmittedCurrentRound = useMemo(() => {
    if (!currentRound || !myPlayer) return false;
    return mySubmissions.some(s => s.round_id === currentRound.id);
  }, [currentRound, myPlayer, mySubmissions]);

  // Realtime subscription
  useEffect(() => {
    if (!tournamentId) return;

    fetchTournamentData();

    const channel = supabase
      .channel(`bounce-back-${tournamentId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bounce_back_rounds',
        filter: `tournament_id=eq.${tournamentId}`
      }, () => {
        fetchTournamentData();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bounce_back_players',
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
    players,
    rounds,
    currentRound,
    myPlayer,
    mySubmissions,
    leaderboard,
    myRank,
    timeRemaining,
    isLoading,
    isRegistered: !!myPlayer,
    isEliminated: myPlayer?.is_eliminated ?? false,
    hasSubmittedCurrentRound,
    joinTournament,
    submitResponse,
    refresh: fetchTournamentData,
    challengeTypes: CHALLENGE_TYPES
  };
}

// Hook pour lister les tournois disponibles
export function useAvailableBounceBackTournaments() {
  const [tournaments, setTournaments] = useState<BounceBackTournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTournaments = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bounce_back_tournaments')
        .select('*')
        .in('phase', ['registration', 'warmup', 'active'])
        .order('starts_at', { ascending: true });

      if (error) throw error;
      setTournaments((data || []) as BounceBackTournament[]);
    } catch (error) {
      logger.error('Failed to fetch tournaments', error as Error, 'BOUNCE_BACK');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  return { tournaments, isLoading, refresh: fetchTournaments };
}
