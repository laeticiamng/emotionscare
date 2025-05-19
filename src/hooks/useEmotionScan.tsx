
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EmotionResult } from '@/types/emotion';
import { v4 as uuid } from 'uuid';

// Mock service function for creating emotion entries
const createEmotionEntry = async (data: EmotionResult): Promise<EmotionResult> => {
  // This would normally be an API call
  console.log('Creating emotion entry:', data);
  return Promise.resolve(data);
};

// Mock service function for fetching latest emotion
const fetchLatestEmotion = async (userId: string): Promise<EmotionResult | null> => {
  // This would normally be an API call
  console.log('Fetching latest emotion for user:', userId);
  return Promise.resolve(null);
};

export function useEmotionScan() {
  const { user } = useAuth() || { user: null };
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
      
      const emotionData: EmotionResult = {
        ...data,
        id: data.id || uuid(),
        emotion: data.emotion || 'neutral',
        confidence: data.confidence || 1.0,
        timestamp: data.timestamp || new Date().toISOString(),
        user_id: user.id,
        emojis: data.emojis || [],
        emotions: data.emotions || {},
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
