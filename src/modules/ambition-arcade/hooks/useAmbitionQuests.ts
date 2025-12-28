/**
 * Hook pour la gestion des quêtes Ambition Arcade
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useConfetti } from './useConfetti';

export interface AmbitionQuest {
  id: string;
  runId: string;
  title: string;
  flavor?: string;
  status: 'available' | 'in_progress' | 'completed';
  xpReward: number;
  estMinutes: number;
  result?: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface CreateQuestInput {
  runId: string;
  title: string;
  flavor?: string;
  xpReward?: number;
  estMinutes?: number;
}

export function useAmbitionQuests(runId?: string) {
  return useQuery({
    queryKey: ['ambition-quests', runId],
    queryFn: async (): Promise<AmbitionQuest[]> => {
      if (!runId) return [];

      const { data, error } = await supabase
        .from('ambition_quests')
        .select('*')
        .eq('run_id', runId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(q => ({
        id: q.id,
        runId: q.run_id || '',
        title: q.title,
        flavor: q.flavor || undefined,
        status: (q.status || 'available') as 'available' | 'in_progress' | 'completed',
        xpReward: q.xp_reward || 25,
        estMinutes: q.est_minutes || 15,
        result: q.result || undefined,
        notes: q.notes || undefined,
        createdAt: q.created_at || new Date().toISOString(),
        completedAt: q.completed_at || undefined
      }));
    },
    enabled: !!runId,
  });
}

export function useCreateQuest() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateQuestInput) => {
      const { data, error } = await supabase
        .from('ambition_quests')
        .insert({
          run_id: input.runId,
          title: input.title,
          flavor: input.flavor,
          xp_reward: input.xpReward || 25,
          est_minutes: input.estMinutes || 15,
          status: 'available'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ambition-quests', variables.runId] });
      queryClient.invalidateQueries({ queryKey: ['ambition-goals'] });
      toast({
        title: 'Quête ajoutée',
        description: 'Nouvelle quête créée avec succès',
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

export function useCompleteQuest() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { fireQuestCompleteConfetti } = useConfetti();

  return useMutation({
    mutationFn: async ({ questId, result, notes }: { questId: string; result?: string; notes?: string }) => {
      const { data, error } = await supabase
        .from('ambition_quests')
        .update({
          status: 'completed',
          result,
          notes,
          completed_at: new Date().toISOString()
        })
        .eq('id', questId)
        .select('xp_reward, run_id')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ambition-quests'] });
      queryClient.invalidateQueries({ queryKey: ['ambition-goals'] });
      queryClient.invalidateQueries({ queryKey: ['ambition-stats'] });
      queryClient.invalidateQueries({ queryKey: ['ambition-artifacts'] });
      
      fireQuestCompleteConfetti();
      
      toast({
        title: '✅ Quête complétée !',
        description: `+${data?.xp_reward || 0} XP gagnés`,
      });
    },
  });
}

export function useStartQuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questId: string) => {
      const { error } = await supabase
        .from('ambition_quests')
        .update({ status: 'in_progress' })
        .eq('id', questId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambition-quests'] });
    },
  });
}
