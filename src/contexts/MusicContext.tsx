
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  emotion?: string;
  mood?: string;
}

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playlist: Track[];
  volume: number;
  currentTime: number;
  duration: number;
  play: (track?: Track) => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  setPlaylist: (tracks: Track[]) => void;
  generateEmotionalMusic: (emotion: string) => Promise<Track[]>;
}

// Export the context
export const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [volume, setVolumeState] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => next();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const play = (track?: Track) => {
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

  const next = () => {
    if (currentTrack && playlist.length > 0) {
      const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % playlist.length;
      play(playlist[nextIndex]);
    }
  };

  const previous = () => {
    if (currentTrack && playlist.length > 0) {
      const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
      const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
      play(playlist[prevIndex]);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const generateEmotionalMusic = async (emotion: string): Promise<Track[]> => {
    // TODO: Integrate with MusicGen API
    console.log('Generating music for emotion:', emotion);
    
    // Mock generated tracks based on emotion
    const mockTracks: Track[] = [
      {
        id: `generated-${Date.now()}-1`,
        title: `Musique pour ${emotion} 1`,
        artist: 'EmotionsCare AI',
        duration: 180,
        url: '/sounds/ambient-calm.mp3',
        emotion,
        mood: emotion
      },
      {
        id: `generated-${Date.now()}-2`,
        title: `Musique pour ${emotion} 2`,
        artist: 'EmotionsCare AI',
        duration: 240,
        url: '/sounds/ambient-calm.mp3',
        emotion,
        mood: emotion
      }
    ];

    return mockTracks;
  };

  const value = {
    currentTrack,
    isPlaying,
    playlist,
    volume,
    currentTime,
    duration,
    play,
    pause,
    next,
    previous,
    setVolume,
    seek,
    setPlaylist,
    generateEmotionalMusic
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};
