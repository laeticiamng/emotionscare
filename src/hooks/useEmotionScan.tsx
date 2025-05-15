
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createEmotionEntry, fetchLatestEmotion } from '@/lib/scanService';
import type { EmotionResult } from '@/types';

export function useEmotionScan() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastEmotion, setLastEmotion] = useState<EmotionResult | null>(null);
  const { user } = useAuth();

  const scanEmotion = async (input: {
    text?: string;
    emojis?: string;
    audio_url?: string;
    is_confidential?: boolean;
    share_with_coach?: boolean;
  }) => {
    if (!user) {
      setError("Vous devez être connecté pour enregistrer une émotion");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call the createEmotionEntry function with all required fields
      const emotion = await createEmotionEntry({
        user_id: user.id,
        date: new Date().toISOString(),
        ...input
      });
      
      setLastEmotion(emotion);
      return emotion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getLatestEmotion = async () => {
    if (!user) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const emotion = await fetchLatestEmotion(user.id);
      setLastEmotion(emotion);
      return emotion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    scanEmotion,
    getLatestEmotion,
    lastEmotion,
    isLoading,
    error
  };
}

export default useEmotionScan;
