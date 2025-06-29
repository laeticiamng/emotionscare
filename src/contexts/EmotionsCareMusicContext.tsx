
import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  url: string;
  duration: number;
}

interface Playlist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  emotion: string;
}

interface EmotionsCareMusicContextType {
  currentPlaylist: Playlist | null;
  currentTrack: MusicTrack | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  loadPlaylist: (playlist: Playlist) => void;
  play: () => void;
  pause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  clearPlaylist: () => void;
}

const EmotionsCareMusicContext = createContext<EmotionsCareMusicContextType | undefined>(undefined);

export const EmotionsCareMusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentTrack = currentPlaylist?.tracks[currentTrackIndex] || null;

  // Initialiser l'audio element
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'metadata';
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration || 0);
        setIsLoading(false);
      });
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime || 0);
      });
      
      audio.addEventListener('ended', () => {
        nextTrack();
      });
      
      audio.addEventListener('play', () => {
        setIsPlaying(true);
      });
      
      audio.addEventListener('pause', () => {
        setIsPlaying(false);
      });
      
      audio.addEventListener('error', (e) => {
        console.error('❌ EmotionsCare Audio Error:', e);
        setIsLoading(false);
        setIsPlaying(false);
      });
      
      audioRef.current = audio;
    }
    
    return () => {
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
      }
    };
  }, []);

  // Charger un nouveau track
  const loadCurrentTrack = useCallback(async () => {
    if (!currentTrack || !audioRef.current) return;
    
    setIsLoading(true);
    
    try {
      // Arrêter la lecture actuelle si nécessaire
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
      
      // Charger le nouveau track
      audioRef.current.src = currentTrack.url;
      audioRef.current.volume = volume;
      
      console.log('🎵 EmotionsCare: Chargement du track:', currentTrack.title);
      
    } catch (error) {
      console.error('❌ EmotionsCare: Erreur de chargement:', error);
      setIsLoading(false);
    }
  }, [currentTrack, volume]);

  // Effet pour charger le track quand il change
  useEffect(() => {
    if (currentTrack) {
      loadCurrentTrack();
    }
  }, [currentTrack, loadCurrentTrack]);

  const loadPlaylist = useCallback((playlist: Playlist) => {
    console.log('🎵 EmotionsCare: Chargement de la playlist:', playlist);
    setCurrentPlaylist(playlist);
    setCurrentTrackIndex(0);
    setCurrentTime(0);
    setIsPlaying(false);
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current || !currentTrack || isLoading) {
      console.log('⚠️ EmotionsCare: Impossible de jouer - audio:', !!audioRef.current, 'track:', !!currentTrack, 'loading:', isLoading);
      return;
    }

    try {
      console.log('▶️ EmotionsCare: Lecture du track:', currentTrack.title);
      
      // S'assurer que l'audio est prêt
      if (audioRef.current.readyState < 2) {
        setIsLoading(true);
        await new Promise((resolve) => {
          const handleCanPlay = () => {
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            setIsLoading(false);
            resolve(true);
          };
          audioRef.current?.addEventListener('canplay', handleCanPlay);
        });
      }
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        console.log('✅ EmotionsCare: Lecture démarrée');
      }
      
    } catch (error) {
      console.error('❌ EmotionsCare: Erreur de lecture:', error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [currentTrack, isLoading]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    
    console.log('⏸️ EmotionsCare: Pause');
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const nextTrack = useCallback(() => {
    if (!currentPlaylist) return;
    
    const nextIndex = (currentTrackIndex + 1) % currentPlaylist.tracks.length;
    console.log('⏭️ EmotionsCare: Track suivant:', nextIndex);
    setCurrentTrackIndex(nextIndex);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [currentTrackIndex, currentPlaylist]);

  const previousTrack = useCallback(() => {
    if (!currentPlaylist) return;
    
    const prevIndex = currentTrackIndex === 0 
      ? currentPlaylist.tracks.length - 1 
      : currentTrackIndex - 1;
    console.log('⏮️ EmotionsCare: Track précédent:', prevIndex);
    setCurrentTrackIndex(prevIndex);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [currentTrackIndex, currentPlaylist]);

  const handleSetVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const clearPlaylist = useCallback(() => {
    console.log('🗑️ EmotionsCare: Suppression de la playlist');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setCurrentPlaylist(null);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const contextValue: EmotionsCareMusicContextType = {
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
    <EmotionsCareMusicContext.Provider value={contextValue}>
      {children}
    </EmotionsCareMusicContext.Provider>
  );
};

export const useEmotionsCareMusicContext = () => {
  const context = useContext(EmotionsCareMusicContext);
  if (!context) {
    throw new Error('useEmotionsCareMusicContext must be used within EmotionsCareMusicProvider');
  }
  return context;
};
