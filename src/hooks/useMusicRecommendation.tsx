
import { useCallback, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useMusic } from '@/contexts/music';
import { EmotionResult } from '@/types/emotion';
import { Track } from '@/contexts/music/types';

// Define emotion to music mapping for consistent recommendations
const EMOTION_TO_MUSIC_TYPE: Record<string, string> = {
  'happy': 'happy',
  'joy': 'happy',
  'excited': 'happy',
  'sad': 'sad',
  'melancholic': 'sad',
  'depressed': 'sad',
  'angry': 'anxious',
  'frustrated': 'anxious',
  'anxious': 'calm',
  'worried': 'calm',
  'scared': 'calm',
  'neutral': 'neutral',
  'calm': 'calm',
  'relaxed': 'calm',
  'stressed': 'calm',
  'focused': 'focus',
  'concentrated': 'focus',
  'energetic': 'happy',
  'tired': 'calm',
  'bored': 'focus',
  'default': 'neutral'
};

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
  const [recommendedTracks, setRecommendedTracks] = useState<Track[]>([]);

  // Charger des recommandations de musique pour une humeur
  const loadMusicForMood = useCallback(async (mood: string) => {
    setLoading(true);
    setError('');
    
    try {
      const musicType = EMOTION_TO_MUSIC_TYPE[mood.toLowerCase()] || EMOTION_TO_MUSIC_TYPE.default;
      const playlist = await loadPlaylistForEmotion(musicType);
      
      if (playlist && playlist.tracks) {
        setRecommendedTracks(playlist.tracks);
      }
      
      setLoading(false);
      return playlist;
    } catch (err) {
      console.error("Error loading music:", err);
      setError("Impossible de charger la musique pour cette émotion");
      setLoading(false);
      return null;
    }
  }, [loadPlaylistForEmotion]);

  // Gérer le clic sur "Play Music" depuis les écrans d'émotion
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
    loadMusicForMood(emotion.toLowerCase())
      .then(playlist => {
        if (playlist) {
          setOpenDrawer(true);
          
          toast({
            title: "Musique recommandée",
            description: `Nous vous suggérons d'écouter la playlist "${playlist.name}" adaptée à votre humeur actuelle`,
          });
        }
      });
  }, [toast, loadMusicForMood, setOpenDrawer]);

  // Jouer la première recommandation
  const playFirstRecommendation = useCallback(() => {
    if (recommendedTracks.length > 0) {
      playTrack(recommendedTracks[0]);
      return true;
    }
    return false;
  }, [recommendedTracks, playTrack]);

  // Basculer lecture/pause
  const togglePlayPause = useCallback(() => {
    togglePlay();
  }, [togglePlay]);

  // Obtenir une description pour une émotion
  const getEmotionMusicDescription = useCallback((emotion: string): string => {
    const descriptions: Record<string, string> = {
      'happy': 'Des mélodies joyeuses pour amplifier votre bonne humeur',
      'sad': 'Des mélodies douces pour vous accompagner dans ce moment',
      'calm': 'Des sonorités apaisantes pour maintenir votre tranquillité',
      'focus': 'Des rythmes qui favorisent la concentration et la productivité',
      'energetic': 'Des tempos dynamiques pour stimuler votre énergie',
      'angry': 'De la musique apaisante pour aider à gérer les émotions fortes',
      'anxious': 'Des mélodies relaxantes pour réduire l'anxiété',
      'neutral': 'Une sélection musicale équilibrée adaptée à votre journée'
    };
    
    return descriptions[emotion.toLowerCase()] || descriptions.neutral;
  }, []);

  return {
    isLoading: loading,
    currentTrack,
    error,
    isPlaying,
    loadMusicForMood,
    togglePlayPause,
    handlePlayMusic,
    recommendedTracks,
    playFirstRecommendation,
    getEmotionMusicDescription,
    EMOTION_TO_MUSIC_TYPE
  };
}
