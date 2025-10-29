// @ts-nocheck
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

export interface EmotionTrend {
  avgValence: number;
  avgArousal: number;
  dominantEmotion: string;
  emotionCount: Record<string, number>;
  timeWindow: string;
}

export interface MusicGenerationParams {
  timeWindowMinutes?: number; // Par défaut 30 minutes
  useLatestOnly?: boolean; // Utiliser seulement la dernière émotion
}

/**
 * Hook pour générer de la musique basée sur l'historique émotionnel stocké dans clinical_signals
 */
export const useClinicalMusicGeneration = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [trend, setTrend] = useState<EmotionTrend | null>(null);

  /**
   * Analyse l'historique émotionnel récent depuis clinical_signals
   */
  const analyzeEmotionalTrend = useCallback(async (
    params: MusicGenerationParams = {}
  ): Promise<EmotionTrend | null> => {
    const { timeWindowMinutes = 30, useLatestOnly = false } = params;
    
    setIsAnalyzing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      // Calculer la fenêtre temporelle
      const since = new Date(Date.now() - timeWindowMinutes * 60 * 1000).toISOString();

      // Récupérer les signaux émotionnels récents
      const { data: signals, error } = await supabase
        .from('clinical_signals')
        .select('metadata, created_at')
        .eq('user_id', user.id)
        .in('source_instrument', ['scan_camera', 'SAM', 'scan_sliders'])
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(useLatestOnly ? 1 : 50);

      if (error) throw error;
      if (!signals || signals.length === 0) {
        toast.info('Aucune donnée émotionnelle récente trouvée');
        return null;
      }

      // Analyser les tendances
      let totalValence = 0;
      let totalArousal = 0;
      const emotionCount: Record<string, number> = {};

      signals.forEach((signal) => {
        const meta = signal.metadata as any;
        if (meta) {
          totalValence += meta.valence ?? 50;
          totalArousal += meta.arousal ?? 50;
          
          const emotion = meta.emotion || meta.summary || 'neutre';
          emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
        }
      });

      const count = signals.length;
      const avgValence = Math.round(totalValence / count);
      const avgArousal = Math.round(totalArousal / count);

      // Trouver l'émotion dominante
      const dominantEmotion = Object.entries(emotionCount)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutre';

      const emotionTrend: EmotionTrend = {
        avgValence,
        avgArousal,
        dominantEmotion,
        emotionCount,
        timeWindow: useLatestOnly ? 'instant' : `${timeWindowMinutes}min`
      };

      setTrend(emotionTrend);
      logger.info('Tendance émotionnelle analysée', emotionTrend, 'MUSIC');
      
      return emotionTrend;

    } catch (error) {
      logger.error('Erreur analyse tendance émotionnelle', error as Error, 'MUSIC');
      toast.error('Erreur lors de l\'analyse émotionnelle');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * Génère une musique basée sur l'historique émotionnel
   */
  const generateMusicFromHistory = useCallback(async (
    params: MusicGenerationParams = {}
  ) => {
    setIsGenerating(true);
    
    try {
      // 1. Analyser la tendance émotionnelle
      toast.info('Analyse de votre historique émotionnel...');
      const emotionTrend = await analyzeEmotionalTrend(params);
      
      if (!emotionTrend) {
        throw new Error('Impossible d\'analyser vos émotions');
      }

      // 2. Appeler l'edge function pour générer la musique
      toast.info('Génération de votre musique personnalisée...');
      
      const { data, error } = await supabase.functions.invoke(
        'emotion-music-generate',
        {
          body: {
            emotionState: {
              valence: emotionTrend.avgValence,
              arousal: emotionTrend.avgArousal,
              dominantEmotion: emotionTrend.dominantEmotion,
              labels: Object.keys(emotionTrend.emotionCount)
            },
            userContext: {
              timeWindow: emotionTrend.timeWindow,
              emotionDistribution: emotionTrend.emotionCount
            }
          }
        }
      );

      if (error) throw error;

      if (!data?.taskId) {
        throw new Error('Aucune tâche de génération créée');
      }

      logger.info('Musique générée depuis historique', { 
        taskId: data.taskId, 
        trend: emotionTrend 
      }, 'MUSIC');
      
      toast.success('Votre musique est en cours de création !');

      return {
        taskId: data.taskId,
        emotionBadge: data.emotionBadge,
        estimatedDuration: data.estimatedDuration || 120,
        trend: emotionTrend
      };

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erreur de génération';
      logger.error('Erreur génération musique depuis historique', error as Error, 'MUSIC');
      toast.error(errorMsg);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [analyzeEmotionalTrend]);

  return {
    // État
    isAnalyzing,
    isGenerating,
    trend,
    
    // Actions
    analyzeEmotionalTrend,
    generateMusicFromHistory,
  };
};
