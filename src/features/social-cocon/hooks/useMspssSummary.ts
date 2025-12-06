import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMspssSummary } from '../api';
import { type MspssSummary } from '../types';

interface UseMspssSummaryOptions {
  enabled?: boolean;
}

interface UseMspssSummaryResult {
  summary: MspssSummary | null;
  isLoading: boolean;
  error: Error | null;
}

export const useMspssSummary = (
  options?: UseMspssSummaryOptions
): UseMspssSummaryResult => {
  const query = useQuery({
    queryKey: ['mspss-summary'],
    queryFn: fetchMspssSummary,
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 10,
  });

  return useMemo(
    () => ({
      summary: query.data ?? null,
      isLoading: query.isLoading,
      error: (query.error as Error) || null,
    }),
    [query.data, query.isLoading, query.error]
  );
};

export default useMspssSummary;
