
import { useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useMusic } from "@/contexts/MusicContext";
import { EmotionResult } from '@/types';

export const useMusicRecommendation = () => {
  const { toast } = useToast();
  const { loadPlaylistForEmotion, playTrack } = useMusic();

  // Define emotion to music mapping
  const EMOTION_TO_MUSIC = {
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
    const playlist = loadPlaylistForEmotion(emotion.toLowerCase());

    if (playlist && playlist.tracks.length > 0) {
      // Play the first track from the playlist, ensuring it has duration
      const track = {
        ...playlist.tracks[0],
        duration: playlist.tracks[0].duration || 0
      };
      playTrack(track);
      
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
  }, [toast, loadPlaylistForEmotion, playTrack]);

  return {
    handlePlayMusic,
    EMOTION_TO_MUSIC
  };
};
