
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { MusicTrack, MusicPlaylist, MusicPreferences } from '@/types/music';

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  playlists: MusicPlaylist[];
  playlist: MusicPlaylist | null;
  currentPlaylist: MusicPlaylist | null;
  currentTime: number;
  duration: number;
  loading: boolean;
  error: string | null;
  audioState: {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
  };
  currentEmotion?: string;
  preferences: MusicPreferences;
  
  // Player controls
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  seekTo: (time: number) => void;
  
  // Track operations
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void; 
  nextTrack: () => void;
  previousTrack: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  
  // Playlist operations
  loadPlaylist: (playlist: MusicPlaylist) => void;
  loadPlaylistById: (id: string) => void;
  loadPlaylistForEmotion: (emotion: string) => MusicPlaylist | null;
  
  // UI controls
  setOpenDrawer: (open: boolean) => void;
  initializeMusicSystem: () => void;
  setAudioState: (state: any) => void;
  openDrawer: boolean;
}

const defaultPreferences: MusicPreferences = {
  volume: 0.7,
  autoplay: false,
  crossfade: true,
  crossfadeDuration: 2,
  shuffle: false,
  repeat: 'none',
  emotionSync: true,
};

// Create context with default values
export const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  muted: false,
  playlists: [],
  playlist: null,
  currentPlaylist: null,
  currentTime: 0,
  duration: 0,
  loading: false,
  error: null,
  audioState: {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  },
  preferences: defaultPreferences,
  
  // Player controls
  play: () => {},
  pause: () => {},
  togglePlay: () => {},
  next: () => {},
  previous: () => {},
  setVolume: () => {},
  setMuted: () => {},
  seekTo: () => {},
  
  // Track operations
  playTrack: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  toggleRepeat: () => {},
  toggleShuffle: () => {},
  
  // Playlist operations
  loadPlaylist: () => {},
  loadPlaylistById: () => {},
  loadPlaylistForEmotion: () => null,
  
  // UI controls
  setOpenDrawer: () => {},
  initializeMusicSystem: () => {},
  setAudioState: () => {},
  openDrawer: false,
});

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [muted, setMutedState] = useState(false);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | undefined>(undefined);
  const [preferences, setPreferences] = useState<MusicPreferences>(defaultPreferences);
  const [audioState, setAudioState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });

  // Player controls
  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const next = useCallback(() => {
    console.log("Next track");
    // Implementation would go here
    nextTrack();
  }, []);

  const previous = useCallback(() => {
    console.log("Previous track");
    // Implementation would go here
    previousTrack();
  }, []);

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
  }, []);

  const setMuted = useCallback((value: boolean) => {
    setMutedState(value);
  }, []);

  const seekTo = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  // Track operations
  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);
  
  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  // More robust implementations would handle playlist navigation
  const nextTrack = useCallback(() => {
    if (!currentPlaylist || !currentPlaylist.tracks || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentPlaylist.tracks.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
    playTrack(currentPlaylist.tracks[nextIndex]);
  }, [currentTrack, currentPlaylist]);
  
  const previousTrack = useCallback(() => {
    if (!currentPlaylist || !currentPlaylist.tracks || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentPlaylist.tracks.length === 0) return;
    
    const prevIndex = (currentIndex - 1 + currentPlaylist.tracks.length) % currentPlaylist.tracks.length;
    playTrack(currentPlaylist.tracks[prevIndex]);
  }, [currentTrack, currentPlaylist]);
  
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  
  const toggleRepeat = useCallback(() => {
    setRepeat(prev => !prev);
  }, []);
  
  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  // Playlist operations
  const loadPlaylist = useCallback((newPlaylist: MusicPlaylist) => {
    setPlaylist(newPlaylist);
    setCurrentPlaylist(newPlaylist);
    if (newPlaylist.tracks.length > 0) {
      setCurrentTrack(newPlaylist.tracks[0]);
    }
  }, []);

  const loadPlaylistById = useCallback((id: string) => {
    const found = playlists.find(p => p.id === id);
    if (found) {
      loadPlaylist(found);
    } else {
      setError(`Playlist with ID ${id} not found`);
    }
  }, [playlists, loadPlaylist]);

  const loadPlaylistForEmotion = useCallback((emotion: string): MusicPlaylist | null => {
    // Find an existing playlist for this emotion
    const found = playlists.find(p => p.emotion?.toLowerCase() === emotion.toLowerCase());
    if (found) {
      loadPlaylist(found);
      return found;
    }
    
    // Create a mock playlist if none exists
    const mockPlaylist: MusicPlaylist = {
      id: `emotion-${emotion}-${Date.now()}`,
      name: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Music`,
      description: `Music tailored for ${emotion} emotion`,
      tracks: [
        {
          id: `track-${Date.now()}-1`,
          title: `${emotion} Melody`,
          artist: "Emotion Artist",
          album: "Emotion Album",
          artwork: "/music/cover.jpg",
          url: "/music/track1.mp3",
          duration: 180,
        }
      ],
      emotion: emotion,
    };
    
    loadPlaylist(mockPlaylist);
    setOpenDrawer(true);
    return mockPlaylist;
  }, [playlists, loadPlaylist]);

  const initializeMusicSystem = useCallback(() => {
    console.log("Music system initialized");
    setLoading(false);
  }, []);

  const value = {
    currentTrack,
    isPlaying,
    volume,
    muted,
    playlists,
    playlist,
    currentPlaylist,
    currentTime,
    duration,
    loading,
    error,
    audioState,
    currentEmotion,
    preferences,
    repeat,
    shuffle,
    
    // Player controls
    play,
    pause,
    togglePlay,
    next,
    previous,
    setVolume,
    setMuted,
    seekTo,
    
    // Track operations
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    toggleRepeat,
    toggleShuffle,
    
    // Playlist operations
    loadPlaylist,
    loadPlaylistById,
    loadPlaylistForEmotion,
    
    // UI controls
    setOpenDrawer,
    initializeMusicSystem,
    setAudioState,
    openDrawer,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
