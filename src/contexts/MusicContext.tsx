
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
  cover?: string;
  audioUrl?: string;
  audio_url?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title: string;
  description: string;
  coverUrl: string;
  emotion: string;
  tracks: MusicTrack[];
}

interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  playlists: MusicPlaylist[];
  currentEmotion: string | null;
  error: string | null;
  currentPlaylist: MusicPlaylist | null;
  isInitialized: boolean;
  openDrawer: boolean;
  
  // Player controls
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  adjustVolume: (amount: number) => void;
  
  // Playlist management
  loadPlaylistById: (id: string) => Promise<MusicPlaylist | null>;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  
  // UI state
  setOpenDrawer: (isOpen: boolean) => void;
  
  // Initialization
  initializeMusicSystem: () => Promise<void>;
}

// Create context with default values
const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  isMuted: false,
  playlists: [],
  currentEmotion: null,
  error: null,
  currentPlaylist: null,
  isInitialized: false,
  openDrawer: false,
  
  playTrack: () => {},
  pauseTrack: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  adjustVolume: () => {},
  
  loadPlaylistById: async () => null,
  loadPlaylistForEmotion: async () => null,
  
  initializeMusicSystem: async () => {},
  setOpenDrawer: () => {}
});

// Sample music data for demo
const SAMPLE_PLAYLISTS: MusicPlaylist[] = [
  {
    id: 'playlist-calm',
    name: 'Calme et Relaxation',
    title: 'Calme et Relaxation',
    description: 'Des mélodies apaisantes pour retrouver la sérénité',
    coverUrl: 'https://images.unsplash.com/photo-1498550744921-75f79806b8a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    emotion: 'calm',
    tracks: [
      {
        id: 'track-1',
        title: 'Océan paisible',
        artist: 'Nature Sounds',
        duration: 240,
        url: '/music/calm-1.mp3'
      },
      {
        id: 'track-2',
        title: 'Méditation du soir',
        artist: 'Healing Vibes',
        duration: 320,
        url: '/music/calm-2.mp3'
      }
    ]
  },
  {
    id: 'playlist-focus',
    name: 'Concentration',
    title: 'Concentration',
    description: 'Musique ambiante pour améliorer votre concentration',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    emotion: 'focus',
    tracks: [
      {
        id: 'track-3',
        title: 'Focus Flow',
        artist: 'Ambient Works',
        duration: 380,
        url: '/music/focus-1.mp3'
      }
    ]
  },
  {
    id: 'playlist-happy',
    name: 'Energie Positive',
    title: 'Energie Positive',
    description: 'Des rythmes entraînants pour booster votre moral',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    emotion: 'happy',
    tracks: [
      {
        id: 'track-4',
        title: 'Sunshine Vibes',
        artist: 'Happy Days',
        duration: 210,
        url: '/music/happy-1.mp3'
      }
    ]
  }
];

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>(SAMPLE_PLAYLISTS);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  
  // Initialize the music system
  const initializeMusicSystem = useCallback(async () => {
    try {
      // In a real app, this would load user preferences, check permissions, etc.
      console.log('Music system initialized');
      setIsInitialized(true);
      return;
    } catch (err) {
      setError('Failed to initialize music system');
      throw new Error('Failed to initialize music system');
    }
  }, []);
  
  // Playlist management
  const loadPlaylistById = useCallback(async (id: string) => {
    try {
      // In a real app, this would fetch from an API
      const playlist = playlists.find(p => p.id === id) || null;
      if (playlist) {
        setCurrentPlaylist(playlist);
      }
      return playlist;
    } catch (err) {
      setError('Failed to load playlist');
      return null;
    }
  }, [playlists]);
  
  const loadPlaylistForEmotion = useCallback(async (emotion: string) => {
    try {
      const playlist = playlists.find(p => p.emotion === emotion) || null;
      if (playlist) {
        setCurrentPlaylist(playlist);
        setCurrentEmotion(emotion);
      }
      return playlist;
    } catch (err) {
      setError('Failed to load playlist for emotion');
      return null;
    }
  }, [playlists]);
  
  // Playback controls
  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);
  
  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  const togglePlay = useCallback(() => {
    if (currentTrack) {
      setIsPlaying(prev => !prev);
    }
  }, [currentTrack]);
  
  const nextTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex < currentPlaylist.tracks.length - 1) {
      playTrack(currentPlaylist.tracks[currentIndex + 1]);
    }
  }, [currentPlaylist, currentTrack, playTrack]);
  
  const previousTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(currentPlaylist.tracks[currentIndex - 1]);
    }
  }, [currentPlaylist, currentTrack, playTrack]);
  
  // Volume controls
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
  }, []);
  
  const toggleMute = useCallback(() => {
    if (isMuted) {
      setVolume(previousVolume);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
    }
    setIsMuted(!isMuted);
  }, [isMuted, volume, previousVolume]);
  
  const adjustVolume = useCallback((amount: number) => {
    setVolume(prev => {
      const newVolume = Math.max(0, Math.min(1, prev + amount));
      return newVolume;
    });
    if (isMuted && amount > 0) {
      setIsMuted(false);
    }
  }, [isMuted]);
  
  const value = {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    playlists,
    currentEmotion,
    error,
    currentPlaylist,
    isInitialized,
    openDrawer,
    
    playTrack,
    pauseTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    setVolume: handleVolumeChange,
    toggleMute,
    adjustVolume,
    
    loadPlaylistById,
    loadPlaylistForEmotion,
    
    initializeMusicSystem,
    setOpenDrawer
  };
  
  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
