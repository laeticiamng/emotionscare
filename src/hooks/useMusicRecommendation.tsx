
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useMusic } from '@/contexts/MusicContext';
import { EmotionResult, MusicTrack } from '@/types';

export function useMusicRecommendation() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { 
    currentPlaylist, 
    setCurrentPlaylist, 
    currentTrack, 
    setCurrentTrack, 
    isPlaying, 
    setIsPlaying,
    setOpenDrawer,
    loadPlaylistForEmotion,
    playTrack
  } = useMusic();
  const { toast } = useToast();

  // Define emotion to music mapping
  const EMOTION_TO_MUSIC: Record<string, string> = {
    'happy': 'Musique entraînante',
    'sad': 'Musique apaisante',
    'angry': 'Musique calmante',
    'anxious': 'Sons de méditation',
    'neutral': 'Musique douce',
    'calm': 'Sons de nature',
    'stressed': 'Musique relaxante',
    'energetic': 'Musique dynamique',
    'bored': 'Musique stimulante',
    'tired': 'Musique méditative',
    'fearful': 'Musique enveloppante',
    'default': 'Musique apaisante'
  };

  // Get music recommendations for an emotion
  const getRecommendationsForEmotion = useCallback((emotion: string) => {
    try {
      const playlist = loadPlaylistForEmotion(emotion.toLowerCase());
      return playlist?.tracks || [];
    } catch (err) {
      console.error('Error getting music recommendations:', err);
      return [];
    }
  }, [loadPlaylistForEmotion]);

  // Load music for a specific mood
  const loadMusicForMood = useCallback((mood: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const playlist = loadPlaylistForEmotion(mood.toLowerCase());
      if (playlist && playlist.tracks && playlist.tracks.length > 0) {
        const track = playlist.tracks[0];
        playTrack(track);
        safeOpen(setOpenDrawer);
        setIsLoading(false);
        return track;
      } else {
        setError("Aucune musique disponible pour cette humeur");
        setIsLoading(false);
        return null;
      }
    } catch (err) {
      console.error('Error loading music for mood:', err);
      setError("Erreur lors du chargement de la musique");
      setIsLoading(false);
      return null;
    }
  }, [loadPlaylistForEmotion, playTrack, setOpenDrawer]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying, setIsPlaying]);

  // Handle play music based on emotion result
  const handlePlayMusic = useCallback((emotionResult: EmotionResult) => {
    if (!emotionResult || !emotionResult.emotion) {
      toast({
        title: "Pas d'émotion détectée",
        description: "Nous n'avons pas pu détecter votre émotion pour vous recommander une musique",
        variant: "destructive",
      });
      return;
    }

    const { emotion } = emotionResult;
    const recommendations = getRecommendationsForEmotion(emotion.toLowerCase());

    if (recommendations && recommendations.length > 0) {
      playTrack(recommendations[0]);
      safeOpen(setOpenDrawer);
      
      toast({
        title: "Musique recommandée",
        description: `Nous vous suggérons d'écouter une ${EMOTION_TO_MUSIC[emotion.toLowerCase()] || EMOTION_TO_MUSIC.default}`,
      });
    } else {
      toast({
        title: "Aucune recommandation disponible",
        description: "Nous n'avons pas de musique à vous recommander pour le moment",
        variant: "destructive",
      });
    }
  }, [toast, getRecommendationsForEmotion, playTrack, setOpenDrawer]);

  return {
    isLoading,
    loadMusicForMood,
    togglePlayPause,
    currentTrack,
    error,
    handlePlayMusic,
    getRecommendationsForEmotion,
    EMOTION_TO_MUSIC
  };
}

// Helper function for safe opening
function safeOpen(setOpen: React.Dispatch<React.SetStateAction<boolean>> | ((value: boolean) => void)): void {
  if (typeof setOpen === 'function') {
    setOpen(true);
  }
}

export default useMusicRecommendation;
