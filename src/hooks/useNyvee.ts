/**
 * Hook React Query pour Nyvee
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NyveeService } from '@/modules/nyvee/nyveeService';
import { useToast } from '@/hooks/use-toast';

export const useNyvee = (userId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Récupérer l'historique
  const { data: history, isLoading } = useQuery({
    queryKey: ['nyvee-history', userId],
    queryFn: () => NyveeService.fetchHistory(userId),
    enabled: !!userId
  });

  // Créer une session
  const createSession = useMutation({
    mutationFn: ({ cozyLevel, moodBefore }: { cozyLevel?: number; moodBefore?: number }) =>
      NyveeService.createSession(userId, cozyLevel, moodBefore),
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

  // Mettre à jour le niveau de confort
  const updateCozyLevel = useMutation({
    mutationFn: ({ sessionId, cozyLevel }: { sessionId: string; cozyLevel: number }) =>
      NyveeService.updateCozyLevel(sessionId, cozyLevel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nyvee-history', userId] });
    }
  });

  // Compléter une session
  const completeSession = useMutation({
    mutationFn: ({ sessionId, duration, moodAfter }: { 
      sessionId: string; 
      duration: number;
      moodAfter?: number;
    }) => NyveeService.completeSession(sessionId, duration, moodAfter),
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
