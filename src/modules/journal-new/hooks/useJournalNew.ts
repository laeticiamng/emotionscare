import { useState, useCallback } from 'react';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

interface UseJournalNewReturn {
  entries: JournalEntry[];
  addEntry: () => void;
  loading: boolean;
}

/**
 * Hook pour gérer le nouveau journal enrichi
 */
export const useJournalNew = (): UseJournalNewReturn => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const addEntry = useCallback(() => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: '',
    };
    setEntries(prev => [newEntry, ...prev]);
  }, []);

  return {
    entries,
    addEntry,
    loading,
  };
};
