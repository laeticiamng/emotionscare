
import { useCallback, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useMusic } from '@/contexts/MusicContext';
import { EmotionResult } from '@/types';
import { Track } from '@/services/music/types';

export default function useMusicRecommendation() {
  const { toast } = useToast();
  const { 
    currentTrack, 
    isPlaying, 
    setOpenDrawer, 
    loadPlaylistForEmotion,
    playTrack,
    togglePlay
  } = useMusic();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Define emotion to music mapping
  const EMOTION_TO_MUSIC = {
    'happy': 'energetic',
    'sad': 'calm',
    'angry': 'calm',
    'anxious': 'calm',
    'neutral': 'neutral',
    'calm': 'calm',
    'stressed': 'calm',
    'energetic': 'energetic',
    'bored': 'energetic',
    'tired': 'calm',
    'fearful': 'calm',
    'default': 'neutral'
  };

  const loadMusicForMood = useCallback(async (mood: string) => {
    setLoading(true);
    setError('');
    
    try {
      const musicType = EMOTION_TO_MUSIC[mood.toLowerCase()] || EMOTION_TO_MUSIC.default;
      await loadPlaylistForEmotion(musicType);
      setLoading(false);
    } catch (err) {
      console.error("Error loading music:", err);
      setError("Impossible de charger la musique pour cette émotion");
      setLoading(false);
    }
  }, [loadPlaylistForEmotion]);

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
    loadMusicForMood(emotion.toLowerCase());
    
    toast({
      title: "Musique recommandée",
      description: `Nous vous suggérons d'écouter une playlist pour l'humeur: ${emotion}`,
    });
  }, [toast, loadMusicForMood]);

  const togglePlayPause = () => {
    togglePlay();
  };

  return {
    isLoading: loading,
    currentTrack,
    error,
    isPlaying,
    loadMusicForMood,
    togglePlayPause,
    handlePlayMusic,
    EMOTION_TO_MUSIC
  };
}
