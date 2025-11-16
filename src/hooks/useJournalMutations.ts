/**
 * Hook pour gérer les mutations du journal (create, update, delete)
 * Utilise l'API v1/journal
 */

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface JournalEntry {
  title: string;
  content: string;
  mood?: string;
  mood_score?: number;
  tags?: string[];
  emotion?: string;
  is_private?: boolean;
}

export function useJournalMutations() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEntry = async (entry: JournalEntry) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          title: entry.title,
          content: entry.content,
          mood: entry.mood,
          mood_score: entry.mood_score,
          tags: entry.tags || [],
          emotion: entry.emotion,
          is_private: entry.is_private ?? true,
          date: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      logger.info('Journal entry created', { entryId: data.id }, 'HOOK');
      return data;
    } catch (err) {
      logger.error('Failed to create journal entry', err as Error, 'HOOK');
      setError('Impossible de sauvegarder l\'entrée');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (entryId: string, updates: Partial<JournalEntry>) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('journal_entries')
        .update(updates)
        .eq('id', entryId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      logger.info('Journal entry updated', { entryId }, 'HOOK');
      return data;
    } catch (err) {
      logger.error('Failed to update journal entry', err as Error, 'HOOK');
      setError('Impossible de mettre à jour l\'entrée');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (entryId: string) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      logger.info('Journal entry deleted', { entryId }, 'HOOK');
      return true;
    } catch (err) {
      logger.error('Failed to delete journal entry', err as Error, 'HOOK');
      setError('Impossible de supprimer l\'entrée');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEntry,
    updateEntry,
    deleteEntry,
    loading,
    error,
  };
}
