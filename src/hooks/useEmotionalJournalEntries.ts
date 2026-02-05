/**
 * useEmotionalJournalEntries - Hook pour gérer les entrées du journal émotionnel
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { EmotionalJournalEntryData } from '@/components/journal/EmotionalJournalEntryForm';
import { EmotionalType } from '@/components/journal/EmotionalJournalSelector';
import { EmotionalJournalEntry } from '@/components/journal/EmotionalJournalTimeline';
import { toast } from 'sonner';

interface EmotionalJournalFilters {
  emotion?: EmotionalType | 'all';
  startDate?: Date;
  endDate?: Date;
}

export const useEmotionalJournalEntries = (filters?: EmotionalJournalFilters) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Récupérer les entrées avec filtres
  const entriesQuery = useQuery({
    queryKey: ['emotional-journal-entries', user?.id, filters],
    queryFn: async (): Promise<EmotionalJournalEntry[]> => {
      if (!user) return [];

      let query = supabase
        .from('journal_entries')
        .select('id, user_id, emotion, intensity, content, tags, created_at, updated_at, is_favorite')
        .eq('user_id', user.id)
        .not('emotion', 'is', null)
        .order('created_at', { ascending: false });

      // Filtre par émotion
      if (filters?.emotion && filters.emotion !== 'all') {
        query = query.eq('emotion', filters.emotion);
      }

      // Filtre par période
      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate.toISOString());
      }
      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate.toISOString());
      }

      const { data, error } = await query.limit(100);

      if (error) {
        console.error('Error fetching journal entries:', error);
        throw error;
      }

      return (data || []) as EmotionalJournalEntry[];
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  // Créer une nouvelle entrée
  const createEntryMutation = useMutation({
    mutationFn: async (entry: EmotionalJournalEntryData) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          emotion: entry.emotion,
          intensity: entry.intensity,
          content: entry.content,
          tags: entry.tags.length > 0 ? entry.tags : null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating journal entry:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotional-journal-entries', user?.id] });
      toast.success('Entrée enregistrée !');
    },
    onError: (error) => {
      console.error('Error creating entry:', error);
      toast.error('Erreur lors de l\'enregistrement');
    },
  });

  // Supprimer une entrée
  const deleteEntryMutation = useMutation({
    mutationFn: async (entryId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting journal entry:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotional-journal-entries', user?.id] });
      toast.success('Entrée supprimée');
    },
    onError: (error) => {
      console.error('Error deleting entry:', error);
      toast.error('Erreur lors de la suppression');
    },
  });

  // Toggle favori
  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ entryId, isFavorite }: { entryId: string; isFavorite: boolean }) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('journal_entries')
        .update({ is_favorite: isFavorite })
        .eq('id', entryId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotional-journal-entries', user?.id] });
    },
  });

  // Export RGPD en JSON
  const exportEntries = async (): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const exportData = {
      exportDate: new Date().toISOString(),
      userId: user.id,
      userEmail: user.email,
      totalEntries: data?.length || 0,
      entries: data || [],
    };

    return JSON.stringify(exportData, null, 2);
  };

  // Statistiques
  const stats = (() => {
    const entries = entriesQuery.data || [];
    const emotionCounts: Record<string, number> = {};
    
    entries.forEach(e => {
      if (e.emotion) {
        emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
      }
    });

    const mostFrequentEmotion = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const avgIntensity = entries.length > 0
      ? entries.reduce((sum, e) => sum + (e.intensity || 0), 0) / entries.length
      : 0;

    return {
      totalEntries: entries.length,
      emotionCounts,
      mostFrequentEmotion,
      avgIntensity: Math.round(avgIntensity * 10) / 10,
    };
  })();

  return {
    entries: entriesQuery.data || [],
    stats,
    isLoading: entriesQuery.isLoading,
    createEntry: createEntryMutation.mutateAsync,
    isCreating: createEntryMutation.isPending,
    deleteEntry: deleteEntryMutation.mutateAsync,
    isDeleting: deleteEntryMutation.isPending,
    toggleFavorite: toggleFavoriteMutation.mutateAsync,
    exportEntries,
    refetch: entriesQuery.refetch,
  };
};

export default useEmotionalJournalEntries;
