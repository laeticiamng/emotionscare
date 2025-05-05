
import { useCallback } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import type { EmotionResult } from '@/lib/scanService';

// Map des émotions vers les types de musique
const EMOTION_TO_MUSIC: Record<string, string> = {
  happy: 'happy',
  sad: 'calm',
  angry: 'calm',
  anxious: 'calm',
  calm: 'neutral',
  excited: 'energetic',
  stressed: 'calm',
  tired: 'calm',
  neutral: 'neutral',
  focused: 'focused'
};

export function useMusicRecommendation() {
  const { loadPlaylistForEmotion, openDrawer } = useMusic();
  const { toast } = useToast();
  
  // Handler pour activer la musique adaptée à l'émotion
  const handlePlayMusic = useCallback((emotionResult?: EmotionResult | null) => {
    if (!emotionResult || !emotionResult.emotion) return;
    
    const musicType = EMOTION_TO_MUSIC[emotionResult.emotion.toLowerCase()] || 'neutral';
    
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
