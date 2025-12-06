/**
 * Hook React Query pour Story Synth
 * @deprecated Use useStorySynthMachine instead
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as storySynthService from '@/modules/story-synth/storySynthService';
import { useToast } from '@/hooks/use-toast';

export const useStorySynth = (userId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: history, isLoading } = useQuery({
    queryKey: ['story-synth-history', userId],
    queryFn: () => storySynthService.getRecentSessions(20),
    enabled: !!userId
  });

  const createSession = useMutation({
    mutationFn: ({ theme, tone }: { theme: 'calme' | 'aventure' | 'poetique' | 'mysterieux' | 'romance' | 'introspection' | 'nature'; tone: 'apaisant' | 'encourageant' | 'contemplatif' | 'joyeux' | 'nostalgique' | 'esperant' }) =>
      storySynthService.createSession({ theme, tone }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story-synth-history', userId] });
      toast({ title: 'Nouvelle histoire commencée' });
    }
  });

  const createStory = useMutation({
    mutationFn: async ({ 
      title, 
      content, 
      genre, 
      style,
      metadata 
    }: { 
      title: string; 
      content: string;
      genre: string;
      style: string;
      metadata: any;
    }) => {
      // Legacy functionality - create a session with calme theme
      const session = await storySynthService.createSession({ theme: 'calme', tone: 'apaisant' });
      return session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story-synth-history', userId] });
      toast({ title: 'Histoire sauvegardée!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const completeSession = useMutation({
    mutationFn: ({ sessionId, duration }: { sessionId: string; duration: number }) =>
      storySynthService.completeSession({ session_id: sessionId, reading_duration_seconds: duration }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story-synth-history', userId] });
      toast({ title: 'Histoire terminée' });
    }
  });

  return {
    history,
    isLoading,
    createSession: createSession.mutate,
    createStory: createStory.mutate,
    completeSession: completeSession.mutate,
    isCreating: createSession.isPending,
    isSavingStory: createStory.isPending
  };
};
