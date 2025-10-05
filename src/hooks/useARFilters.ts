/**
 * Hook React Query pour AR Filters
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ARFiltersService } from '@/modules/ar-filters/arFiltersService';
import { useToast } from '@/hooks/use-toast';

export const useARFilters = (userId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: history, isLoading } = useQuery({
    queryKey: ['ar-filters-history', userId],
    queryFn: () => ARFiltersService.fetchHistory(userId),
    enabled: !!userId
  });

  const { data: stats } = useQuery({
    queryKey: ['ar-filters-stats', userId],
    queryFn: () => ARFiltersService.getStats(userId),
    enabled: !!userId
  });

  const createSession = useMutation({
    mutationFn: ({ filterType }: { filterType: string }) =>
      ARFiltersService.createSession(userId, filterType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ar-filters-history', userId] });
    }
  });

  const incrementPhotosTaken = useMutation({
    mutationFn: ({ sessionId }: { sessionId: string }) =>
      ARFiltersService.incrementPhotosTaken(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ar-filters-history', userId] });
    }
  });

  const completeSession = useMutation({
    mutationFn: ({ 
      sessionId, 
      duration,
      moodImpact 
    }: { 
      sessionId: string;
      duration: number;
      moodImpact?: string;
    }) => ARFiltersService.completeSession(sessionId, duration, moodImpact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ar-filters-history', userId] });
      queryClient.invalidateQueries({ queryKey: ['ar-filters-stats', userId] });
      toast({ title: 'Session AR terminée' });
    }
  });

  return {
    history,
    stats,
    isLoading,
    createSession: createSession.mutate,
    incrementPhotosTaken: incrementPhotosTaken.mutate,
    completeSession: completeSession.mutate
  };
};
