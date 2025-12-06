/**
 * Hook principal pour activities
 */

import { useEffect } from 'react';
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
    if (options.autoLoad && user?.id) {
      machine.loadActivities(options.defaultFilters);
    }
  }, [options.autoLoad, user?.id]);

  return {
    activities: machine.state.activities,
    favorites: machine.state.favorites,
    history: machine.state.history,
    filters: machine.state.filters,
    status: machine.state.status,
    error: machine.state.error,
    loadActivities: machine.loadActivities,
    toggleFavorite: machine.toggleFavorite,
    completeActivity: machine.completeActivity,
    setFilters: machine.setFilters
  };
}
