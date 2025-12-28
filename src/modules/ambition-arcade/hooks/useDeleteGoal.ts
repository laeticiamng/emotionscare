/**
 * Hook pour supprimer définitivement un objectif
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useDeleteGoal() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goalId: string) => {
      // Supprimer d'abord les quêtes liées
      await supabase
        .from('ambition_quests')
        .delete()
        .eq('run_id', goalId);

      // Supprimer les artefacts liés
      await supabase
        .from('ambition_artifacts')
        .delete()
        .eq('run_id', goalId);

      // Supprimer l'objectif
      const { error } = await supabase
        .from('ambition_runs')
        .delete()
        .eq('id', goalId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambition-goals'] });
      queryClient.invalidateQueries({ queryKey: ['ambition-stats'] });
      toast({
        title: 'Objectif supprimé',
        description: 'L\'objectif a été définitivement supprimé',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
