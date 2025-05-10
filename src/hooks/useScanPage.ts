
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchEmotionHistory } from '@/lib/scanService';
import { Emotion } from '@/types';

export const useScanPage = () => {
  const { user } = useAuth();
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const emotionHistory = await fetchEmotionHistory(user.id);
      setEmotions(emotionHistory);
    } catch (err) {
      console.error('Error fetching emotion history:', err);
      setError('Impossible de charger votre historique d\'émotions');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshEmotions = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    emotions,
    isLoading,
    error,
    refreshEmotions,
  };
};
