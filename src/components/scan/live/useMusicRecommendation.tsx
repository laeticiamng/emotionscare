
import { useCallback } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import type { EmotionResult } from '@/types';

// Mapping plus complet des émotions vers les types de musique
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

export function useMusicRecommendation() {
  const { loadPlaylistForEmotion, openDrawer } = useMusic();
  const { toast } = useToast();
  
  // Handler pour activer la musique adaptée à l'émotion
  const handlePlayMusic = useCallback((emotionResult?: EmotionResult | null) => {
    if (!emotionResult || !emotionResult.emotion) return;
    
    const emotionKey = emotionResult.emotion.toLowerCase();
    const musicType = EMOTION_TO_MUSIC[emotionKey] || EMOTION_TO_MUSIC.default;
    
    console.log(`Émotion détectée: ${emotionKey} → Type de musique: ${musicType}`);
    
    loadPlaylistForEmotion(musicType);
    openDrawer();
    
    toast({
      title: "Playlist activée",
      description: `Votre ambiance musicale "${musicType}" est prête à être écoutée`,
    });
  }, [loadPlaylistForEmotion, openDrawer, toast]);

  return {
    handlePlayMusic,
    EMOTION_TO_MUSIC
  };
}
