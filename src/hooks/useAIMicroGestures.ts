// @ts-nocheck
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface AIMicroGesture {
  icon: string;
  label: string;
  description: string;
  duration: string;
}

export interface MicroGestureSuggestions {
  gestures: AIMicroGesture[];
  summary: string;
}

/**
 * Hook pour obtenir des suggestions de micro-gestes personnalisées
 * générées par l'IA en fonction de l'état émotionnel
 */
export const useAIMicroGestures = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<MicroGestureSuggestions | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Récupère les émotions récentes de l'utilisateur depuis clinical_signals
   */
  const getRecentEmotions = useCallback(async (): Promise<string[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const since = new Date(Date.now() - 30 * 60 * 1000).toISOString(); // 30 dernières minutes

      const { data: signals } = await supabase
        .from('clinical_signals')
        .select('metadata')
        .eq('user_id', user.id)
        .in('source_instrument', ['scan_camera', 'SAM', 'scan_sliders'])
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!signals) return [];

      const emotions = signals
        .map(s => (s.metadata as any)?.emotion || (s.metadata as any)?.summary)
        .filter(Boolean);

      return [...new Set(emotions)]; // Déduplications
    } catch (error) {
      logger.warn('Erreur récupération émotions récentes', { error }, 'GESTURES');
      return [];
    }
  }, []);

  /**
   * Génère des suggestions de micro-gestes personnalisées
   */
  const generateSuggestions = useCallback(async (params: {
    emotion: string;
    valence: number;
    arousal: number;
    context?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const recentEmotions = await getRecentEmotions();

      const { data, error: funcError } = await supabase.functions.invoke(
        'emotion-micro-gestures',
        {
          body: {
            emotion: params.emotion,
            valence: params.valence,
            arousal: params.arousal,
            context: params.context,
            recentEmotions
          }
        }
      );

      if (funcError) {
        throw new Error(funcError.message || 'Erreur génération suggestions');
      }

      if (!data || !data.gestures) {
        throw new Error('Aucune suggestion reçue');
      }

      logger.info('Suggestions micro-gestes générées', { 
        count: data.gestures.length,
        emotion: params.emotion 
      }, 'GESTURES');

      setSuggestions(data);
      return data;

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur génération suggestions';
      logger.error('Erreur génération micro-gestes IA', err as Error, 'GESTURES');
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getRecentEmotions]);

  const reset = useCallback(() => {
    setSuggestions(null);
    setError(null);
  }, []);

  return {
    isLoading,
    suggestions,
    error,
    generateSuggestions,
    reset
  };
};
