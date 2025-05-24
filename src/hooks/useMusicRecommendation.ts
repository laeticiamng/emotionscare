
import { useState, useEffect, useCallback } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

export const EMOTION_TO_MUSIC: Record<string, string> = {
  joy: 'upbeat',
  happy: 'upbeat',
  calm: 'ambient',
  relaxed: 'ambient',
  anxious: 'calming',
  stressed: 'calming',
  sad: 'gentle',
  melancholic: 'gentle',
  energetic: 'dance',
  excited: 'dance',
  neutral: 'focus',
};

export interface UseMusicRecommendationOptions {
  autoActivate?: boolean;
  defaultEmotion?: string;
  intensity?: number;
}

export function useMusicRecommendation(options: UseMusicRecommendationOptions = {}) {
  const { autoActivate = false, defaultEmotion, intensity = 0.5 } = options;
  const [recommendedTracks, setRecommendedTracks] = useState<MusicTrack[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(defaultEmotion || null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { loadPlaylistForEmotion, playTrack } = useMusic();
  const { toast } = useToast();
  
  useEffect(() => {
    if (autoActivate && currentEmotion) {
      loadRecommendations(currentEmotion);
    }
  }, [currentEmotion, autoActivate]);
  
  const loadRecommendations = useCallback(async (emotion: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const musicType = EMOTION_TO_MUSIC[emotion.toLowerCase()] || 'focus';
      const params: EmotionMusicParams = { 
        emotion: musicType,
        intensity 
      };
      
      if (loadPlaylistForEmotion) {
        const result = await loadPlaylistForEmotion(params);
        
        if (result && result.tracks) {
          const tracksWithRequiredProps = result.tracks.map(track => ({
            ...track,
            url: track.url || track.audioUrl || '',
            duration: track.duration || 0
          }));
          
          setRecommendedTracks(tracksWithRequiredProps);
          setPlaylist(result);
        } else {
          setRecommendedTracks([]);
          setPlaylist(null);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading music recommendations';
      setError(new Error(errorMessage));
      console.error('Error loading music recommendations:', err);
      setRecommendedTracks([]);
    } finally {
      setIsLoading(false);
    }
  }, [loadPlaylistForEmotion, intensity]);
  
  const updateEmotion = useCallback(async (emotion: string, activate = false) => {
    setCurrentEmotion(emotion);
    if (activate) {
      return await loadRecommendations(emotion);
    }
    return null;
  }, [loadRecommendations]);
  
  const playRecommendedTrack = useCallback((track: MusicTrack) => {
    if (track && playTrack) {
      playTrack({
        ...track,
        url: track.url || track.audioUrl || '',
        duration: track.duration || 0
      });
      
      toast({
        title: "Lecture en cours",
        description: `${track.title} - ${track.artist}`,
        duration: 2000
      });
    }
  }, [playTrack, toast]);
  
  const playFirstRecommendation = useCallback(() => {
    if (recommendedTracks.length > 0) {
      playRecommendedTrack(recommendedTracks[0]);
      return true;
    }
    return false;
  }, [recommendedTracks, playRecommendedTrack]);
  
  const handlePlayMusic = useCallback(async (emotion: string) => {
    await updateEmotion(emotion, true);
    return playFirstRecommendation();
  }, [updateEmotion, playFirstRecommendation]);
  
  return {
    // État
    recommendedTracks,
    currentEmotion,
    playlist,
    isLoading,
    error,
    tracks: playlist ? playlist.tracks : [],
    
    // Actions
    updateEmotion,
    loadRecommendations,
    playRecommendedTrack,
    playFirstRecommendation,
    handlePlayMusic,
    
    // Constantes
    EMOTION_TO_MUSIC
  };
}

export default useMusicRecommendation;
