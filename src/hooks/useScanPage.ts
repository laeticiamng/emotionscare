
import { useState, useEffect, useCallback } from 'react';
import { Emotion } from '@/types';
import { fetchEmotionHistory } from '@/lib/scanService';
import { useAuth } from '@/contexts/AuthContext';

export function useScanPage() {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const refreshEmotions = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const history = await fetchEmotionHistory(user.id);
      setEmotions(history);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(message);
      console.error("Error refreshing emotions:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  // Charger l'historique d'émotions au montage
  useEffect(() => {
    if (user?.id) {
      refreshEmotions();
    }
  }, [user?.id, refreshEmotions]);

  return {
    emotions,
    isLoading,
    error,
    refreshEmotions
  };
}

export default useScanPage;
