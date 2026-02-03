/**
 * Hook pour Perplexity AI Search
 * Recherche contextuelle intelligente
 */

import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  searchWithAI,
  searchStressTechniques,
  searchMeditationResources,
  searchEmotionInfo,
  searchWellnessHelp,
  type SearchContext,
  type SearchResult,
} from '@/services/perplexity';
import { toast } from 'sonner';

interface UsePerplexityOptions {
  context?: SearchContext;
  language?: 'fr' | 'en';
  onError?: (error: Error) => void;
}

export function usePerplexity(options: UsePerplexityOptions = {}) {
  const { context = 'general', language = 'fr', onError } = options;
  
  const [lastResult, setLastResult] = useState<SearchResult | null>(null);

  // Mutation pour recherche générale
  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      return searchWithAI(query, { context, language });
    },
    onSuccess: (result) => {
      setLastResult(result);
    },
    onError: (error: Error) => {
      toast.error('Erreur de recherche IA');
      onError?.(error);
    },
  });

  // Recherche de techniques anti-stress
  const stressMutation = useMutation({
    mutationFn: async (symptoms: string[]) => {
      return searchStressTechniques(symptoms);
    },
    onSuccess: setLastResult,
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  // Recherche méditation
  const meditationMutation = useMutation({
    mutationFn: async (goal: 'relaxation' | 'focus' | 'sleep' | 'anxiety') => {
      return searchMeditationResources(goal);
    },
    onSuccess: setLastResult,
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  // Recherche info émotion
  const emotionMutation = useMutation({
    mutationFn: async (emotion: string) => {
      return searchEmotionInfo(emotion);
    },
    onSuccess: setLastResult,
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  // Recherche aide bien-être
  const wellnessMutation = useMutation({
    mutationFn: async (topic: string) => {
      return searchWellnessHelp(topic);
    },
    onSuccess: setLastResult,
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  // Fonction de recherche principale
  const search = useCallback((query: string) => {
    searchMutation.mutate(query);
  }, [searchMutation]);

  return {
    // État
    result: lastResult,
    isLoading: 
      searchMutation.isPending || 
      stressMutation.isPending || 
      meditationMutation.isPending ||
      emotionMutation.isPending ||
      wellnessMutation.isPending,
    error: searchMutation.error,
    
    // Actions
    search,
    searchStress: (symptoms: string[]) => stressMutation.mutate(symptoms),
    searchMeditation: (goal: 'relaxation' | 'focus' | 'sleep' | 'anxiety') => 
      meditationMutation.mutate(goal),
    searchEmotion: (emotion: string) => emotionMutation.mutate(emotion),
    searchWellness: (topic: string) => wellnessMutation.mutate(topic),
    
    // Reset
    clearResult: () => setLastResult(null),
  };
}

/**
 * Hook pour recherche de bien-être avec cache
 */
export function useWellnessSearch(topic: string, enabled = true) {
  return useQuery({
    queryKey: ['wellness-search', topic],
    queryFn: () => searchWellnessHelp(topic),
    enabled: enabled && topic.length > 3,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 heure
  });
}

/**
 * Hook pour info émotion avec cache
 */
export function useEmotionSearch(emotion: string, enabled = true) {
  return useQuery({
    queryKey: ['emotion-search', emotion],
    queryFn: () => searchEmotionInfo(emotion),
    enabled: enabled && emotion.length > 2,
    staleTime: 1000 * 60 * 60, // 1 heure
    gcTime: 1000 * 60 * 60 * 24, // 24 heures
  });
}

export default usePerplexity;
