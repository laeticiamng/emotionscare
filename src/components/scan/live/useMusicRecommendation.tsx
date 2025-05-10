
import { useState, useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { EmotionResult, MusicTrack } from '@/types';

// Hook for recommending music based on emotion analysis
export const useMusicRecommendation = (emotionResult: EmotionResult | null) => {
  const [recommendedTracks, setRecommendedTracks] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { loadPlaylistForEmotion, playTrack } = useMusic();
  const { toast } = useToast();
  
  // Mapping emotions to music types
  const EMOTION_TO_MUSIC: Record<string, string> = {
    'happy': 'positive',
    'sad': 'melancholic',
    'calm': 'relaxing',
    'anxious': 'soothing',
    'angry': 'calming',
    'neutral': 'balanced',
    'default': 'relaxing'
  };
  
  // Get emotion from result
  const getEmotion = (result: EmotionResult | null): string => {
    if (!result) return 'neutral';
    
    if (result.primaryEmotion?.name) {
      return result.primaryEmotion.name.toLowerCase();
    }
    
    if (result.emotion) {
      return result.emotion.toLowerCase();
    }
    
    // Determine emotion from score if available
    if (result.score !== undefined) {
      if (result.score > 75) return 'happy';
      if (result.score < 30) return 'sad';
      if (result.score < 50) return 'calm';
      return 'neutral';
    }
    
    return 'neutral';
  };
  
  // Handle playing music based on emotion
  const handlePlayMusic = async (result: EmotionResult) => {
    if (!result) return;
    
    const emotion = getEmotion(result);
    setIsLoading(true);
    
    try {
      const playlist = await loadPlaylistForEmotion(emotion);
      if (playlist && playlist.tracks && playlist.tracks.length > 0) {
        playTrack(playlist.tracks[0]);
        toast({
          title: 'Musique adaptée',
          description: `Lecture de musique pour accompagner votre état émotionnel: ${emotion}`
        });
        return true;
      } else {
        toast({
          title: 'Aucune musique disponible',
          description: 'Aucune musique trouvée pour cet état émotionnel',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error playing emotion music:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de jouer la musique recommandée',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
    
    return false;
  };
  
  // Load music recommendations when emotion changes
  useEffect(() => {
    const loadRecommendations = async () => {
      if (!emotionResult) return;
      
      const emotion = getEmotion(emotionResult);
      setIsLoading(true);
      
      try {
        const playlist = await loadPlaylistForEmotion(emotion);
        if (playlist && playlist.tracks && playlist.tracks.length > 0) {
          setRecommendedTracks(playlist.tracks);
        } else {
          setRecommendedTracks([]);
        }
      } catch (error) {
        console.error('Error loading music recommendations:', error);
        setRecommendedTracks([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecommendations();
  }, [emotionResult, loadPlaylistForEmotion]);
  
  // Play a recommended track
  const playRecommendedTrack = (track: MusicTrack) => {
    playTrack(track);
    toast({
      title: 'Lecture en cours',
      description: `${track.title} par ${track.artist}`,
    });
  };
  
  // Play first recommended track
  const playFirstRecommendation = () => {
    if (recommendedTracks.length > 0) {
      playRecommendedTrack(recommendedTracks[0]);
      return true;
    }
    return false;
  };
  
  return {
    recommendedTracks,
    isLoading,
    playRecommendedTrack,
    playFirstRecommendation,
    handlePlayMusic,
    EMOTION_TO_MUSIC
  };
};

export default useMusicRecommendation;
