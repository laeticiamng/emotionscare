
import React, { useState, useEffect, useRef } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';

// Create a context
export const MusicContext = React.createContext<MusicContextType | null>(null);

// Create a hook for using the context
export const useMusic = () => {
  const context = React.useContext(MusicContext);
  
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  
  return context;
};

export interface MusicProviderProps {
  children: React.ReactNode;
}

const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [recommendations, setRecommendations] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const initializeMusicSystem = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }
    
    setIsInitialized(true);
  };
  
  useEffect(() => {
    initializeMusicSystem();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  const togglePlay = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };
  
  const playTrack = (track: MusicTrack) => {
    if (!audioRef.current) {
      initializeMusicSystem();
    }
    
    if (audioRef.current) {
      audioRef.current.src = track.url || track.audioUrl || '';
      audioRef.current.play().then(() => {
        setCurrentTrack(track);
        setIsPlaying(true);
      }).catch(error => {
        console.error('Error playing track:', error);
        setError(error as Error);
      });
    }
  };
  
  const pauseTrack = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const resumeTrack = () => {
    if (audioRef.current && !isPlaying && currentTrack) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error('Error resuming track:', error);
          setError(error as Error);
        });
    }
  };
  
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > -1 && currentIndex < playlist.tracks.length - 1) {
      playTrack(playlist.tracks[currentIndex + 1]);
    } else if (playlist.tracks.length > 0) {
      // Loop back to the first track
      playTrack(playlist.tracks[0]);
    }
  };
  
  const previousTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(playlist.tracks[currentIndex - 1]);
    } else if (playlist.tracks.length > 0) {
      // Loop to the last track
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    }
  };
  
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };
  
  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };
  
  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    setError(null);
    
    // Parse parameters
    const emotion = typeof params === 'string' ? params : params.emotion;
    setCurrentEmotion(emotion);
    
    try {
      // In a real application, this would be an API call
      // For now we'll create a mock playlist
      const newPlaylist: MusicPlaylist = {
        id: `playlist-${emotion}-${Date.now()}`,
        name: `${emotion} Music`,
        title: `${emotion} Music`,
        emotion: emotion,
        tracks: [
          {
            id: `track-${emotion}-1`,
            title: `${emotion} Track 1`,
            artist: 'AI Composer',
            duration: 180,
            url: '/sounds/ambient-calm.mp3',
            coverUrl: '/images/covers/generated.jpg',
            emotion: emotion
          },
          {
            id: `track-${emotion}-2`,
            title: `${emotion} Track 2`,
            artist: 'AI Composer',
            duration: 210,
            url: '/sounds/welcome.mp3',
            coverUrl: '/images/covers/generated.jpg',
            emotion: emotion
          }
        ],
        description: `Music to match your ${emotion} mood`
      };
      
      setPlaylist(newPlaylist);
      return newPlaylist;
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('Error loading playlist for emotion:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const setEmotion = (emotion: string) => {
    setCurrentEmotion(emotion);
    loadPlaylistForEmotion(emotion);
  };
  
  // Provide the context value
  const musicContextValue: MusicContextType = {
    isInitialized,
    currentTrack,
    isPlaying,
    volume,
    muted,
    isMuted: muted,
    currentTime,
    duration,
    playlist,
    recommendations,
    isLoading,
    error,
    currentEmotion,
    emotion: currentEmotion,
    openDrawer,
    setOpenDrawer,
    togglePlay,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume: handleVolumeChange,
    toggleMute,
    loadPlaylistForEmotion,
    setEmotion,
    initializeMusicSystem
  };
  
  return (
    <MusicContext.Provider value={musicContextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicProvider;
