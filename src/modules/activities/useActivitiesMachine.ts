/**
 * State machine pour activities
 */

import { useState, useCallback } from 'react';
import type { ActivitiesState, ActivityFilters } from './types';
import { ActivitiesService } from './activitiesService';

export function useActivitiesMachine(userId: string) {
  const [state, setState] = useState<ActivitiesState>({
    status: 'idle',
    activities: [],
    favorites: [],
    history: [],
    filters: {},
    error: null
  });

  const loadActivities = useCallback(async (filters?: ActivityFilters) => {
    setState(prev => ({ ...prev, status: 'loading', filters: filters || {}, error: null }));

    try {
      const [activities, favorites, history] = await Promise.all([
        ActivitiesService.fetchActivities(filters),
        ActivitiesService.fetchFavorites(userId),
        ActivitiesService.fetchHistory(userId, 20)
      ]);

      setState(prev => ({
        ...prev,
        status: 'success',
        activities,
        favorites,
        history
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to load activities'
      }));
    }
  }, [userId]);

  const toggleFavorite = useCallback(async (activityId: string) => {
    const isFavorite = state.favorites.includes(activityId);

    try {
      if (isFavorite) {
        await ActivitiesService.removeFavorite(userId, activityId);
        setState(prev => ({
          ...prev,
          favorites: prev.favorites.filter(id => id !== activityId)
        }));
      } else {
        await ActivitiesService.addFavorite(userId, activityId);
        setState(prev => ({
          ...prev,
          favorites: [...prev.favorites, activityId]
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update favorite'
      }));
    }
  }, [userId, state.favorites]);

  const completeActivity = useCallback(async (
    activityId: string,
    data: { rating?: number; notes?: string; mood_before?: number; mood_after?: number }
  ) => {
    try {
      const result = await ActivitiesService.completeActivity(userId, activityId, data);
      setState(prev => ({
        ...prev,
        history: [result, ...prev.history]
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to complete activity'
      }));
    }
  }, [userId]);

  const setFilters = useCallback((filters: ActivityFilters) => {
    loadActivities(filters);
  }, [loadActivities]);

  return {
    state,
    loadActivities,
    toggleFavorite,
    completeActivity,
    setFilters
  };
}
