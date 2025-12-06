/**
 * Hook React Query pour Bubble Beat
 * @deprecated Use useBubbleBeatMachine instead
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as bubbleBeatService from '@/modules/bubble-beat/bubbleBeatService';
import { useToast } from '@/hooks/use-toast';

export const useBubbleBeat = (userId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: history, isLoading } = useQuery({
    queryKey: ['bubble-beat-history', userId],
    queryFn: () => bubbleBeatService.getRecentSessions(20),
    enabled: !!userId
  });

  const { data: stats } = useQuery({
    queryKey: ['bubble-beat-stats', userId],
    queryFn: () => bubbleBeatService.getStats(),
    enabled: !!userId
  });

  const bestScore = stats?.best_score || 0;

  const createSession = useMutation({
    mutationFn: ({ difficulty, mood }: { difficulty: 'easy' | 'medium' | 'hard'; mood: 'calm' | 'energetic' | 'focus' }) =>
      bubbleBeatService.createSession({ difficulty, mood }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bubble-beat-history', userId] });
    }
  });

  const completeSession = useMutation({
    mutationFn: ({ sessionId, score, bubblesPopped, duration }: { 
      sessionId: string; 
      score: number;
      bubblesPopped: number;
      duration: number 
    }) =>
      bubbleBeatService.completeSession({ 
        session_id: sessionId, 
        score, 
        bubbles_popped: bubblesPopped, 
        duration_seconds: duration 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bubble-beat-history', userId] });
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
    completeSession: completeSession.mutate
  };
};
