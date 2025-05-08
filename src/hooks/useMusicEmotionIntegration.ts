
import { useCallback } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import type { EmotionResult } from '@/lib/scanService';
import type { Emotion } from '@/types';

// Mapping complet des émotions vers les types de musique
const EMOTION_TO_MUSIC: Record<string, string> = {
  // États positifs
  happy: 'happy',
  excited: 'energetic',
  joyful: 'happy',
  satisfied: 'happy',
  energetic: 'energetic',
  
  // États calmes
  calm: 'calm',
  relaxed: 'calm',
  peaceful: 'calm',
  tranquil: 'calm',
  
  // États négatifs - musique apaisante
  sad: 'calm',
  anxious: 'calm',
  stressed: 'calm',
  angry: 'calm',
  frustrated: 'calm',
  overwhelmed: 'calm',
  tired: 'calm',
  
  // États de concentration
  focused: 'focused',
  determined: 'focused',
  concentrated: 'focused',
  
  // État neutre
  neutral: 'neutral',
  normal: 'neutral',
  
  // Valeurs par défaut pour émotions non mappées
  default: 'neutral'
};

export interface MusicEmotionOptions {
  showToast?: boolean;
  openDrawer?: boolean;
}

export function useMusicEmotionIntegration() {
  const { loadPlaylistForEmotion, openDrawer } = useMusic();
  const { toast } = useToast();
  
  // Handler pour activer la musique adaptée à une émotion brute (string)
  const playMusicForEmotion = useCallback((
    emotion: string, 
    options: MusicEmotionOptions = {}
  ) => {
    const { showToast = true, openDrawer: shouldOpenDrawer = true } = options;
    
    const emotionKey = emotion.toLowerCase();
    const musicType = EMOTION_TO_MUSIC[emotionKey] || EMOTION_TO_MUSIC.default;
    
    console.log(`Émotion détectée: ${emotionKey} → Type de musique: ${musicType}`);
    
    loadPlaylistForEmotion(musicType);
    
    if (shouldOpenDrawer) {
      openDrawer();
    }
    
    if (showToast) {
      toast({
        title: "Playlist activée",
        description: `Votre ambiance musicale "${musicType}" est prête à être écoutée`,
      });
    }
    
    return musicType;
  }, [loadPlaylistForEmotion, openDrawer, toast]);
  
  // Handler pour activer la musique adaptée à un objet EmotionResult
  const playMusicForEmotionResult = useCallback((
    emotionResult?: EmotionResult | null,
    options: MusicEmotionOptions = {}
  ) => {
    if (!emotionResult || !emotionResult.emotion) return null;
    
    return playMusicForEmotion(emotionResult.emotion, options);
  }, [playMusicForEmotion]);
  
  // Handler pour activer la musique adaptée à un objet Emotion
  const playMusicForEmotionObject = useCallback((
    emotion?: Emotion | null,
    options: MusicEmotionOptions = {}
  ) => {
    if (!emotion || !emotion.emotion) return null;
    
    return playMusicForEmotion(emotion.emotion, options);
  }, [playMusicForEmotion]);
  
  // Obtenir le type de musique recommandé pour une émotion sans jouer
  const getMusicTypeForEmotion = useCallback((emotion: string) => {
    const emotionKey = emotion.toLowerCase();
    return EMOTION_TO_MUSIC[emotionKey] || EMOTION_TO_MUSIC.default;
  }, []);

  return {
    playMusicForEmotion,
    playMusicForEmotionResult,
    playMusicForEmotionObject,
    getMusicTypeForEmotion,
    EMOTION_TO_MUSIC
  };
}

export default useMusicEmotionIntegration;
