/**
 * Hook useEmotionAtlas
 * Gestion de la cartographie émotionnelle avec React Query
 */

import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { EmotionAtlasService, type EmotionAtlasStats } from './emotionAtlasService';
import type { AtlasData, AtlasFilter, AtlasInsight } from './types';

const QUERY_KEYS = {
  atlas: (userId: string, filter: AtlasFilter) => ['emotion-atlas', userId, filter],
  insights: (userId: string) => ['emotion-atlas-insights', userId],
  stats: (userId: string) => ['emotion-atlas-stats', userId],
};

export interface UseEmotionAtlasReturn {
  // Data
  atlasData: AtlasData | null;
  insights: AtlasInsight[];
  stats: EmotionAtlasStats | null;
  
  // Filter
  filter: AtlasFilter;
  setFilter: (filter: Partial<AtlasFilter>) => void;
  resetFilter: () => void;
  
  // State
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  
  // Actions
  refreshAtlas: () => Promise<void>;
  exportData: () => Promise<string>;
}

const DEFAULT_FILTER: AtlasFilter = {
  timeRange: 'month',
  minIntensity: 0,
  sources: ['scan', 'journal', 'voice', 'text'],
  categories: ['positive', 'neutral', 'negative'],
};

export function useEmotionAtlas(): UseEmotionAtlasReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilterState] = useState<AtlasFilter>(DEFAULT_FILTER);

  const userId = user?.id || '';

  // Query: Atlas data
  const {
    data: atlasData,
    isLoading: isLoadingAtlas,
    isError: isErrorAtlas,
    error: errorAtlas,
  } = useQuery({
    queryKey: QUERY_KEYS.atlas(userId, filter),
    queryFn: () => EmotionAtlasService.getAtlasData(userId, filter),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Query: Insights (dépend de atlasData)
  const {
    data: insights = [],
    isLoading: isLoadingInsights,
  } = useQuery({
    queryKey: QUERY_KEYS.insights(userId),
    queryFn: () => atlasData 
      ? EmotionAtlasService.getInsights(userId, atlasData)
      : Promise.resolve([]),
    enabled: !!userId && !!atlasData,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Query: Stats
  const {
    data: stats,
    isLoading: isLoadingStats,
  } = useQuery({
    queryKey: QUERY_KEYS.stats(userId),
    queryFn: () => EmotionAtlasService.getStats(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  // Update filter
  const setFilter = useCallback((updates: Partial<AtlasFilter>) => {
    setFilterState(prev => ({ ...prev, ...updates }));
  }, []);

  // Reset filter
  const resetFilter = useCallback(() => {
    setFilterState(DEFAULT_FILTER);
  }, []);

  // Refresh atlas data
  const refreshAtlas = useCallback(async () => {
    await queryClient.invalidateQueries({ 
      queryKey: ['emotion-atlas', userId] 
    });
  }, [queryClient, userId]);

  // Export data as JSON
  const exportData = useCallback(async (): Promise<string> => {
    if (!atlasData) return '{}';

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      filter,
      data: atlasData,
      insights,
      stats,
    };

    return JSON.stringify(exportPayload, null, 2);
  }, [atlasData, filter, insights, stats]);

  // Combined loading state
  const isLoading = isLoadingAtlas || isLoadingInsights || isLoadingStats;
  const isError = isErrorAtlas;
  const error = errorAtlas as Error | null;

  return {
    atlasData: atlasData || null,
    insights,
    stats: stats || null,
    filter,
    setFilter,
    resetFilter,
    isLoading,
    isError,
    error,
    refreshAtlas,
    exportData,
  };
}

export default useEmotionAtlas;
