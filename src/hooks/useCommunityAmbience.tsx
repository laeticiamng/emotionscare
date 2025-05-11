
import { useCallback, useEffect, useState } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useSoundscape } from '@/providers/SoundscapeProvider';
import { useOpenAI } from '@/hooks/ai/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { EMOTION_TO_MUSIC_MAP } from '@/services/music/emotion-music-mapping';
import { usePredictiveIntelligence } from '@/hooks/usePredictiveIntelligence';

export interface CommunityAmbienceOptions {
  autoAdjust?: boolean;
  intensity?: 'subtle' | 'moderate' | 'immersive';
  syncWithMood?: boolean;
  continuousEvaluation?: boolean;
  proactiveImprovement?: boolean;
}

export function useCommunityAmbience(options: CommunityAmbienceOptions = {}) {
  const { 
    autoAdjust = true, 
    intensity = 'moderate', 
    syncWithMood = true,
    continuousEvaluation = true,
    proactiveImprovement = true
  } = options;
  
  const { loadPlaylistForEmotion, setOpenDrawer, playTrack, pauseTrack, isPlaying } = useMusic();
  const { updateSoundscapeForEmotion } = useSoundscape();
  const { moderation } = useOpenAI();
  const { toast } = useToast();
  const { currentPredictions } = usePredictiveIntelligence();
  
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ambienceQuality, setAmbienceQuality] = useState<number>(85);
  const [lastEvaluationTime, setLastEvaluationTime] = useState<Date | null>(null);
  
  // Analyser le contenu de la communauté pour détecter l'ambiance émotionnelle
  const analyzeGroupMood = useCallback(async (content: string) => {
    if (!content) return null;
    
    setIsLoading(true);
    try {
      // Utiliser OpenAI pour détecter l'émotion dominante
      const result = await moderation.checkContent(content);
      
      if (result && !result.flagged) {
        // Simulation de détection d'émotion (dans une implémentation réelle,
        // on utiliserait OpenAI pour extraire l'émotion dominante)
        const emotions = ['calm', 'energetic', 'creative', 'reflective', 'anxious'];
        const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        
        setCurrentMood(detectedEmotion);
        
        // Si continuousEvaluation est activé, enregistrer le moment de l'évaluation
        if (continuousEvaluation) {
          setLastEvaluationTime(new Date());
          
          // Simuler l'amélioration de la qualité d'ambiance avec chaque analyse
          setAmbienceQuality(prev => Math.min(prev + 2, 100));
        }
        
        return detectedEmotion;
      }
      
      if (result?.flagged) {
        console.warn("Contenu inapproprié détecté:", result.reason);
      }
      
      return null;
    } catch (error) {
      console.error("Erreur lors de l'analyse de l'ambiance:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [moderation, continuousEvaluation]);
  
  // Adapter l'ambiance sonore en fonction de l'émotion détectée
  const adjustAmbience = useCallback(async (emotion: string) => {
    if (!emotion) return;
    
    try {
      // Mapper l'émotion à un type de musique
      const musicType = EMOTION_TO_MUSIC_MAP[emotion.toLowerCase()] || EMOTION_TO_MUSIC_MAP.default;
      
      // Adapter le soundscape
      if (syncWithMood) {
        updateSoundscapeForEmotion(emotion);
      }
      
      // Charger et jouer la playlist correspondante (seulement si intensity est immersive)
      if (intensity === 'immersive') {
        const playlist = await loadPlaylistForEmotion(musicType);
        
        if (playlist && playlist.tracks && playlist.tracks.length > 0) {
          // Ne pas auto-jouer, juste préparer
          // si on veut jouer: playTrack(playlist.tracks[0]);
          
          if (autoAdjust && !isPlaying) {
            // Montrer le lecteur de musique discrètement
            setOpenDrawer(true);
            
            toast({
              title: "Ambiance communautaire",
              description: `Une playlist adaptée à l'ambiance ${emotion} est prête à être écoutée`,
            });
          }
        }
      }
      
      // Évaluation continue et amélioration proactive
      if (proactiveImprovement && currentPredictions?.emotion) {
        // Fusion intelligente entre l'émotion détectée et l'émotion prédite
        const blendedEmotion = blendEmotions(emotion, currentPredictions.emotion);
        
        if (blendedEmotion !== emotion) {
          toast({
            title: "Amélioration proactive",
            description: `Ambiance optimisée en tenant compte des prédictions émotionnelles`,
          });
          
          // Appliquer l'émotion fusionnée si elle diffère de l'émotion détectée
          updateSoundscapeForEmotion(blendedEmotion);
        }
      }
      
    } catch (error) {
      console.error("Erreur lors de l'ajustement de l'ambiance:", error);
    }
  }, [
    autoAdjust, 
    intensity, 
    syncWithMood, 
    updateSoundscapeForEmotion, 
    loadPlaylistForEmotion, 
    isPlaying, 
    setOpenDrawer, 
    toast, 
    proactiveImprovement,
    currentPredictions
  ]);
  
  // Fonction utilitaire pour fusionner intelligemment deux émotions
  const blendEmotions = (detectedEmotion: string, predictedEmotion: string): string => {
    // Si les émotions sont les mêmes, aucun changement nécessaire
    if (detectedEmotion === predictedEmotion) return detectedEmotion;
    
    // Émotions compatibles qui peuvent être fusionnées pour une expérience enrichie
    const compatiblePairs: Record<string, Record<string, string>> = {
      'calm': { 'reflective': 'deep-calm', 'creative': 'inspired-calm' },
      'energetic': { 'creative': 'creative-flow', 'happy': 'joyful-energy' },
      'reflective': { 'calm': 'mindful-reflection', 'anxious': 'focused-clarity' },
      'creative': { 'energetic': 'dynamic-creativity', 'calm': 'peaceful-inspiration' },
      'anxious': { 'reflective': 'grounded-awareness', 'calm': 'gentle-release' }
    };
    
    // Vérifier s'il existe une fusion spécifique pour ces deux émotions
    if (compatiblePairs[detectedEmotion]?.[predictedEmotion]) {
      return compatiblePairs[detectedEmotion][predictedEmotion];
    }
    
    // Par défaut, priorité à l'émotion détectée
    return detectedEmotion;
  };
  
  // Activer/désactiver l'ambiance
  const toggleAmbience = useCallback((forceState?: boolean) => {
    if (forceState === true || (!forceState && !isPlaying)) {
      if (currentMood) {
        adjustAmbience(currentMood);
      }
    } else {
      pauseTrack();
    }
  }, [currentMood, isPlaying, adjustAmbience, pauseTrack]);
  
  // Analyser et adapter automatiquement l'ambiance pour un groupe de discussion
  const syncGroupAmbience = useCallback(async (groupId: string, recentMessages: string[]) => {
    if (recentMessages.length === 0) return;
    
    // Combiner les messages récents pour analyse
    const combinedContent = recentMessages.join(" ");
    const detectedMood = await analyzeGroupMood(combinedContent);
    
    if (detectedMood && autoAdjust) {
      adjustAmbience(detectedMood);
    }
    
    return detectedMood;
  }, [analyzeGroupMood, autoAdjust, adjustAmbience]);
  
  // Évaluation périodique de la qualité de l'ambiance si l'option continuousEvaluation est activée
  useEffect(() => {
    if (!continuousEvaluation) return;
    
    const evaluationInterval = setInterval(() => {
      // Simuler une légère dégradation de la qualité d'ambiance au fil du temps
      // pour encourager des ajustements réguliers
      setAmbienceQuality(prev => Math.max(prev - 1, 70));
      
      if (ambienceQuality < 75 && currentMood) {
        toast({
          title: "Recommandation d'amélioration",
          description: "L'ambiance sonore pourrait être rafraîchie pour maintenir l'engagement optimal",
          action: {
            label: "Ajuster",
            onClick: () => adjustAmbience(currentMood)
          }
        });
      }
    }, 5 * 60 * 1000); // Évaluation toutes les 5 minutes
    
    return () => clearInterval(evaluationInterval);
  }, [continuousEvaluation, ambienceQuality, currentMood, toast, adjustAmbience]);
  
  // Amélioration proactive basée sur les prédictions
  useEffect(() => {
    if (!proactiveImprovement || !currentPredictions?.emotion || !currentMood) return;
    
    // Si l'émotion prédite diffère significativement de l'émotion actuelle,
    // proposer une adaptation proactive
    if (currentPredictions.emotion !== currentMood && currentPredictions.confidence > 0.7) {
      toast({
        title: "Amélioration proactive disponible",
        description: `Une adaptation sonore optimisée pour l'ambiance prévue "${currentPredictions.emotion}" est disponible`,
        action: {
          label: "Appliquer",
          onClick: () => adjustAmbience(blendEmotions(currentMood, currentPredictions.emotion))
        }
      });
    }
  }, [proactiveImprovement, currentPredictions, currentMood, toast, adjustAmbience]);
  
  return {
    currentMood,
    isLoading,
    analyzeGroupMood,
    adjustAmbience,
    toggleAmbience,
    syncGroupAmbience,
    ambienceQuality,
    lastEvaluationTime,
    // Nouvelles méthodes pour l'évaluation continue
    getQualityMetrics: () => ({
      ambienceQuality,
      lastEvaluationTime,
      currentMood
    }),
    resetEvaluation: () => {
      setAmbienceQuality(85);
      setLastEvaluationTime(new Date());
    },
  };
}
