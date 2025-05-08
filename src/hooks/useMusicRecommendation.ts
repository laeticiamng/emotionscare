
import { useState, useCallback } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { MusicTrack } from '@/types/music';

// Mapping des émotions vers les types de musique
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
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { loadPlaylistForEmotion, playTrack, pauseTrack, isPlaying, openDrawer } = useMusic();
  const { toast } = useToast();

  const loadMusicForMood = useCallback(async (emotion: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const emotionKey = emotion.toLowerCase();
      const musicType = EMOTION_TO_MUSIC[emotionKey] || EMOTION_TO_MUSIC.default;
      
      console.log(`Chargement de musique pour l'émotion: ${emotionKey} → Type: ${musicType}`);
      
      const playlist = loadPlaylistForEmotion(musicType);
      if (playlist && playlist.tracks.length > 0) {
        setCurrentTrack(playlist.tracks[0]);
        playTrack(playlist.tracks[0]);
      } else {
        setError(`Aucune musique disponible pour l'humeur "${emotion}"`);
      }
    } catch (err) {
      console.error('Erreur lors du chargement de la musique:', err);
      setError("Une erreur est survenue lors du chargement de la musique");
    } finally {
      setIsLoading(false);
    }
  }, [loadPlaylistForEmotion, playTrack]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    }
  }, [isPlaying, currentTrack, playTrack, pauseTrack]);

  return {
    isLoading,
    currentTrack,
    error,
    loadMusicForMood,
    togglePlayPause
  };
}

export default useMusicRecommendation;
