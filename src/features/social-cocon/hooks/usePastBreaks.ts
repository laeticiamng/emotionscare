import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPastBreaks } from '../api';
import type { SocialBreakPlan } from '../types';

interface UsePastBreaksOptions {
  enabled?: boolean;
  limit?: number;
}

interface UsePastBreaksResult {
  pastBreaks: SocialBreakPlan[];
  isLoading: boolean;
  error: Error | null;
}

export const usePastBreaks = (options?: UsePastBreaksOptions): UsePastBreaksResult => {
  const limit = options?.limit ?? 10;

  const query = useQuery({
    queryKey: ['social-breaks-past', limit],
    queryFn: () => fetchPastBreaks(limit),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5,
  });

  return useMemo(
    () => ({
      pastBreaks: query.data ?? [],
      isLoading: query.isLoading,
      error: (query.error as Error) || null,
    }),
    [query.data, query.isLoading, query.error]
  );
};

export default usePastBreaks;
