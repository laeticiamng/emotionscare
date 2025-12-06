/**
 * Hook principal pour weekly-bars
 */

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWeeklyBarsMachine } from './useWeeklyBarsMachine';
import type { WeeklyBarsConfig } from './types';

interface UseWeeklyBarsOptions {
  autoLoad?: boolean;
  defaultConfig?: Partial<WeeklyBarsConfig>;
}

export function useWeeklyBars(options: UseWeeklyBarsOptions = {}) {
  const { user } = useAuth();
  const machine = useWeeklyBarsMachine(user?.id || '');

  useEffect(() => {
    if (options.autoLoad && user?.id && options.defaultConfig) {
      const config: WeeklyBarsConfig = {
        startDate: options.defaultConfig.startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: options.defaultConfig.endDate || new Date(),
        metrics: options.defaultConfig.metrics || ['mood', 'stress', 'energy'],
        showAverage: options.defaultConfig.showAverage ?? true,
        showTrend: options.defaultConfig.showTrend ?? true
      };
      machine.loadData(config);
    }
  }, [options.autoLoad, user?.id]);

  return {
    data: machine.state.data,
    status: machine.state.status,
    error: machine.state.error,
    config: machine.state.config,
    loadData: machine.loadData,
    reset: machine.reset
  };
}
