/**
 * Hook pour récupérer les tags tendance
 */

import { useState, useEffect, useCallback } from 'react';
import { CommunityTrendingService, TrendingTag } from '@/modules/community/services/communityTrendingService';

export interface UseTrendingTagsReturn {
  tags: TrendingTag[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useTrendingTags(limit: number = 10): UseTrendingTagsReturn {
  const [tags, setTags] = useState<TrendingTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CommunityTrendingService.getTrendingTags(limit);
      setTags(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  return {
    tags,
    loading,
    error,
    refresh: loadTags
  };
}
