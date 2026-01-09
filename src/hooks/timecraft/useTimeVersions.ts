/**
 * Hook pour gérer les versions de trajectoires temporelles (B2C)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TimeVersion {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  version_type: 'current' | 'ideal' | 'past' | 'scenario';
  is_active: boolean;
  snapshot_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CreateVersionInput {
  name: string;
  description?: string;
  version_type: 'current' | 'ideal' | 'past' | 'scenario';
  is_active?: boolean;
}

export function useTimeVersions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch versions
  const { data: versions = [], isLoading, error, refetch } = useQuery({
    queryKey: ['time-versions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('time_versions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TimeVersion[];
    },
  });

  // Get active version
  const activeVersion = versions.find(v => v.is_active) || null;

  // Create version
  const createMutation = useMutation({
    mutationFn: async (input: CreateVersionInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('time_versions')
        .insert({
          user_id: user.id,
          ...input,
        })
        .select()
        .single();

      if (error) throw error;
      return data as TimeVersion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-versions'] });
      toast({
        title: 'Version créée',
        description: 'Nouvelle trajectoire temporelle enregistrée',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la version',
        variant: 'destructive',
      });
    },
  });

  // Update version
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TimeVersion> & { id: string }) => {
      const { data, error } = await supabase
        .from('time_versions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as TimeVersion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-versions'] });
    },
  });

  // Set active version
  const setActiveMutation = useMutation({
    mutationFn: async (versionId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Deactivate all versions
      await supabase
        .from('time_versions')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Activate selected version
      const { data, error } = await supabase
        .from('time_versions')
        .update({ is_active: true })
        .eq('id', versionId)
        .select()
        .single();

      if (error) throw error;
      return data as TimeVersion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-versions'] });
      toast({
        title: 'Version activée',
        description: 'Cette trajectoire est maintenant active',
      });
    },
  });

  // Delete version
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('time_versions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-versions'] });
      toast({
        title: 'Version supprimée',
        description: 'La trajectoire a été supprimée',
      });
    },
  });

  // Duplicate version with blocks
  const duplicateVersion = async (sourceVersionId: string, newName: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    // Create new version
    const newVersion = await createMutation.mutateAsync({
      name: newName,
      version_type: 'scenario',
    });

    // Copy blocks
    const { data: sourceBlocks } = await supabase
      .from('time_blocks')
      .select('*')
      .eq('version_id', sourceVersionId);

    if (sourceBlocks && sourceBlocks.length > 0) {
      const newBlocks = sourceBlocks.map(block => ({
        user_id: user.id,
        version_id: newVersion.id,
        block_type: block.block_type,
        label: block.label,
        day_of_week: block.day_of_week,
        start_hour: block.start_hour,
        duration_hours: block.duration_hours,
        energy_level: block.energy_level,
        emotional_valence: block.emotional_valence,
        emotional_arousal: block.emotional_arousal,
        notes: block.notes,
      }));

      await supabase.from('time_blocks').insert(newBlocks);
    }

    queryClient.invalidateQueries({ queryKey: ['time-blocks'] });
    return newVersion;
  };

  return {
    versions,
    activeVersion,
    isLoading,
    error,
    refetch,
    createVersion: createMutation.mutateAsync,
    updateVersion: updateMutation.mutateAsync,
    setActiveVersion: setActiveMutation.mutateAsync,
    deleteVersion: deleteMutation.mutateAsync,
    duplicateVersion,
    isCreating: createMutation.isPending,
  };
}
