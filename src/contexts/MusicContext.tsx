
import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  cover?: string;
}

interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playlist: MusicTrack[];
  play: (track?: MusicTrack) => void;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  addToPlaylist: (track: MusicTrack) => void;
  removeFromPlaylist: (trackId: string) => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<MusicTrack[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = (track?: MusicTrack) => {
    if (track && track !== currentTrack) {
      setCurrentTrack(track);
      if (audioRef.current) {
        audioRef.current.src = track.url;
      }
    }
    
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const addToPlaylist = (track: MusicTrack) => {
    setPlaylist(prev => [...prev, track]);
  };

  const removeFromPlaylist = (trackId: string) => {
    setPlaylist(prev => prev.filter(track => track.id !== trackId));
  };

  const nextTrack = () => {
    if (currentTrack && playlist.length > 0) {
      const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % playlist.length;
      play(playlist[nextIndex]);
    }
  };

  const previousTrack = () => {
    if (currentTrack && playlist.length > 0) {
      const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
      const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
      play(playlist[prevIndex]);
    }
  };

  // Initialiser l'audio element
  React.useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      nextTrack();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const value: MusicContextType = {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    playlist,
    play,
    pause,
    stop,
    setVolume,
    seekTo,
    addToPlaylist,
    removeFromPlaylist,
    nextTrack,
    previousTrack,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export { MusicContext };
