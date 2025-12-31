/**
 * Hook principal pour le module Adaptive Music
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { AdaptiveMusicService } from './adaptiveMusicService';
import type {
  AdaptiveMusicSession,
  AdaptiveMusicStats,
  AdaptiveMusicPreferences,
  AdaptiveMusicTrack,
  PomsValues,
} from './types';

export function useAdaptiveMusic() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentSession, setCurrentSession] = useState<AdaptiveMusicSession | null>(null);

  // Stats query
  const statsQuery = useQuery({
    queryKey: ['adaptive-music-stats', user?.id],
    queryFn: () => AdaptiveMusicService.getStats(user!.id),
    enabled: !!user?.id,
    staleTime: 60000,
  });

  // Preferences query
  const preferencesQuery = useQuery({
    queryKey: ['adaptive-music-preferences', user?.id],
    queryFn: () => AdaptiveMusicService.getPreferences(user!.id),
    enabled: !!user?.id,
  });

  // Favorites query
  const favoritesQuery = useQuery({
    queryKey: ['adaptive-music-favorites', user?.id],
    queryFn: () => AdaptiveMusicService.getFavorites(user!.id),
    enabled: !!user?.id,
  });

  // Start session mutation
  const startSessionMutation = useMutation({
    mutationFn: async (params: { presetId: string; intensity: string; moodBefore?: number }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return AdaptiveMusicService.createSession(
        user.id,
        params.presetId,
        params.intensity,
        params.moodBefore
      );
    },
    onSuccess: (session) => {
      setCurrentSession(session);
    },
  });

  // Complete session mutation
  const completeSessionMutation = useMutation({
    mutationFn: async (params: { moodAfter?: number; pomsPost?: PomsValues }) => {
      if (!user?.id || !currentSession) throw new Error('No active session');
      return AdaptiveMusicService.completeSession(
        currentSession.id,
        user.id,
        params.moodAfter,
        params.pomsPost
      );
    },
    onSuccess: () => {
      setCurrentSession(null);
      queryClient.invalidateQueries({ queryKey: ['adaptive-music-stats'] });
    },
  });

  // Add track mutation
  const addTrackMutation = useMutation({
    mutationFn: async (trackId: string) => {
      if (!user?.id || !currentSession) throw new Error('No active session');
      return AdaptiveMusicService.addPlayedTrack(currentSession.id, user.id, trackId);
    },
  });

  // Save preferences mutation
  const savePreferencesMutation = useMutation({
    mutationFn: async (prefs: Partial<AdaptiveMusicPreferences>) => {
      if (!user?.id) throw new Error('User not authenticated');
      return AdaptiveMusicService.savePreferences(user.id, prefs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adaptive-music-preferences'] });
    },
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (track: AdaptiveMusicTrack) => {
      if (!user?.id) throw new Error('User not authenticated');
      const isFav = await AdaptiveMusicService.isFavorite(user.id, track.id);
      if (isFav) {
        await AdaptiveMusicService.removeFavorite(user.id, track.id);
      } else {
        await AdaptiveMusicService.addFavorite(user.id, track);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adaptive-music-favorites'] });
    },
  });

  // Helper functions
  const startSession = useCallback(
    (presetId: string, intensity: string, moodBefore?: number) => {
      return startSessionMutation.mutateAsync({ presetId, intensity, moodBefore });
    },
    [startSessionMutation]
  );

  const endSession = useCallback(
    (moodAfter?: number, pomsPost?: PomsValues) => {
      return completeSessionMutation.mutateAsync({ moodAfter, pomsPost });
    },
    [completeSessionMutation]
  );

  const addPlayedTrack = useCallback(
    (trackId: string) => {
      return addTrackMutation.mutateAsync(trackId);
    },
    [addTrackMutation]
  );

  const toggleFavorite = useCallback(
    (track: AdaptiveMusicTrack) => {
      return toggleFavoriteMutation.mutateAsync(track);
    },
    [toggleFavoriteMutation]
  );

  const isFavorite = useCallback(
    (trackId: string) => {
      return favoritesQuery.data?.some(t => t.id === trackId) ?? false;
    },
    [favoritesQuery.data]
  );

  const updatePreferences = useCallback(
    (prefs: Partial<AdaptiveMusicPreferences>) => {
      return savePreferencesMutation.mutateAsync(prefs);
    },
    [savePreferencesMutation]
  );

  return {
    // State
    currentSession,
    isSessionActive: !!currentSession,

    // Data
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,
    preferences: preferencesQuery.data,
    favorites: favoritesQuery.data ?? [],

    // Actions
    startSession,
    endSession,
    addPlayedTrack,
    toggleFavorite,
    isFavorite,
    updatePreferences,

    // Loading states
    isStartingSession: startSessionMutation.isPending,
    isEndingSession: completeSessionMutation.isPending,
  };
}
