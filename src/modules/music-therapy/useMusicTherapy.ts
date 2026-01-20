/**
 * Hook useMusicTherapy
 * Gestion des sessions de musicothérapie avec React Query
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import {
  MusicTherapyService,
  type MusicSession,
  type TherapeuticPlaylist,
  type MusicTherapyRecommendation,
  type MusicTherapyStats,
  type EmotionalPoint,
} from './musicTherapyServiceUnified';

// ============================================================================
// TYPES
// ============================================================================

export interface UseMusicTherapyReturn {
  // Data
  currentSession: MusicSession | null;
  history: MusicSession[];
  stats: MusicTherapyStats | null;
  recommendations: MusicTherapyRecommendation[];
  
  // Session state
  isPlaying: boolean;
  currentPlaylist: TherapeuticPlaylist | null;
  
  // Loading states
  isLoading: boolean;
  isGenerating: boolean;
  
  // Actions
  startSession: (playlistId?: string, moodBefore?: number) => Promise<MusicSession>;
  endSession: (moodAfter?: number) => Promise<void>;
  recordEmotionalPoint: (point: Omit<EmotionalPoint, 'timestamp'>) => Promise<void>;
  generatePlaylist: (mood: string, preferences?: any) => Promise<TherapeuticPlaylist>;
  generateTherapeuticPlaylist: (goal: {
    currentMood: number;
    targetMood: number;
    emotionalState: string;
  }) => Promise<TherapeuticPlaylist>;
  refreshRecommendations: () => Promise<void>;
  setPlaying: (playing: boolean) => void;
}

// ============================================================================
// QUERY KEYS
// ============================================================================

const QUERY_KEYS = {
  session: (userId: string) => ['music-therapy', 'session', userId],
  history: (userId: string) => ['music-therapy', 'history', userId],
  stats: (userId: string) => ['music-therapy', 'stats', userId],
  recommendations: (userId: string) => ['music-therapy', 'recommendations', userId],
};

// ============================================================================
// HOOK
// ============================================================================

export function useMusicTherapy(): UseMusicTherapyReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id || '';

  // Local state
  const [currentSession, setCurrentSession] = useState<MusicSession | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<TherapeuticPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch history
  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: QUERY_KEYS.history(userId),
    queryFn: () => MusicTherapyService.fetchHistory(userId, 50),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: QUERY_KEYS.stats(userId),
    queryFn: () => MusicTherapyService.getStats(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 10,
  });

  // Fetch recommendations
  const { data: recommendations = [], isLoading: isLoadingRecommendations } = useQuery({
    queryKey: QUERY_KEYS.recommendations(userId),
    queryFn: () => MusicTherapyService.getIntelligentRecommendations(userId, {
      timeOfDay: getTimeOfDay(),
      recentMood: history[0]?.mood_after,
    }),
    enabled: !!userId,
    staleTime: 1000 * 60 * 15,
  });

  // Start session mutation
  const startMutation = useMutation({
    mutationFn: async ({ playlistId, moodBefore }: { playlistId?: string; moodBefore?: number }) => {
      if (playlistId) {
        return MusicTherapyService.createSessionWithEmotionalTracking(userId, playlistId, moodBefore || 50);
      }
      return MusicTherapyService.createSession(userId, playlistId, moodBefore);
    },
    onSuccess: (session) => {
      setCurrentSession(session);
      setIsPlaying(true);
    },
  });

  // End session mutation
  const endMutation = useMutation({
    mutationFn: async ({ sessionId, moodAfter }: { sessionId: string; moodAfter?: number }) => {
      const duration = currentSession
        ? Math.floor((Date.now() - new Date(currentSession.created_at).getTime()) / 1000)
        : 0;

      await MusicTherapyService.completeSession(
        sessionId,
        duration,
        currentSession?.tracks_played || [],
        moodAfter
      );
    },
    onSuccess: () => {
      setCurrentSession(null);
      setCurrentPlaylist(null);
      setIsPlaying(false);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats(userId) });
    },
  });

  // Actions
  const startSession = useCallback(async (playlistId?: string, moodBefore?: number): Promise<MusicSession> => {
    const session = await startMutation.mutateAsync({ playlistId, moodBefore });
    return session;
  }, [startMutation]);

  const endSession = useCallback(async (moodAfter?: number): Promise<void> => {
    if (!currentSession) return;
    await endMutation.mutateAsync({ sessionId: currentSession.id, moodAfter });
  }, [currentSession, endMutation]);

  const recordEmotionalPoint = useCallback(async (point: Omit<EmotionalPoint, 'timestamp'>): Promise<void> => {
    if (!currentSession) return;
    await MusicTherapyService.recordEmotionalPoint(currentSession.id, {
      ...point,
      timestamp: Date.now(),
    });
  }, [currentSession]);

  const generatePlaylist = useCallback(async (mood: string, preferences?: any): Promise<TherapeuticPlaylist> => {
    setIsGenerating(true);
    try {
      const playlist = await MusicTherapyService.generatePlaylist(userId, mood, preferences);
      setCurrentPlaylist(playlist);
      return playlist;
    } finally {
      setIsGenerating(false);
    }
  }, [userId]);

  const generateTherapeuticPlaylist = useCallback(async (goal: {
    currentMood: number;
    targetMood: number;
    emotionalState: string;
  }): Promise<TherapeuticPlaylist> => {
    setIsGenerating(true);
    try {
      const playlist = await MusicTherapyService.generateTherapeuticPlaylist(userId, goal);
      setCurrentPlaylist(playlist);
      return playlist;
    } finally {
      setIsGenerating(false);
    }
  }, [userId]);

  const refreshRecommendations = useCallback(async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recommendations(userId) });
  }, [queryClient, userId]);

  const setPlaying = useCallback((playing: boolean) => {
    setIsPlaying(playing);
  }, []);

  // Combined loading state
  const isLoading = isLoadingHistory || isLoadingStats || isLoadingRecommendations;

  return {
    currentSession,
    history,
    stats: stats || null,
    recommendations,
    isPlaying,
    currentPlaylist,
    isLoading,
    isGenerating,
    startSession,
    endSession,
    recordEmotionalPoint,
    generatePlaylist,
    generateTherapeuticPlaylist,
    refreshRecommendations,
    setPlaying,
  };
}

// Helper function
function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export default useMusicTherapy;
