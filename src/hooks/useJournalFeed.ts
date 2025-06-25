
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ApiService } from '@/services/api';

interface JournalEntry {
  id: string;
  content: string;
  date: string;
  ai_feedback?: string;
}

export const useJournalFeed = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getJournalFeed(user.id);
      setEntries(data.entries || []);
    } catch (err) {
      setError('Erreur lors du chargement du journal');
      console.error('Journal feed error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (text: string) => {
    if (!user?.id) return;
    
    try {
      await ApiService.postJournalText({ userId: user.id, text });
      await fetchEntries(); // Refresh
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'entrée');
      console.error('Add journal entry error:', err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user?.id]);

  return {
    entries,
    loading,
    error,
    addEntry,
    refetch: fetchEntries,
  };
};
