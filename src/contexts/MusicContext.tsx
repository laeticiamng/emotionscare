import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

export interface MusicContextValue {
  // Player state
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  volume: number;
  progress: number;
  duration: number;
  
  // Playback controls
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  togglePlay: () => void;
  adjustVolume: (change: number) => void;
  
  // Playlist management
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  loadPlaylistById: (id: string) => Promise<MusicPlaylist | null>;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  
  // UI state
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  
  // Utility
  formatTime: (seconds: number) => string;
  
  // System state
  isInitialized: boolean;
  initializeMusicSystem: () => Promise<void>;
  error: string | null;
  
  // Additional properties
  isShuffled: boolean;
  isRepeating: boolean;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  currentEmotion: string | null;
  isMuted: boolean;
  toggleMute: () => void;
}

// Mock data
const mockPlaylists: MusicPlaylist[] = [
  {
    id: "playlist-1",
    title: "Relaxation",
    name: "Relaxation", // Added name property
    description: "Calm and peaceful tracks",
    coverUrl: "/assets/images/playlist-covers/relaxation.jpg",
    emotion: "calm",
    tracks: [
      {
        id: "track-1",
        title: "Ocean Waves",
        artist: "Nature Sounds",
        duration: 180,
        url: "https://example.com/audio/ocean-waves.mp3",
      }
    ]
  },
  {
    id: "playlist-2",
    title: "Energy Boost",
    name: "Energy Boost", // Added name property
    description: "Upbeat and energetic tracks",
    coverUrl: "/assets/images/playlist-covers/energy.jpg",
    emotion: "happy",
    tracks: [
      {
        id: "track-2",
        title: "Morning Light",
        artist: "Sunrise Band",
        duration: 210,
        url: "https://example.com/audio/morning-light.mp3",
      }
    ]
  }
];

const defaultContext: MusicContextValue = {
  isPlaying: false,
  currentTrack: null,
  volume: 0.7,
  progress: 0,
  duration: 0,
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  seekTo: () => {},
  togglePlay: () => {}, // Added missing method
  adjustVolume: () => {}, // Added missing method
  playlists: [],
  currentPlaylist: null,
  loadPlaylistById: async () => null,
  loadPlaylistForEmotion: async () => null,
  openDrawer: false,
  setOpenDrawer: () => {},
  formatTime: () => "0:00",
  isInitialized: false,
  initializeMusicSystem: async () => {},
  error: null,
  isShuffled: false,
  isRepeating: false,
  toggleShuffle: () => {},
  toggleRepeat: () => {},
  currentEmotion: null,
  isMuted: false,
  toggleMute: () => {}
};

const MusicContext = createContext<MusicContextValue>(defaultContext);

export const useMusic = () => useContext(MusicContext);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [volume, setVolumeState] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>(mockPlaylists);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    audioRef.current = new Audio();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  const initializeMusicSystem = async () => {
    try {
      // Simulate initialization
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsInitialized(true);
    } catch (err) {
      console.error("Error initializing music system:", err);
      setError("Failed to initialize music system");
      throw err;
    }
  };
  
  const playTrack = useCallback((track: MusicTrack) => {
    if (!audioRef.current) return;
    
    // Set the track
    setCurrentTrack(track);
    
    // Set the audio source
    audioRef.current.src = track.url;
    audioRef.current.load();
    
    // Play
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.error("Error playing track:", err);
        toast({
          title: "Playback Error",
          description: "Failed to play the track. Please try again.",
          variant: "destructive"
        });
      });
  }, [toast]);
  
  const pauseTrack = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);
  
  const resumeTrack = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
    
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.error("Error resuming track:", err);
      });
  }, [currentTrack]);
  
  const nextTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    
    if (currentIndex >= 0 && currentIndex < currentPlaylist.tracks.length - 1) {
      playTrack(currentPlaylist.tracks[currentIndex + 1]);
    } else if (isRepeating) {
      // If repeating, go back to the first track
      playTrack(currentPlaylist.tracks[0]);
    }
  }, [currentPlaylist, currentTrack, isRepeating, playTrack]);
  
  const previousTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    
    if (currentIndex > 0) {
      playTrack(currentPlaylist.tracks[currentIndex - 1]);
    } else if (isRepeating) {
      // If repeating, go to the last track
      playTrack(currentPlaylist.tracks[currentPlaylist.tracks.length - 1]);
    }
  }, [currentPlaylist, currentTrack, isRepeating, playTrack]);
  
  const setVolume = useCallback((value: number) => {
    if (!audioRef.current) return;
    
    const clampedValue = Math.max(0, Math.min(1, value));
    setVolumeState(clampedValue);
    audioRef.current.volume = clampedValue;
  }, []);
  
  const seekTo = useCallback((time: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = time;
    setProgress(time);
  }, []);
  
  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => !prev);
  }, []);
  
  const toggleRepeat = useCallback(() => {
    setIsRepeating(prev => !prev);
  }, []);
  
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    
    const newMuted = !isMuted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
  }, [isMuted]);
  
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }, []);
  
  const loadPlaylistById = useCallback(async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const playlist = playlists.find(p => p.id === id);
    
    if (playlist) {
      setCurrentPlaylist(playlist);
      return playlist;
    }
    
    return null;
  }, [playlists]);
  
  const loadPlaylistForEmotion = useCallback(async (emotion: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const playlist = playlists.find(p => p.emotion === emotion);
    
    if (playlist) {
      setCurrentPlaylist(playlist);
      setCurrentEmotion(emotion);
      return playlist;
    }
    
    // Fallback to first playlist if no match
    if (playlists.length > 0) {
      setCurrentPlaylist(playlists[0]);
      setCurrentEmotion(emotion);
      return playlists[0];
    }
    
    return null;
  }, [playlists]);
  
  // Add togglePlay function
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      resumeTrack();
    }
  }, [isPlaying, currentTrack, pauseTrack, resumeTrack]);
  
  // Add adjustVolume function
  const adjustVolume = useCallback((change: number) => {
    setVolumeState(prev => {
      const newVolume = Math.max(0, Math.min(1, prev + change));
      
      // Update audio element volume if available
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
      
      return newVolume;
    });
  }, []);
  
  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      nextTrack();
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [nextTrack]);
  
  const value: MusicContextValue = {
    isPlaying,
    currentTrack,
    volume,
    progress,
    duration,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    setVolume,
    seekTo,
    togglePlay, // Added
    adjustVolume, // Added
    playlists,
    currentPlaylist,
    loadPlaylistById,
    loadPlaylistForEmotion,
    openDrawer,
    setOpenDrawer,
    formatTime,
    isInitialized,
    initializeMusicSystem,
    error,
    isShuffled,
    isRepeating,
    toggleShuffle,
    toggleRepeat,
    currentEmotion,
    isMuted,
    toggleMute
  };
  
  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;
