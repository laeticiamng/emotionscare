
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';

interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  currentPlaylist: MusicPlaylist | null;
  openDrawer: boolean;
  emotion: string | null;
  isInitialized: boolean;
  error: string | null;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  isShuffled: boolean;
  isRepeating: boolean;
  queue: MusicTrack[];
  currentEmotion: string | null;

  setCurrentTrack: (track: MusicTrack | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentPlaylist: (playlist: MusicPlaylist | null) => void;
  setOpenDrawer: (open: boolean) => void;
  setEmotion: (emotion: string | null) => void;
  toggleDrawer: () => void;
  initializeMusicSystem: () => Promise<void>;
  
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (position: number) => void;
  setVolume: (volume: number) => void;
  adjustVolume: (adjustment: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  addToQueue: (track: MusicTrack) => void;
  clearQueue: () => void;
  loadPlaylist: (playlistId: string) => Promise<MusicPlaylist | null>;
  shufflePlaylist: () => void;
}

const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  isPlaying: false,
  currentPlaylist: null,
  openDrawer: false,
  emotion: null,
  isInitialized: false,
  error: null,
  volume: 0.7,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  isShuffled: false,
  isRepeating: false,
  queue: [],
  currentEmotion: null,

  setCurrentTrack: () => {},
  setIsPlaying: () => {},
  setCurrentPlaylist: () => {},
  setOpenDrawer: () => {},
  setEmotion: () => {},
  toggleDrawer: () => {},
  initializeMusicSystem: async () => {},
  
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  seekTo: () => {},
  setVolume: () => {},
  adjustVolume: () => {},
  toggleMute: () => {},
  toggleShuffle: () => {},
  toggleRepeat: () => {},
  
  loadPlaylistForEmotion: async () => null,
  addToQueue: () => {},
  clearQueue: () => {},
  loadPlaylist: async () => null,
  shufflePlaylist: () => {},
});

// Mock data for testing
const mockTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Calm Waters',
    artist: 'Ocean Sounds',
    url: '/audio/calm-waters.mp3',
    coverUrl: '/images/covers/calm-waters.jpg',
    duration: 180,
    emotionalTone: 'calm',
    mood: 'relaxed'
  },
  {
    id: '2',
    title: 'Focus Flow',
    artist: 'Mind Maps',
    url: '/audio/focus-flow.mp3',
    coverUrl: '/images/covers/focus-flow.jpg',
    duration: 240,
    emotionalTone: 'focus',
    mood: 'concentrated'
  }
];

const mockPlaylists: MusicPlaylist[] = [
  {
    id: 'pl-calm',
    title: 'Calm Collection',
    description: 'Relaxing sounds for peace of mind',
    coverUrl: '/images/covers/calm-collection.jpg',
    tracks: [mockTracks[0]],
    mood: 'calm'
  },
  {
    id: 'pl-focus',
    title: 'Focus Flow',
    description: 'Music to help you concentrate',
    coverUrl: '/images/covers/focus-flow.jpg',
    tracks: [mockTracks[1]],
    mood: 'focus'
  }
];

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [isRepeating, setIsRepeating] = useState<boolean>(false);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);

  const toggleDrawer = useCallback(() => {
    setOpenDrawer(prev => !prev);
  }, []);

  const initializeMusicSystem = useCallback(async () => {
    try {
      // Simulate API loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsInitialized(true);
      return;
    } catch (err) {
      setError("Failed to initialize music system");
      throw new Error("Music system initialization failed");
    }
  }, []);

  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // In a real implementation, this would play the actual audio
    console.log(`Playing track: ${track.title}`);
  }, []);

  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
    console.log("Paused track");
  }, []);

  const resumeTrack = useCallback(() => {
    if (currentTrack) {
      setIsPlaying(true);
      console.log(`Resumed track: ${currentTrack.title}`);
    }
  }, [currentTrack]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  }, [isPlaying, pauseTrack, resumeTrack]);

  const nextTrack = useCallback(() => {
    if (!currentPlaylist || !currentPlaylist.tracks || currentPlaylist.tracks.length === 0) {
      return;
    }

    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack?.id);
    if (currentIndex === -1) return;

    const nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
    playTrack(currentPlaylist.tracks[nextIndex]);
  }, [currentPlaylist, currentTrack, playTrack]);

  const previousTrack = useCallback(() => {
    if (!currentPlaylist || !currentPlaylist.tracks || currentPlaylist.tracks.length === 0) {
      return;
    }

    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack?.id);
    if (currentIndex === -1) return;

    const prevIndex = (currentIndex - 1 + currentPlaylist.tracks.length) % currentPlaylist.tracks.length;
    playTrack(currentPlaylist.tracks[prevIndex]);
  }, [currentPlaylist, currentTrack, playTrack]);

  const seekTo = useCallback((position: number) => {
    setCurrentTime(position);
    console.log(`Seek to: ${position}s`);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setIsRepeating(prev => !prev);
  }, []);

  const loadPlaylistForEmotion = useCallback(async (emotionValue: string): Promise<MusicPlaylist | null> => {
    try {
      console.log(`Loading playlist for emotion: ${emotionValue}`);
      setCurrentEmotion(emotionValue);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find a matching playlist
      const playlist = mockPlaylists.find(p => 
        p.mood?.toLowerCase() === emotionValue.toLowerCase() || 
        p.title?.toLowerCase().includes(emotionValue.toLowerCase())
      );
      
      if (playlist) {
        setCurrentPlaylist(playlist);
        return playlist;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading emotion playlist:', error);
      return null;
    }
  }, []);

  const loadPlaylist = useCallback(async (playlistId: string): Promise<MusicPlaylist | null> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find the playlist by ID
      const playlist = mockPlaylists.find(p => p.id === playlistId);
      
      if (playlist) {
        setCurrentPlaylist(playlist);
        return playlist;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading playlist:', error);
      return null;
    }
  }, []);

  const addToQueue = useCallback((track: MusicTrack) => {
    setQueue(prev => [...prev, track]);
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const shufflePlaylist = useCallback(() => {
    if (!currentPlaylist || !currentPlaylist.tracks) return;
    
    // Create a shuffled copy of the tracks
    const shuffledTracks = [...currentPlaylist.tracks]
      .sort(() => Math.random() - 0.5);
    
    setCurrentPlaylist({
      ...currentPlaylist,
      tracks: shuffledTracks
    });
  }, [currentPlaylist]);

  const adjustVolume = useCallback((adjustment: number) => {
    setVolume(prev => {
      const newVolume = Math.max(0, Math.min(1, prev + adjustment));
      return newVolume;
    });
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeMusicSystem().catch(console.error);
  }, [initializeMusicSystem]);

  const value: MusicContextType = {
    currentTrack,
    isPlaying,
    currentPlaylist,
    openDrawer,
    emotion,
    isInitialized,
    error,
    volume,
    isMuted,
    currentTime,
    duration,
    isShuffled,
    isRepeating,
    queue,
    currentEmotion,

    setCurrentTrack,
    setIsPlaying,
    setCurrentPlaylist,
    setOpenDrawer,
    setEmotion,
    toggleDrawer,
    initializeMusicSystem,
    
    playTrack,
    pauseTrack,
    resumeTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume,
    adjustVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    
    loadPlaylistForEmotion,
    addToQueue,
    clearQueue,
    loadPlaylist,
    shufflePlaylist,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default MusicContext;
