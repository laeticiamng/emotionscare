
import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  artwork?: string;
}

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  playlist: Track[];
  currentTime: number;
  duration: number;
  isLoading: boolean;
  play: (track?: Track) => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  addToPlaylist: (track: Track) => void;
  removeFromPlaylist: (trackId: string) => void;
  setPlaylist: (tracks: Track[]) => void;
  clearPlaylist: () => void;
}

export const MusicContext = createContext<MusicContextType | undefined>(undefined);

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [playlist, setPlaylistState] = useState<Track[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const updateTimeRef = useRef<number>();

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
      
      // Set up event listeners
      const audio = audioRef.current;
      
      audio.addEventListener('loadstart', () => setIsLoading(true));
      audio.addEventListener('canplay', () => setIsLoading(false));
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration || 0);
      });
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        next();
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setIsLoading(false);
        setIsPlaying(false);
      });
    }
    
    return () => {
      if (updateTimeRef.current) {
        cancelAnimationFrame(updateTimeRef.current);
      }
    };
  }, []);

  // Update audio volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = useCallback((track?: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (track && track !== currentTrack) {
      setCurrentTrack(track);
      audio.src = track.url;
      audio.load();
    }

    if (currentTrack || track) {
      setIsLoading(true);
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
          setIsLoading(false);
          setIsPlaying(false);
        });
    }
  }, [currentTrack]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  const next = useCallback(() => {
    if (playlist.length === 0 || !currentTrack) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    
    if (nextTrack) {
      play(nextTrack);
    }
  }, [playlist, currentTrack, play]);

  const previous = useCallback(() => {
    if (playlist.length === 0 || !currentTrack) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    const prevTrack = playlist[prevIndex];
    
    if (prevTrack) {
      play(prevTrack);
    }
  }, [playlist, currentTrack, play]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const addToPlaylist = useCallback((track: Track) => {
    setPlaylistState(prev => [...prev, track]);
  }, []);

  const removeFromPlaylist = useCallback((trackId: string) => {
    setPlaylistState(prev => prev.filter(track => track.id !== trackId));
  }, []);

  const setPlaylist = useCallback((tracks: Track[]) => {
    setPlaylistState(tracks);
  }, []);

  const clearPlaylist = useCallback(() => {
    setPlaylistState([]);
    setCurrentTrack(null);
    stop();
  }, [stop]);

  const value: MusicContextType = {
    currentTrack,
    isPlaying,
    volume,
    playlist,
    currentTime,
    duration,
    isLoading,
    play,
    pause,
    stop,
    next,
    previous,
    setVolume,
    seek,
    addToPlaylist,
    removeFromPlaylist,
    setPlaylist,
    clearPlaylist,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default MusicContext;
