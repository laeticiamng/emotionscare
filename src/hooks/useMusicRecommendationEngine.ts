import { useState, useCallback, useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import type { EmotionResult, MusicTrack } from '@/types';

// Classification des émotions plus détaillée
export enum EmotionCategory {
  POSITIVE = 'positive',  // émotions positives (joie, enthousiasme)
  CALM = 'calm',          // émotions calmes (tranquillité, sérénité)
  FOCUS = 'focus',        // états de concentration (focus, détermination)
  NEGATIVE = 'negative',  // émotions négatives (tristesse, anxiété)
  NEUTRAL = 'neutral',    // état neutre
}

// Mapping des émotions vers les catégories
export const emotionToCategoryMap: Record<string, EmotionCategory> = {
  // Émotions positives
  happy: EmotionCategory.POSITIVE,
  excited: EmotionCategory.POSITIVE,
  joyful: EmotionCategory.POSITIVE,
  satisfied: EmotionCategory.POSITIVE,
  energetic: EmotionCategory.POSITIVE,
  
  // Émotions calmes
  calm: EmotionCategory.CALM,
  relaxed: EmotionCategory.CALM,
  peaceful: EmotionCategory.CALM,
  tranquil: EmotionCategory.CALM,
  
  // Émotions nécessitant du focus
  focused: EmotionCategory.FOCUS,
  determined: EmotionCategory.FOCUS,
  concentrated: EmotionCategory.FOCUS,
  
  // Émotions négatives
  sad: EmotionCategory.NEGATIVE,
  anxious: EmotionCategory.NEGATIVE,
  stressed: EmotionCategory.NEGATIVE,
  angry: EmotionCategory.NEGATIVE,
  frustrated: EmotionCategory.NEGATIVE,
  overwhelmed: EmotionCategory.NEGATIVE,
  tired: EmotionCategory.NEGATIVE,
  
  // État neutre
  neutral: EmotionCategory.NEUTRAL,
  normal: EmotionCategory.NEUTRAL,
};

// Type pour la configuration musicale
interface MusicRecommendationConfig {
  targetMood?: EmotionCategory | null;
  shouldAutoplay?: boolean;
  intensityLevel?: number;
}

export function useMusicRecommendationEngine() {
  const { 
    loadPlaylistForEmotion, 
    playTrack, 
    pauseTrack, 
    openDrawer, 
    currentTrack, 
    isPlaying 
  } = useMusic();
  const { toast } = useToast();
  
  const [lastRecommendation, setLastRecommendation] = useState<{
    emotion: string,
    track: MusicTrack | null
  } | null>(null);
  
  const [config, setConfig] = useState<MusicRecommendationConfig>({
    targetMood: null,
    shouldAutoplay: true,
    intensityLevel: 5, // 1-10
  });
  
  // Fonction pour obtenir la catégorie d'émotion
  const getEmotionCategory = useCallback((emotion: string): EmotionCategory => {
    const normalized = emotion.toLowerCase().trim();
    return emotionToCategoryMap[normalized] || EmotionCategory.NEUTRAL;
  }, []);
  
  // Fonction pour mapper l'émotion à un type de musique
  const mapEmotionToMusicType = useCallback((emotion: string): string => {
    const category = getEmotionCategory(emotion);
    
    // Par défaut, on recommande une musique qui correspond à l'état émotionnel
    if (!config.targetMood) {
      switch (category) {
        case EmotionCategory.POSITIVE:
          return 'happy';
        case EmotionCategory.CALM:
          return 'calm';
        case EmotionCategory.FOCUS:
          return 'focused';
        case EmotionCategory.NEGATIVE:
          return 'calm'; // Pour les émotions négatives, on suggère de la musique apaisante
        case EmotionCategory.NEUTRAL:
        default:
          return 'neutral';
      }
    }
    
    // Si une cible thérapeutique est définie, on la suit
    switch (config.targetMood) {
      case EmotionCategory.POSITIVE:
        return 'happy';
      case EmotionCategory.CALM:
        return 'calm';
      case EmotionCategory.FOCUS:
        return 'focused';
      case EmotionCategory.NEUTRAL:
      default:
        return 'neutral';
    }
  }, [config.targetMood, getEmotionCategory]);
  
  // Fonction principale pour recommander de la musique
  const recommendMusicForEmotion = useCallback((emotionResult: EmotionResult | null) => {
    if (!emotionResult || !emotionResult.emotion) {
      return null;
    }
    
    try {
      const emotionName = emotionResult.emotion.toLowerCase();
      const musicType = mapEmotionToMusicType(emotionName);
      const playlist = loadPlaylistForEmotion(musicType);
      
      if (!playlist || playlist.tracks.length === 0) {
        toast({
          title: "Aucune musique disponible",
          description: `Pas de playlist disponible pour l'émotion ${emotionResult.emotion}`,
          variant: "destructive"
        });
        return null;
      }
      
      // On choisit une piste en fonction de l'intensité de l'émotion si disponible
      let selectedTrack = playlist.tracks[0];
      if (emotionResult.intensity && playlist.tracks.length > 1) {
        const trackIndex = Math.min(
          Math.floor((emotionResult.intensity / 10) * playlist.tracks.length),
          playlist.tracks.length - 1
        );
        selectedTrack = playlist.tracks[trackIndex];
      }
      
      // Make sure the track conforms to the MusicTrack type
      const normalizedTrack: MusicTrack = {
        ...selectedTrack,
        audioUrl: selectedTrack.audioUrl || selectedTrack.url || '',
      };
      
      // Autoplay si configuré
      if (config.shouldAutoplay) {
        playTrack(normalizedTrack);
        openDrawer();
      }
      
      setLastRecommendation({
        emotion: emotionName,
        track: normalizedTrack
      });
      
      return {
        playlist,
        track: normalizedTrack,
        emotionCategory: getEmotionCategory(emotionName)
      };
      
    } catch (error) {
      console.error('Error recommending music for emotion:', error);
      toast({
        title: "Erreur de recommandation",
        description: "Impossible de charger les recommandations musicales",
        variant: "destructive"
      });
      return null;
    }
  }, [
    loadPlaylistForEmotion, 
    playTrack, 
    openDrawer, 
    toast, 
    config.shouldAutoplay, 
    mapEmotionToMusicType,
    getEmotionCategory
  ]);
  
  // Fonction pour mettre à jour la configuration
  const updateConfig = useCallback((newConfig: Partial<MusicRecommendationConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  }, []);
  
  return {
    recommendMusicForEmotion,
    updateConfig,
    config,
    lastRecommendation,
    currentTrack,
    isPlaying,
    playTrack,
    pauseTrack,
    EmotionCategory,
    getEmotionCategory
  };
}
