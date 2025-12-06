/**
 * Hook React Query pour Mood Mixer
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MoodMixerService } from '@/modules/mood-mixer/moodMixerService';
import { useToast } from '@/hooks/use-toast';

export const useMoodMixer = (userId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: history, isLoading } = useQuery({
    queryKey: ['mood-mixer-history', userId],
    queryFn: () => MoodMixerService.fetchHistory(userId),
    enabled: !!userId
  });

  const { data: stats } = useQuery({
    queryKey: ['mood-mixer-stats', userId],
    queryFn: () => MoodMixerService.getStats(userId),
    enabled: !!userId
  });

  const createSession = useMutation({
    mutationFn: ({ moodBefore }: { moodBefore?: string }) =>
      MoodMixerService.createSession(userId, moodBefore),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-mixer-history', userId] });
    }
  });

  const addActivity = useMutation({
    mutationFn: ({ sessionId, activity }: { sessionId: string; activity: string }) =>
      MoodMixerService.addActivity(sessionId, activity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-mixer-history', userId] });
    }
  });

  const completeSession = useMutation({
    mutationFn: ({ 
      sessionId, 
      duration, 
      moodAfter,
      satisfaction 
    }: { 
      sessionId: string; 
      duration: number;
      moodAfter?: string;
      satisfaction?: number;
    }) => MoodMixerService.completeSession(sessionId, duration, moodAfter, satisfaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-mixer-history', userId] });
      queryClient.invalidateQueries({ queryKey: ['mood-mixer-stats', userId] });
      toast({ title: 'Session Mood Mixer terminée' });
    }
  });

  return {
    history,
    stats,
    isLoading,
    createSession: createSession.mutate,
    addActivity: addActivity.mutate,
    completeSession: completeSession.mutate
  };
};
