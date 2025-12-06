/**
 * State machine pour weekly-bars
 */

import { useState, useCallback } from 'react';
import type { WeeklyBarsState, WeeklyBarsConfig } from './types';
import { WeeklyBarsService } from './weeklyBarsService';

export function useWeeklyBarsMachine(userId: string) {
  const [state, setState] = useState<WeeklyBarsState>({
    status: 'idle',
    data: [],
    config: null,
    error: null
  });

  const loadData = useCallback(async (config: WeeklyBarsConfig) => {
    setState(prev => ({ ...prev, status: 'loading', config, error: null }));

    try {
      const data = await WeeklyBarsService.fetchAllMetrics(
        userId,
        config.metrics,
        config.startDate,
        config.endDate
      );

      setState(prev => ({
        ...prev,
        status: 'success',
        data
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, [userId]);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      data: [],
      config: null,
      error: null
    });
  }, []);

  return {
    state,
    loadData,
    reset
  };
}
