import { useEffect, useState } from 'react';
import { useMusicCompat } from '@/hooks/useMusicCompat';
import { EmotionMusicParams } from '@/types/music';
import { logger } from '@/lib/logger';

interface UseCommunityAmbienceOptions {
  autoPlay?: boolean;
  defaultEmotion?: string;
}

export const useCommunityAmbience = (options: UseCommunityAmbienceOptions = {}) => {
  const { autoPlay = false, defaultEmotion = 'calm' } = options;
  const music = useMusicCompat();
  const { currentTrack, currentTime, duration } = music.state;
  const [currentEmotion, setCurrentEmotion] = useState(defaultEmotion);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Load default emotion playlist on mount if autoPlay is true
    if (autoPlay && !isLoaded) {
      loadEmotionMusic(defaultEmotion);
    }
  }, [autoPlay, defaultEmotion, isLoaded]);
  
  const loadEmotionMusic = async (emotion: string, intensity?: number) => {
    try {
      setIsLoaded(false);
      
      // Create valid EmotionMusicParams object
      const params: EmotionMusicParams = {
        emotion,
        intensity: intensity || 0.5
      };
      
      const playlist = await music.loadPlaylistForEmotion(params);
      
      if (playlist) {
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
    if (success && currentTrack) {
      music.play(currentTrack);
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
    // Stop current music if playing
    if (isPlaying) {
      pauseMusic();
    }

    // Create valid EmotionMusicParams object for the API
    const params: EmotionMusicParams = {
      emotion
    };

    await music.loadPlaylistForEmotion(params);

    if (currentTrack) {
      music.play(currentTrack);
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
    currentTrack,
    progress: currentTime / (duration || 1),
  };
};

export default useCommunityAmbience;
