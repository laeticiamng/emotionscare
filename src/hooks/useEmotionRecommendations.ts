// @ts-nocheck

import { useState, useEffect, useCallback } from 'react';
import emotionRecommendationService, { EmotionRecommendation } from '@/services/coach/emotion-recommendation-service';
import { logger } from '@/lib/logger';

interface UseEmotionRecommendationsOptions {
  initialEmotion?: string;
  initialCategory?: string;
  autoFetch?: boolean;
  limit?: number;
}

export function useEmotionRecommendations({
  initialEmotion = 'neutral',
  initialCategory,
  autoFetch = true,
  limit = 3
}: UseEmotionRecommendationsOptions = {}) {
  const [emotion, setEmotion] = useState<string>(initialEmotion);
  const [category, setCategory] = useState<string | undefined>(initialCategory);
  const [recommendations, setRecommendations] = useState<EmotionRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async (emotionValue = emotion, categoryValue = category) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let results: EmotionRecommendation[];
      
      if (categoryValue) {
        // Si une catégorie spécifique est demandée
        const recommendation = await emotionRecommendationService.generateRecommendation(
          emotionValue, 
          categoryValue
        );
        
        results = [{
          emotion: emotionValue,
          category: categoryValue as 'music' | 'vr' | 'exercise' | 'mindfulness' | 'general',
          content: recommendation
        }];
      } else {
        // Sinon, obtenir plusieurs recommandations
        results = await emotionRecommendationService.getRecommendationsForEmotion(
          emotionValue, 
          limit
        );
      }
      
      setRecommendations(results);
    } catch (err) {
      logger.error('Error fetching emotion recommendations', err as Error, 'SYSTEM');
      setError('Impossible de charger les recommandations');
    } finally {
      setIsLoading(false);
    }
  }, [emotion, category, limit]);

  // Charger automatiquement les recommandations au montage ou quand l'émotion change
  useEffect(() => {
    if (autoFetch) {
      fetchRecommendations();
    }
  }, [autoFetch, emotion, category, fetchRecommendations]);

  // Pour changer l'émotion et recharger les recommandations
  const updateEmotion = useCallback((newEmotion: string) => {
    setEmotion(newEmotion);
    if (autoFetch) {
      fetchRecommendations(newEmotion, category);
    }
  }, [category, autoFetch, fetchRecommendations]);

  // Pour changer la catégorie et recharger les recommandations
  const updateCategory = useCallback((newCategory?: string) => {
    setCategory(newCategory);
    if (autoFetch) {
      fetchRecommendations(emotion, newCategory);
    }
  }, [emotion, autoFetch, fetchRecommendations]);

  return {
    emotion,
    category,
    recommendations,
    isLoading,
    error,
    updateEmotion,
    updateCategory,
    fetchRecommendations
  };
}

export default useEmotionRecommendations;
