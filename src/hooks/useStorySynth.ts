/**
 * Hook React Query pour Story Synth
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StorySynthService } from '@/modules/story-synth/storySynthService';
import { useToast } from '@/hooks/use-toast';

export const useStorySynth = (userId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: history, isLoading } = useQuery({
    queryKey: ['story-synth-history', userId],
    queryFn: () => StorySynthService.fetchHistory(userId),
    enabled: !!userId
  });

  const createSession = useMutation({
    mutationFn: ({ theme }: { theme?: string }) =>
      StorySynthService.createSession(userId, theme),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story-synth-history', userId] });
      toast({ title: 'Nouvelle histoire commencée' });
    }
  });

  const recordChoice = useMutation({
    mutationFn: ({ sessionId, choice }: { sessionId: string; choice: any }) =>
      StorySynthService.recordChoice(sessionId, choice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story-synth-history', userId] });
    }
  });

  const completeSession = useMutation({
    mutationFn: ({ sessionId, duration }: { sessionId: string; duration: number }) =>
      StorySynthService.completeSession(sessionId, duration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story-synth-history', userId] });
      toast({ title: 'Histoire terminée' });
    }
  });

  return {
    history,
    isLoading,
    createSession: createSession.mutate,
    recordChoice: recordChoice.mutate,
    completeSession: completeSession.mutate,
    isCreating: createSession.isPending
  };
};
