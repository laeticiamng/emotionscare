import { useEffect, useState } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { EmotionMusicParams } from '@/types/music';
import { logger } from '@/lib/logger';

interface UseCommunityAmbienceOptions {
  autoPlay?: boolean;
  defaultEmotion?: string;
}

export const useCommunityAmbience = (options: UseCommunityAmbienceOptions = {}) => {
  const { autoPlay = false, defaultEmotion = 'calm' } = options;
  const music = useMusic();
  const [currentEmotion, setCurrentEmotion] = useState(defaultEmotion);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (autoPlay && !isLoaded) {
      loadEmotionMusic(defaultEmotion);
    }
  }, [autoPlay, defaultEmotion, isLoaded]);
  
  const loadEmotionMusic = async (emotion: string, intensity?: number) => {
    try {
      setIsLoaded(false);
      const params: EmotionMusicParams = { emotion, intensity: intensity || 0.5 };
      
      // Use getRecommendationsForEmotion which exists on MusicContextType
      const tracks = await music.getRecommendationsForEmotion(emotion);
      if (tracks && tracks.length > 0) {
        setCurrentEmotion(emotion);
        setIsLoaded(true);
        return true;
      }
      return false;
    } catch (error) {
      logger.error("Error loading emotion music", error as Error, 'MUSIC');
      return false;
    }
  };
  
  const playEmotionMusic = async (emotion: string, intensity?: number) => {
    const success = await loadEmotionMusic(emotion, intensity);
    if (success) {
      await music.play();
      setIsPlaying(true);
    }
    return success;
  };
  
  const pauseMusic = () => {
    music.pause();
    setIsPlaying(false);
  };
  
  const resumeMusic = () => {
    music.play();
    setIsPlaying(true);
  };
  
  const togglePlayback = () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      resumeMusic();
    }
  };
  
  const matchMusicToEmotion = async (emotion: string) => {
    if (isPlaying) pauseMusic();
    
    const tracks = await music.getRecommendationsForEmotion(emotion);
    if (tracks && tracks.length > 0) {
      await music.play(tracks[0]);
      setIsPlaying(true);
      setCurrentEmotion(emotion);
      return true;
    }
    return false;
  };
  
  return {
    currentEmotion,
    isPlaying,
    isLoaded,
    loadEmotionMusic,
    playEmotionMusic,
    pauseMusic,
    resumeMusic,
    togglePlayback,
    matchMusicToEmotion,
    setVolume: music.setVolume,
    currentTrack: music.state.currentTrack,
    progress: music.state.duration > 0 ? music.state.currentTime / music.state.duration : 0,
  };
};

export default useCommunityAmbience;
