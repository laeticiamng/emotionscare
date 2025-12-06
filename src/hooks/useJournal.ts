// @ts-nocheck
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JournalEntry, useJournalStore } from '@/store/journal.store';

interface JournalList {
  entries: JournalEntry[];
}

const fetchJournalEntries = async (params: { from?: string; to?: string; q?: string }): Promise<JournalList> => {
  const { data, error } = await supabase.functions.invoke('journal-weekly', {
    body: params
  });

  if (error) throw error;
  return data;
};

export const useJournal = () => {
  const { setUploading, setCurrentEntry, addEntry } = useJournalStore();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ['journal-entries'],
    queryFn: () => fetchJournalEntries({}),
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const submitVoice = async (audioBlob: Blob): Promise<void> => {
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice-note.webm');
      formData.append('lang', 'fr');

      const { data: result, error } = await supabase.functions.invoke('journal-voice', {
        body: formData
      });

      if (error) throw error;

      // Poll for analysis result
      const entryId = result.entry_id;
      const pollResult = async (): Promise<JournalEntry> => {
        const { data: entry, error } = await supabase.functions.invoke('journal-entry', {
          body: { entry_id: entryId }
        });
        
        if (error) throw error;
        return entry;
      };

      // Simple polling with timeout
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds max
      
      const checkResult = async (): Promise<JournalEntry> => {
        try {
          const entry = await pollResult();
          if (entry.mood_bucket) {
            return entry;
          }
        } catch (e) {
          // Continue polling
        }
        
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error('Analysis timeout');
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        return checkResult();
      };

      const finalEntry = await checkResult();
      setCurrentEntry(finalEntry);
      addEntry(finalEntry);
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });

    } finally {
      setUploading(false);
    }
  };

  const submitText = async (text: string): Promise<void> => {
    try {
      setUploading(true);

      const { data: result, error } = await supabase.functions.invoke('journal-text', {
        body: { text, lang: 'fr' }
      });

      if (error) throw error;

      // Poll for result similar to voice
      const entryId = result.entry_id;
      const pollResult = async (): Promise<JournalEntry> => {
        const { data: entry, error } = await supabase.functions.invoke('journal-entry', {
          body: { entry_id: entryId }
        });
        
        if (error) throw error;
        return entry;
      };

      let attempts = 0;
      const maxAttempts = 20;
      
      const checkResult = async (): Promise<JournalEntry> => {
        try {
          const entry = await pollResult();
          if (entry.mood_bucket) {
            return entry;
          }
        } catch (e) {
          // Continue polling
        }
        
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error('Analysis timeout');
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        return checkResult();
      };

      const finalEntry = await checkResult();
      setCurrentEntry(finalEntry);
      addEntry(finalEntry);
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });

    } finally {
      setUploading(false);
    }
  };

  return {
    entries: data?.entries || [],
    loading: isLoading,
    error,
    submitVoice,
    submitText,
  };
};