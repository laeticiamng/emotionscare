
import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types/music';

interface EmotionsCareMusicContextType {
  currentPlaylist: MusicPlaylist | null;
  currentTrack: MusicTrack | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  loadPlaylist: (playlist: MusicPlaylist) => void;
  play: () => void;
  pause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  clearPlaylist: () => void;
}

const EmotionsCareMusicContext = createContext<EmotionsCareMusicContextType | undefined>(undefined);

export const useEmotionsCareMusicContext = () => {
  const context = useContext(EmotionsCareMusicContext);
  if (!context) {
    throw new Error('useEmotionsCareMusicContext must be used within EmotionsCareMusicProvider');
  }
  return context;
};

interface EmotionsCareMusicProviderProps {
  children: ReactNode;
}

export const EmotionsCareMusicProvider: React.FC<EmotionsCareMusicProviderProps> = ({ children }) => {
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  const currentTrack = currentPlaylist?.tracks[currentTrackIndex] || null;

  const loadPlaylist = (playlist: MusicPlaylist) => {
    console.log('🎵 EmotionsCare Context: Loading playlist:', playlist);
    setIsLoading(true);
    setCurrentPlaylist(playlist);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    
    // Simuler un court délai de chargement puis marquer comme prêt
    setTimeout(() => {
      setIsLoading(false);
      console.log('✅ EmotionsCare Context: Playlist ready, isLoading set to false');
    }, 500);
  };

  const play = async () => {
    console.log('🎵 EmotionsCare Context: Play called, currentTrack:', currentTrack, 'isLoading:', isLoading);
    
    if (!currentTrack) {
      console.warn('❌ EmotionsCare Context: No current track to play');
      return;
    }

    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.volume = volume;
        
        audioRef.current.addEventListener('loadedmetadata', () => {
          setDuration(audioRef.current?.duration || 0);
        });
        
        audioRef.current.addEventListener('timeupdate', () => {
          setCurrentTime(audioRef.current?.currentTime || 0);
        });
        
        audioRef.current.addEventListener('ended', () => {
          nextTrack();
        });
      }

      if (audioRef.current.src !== currentTrack.url) {
        audioRef.current.src = currentTrack.url;
      }

      await audioRef.current.play();
      setIsPlaying(true);
      console.log('✅ EmotionsCare Context: Audio playing successfully');
      
    } catch (error) {
      console.error('❌ EmotionsCare Context: Play error:', error);
      setIsPlaying(false);
    }
  };

  const pause = () => {
    console.log('⏸️ EmotionsCare Context: Pause called');
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const nextTrack = () => {
    if (!currentPlaylist) return;
    
    const nextIndex = (currentTrackIndex + 1) % currentPlaylist.tracks.length;
    setCurrentTrackIndex(nextIndex);
    setCurrentTime(0);
    
    if (isPlaying) {
      // Will trigger play automatically due to useEffect
    }
  };

  const previousTrack = () => {
    if (!currentPlaylist) return;
    
    const prevIndex = currentTrackIndex === 0 
      ? currentPlaylist.tracks.length - 1 
      : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setCurrentTime(0);
    
    if (isPlaying) {
      // Will trigger play automatically due to useEffect
    }
  };

  const handleSetVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const clearPlaylist = () => {
    console.log('🗑️ EmotionsCare Context: Clearing playlist');
    pause();
    setCurrentPlaylist(null);
    setCurrentTrackIndex(0);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(false);
    
    if (audioRef.current) {
      audioRef.current.src = '';
    }
  };

  // Auto-play when track changes and was playing
  useEffect(() => {
    if (currentTrack && isPlaying && audioRef.current) {
      audioRef.current.src = currentTrack.url;
      play();
    }
  }, [currentTrackIndex]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const value: EmotionsCareMusicContextType = {
    currentPlaylist,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    loadPlaylist,
    play,
    pause,
    nextTrack,
    previousTrack,
    setVolume: handleSetVolume,
    clearPlaylist,
  };

  return (
    <EmotionsCareMusicContext.Provider value={value}>
      {children}
    </EmotionsCareMusicContext.Provider>
  );
};
