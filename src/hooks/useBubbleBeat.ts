/**
 * Hook React Query pour Bubble Beat
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BubbleBeatService } from '@/modules/bubble-beat/bubbleBeatService';
import { useToast } from '@/hooks/use-toast';

export const useBubbleBeat = (userId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: history, isLoading } = useQuery({
    queryKey: ['bubble-beat-history', userId],
    queryFn: () => BubbleBeatService.fetchHistory(userId),
    enabled: !!userId
  });

  const { data: bestScore } = useQuery({
    queryKey: ['bubble-beat-best-score', userId],
    queryFn: () => BubbleBeatService.getBestScore(userId),
    enabled: !!userId
  });

  const { data: stats } = useQuery({
    queryKey: ['bubble-beat-stats', userId],
    queryFn: () => BubbleBeatService.getStats(userId),
    enabled: !!userId
  });

  const createSession = useMutation({
    mutationFn: ({ difficulty }: { difficulty?: string }) =>
      BubbleBeatService.createSession(userId, difficulty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bubble-beat-history', userId] });
    }
  });

  const updateScore = useMutation({
    mutationFn: ({ 
      sessionId, 
      score, 
      bubblesPopped,
      accuracy 
    }: { 
      sessionId: string;
      score: number;
      bubblesPopped: number;
      accuracy?: number;
    }) => BubbleBeatService.updateScore(sessionId, score, bubblesPopped, accuracy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bubble-beat-history', userId] });
    }
  });

  const completeSession = useMutation({
    mutationFn: ({ sessionId, duration }: { sessionId: string; duration: number }) =>
      BubbleBeatService.completeSession(sessionId, duration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bubble-beat-history', userId] });
      queryClient.invalidateQueries({ queryKey: ['bubble-beat-best-score', userId] });
      queryClient.invalidateQueries({ queryKey: ['bubble-beat-stats', userId] });
      toast({ title: 'Partie terminée!' });
    }
  });

  return {
    history,
    bestScore,
    stats,
    isLoading,
    createSession: createSession.mutate,
    updateScore: updateScore.mutate,
    completeSession: completeSession.mutate
  };
};
