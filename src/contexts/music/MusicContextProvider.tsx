import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType, EmotionMusicParams } from '@/types/music';

// Create the context with default values
const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  duration: 0,
  currentTime: 0,
  muted: false,
  playlist: [],
  togglePlay: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  seekTo: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  pauseTrack: () => {},
  playTrack: () => {},
  isInitialized: false,
  initializeMusicSystem: () => {},
  loadPlaylistForEmotion: async () => null,
  setOpenDrawer: () => {},
});

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  // State management for music player
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playlist, setPlaylist] = useState<MusicTrack[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [currentEmotion, setCurrentEmotion] = useState<string | undefined>(undefined);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  
  // Audio element reference
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  // Initialize the audio system
  const initializeMusicSystem = () => {
    if (audioRef.current) return; // Already initialized
    
    try {
      const audio = new Audio();
      audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
      audio.addEventListener('durationchange', () => setDuration(audio.duration));
      audio.addEventListener('ended', handleTrackEnd);
      
      audioRef.current = audio;
      setIsInitialized(true);
    } catch (err) {
      setError(err as Error);
    }
  };
  
  // Handle track end - play next track if available
  const handleTrackEnd = () => {
    if (playlist.length > 0) {
      nextTrack();
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  };

  // Play/pause toggle
  const togglePlay = () => {
    if (!currentTrack || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        setError(err);
        setIsPlaying(false);
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Explicitly pause track
  const pauseTrack = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  // Play a specific track
  const playTrack = (track: MusicTrack) => {
    if (!audioRef.current) return;
    
    setCurrentTrack(track);
    audioRef.current.src = track.url;
    audioRef.current.load();
    
    audioRef.current.play().catch((err) => {
      setError(err);
      setIsPlaying(false);
    });
    
    setIsPlaying(true);
  };
  
  // Play next track in playlist
  const nextTrack = () => {
    if (playlist.length === 0 || !currentTrack) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === playlist.length - 1) {
      // If it's the last track or not found, loop to the first track
      loadTrack(playlist[0]);
    } else {
      // Otherwise play the next track
      loadTrack(playlist[currentIndex + 1]);
    }
  };
  
  // Play previous track in playlist
  const previousTrack = () => {
    if (playlist.length === 0 || !currentTrack) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    if (currentIndex <= 0) {
      // If it's the first track or not found, loop to the last track
      loadTrack(playlist[playlist.length - 1]);
    } else {
      // Otherwise play the previous track
      loadTrack(playlist[currentIndex - 1]);
    }
  };
  
  // Load a track
  const loadTrack = (track: MusicTrack) => {
    if (!audioRef.current) return;
    
    setCurrentTrack(track);
    audioRef.current.src = track.url;
    audioRef.current.load();
    
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        setError(err);
        setIsPlaying(false);
      });
    }
  };
  
  // Seek to a specific time in the track
  const seekTo = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };
  
  // Set the volume
  const setVolume = (newVolume: number) => {
    if (!audioRef.current) return;
    
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    audioRef.current.volume = clampedVolume;
    
    if (clampedVolume > 0 && muted) {
      setMuted(false);
      audioRef.current.muted = false;
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMuted = !muted;
    setMuted(newMuted);
    audioRef.current.muted = newMuted;
  };
  
  // Mock function to load a playlist based on emotion
  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    // Determine the emotion
    const emotion = typeof params === 'string' ? params : params.emotion;
    
    // Simulate API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create a mock playlist
    const mockPlaylist: MusicPlaylist = {
      id: `playlist-${emotion}`,
      name: `${emotion} Music`,
      description: `Music for ${emotion} emotional state`,
      tracks: [
        {
          id: `track-1-${emotion}`,
          title: `${emotion} Track 1`,
          artist: 'Emotion Artist',
          duration: 180,
          url: '/sounds/ambient-calm.mp3',
          coverUrl: '/images/covers/calm.jpg'
        },
        {
          id: `track-2-${emotion}`,
          title: `${emotion} Track 2`,
          artist: 'Emotion Artist',
          duration: 210,
          url: '/sounds/ambient-calm.mp3',
          coverUrl: '/images/covers/calm.jpg'
        }
      ],
      emotion: emotion
    };
    
    setCurrentPlaylist(mockPlaylist);
    setPlaylist(mockPlaylist.tracks);
    setCurrentEmotion(emotion);
    
    return mockPlaylist;
  };
  
  // Effect to initialize audio system on mount
  React.useEffect(() => {
    initializeMusicSystem();
    
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.remove();
      }
    };
  }, []);
  
  // Apply volume and mute settings when they change
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);
  
  const value: MusicContextType = {
    currentTrack,
    isPlaying,
    volume,
    duration,
    currentTime,
    muted,
    playlist,
    togglePlay,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume,
    toggleMute,
    pauseTrack,
    playTrack,
    currentEmotion,
    loadPlaylistForEmotion,
    currentPlaylist,
    setOpenDrawer,
    isInitialized,
    initializeMusicSystem,
    error,
  };
  
  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

// Hook to use the music context
export const useMusic = (): MusicContextType => useContext(MusicContext);

// For default export compatibility
export default useMusic;
