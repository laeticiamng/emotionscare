
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EmotionResult } from '@/types/emotion';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuid } from 'uuid';

// Production service function for creating emotion entries
const createEmotionEntry = async (data: EmotionResult): Promise<EmotionResult> => {
  try {
    const { data: result, error } = await supabase
      .from('emotion_scans')
      .insert({
        id: data.id,
        user_id: data.user_id,
        emotion: data.emotion,
        confidence: data.confidence,
        emotions: data.emotions,
        emojis: data.emojis,
        source: data.source || 'text',
        timestamp: data.timestamp
      })
      .select()
      .single();

    if (error) throw error;
    return result as EmotionResult;
  } catch (error) {
    console.error('Error creating emotion entry:', error);
    throw error;
  }
};

// Production service function for fetching latest emotion
const fetchLatestEmotion = async (userId: string): Promise<EmotionResult | null> => {
  try {
    const { data, error } = await supabase
      .from('emotion_scans')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data as EmotionResult | null;
  } catch (error) {
    console.error('Error fetching latest emotion:', error);
    return null;
  }
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
