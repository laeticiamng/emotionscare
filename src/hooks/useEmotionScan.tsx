
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createEmotionEntry, fetchLatestEmotion } from '@/lib/scanService';
import { EmotionResult } from '@/types/emotion';
import { v4 as uuid } from 'uuid';

export function useEmotionScan() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [latestEmotion, setLatestEmotion] = useState<EmotionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch the latest emotion for the current user
  const fetchLatest = useCallback(async () => {
    if (!user?.id) return null;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const emotion = await fetchLatestEmotion(user.id);
      if (emotion) {
        setLatestEmotion(emotion);
      }
      
      return emotion;
    } catch (err) {
      console.error('Error fetching latest emotion:', err);
      setError('Failed to load your latest emotion scan');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Create a new emotion entry
  const createEmotion = useCallback(async (data: Partial<EmotionResult>) => {
    if (!user?.id) {
      setError('You must be logged in to save emotions');
      return null;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const emotionData: Partial<EmotionResult> = {
        ...data,
        id: data.id || uuid(),
        user_id: user.id,
        date: data.date || new Date().toISOString()
      };
      
      const newEmotion = await createEmotionEntry(emotionData);
      setLatestEmotion(newEmotion);
      
      return newEmotion;
    } catch (err) {
      console.error('Error creating emotion:', err);
      setError('Failed to save your emotion');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  return {
    latestEmotion,
    isLoading,
    error,
    fetchLatest,
    createEmotion,
    setLatestEmotion
  };
}

export default useEmotionScan;
