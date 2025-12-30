/**
 * Hook principal pour activities
 */

import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useActivitiesMachine } from './useActivitiesMachine';
import type { ActivityFilters } from './types';

interface UseActivitiesOptions {
  autoLoad?: boolean;
  defaultFilters?: ActivityFilters;
}

export function useActivities(options: UseActivitiesOptions = {}) {
  const { user } = useAuth();
  const machine = useActivitiesMachine(user?.id || '');

  useEffect(() => {
    if (options.autoLoad) {
      machine.loadActivities(options.defaultFilters);
    }
  }, [options.autoLoad]);

  const loadActivities = useCallback((filters?: ActivityFilters) => {
    machine.loadActivities(filters);
  }, [machine.loadActivities]);

  return {
    activities: machine.state.activities,
    favorites: machine.state.favorites,
    history: machine.state.history,
    filters: machine.state.filters,
    status: machine.state.status,
    error: machine.state.error,
    loadActivities,
    toggleFavorite: machine.toggleFavorite,
    completeActivity: machine.completeActivity,
    setFilters: machine.setFilters
  };
}
