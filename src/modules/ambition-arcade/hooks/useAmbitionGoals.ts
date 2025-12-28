/**
 * Hook pour la gestion des objectifs Ambition Arcade
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface AmbitionGoal {
  id: string;
  objective: string;
  status: 'active' | 'completed' | 'abandoned';
  tags: string[];
  createdAt: string;
  completedAt?: string;
  questsTotal: number;
  questsCompleted: number;
  xpEarned: number;
}

export interface CreateGoalInput {
  objective: string;
  tags?: string[];
}

export function useAmbitionGoals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ambition-goals', user?.id],
    queryFn: async (): Promise<AmbitionGoal[]> => {
      if (!user?.id) throw new Error('Non authentifié');

      const { data: runs, error: runsError } = await supabase
        .from('ambition_runs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (runsError) throw runsError;

      // Pour chaque run, récupérer les quêtes
      const goalsWithQuests = await Promise.all(
        (runs || []).map(async (run) => {
          const { data: quests } = await supabase
            .from('ambition_quests')
            .select('status, xp_reward')
            .eq('run_id', run.id);

          const completedQuests = quests?.filter(q => q.status === 'completed') || [];
          const xpEarned = completedQuests.reduce((sum, q) => sum + (q.xp_reward || 0), 0);

          return {
            id: run.id,
            objective: run.objective || 'Sans titre',
            status: (run.status || 'active') as 'active' | 'completed' | 'abandoned',
            tags: run.tags || [],
            createdAt: run.created_at || new Date().toISOString(),
            completedAt: run.completed_at || undefined,
            questsTotal: quests?.length || 0,
            questsCompleted: completedQuests.length,
            xpEarned
          };
        })
      );

      return goalsWithQuests;
    },
    enabled: !!user?.id,
  });
}

export function useCreateGoal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateGoalInput) => {
      if (!user?.id) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('ambition_runs')
        .insert({
          user_id: user.id,
          objective: input.objective,
          tags: input.tags || [],
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambition-goals'] });
      queryClient.invalidateQueries({ queryKey: ['ambition-stats'] });
      toast({
        title: 'Objectif créé',
        description: 'Votre nouvel objectif a été ajouté',
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

export function useCompleteGoal() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase
        .from('ambition_runs')
        .update({ 
          status: 'completed', 
          completed_at: new Date().toISOString() 
        })
        .eq('id', goalId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambition-goals'] });
      queryClient.invalidateQueries({ queryKey: ['ambition-stats'] });
      toast({
        title: 'Objectif complété',
        description: 'Félicitations pour cette réussite !',
      });
    },
  });
}

export function useAbandonGoal() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase
        .from('ambition_runs')
        .update({ status: 'abandoned' })
        .eq('id', goalId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambition-goals'] });
      queryClient.invalidateQueries({ queryKey: ['ambition-stats'] });
      toast({
        title: 'Objectif abandonné',
        description: 'Vous pourrez toujours en créer de nouveaux',
      });
    },
  });
}
