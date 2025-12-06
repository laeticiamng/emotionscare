
import { useState, useEffect, useCallback } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { useBranding } from '@/contexts/BrandingContext';
import { useStorytelling } from '@/providers/StorytellingProvider';
import { useSoundscape } from '@/providers/SoundscapeProvider';
import useLogger from '@/hooks/useLogger';
import { usePredictiveAnalytics } from '@/providers/PredictiveAnalyticsProvider';
import { useToast } from '@/hooks/use-toast';

export interface PredictiveFeature {
  name: string;
  description: string;
  enabled: boolean;
  priority: number; // 1-10, 10 being highest priority
  toggleFeature: () => void;
}

export function usePredictiveIntelligence(userMode: 'b2c' | 'b2b' | 'b2b-admin' = 'b2c') {
  const [availableFeatures, setAvailableFeatures] = useState<PredictiveFeature[]>([]);
  const { isEnabled: predictionEnabled, setEnabled: setPredictionEnabled, currentPredictions } = usePredictiveAnalytics();
  const { toast } = useToast();
  const logger = useLogger('PredictiveIntelligence');
  
  const { updateSoundscapeForEmotion } = useSoundscape();
  const { applyEmotionalBranding } = useBranding();
  const { addStory } = useStorytelling();
  const { loadPlaylistForEmotion } = useMusic();
  
  // Define available predictive features
  useEffect(() => {
    const features: PredictiveFeature[] = [
      {
        name: 'Prédiction émotionnelle',
        description: 'Anticiper vos états émotionnels pour adapter l\'expérience',
        enabled: predictionEnabled,
        priority: 10,
        toggleFeature: () => setPredictionEnabled(!predictionEnabled)
      },
      {
        name: 'Recommandations musicales prédictives',
        description: 'Suggérer automatiquement des musiques adaptées à votre état prédit',
        enabled: true,
        priority: 8,
        toggleFeature: () => {
          // Toggle music recommendation feature logic would go here
        }
      },
      {
        name: 'Adaptation visuelle anticipative',
        description: 'Ajuster l\'interface selon vos préférences anticipées',
        enabled: true,
        priority: 7,
        toggleFeature: () => {
          // Toggle visual adaptation feature logic would go here
        }
      },
      {
        name: 'Storytelling prédictif',
        description: 'Présenter des récits pertinents selon les prédictions',
        enabled: true,
        priority: 6,
        toggleFeature: () => {
          // Toggle storytelling feature logic would go here
        }
      }
    ];
    
    // For B2B admin, add additional analytics features
    if (userMode === 'b2b-admin') {
      features.push({
        name: 'Analyses prédictives d\'équipe',
        description: 'Anticiper les tendances collectives pour optimiser l\'environnement de travail',
        enabled: true,
        priority: 9,
        toggleFeature: () => {
          // Toggle team analytics feature logic would go here
        }
      });
    }
    
    setAvailableFeatures(features.sort((a, b) => b.priority - a.priority));
  }, [predictionEnabled, userMode, setPredictionEnabled]);
  
  // Apply predictive adaptations based on current predictions
  useEffect(() => {
    if (!predictionEnabled || !currentPredictions) return;
    
    const applyPredictiveAdaptations = async () => {
      try {
        const { emotion, confidence } = currentPredictions;
        logger.debug(`Applying predictive adaptations for emotion: ${emotion} (${confidence})`);
        
        // Only apply high-confidence predictions
        if (confidence > 0.85) {
          // 1. Update soundscape subtly based on predicted emotion
          updateSoundscapeForEmotion(emotion);
          
          // 2. Apply subtle branding changes
          applyEmotionalBranding(emotion);
          
          // 3. Prepare relevant music in the background (but don't auto-play)
          await loadPlaylistForEmotion(emotion);
          
          toast({
            title: "Adaptation prédictive activée",
            description: `L'interface s'adapte à votre état émotionnel anticipé: ${emotion}`,
          });
        }
      } catch (error) {
        logger.error('Error applying predictive adaptations:', error);
      }
    };
    
    applyPredictiveAdaptations();
  }, [currentPredictions, predictionEnabled]);
  
  // Generate a proactive story based on predictions
  const generateProactiveStory = useCallback(() => {
    if (!currentPredictions || !predictionEnabled) return;
    
    const { emotion, confidence } = currentPredictions;
    
    // Only create stories for high-confidence predictions
    if (confidence > 0.9) {
      const storyTypes = {
        focused: 'achievement',
        calm: 'insight',
        energetic: 'milestone',
        creative: 'feature',
        stressed: 'insight',
        tired: 'insight'
      };
      
      const storyType = storyTypes[emotion as keyof typeof storyTypes] || 'insight';
      
      addStory({
        type: storyType as any,
        title: 'Adaptation prédictive',
        content: `Nous anticipons que vous pourriez bénéficier d'une expérience optimisée pour un état ${emotion}. Découvrez nos recommandations personnalisées.`,
        voice: 'supportive',
        emotion: emotion,
        cta: {
          text: 'Explorer',
          action: '/dashboard'
        }
      });
    }
  }, [currentPredictions, predictionEnabled, addStory]);
  
  return {
    availableFeatures,
    predictionEnabled,
    setPredictionEnabled,
    currentPredictions,
    generateProactiveStory
  };
}

export default usePredictiveIntelligence;
