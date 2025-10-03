
import { useState, useCallback } from 'react';
import dalleService, { DALLEOptions } from '@/services/dalle';

interface DALLEResult {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
}

interface UseDalleReturn extends DALLEResult {
  generateImage: (prompt: string, options?: DALLEOptions) => Promise<string | null>;
  generateEmotionImage: (emotion: string, options?: DALLEOptions) => Promise<string | null>;
  generatePersonalizedImage: (userContext: string, emotion: string, options?: DALLEOptions) => Promise<string | null>;
  generateVariations: (imageUrl: string, options?: DALLEOptions) => Promise<string[] | null>;
  checkApiConnection: () => Promise<{ status: boolean; message: string }>;
  reset: () => void;
}

export const useDalle = (): UseDalleReturn => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setImageUrl(null);
    setError(null);
  }, []);

  const generateImage = useCallback(async (prompt: string, options?: DALLEOptions): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const url = await dalleService.generateImage(prompt, options);
      setImageUrl(url);
      setLoading(false);
      return url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to generate image: ${errorMessage}`);
      setLoading(false);
      return null;
    }
  }, []);

  const generateVariations = useCallback(async (imgUrl: string, options?: DALLEOptions): Promise<string[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const urls = await dalleService.generateVariations(imgUrl, options);
      if (urls && urls.length > 0) {
        setImageUrl(urls[0]);
      }
      setLoading(false);
      return urls;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to generate variations: ${errorMessage}`);
      setLoading(false);
      return null;
    }
  }, []);

  const generateEmotionImage = useCallback(async (emotion: string, options?: DALLEOptions): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const url = await dalleService.generateEmotionImage(emotion, options);
      setImageUrl(url);
      setLoading(false);
      return url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to generate emotion image: ${errorMessage}`);
      setLoading(false);
      return null;
    }
  }, []);

  const generatePersonalizedImage = useCallback(async (
    userContext: string, 
    emotion: string, 
    options?: DALLEOptions
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const url = await dalleService.generatePersonalizedImage(userContext, emotion, options);
      setImageUrl(url);
      setLoading(false);
      return url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to generate personalized image: ${errorMessage}`);
      setLoading(false);
      return null;
    }
  }, []);

  const checkApiConnection = useCallback(async () => {
    return dalleService.checkApiConnection();
  }, []);

  return {
    imageUrl,
    loading,
    error,
    generateImage,
    generateEmotionImage,
    generatePersonalizedImage,
    generateVariations,
    checkApiConnection,
    reset
  };
};

export default useDalle;
