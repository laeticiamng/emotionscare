
import { useEffect, useState } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { EmotionMusicParams } from '@/types/music';

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
      console.error("Error loading emotion music:", error);
      return false;
    }
  };
  
  const playEmotionMusic = async (emotion: string, intensity?: number) => {
    const success = await loadEmotionMusic(emotion, intensity);
    if (success && music.currentTrack) {
      music.playTrack(music.currentTrack);
      setIsPlaying(true);
    }
    return success;
  };
  
  const pauseMusic = () => {
    music.pauseTrack();
    setIsPlaying(false);
  };
  
  const resumeMusic = () => {
    if (music.resumeTrack) {
      music.resumeTrack();
    } else {
      music.togglePlay();
    }
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
    
    if (music.currentTrack) {
      music.playTrack(music.currentTrack);
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
    currentTrack: music.currentTrack,
    progress: music.currentTime / (music.duration || 1),
  };
};

export default useCommunityAmbience;
