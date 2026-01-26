/**
 * Hook React Query pour Nyvee
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nyveeService } from '@/modules/nyvee/nyveeServiceUnified';
import { useToast } from '@/hooks/use-toast';

export const useNyvee = (userId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Récupérer l'historique
  const { data: history, isLoading } = useQuery({
    queryKey: ['nyvee-history', userId],
    queryFn: () => nyveeService.getRecentSessions(10),
    enabled: !!userId
  });

  // Créer une session
  const createSession = useMutation({
    mutationFn: ({ intensity, moodBefore }: { intensity?: 'calm' | 'moderate' | 'intense'; moodBefore?: number }) =>
      nyveeService.createSession({ 
        intensity: intensity || 'calm', 
        targetCycles: 6,
        moodBefore 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nyvee-history', userId] });
      toast({ title: 'Session Nyvee démarrée' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Mettre à jour le niveau de confort (placeholder)
  const updateCozyLevel = useMutation({
    mutationFn: async (_params: { sessionId: string; cozyLevel: number }) => {
      // Placeholder - would call nyveeService
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nyvee-history', userId] });
    }
  });

  // Compléter une session
  const completeSession = useMutation({
 mutationFn: ({ sessionId, moodAfter }: { 
      sessionId: string; 
      duration: number;
      moodAfter?: number;
    }) => nyveeService.completeSession({
      sessionId,
      cyclesCompleted: 6,
      badgeEarned: 'calm',
      moodAfter,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nyvee-history', userId] });
      toast({ title: 'Session terminée avec succès' });
    }
  });

  return {
    history,
    isLoading,
    createSession: createSession.mutate,
    updateCozyLevel: updateCozyLevel.mutate,
    completeSession: completeSession.mutate,
    isCreating: createSession.isPending,
    isUpdating: updateCozyLevel.isPending,
    isCompleting: completeSession.isPending
  };
};
