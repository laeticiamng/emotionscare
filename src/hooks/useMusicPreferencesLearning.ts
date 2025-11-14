/**
 * Hook pour l'apprentissage automatique des préférences musicales
 */

import { useState, useEffect, useCallback } from 'react';
import { analyzeMusicBehavior, applyLearningAdjustments } from '@/services/music/preferences-learning-service';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

interface LearningInsights {
  suggestedGenres: string[];
  adjustedMoods: string[];
  tempoShift: { min: number; max: number };
  energyLevelAdjustment: number;
  tasteChangeDetected: boolean;
  confidence: number;
}

export const useMusicPreferencesLearning = () => {
  const [insights, setInsights] = useState<LearningInsights | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);

  // Analyser automatiquement au montage
  useEffect(() => {
    analyzePreferences();
  }, []);

  const analyzePreferences = useCallback(async () => {
    try {
      setIsAnalyzing(true);
      
      const result = await analyzeMusicBehavior();
      
      if (result) {
        setInsights(result);
        setLastAnalysis(new Date());
        
        logger.info('Preferences analysis completed', { 
          confidence: result.confidence,
          tasteChange: result.tasteChangeDetected 
        }, 'MUSIC');

        // Notification si changement de goût détecté
        if (result.tasteChangeDetected && result.confidence > 0.7) {
          toast.info('🎵 Nous avons détecté une évolution de vos goûts musicaux', {
            description: 'Voulez-vous ajuster vos préférences automatiquement ?',
          });
        }
      }
    } catch (error) {
      logger.error('Failed to analyze preferences', error as Error, 'MUSIC');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const applyAdjustments = useCallback(async (autoApply: boolean = false) => {
    if (!insights) {
      toast.error('Aucune analyse disponible');
      return;
    }

    try {
      setIsApplying(true);

      const result = await applyLearningAdjustments(insights, autoApply);

      if (result.success) {
        toast.success('Préférences ajustées !', {
          description: result.message,
        });
        
        // Recharger les insights après application
        await analyzePreferences();
      } else {
        toast.error('Erreur lors de l\'ajustement', {
          description: result.message,
        });
      }
    } catch (error) {
      logger.error('Failed to apply adjustments', error as Error, 'MUSIC');
      toast.error('Une erreur est survenue');
    } finally {
      setIsApplying(false);
    }
  }, [insights, analyzePreferences]);

  return {
    insights,
    isAnalyzing,
    isApplying,
    lastAnalysis,
    analyzePreferences,
    applyAdjustments,
  };
};
