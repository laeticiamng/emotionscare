/**
 * Hook pour gérer les blocs temporels personnels (B2C)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type TimeBlockType = 'creation' | 'recovery' | 'constraint' | 'emotional' | 'chosen' | 'imposed';

export interface TimeBlock {
  id: string;
  user_id: string;
  version_id: string | null;
  block_type: TimeBlockType;
  label: string | null;
  day_of_week: number;
  start_hour: number;
  duration_hours: number;
  energy_level: number | null;
  emotional_valence: number | null;
  emotional_arousal: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTimeBlockInput {
  version_id?: string;
  block_type: TimeBlockType;
  label?: string;
  day_of_week: number;
  start_hour: number;
  duration_hours: number;
  energy_level?: number;
  emotional_valence?: number;
  emotional_arousal?: number;
  notes?: string;
}

export interface TimeBlockStats {
  creation: number;
  recovery: number;
  constraint: number;
  emotional: number;
  chosen: number;
  imposed: number;
  total: number;
}

export function useTimeBlocks(versionId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch time blocks
  const { data: blocks = [], isLoading, error, refetch } = useQuery({
    queryKey: ['time-blocks', versionId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      let query = supabase
        .from('time_blocks')
        .select('*')
        .eq('user_id', user.id)
        .order('day_of_week', { ascending: true })
        .order('start_hour', { ascending: true });

      if (versionId) {
        query = query.eq('version_id', versionId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TimeBlock[];
    },
  });

  // Create time block
  const createMutation = useMutation({
    mutationFn: async (input: CreateTimeBlockInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('time_blocks')
        .insert({
          user_id: user.id,
          ...input,
        })
        .select()
        .single();

      if (error) throw error;
      return data as TimeBlock;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-blocks'] });
      toast({
        title: 'Bloc créé',
        description: 'Votre bloc temporel a été ajouté',
      });
    },
    onError: (_error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le bloc',
        variant: 'destructive',
      });
    },
  });

  // Update time block
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TimeBlock> & { id: string }) => {
      const { data, error } = await supabase
        .from('time_blocks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as TimeBlock;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-blocks'] });
    },
  });

  // Delete time block
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('time_blocks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-blocks'] });
      toast({
        title: 'Bloc supprimé',
        description: 'Le bloc temporel a été supprimé',
      });
    },
  });

  // Calculate stats
  const stats: TimeBlockStats = blocks.reduce(
    (acc, block) => {
      const hours = block.duration_hours;
      acc[block.block_type] += hours;
      acc.total += hours;
      return acc;
    },
    { creation: 0, recovery: 0, constraint: 0, emotional: 0, chosen: 0, imposed: 0, total: 0 }
  );

  // Group blocks by day
  const blocksByDay = blocks.reduce((acc, block) => {
    const day = block.day_of_week;
    if (!acc[day]) acc[day] = [];
    acc[day].push(block);
    return acc;
  }, {} as Record<number, TimeBlock[]>);

  return {
    blocks,
    blocksByDay,
    stats,
    isLoading,
    error,
    refetch,
    createBlock: createMutation.mutateAsync,
    updateBlock: updateMutation.mutateAsync,
    deleteBlock: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
