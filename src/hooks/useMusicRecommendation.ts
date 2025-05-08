
import { useState, useCallback } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

interface UseMusicRecommendationProps {
  defaultMood?: string;
}

export function useMusicRecommendation({ defaultMood = 'calm' }: UseMusicRecommendationProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState<string>(defaultMood);
  const [error, setError] = useState<string | null>(null);
  
  const { loadPlaylistForEmotion, playTrack, pauseTrack, currentTrack } = useMusic();
  const { toast } = useToast();
  
  const loadMusicForMood = useCallback(async (mood: string) => {
    if (!mood) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await loadPlaylistForEmotion(mood);
      setCurrentMood(mood);
      
      toast({
        title: "Playlist chargée",
        description: `Musique adaptée pour l'ambiance "${mood}"`
      });
      
      return true;
    } catch (err) {
      console.error("Erreur lors du chargement de la playlist:", err);
      setError("Impossible de charger la musique pour cette ambiance");
      
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger la playlist musicale",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadPlaylistForEmotion, toast]);
  
  const togglePlayPause = useCallback(() => {
    if (!currentTrack) return;
    
    if (currentTrack.isPlaying) {
      pauseTrack();
    } else {
      playTrack(currentTrack);
    }
  }, [currentTrack, playTrack, pauseTrack]);
  
  return {
    isLoading,
    currentMood,
    error,
    loadMusicForMood,
    togglePlayPause,
    currentTrack
  };
}
