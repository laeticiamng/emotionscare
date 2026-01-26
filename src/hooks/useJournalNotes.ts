import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { SanitizedNote } from '@/modules/journal/types';

interface CreateNoteInput {
  text: string;
  tags?: string[];
  summary?: string;
  mode?: 'text' | 'voice';
}

interface UpdateNoteInput {
  id: string;
  text?: string;
  tags?: string[];
  summary?: string;
  is_favorite?: boolean;
  is_archived?: boolean;
}

/**
 * Hook pour gérer les notes du journal avec Supabase
 */
export const useJournalNotes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all notes
  const { data: notes = [], isLoading, error } = useQuery({
    queryKey: ['journal-notes'],
    queryFn: async (): Promise<SanitizedNote[]> => {
      const { data, error } = await supabase
        .from('journal_notes')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(note => ({
        id: note.id,
        text: note.text,
        tags: note.tags || [],
        summary: note.summary || undefined,
        mode: note.mode || undefined,
        created_at: note.created_at,
      }));
    },
  });

  // Create note mutation
  const createNote = useMutation({
    mutationFn: async (input: CreateNoteInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('journal_notes')
        .insert({
          user_id: user.id,
          text: input.text,
          tags: input.tags || [],
          summary: input.summary,
          mode: input.mode,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-notes'] });
      toast({
        title: 'Note créée',
        description: 'Votre note a été enregistrée avec succès',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de créer la note',
        variant: 'destructive',
      });
    },
  });

  // Update note mutation
  const updateNote = useMutation({
    mutationFn: async (input: UpdateNoteInput) => {
      const { id, ...updates } = input;
      const { data, error } = await supabase
        .from('journal_notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-notes'] });
      toast({
        title: 'Note mise à jour',
        description: 'Vos modifications ont été enregistrées',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de mettre à jour la note',
        variant: 'destructive',
      });
    },
  });

  // Delete note mutation
  const deleteNote = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase
        .from('journal_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-notes'] });
      toast({
        title: 'Note supprimée',
        description: 'La note a été supprimée définitivement',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de supprimer la note',
        variant: 'destructive',
      });
    },
  });

  // Toggle favorite mutation
  const toggleFavorite = useMutation({
    mutationFn: async ({ id, isFavorite }: { id: string; isFavorite: boolean }) => {
      const { error } = await supabase
        .from('journal_notes')
        .update({ is_favorite: isFavorite })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-notes'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de modifier le favori',
        variant: 'destructive',
      });
    },
  });

  // Archive note mutation
  const archiveNote = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase
        .from('journal_notes')
        .update({ is_archived: true })
        .eq('id', noteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-notes'] });
      toast({
        title: 'Note archivée',
        description: 'La note a été déplacée vers les archives',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible d\'archiver la note',
        variant: 'destructive',
      });
    },
  });

  return {
    notes,
    isLoading,
    error,
    createNote: createNote.mutate,
    updateNote: updateNote.mutate,
    deleteNote: deleteNote.mutate,
    toggleFavorite: toggleFavorite.mutate,
    archiveNote: archiveNote.mutate,
    isCreating: createNote.isPending,
    isUpdating: updateNote.isPending,
    isDeleting: deleteNote.isPending,
  };
};
