/**
 * Hook pour la méditation de groupe
 * Gère les sessions collaboratives avec synchronisation temps réel
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  GroupMeditationService,
  type GroupSession,
  type GroupParticipant,
  type GroupSessionState,
  type CreateGroupSessionParams,
  type JoinGroupSessionParams
} from '../groupMeditationService';

export interface UseGroupMeditationOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useGroupMeditation(options: UseGroupMeditationOptions = {}) {
  const { autoRefresh = true, refreshInterval = 30000 } = options;
  const queryClient = useQueryClient();
  
  const [currentSession, setCurrentSession] = useState<GroupSession | null>(null);
  const [participants, setParticipants] = useState<GroupParticipant[]>([]);
  const [sessionState, setSessionState] = useState<GroupSessionState | null>(null);
  const [isHost, setIsHost] = useState(false);
  
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Query: sessions publiques disponibles
  const {
    data: publicSessions = [],
    isLoading: isLoadingPublicSessions,
    refetch: refetchPublicSessions
  } = useQuery({
    queryKey: ['group-meditation-public-sessions'],
    queryFn: () => GroupMeditationService.getPublicSessions(),
    refetchInterval: autoRefresh ? refreshInterval : false,
    staleTime: 10000
  });

  // Mutation: créer une session
  const createSessionMutation = useMutation({
    mutationFn: (params: CreateGroupSessionParams) => 
      GroupMeditationService.createSession(params),
    onSuccess: (session) => {
      setCurrentSession(session);
      setIsHost(true);
      subscribeToSession(session.id);
      toast.success('Session créée ! Partagez le code: ' + session.join_code);
      queryClient.invalidateQueries({ queryKey: ['group-meditation-public-sessions'] });
    },
    onError: (error: Error) => {
      toast.error('Erreur: ' + error.message);
    }
  });

  // Mutation: rejoindre une session
  const joinSessionMutation = useMutation({
    mutationFn: (params: JoinGroupSessionParams) => 
      GroupMeditationService.joinSession(params),
    onSuccess: ({ session, participant }) => {
      setCurrentSession(session);
      setIsHost(false);
      subscribeToSession(session.id);
      toast.success(`Vous avez rejoint "${session.title}"`);
    },
    onError: (error: Error) => {
      toast.error('Erreur: ' + error.message);
    }
  });

  // Mutation: démarrer la session (hôte)
  const startSessionMutation = useMutation({
    mutationFn: (sessionId: string) => 
      GroupMeditationService.startSession(sessionId),
    onSuccess: () => {
      toast.success('Session démarrée !');
    },
    onError: (error: Error) => {
      toast.error('Erreur: ' + error.message);
    }
  });

  // Mutation: terminer la session
  const completeSessionMutation = useMutation({
    mutationFn: (sessionId: string) => 
      GroupMeditationService.completeSession(sessionId),
    onSuccess: () => {
      toast.success('Session terminée');
      cleanup();
    }
  });

  // Mutation: quitter la session
  const leaveSessionMutation = useMutation({
    mutationFn: (sessionId: string) => 
      GroupMeditationService.leaveSession(sessionId),
    onSuccess: () => {
      toast.info('Vous avez quitté la session');
      cleanup();
    }
  });

  // Mutation: enregistrer l'humeur
  const recordMoodMutation = useMutation({
    mutationFn: ({ participantId, moodType, value }: {
      participantId: string;
      moodType: 'before' | 'after';
      value: number;
    }) => GroupMeditationService.recordMood(participantId, moodType, value)
  });

  // S'abonner aux mises à jour temps réel
  const subscribeToSession = useCallback((sessionId: string) => {
    // Nettoyer l'abonnement précédent
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    unsubscribeRef.current = GroupMeditationService.subscribeToSession(sessionId, {
      onStateChange: (state) => {
        setSessionState(state);
      },
      onParticipantJoin: (participant) => {
        setParticipants(prev => [...prev, participant]);
        toast.info(`${participant.user_name} a rejoint la session`);
      },
      onParticipantLeave: (userId) => {
        setParticipants(prev => prev.filter(p => p.user_id !== userId));
      },
      onSessionStart: () => {
        if (currentSession) {
          setCurrentSession({ ...currentSession, status: 'in_progress' });
        }
      },
      onSessionComplete: () => {
        toast.success('La session de méditation est terminée');
        cleanup();
      }
    });

    // Charger les participants actuels
    GroupMeditationService.getParticipants(sessionId).then(setParticipants);
  }, [currentSession]);

  // Synchroniser l'état (hôte uniquement)
  const syncState = useCallback((state: Partial<GroupSessionState>) => {
    if (!currentSession || !isHost) return;

    const fullState: GroupSessionState = {
      currentPhase: state.currentPhase || 'waiting',
      elapsedSeconds: state.elapsedSeconds || 0,
      totalSeconds: state.totalSeconds || 0,
      participantCount: participants.length,
      hostHeartbeat: Date.now(),
      syncTimestamp: new Date().toISOString()
    };

    GroupMeditationService.syncSessionState(currentSession.id, fullState);
  }, [currentSession, isHost, participants.length]);

  // Nettoyage
  const cleanup = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    setCurrentSession(null);
    setParticipants([]);
    setSessionState(null);
    setIsHost(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return {
    // État
    currentSession,
    participants,
    sessionState,
    isHost,
    publicSessions,
    isLoadingPublicSessions,

    // Actions
    createSession: createSessionMutation.mutate,
    joinSession: joinSessionMutation.mutate,
    startSession: () => currentSession && startSessionMutation.mutate(currentSession.id),
    completeSession: () => currentSession && completeSessionMutation.mutate(currentSession.id),
    leaveSession: () => currentSession && leaveSessionMutation.mutate(currentSession.id),
    recordMood: recordMoodMutation.mutate,
    syncState,
    refetchPublicSessions,

    // Loading states
    isCreating: createSessionMutation.isPending,
    isJoining: joinSessionMutation.isPending,
    isStarting: startSessionMutation.isPending
  };
}

export default useGroupMeditation;
