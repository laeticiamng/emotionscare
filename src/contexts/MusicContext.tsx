
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist } from '@/types/music';
import { musicTracks, musicPlaylists } from '@/data/music';
import * as musicService from '@/services/musicService';

// Create the context with proper typing
const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  currentPlaylist: null,
  playlists: [],
  isPlaying: false,
  volume: 0.5,
  duration: 0,
  muted: false,
  currentTime: 0,
  togglePlay: () => {},
  toggleMute: () => {},
  setVolume: () => {},
  playTrack: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  previousTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  play: () => {},
  pause: () => {},
  resume: () => {},
  next: () => {},
  previous: () => {},
  seekTo: () => {},
  toggleDrawer: () => {},
  setOpenDrawer: () => {},
  loadPlaylistForEmotion: async () => null,
  getRecommendationByEmotion: async () => null
});

// Provider component
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State management for music player
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  // Load initial data
  useEffect(() => {
    if (!isInitialized) {
      setPlaylists(musicPlaylists);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Toggle mute
  const toggleMute = () => {
    setMuted(!muted);
  };

  // Play a specific track
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // Pause current track
  const pauseTrack = () => {
    setIsPlaying(false);
  };

  // Resume playing
  const resumeTrack = () => {
    setIsPlaying(true);
  };

  // Play next track
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex < 0 || currentIndex >= playlist.tracks.length - 1) return;
    
    playTrack(playlist.tracks[currentIndex + 1]);
  };

  // Play previous track
  const prevTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex <= 0) return;
    
    playTrack(playlist.tracks[currentIndex - 1]);
  };

  // Seek to a specific time
  const seekTo = (time: number) => {
    setCurrentTime(time);
  };

  // Toggle drawer
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  // Load playlist for a specific emotion
  const loadPlaylistForEmotion = async (emotion: string): Promise<MusicPlaylist | null> => {
    try {
      setIsLoading(true);
      
      // In a real app, fetch from an API
      const matchingPlaylist = musicPlaylists.find(p => 
        p.mood?.toLowerCase() === emotion.toLowerCase()
      );
      
      if (matchingPlaylist) {
        setPlaylist(matchingPlaylist);
        return matchingPlaylist;
      }
      
      return null;
    } catch (err) {
      setError('Failed to load playlist');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get track recommendation by emotion
  const getRecommendationByEmotion = async (emotion: string): Promise<MusicTrack | null> => {
    try {
      setIsLoading(true);
      
      // In a real app, fetch from an API
      const matchingTracks = musicTracks.filter(t => 
        t.emotion?.toLowerCase() === emotion.toLowerCase()
      );
      
      if (matchingTracks.length > 0) {
        return matchingTracks[Math.floor(Math.random() * matchingTracks.length)];
      }
      
      return null;
    } catch (err) {
      setError('Failed to get recommendation');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Play a playlist
  const playPlaylist = (newPlaylist: MusicPlaylist) => {
    setPlaylist(newPlaylist);
    if (newPlaylist.tracks && newPlaylist.tracks.length > 0) {
      playTrack(newPlaylist.tracks[0]);
    }
  };

  // Set emotion for music recommendations
  const setEmotion = (emotion: string) => {
    loadPlaylistForEmotion(emotion);
  };

  // Generate music (mock implementation)
  const generateMusic = async (params: any): Promise<MusicTrack | null> => {
    try {
      setIsLoading(true);
      
      // In a real app, call an API to generate music
      // For now, return a mock track
      const generatedTrack: MusicTrack = {
        id: `generated-${Date.now()}`,
        title: `Generated ${params.mood || 'Music'}`,
        artist: 'AI Composer',
        duration: 180,
        audioUrl: '/audio/generated.mp3',
        coverUrl: '/images/generated-cover.jpg'
      };
      
      return generatedTrack;
    } catch (err) {
      setError('Failed to generate music');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle repeat mode
  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };

  // Toggle shuffle mode
  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  // Provide all methods and state
  const contextValue: MusicContextType = {
    currentTrack,
    currentPlaylist: playlist,
    playlist,
    playlists,
    isPlaying,
    volume,
    duration,
    muted,
    currentTime,
    isLoading,
    error,
    openDrawer,
    isInitialized,
    
    togglePlay,
    toggleMute,
    setVolume,
    playTrack,
    nextTrack,
    prevTrack,
    previousTrack: prevTrack,
    pauseTrack,
    resumeTrack,
    play: resumeTrack,
    pause: pauseTrack,
    resume: resumeTrack,
    next: nextTrack,
    previous: prevTrack,
    seekTo,
    toggleDrawer,
    setOpenDrawer,
    
    loadPlaylistForEmotion,
    getRecommendationByEmotion,
    setEmotion,
    generateMusic,
    setPlaylist,
    setCurrentTrack,
    playPlaylist,
    toggleRepeat,
    toggleShuffle
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

// Custom hook for using the music context
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default MusicContext;
