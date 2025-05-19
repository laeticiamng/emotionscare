
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType } from '@/types/music';
import { mockTracks, mockPlaylists } from '@/contexts/music/mockMusicData';
import { normalizeTrack, normalizePlaylist } from '@/utils/musicCompatibility';
import { useToast } from '@/hooks/use-toast';

// Create the context with a default value
export const MusicContext = createContext<MusicContextType>({} as MusicContextType);

export interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>(mockPlaylists || []);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [muted, setMuted] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // Initialize the music player
  useEffect(() => {
    // Simulate loading playlists
    setIsLoading(true);
    try {
      // In a real app, this would fetch from an API
      setPlaylists(mockPlaylists);
      setIsInitialized(true);
      setIsLoading(false);
    } catch (error) {
      setError("Failed to initialize music player");
      setIsLoading(false);
    }
  }, []);
  
  // Play a track
  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(normalizeTrack(track));
    setIsPlaying(true);
    
    // Show a toast notification
    toast({
      title: "Now playing",
      description: `${track.title} by ${track.artist}`,
      duration: 3000,
    });
  }, [toast]);
  
  // Play a playlist
  const playPlaylist = useCallback((playlist: MusicPlaylist) => {
    const normalizedPlaylist = normalizePlaylist(playlist);
    setCurrentPlaylist(normalizedPlaylist);
    
    if (normalizedPlaylist.tracks.length > 0) {
      playTrack(normalizedPlaylist.tracks[0]);
    }
  }, [playTrack]);
  
  // Toggle play/pause
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  
  // Pause track
  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  // Resume track
  const resumeTrack = useCallback(() => {
    setIsPlaying(true);
  }, []);
  
  // Next track
  const nextTrack = useCallback(() => {
    if (!currentTrack || !currentPlaylist) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(
      track => track.id === currentTrack.id
    );
    
    if (currentIndex >= 0 && currentIndex < currentPlaylist.tracks.length - 1) {
      playTrack(currentPlaylist.tracks[currentIndex + 1]);
    }
  }, [currentTrack, currentPlaylist, playTrack]);
  
  // Previous track
  const prevTrack = useCallback(() => {
    if (!currentTrack || !currentPlaylist) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(
      track => track.id === currentTrack.id
    );
    
    if (currentIndex > 0) {
      playTrack(currentPlaylist.tracks[currentIndex - 1]);
    }
  }, [currentTrack, currentPlaylist, playTrack]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
  }, []);
  
  // Set volume
  const handleSetVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (newVolume > 0 && muted) {
      setMuted(false);
    }
  }, [muted]);
  
  // Seek to position
  const seekTo = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);
  
  // Toggle drawer
  const toggleDrawer = useCallback(() => {
    setOpenDrawer(prev => !prev);
  }, []);
  
  // Load playlist for emotion
  const loadPlaylistForEmotion = useCallback(async (emotion: string): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would call an API
      const matchingPlaylist = mockPlaylists.find(
        p => p.emotion === emotion || p.mood === emotion
      );
      
      if (matchingPlaylist) {
        setCurrentPlaylist(matchingPlaylist);
        return matchingPlaylist;
      }
      
      // If no exact match, create a playlist based on tracks with similar emotion
      const emotionTracks = mockTracks.filter(
        t => t.emotion === emotion || t.mood === emotion
      );
      
      if (emotionTracks.length > 0) {
        const newPlaylist: MusicPlaylist = {
          id: `emotion-${emotion}-${Date.now()}`,
          title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Music`,
          description: `Music for ${emotion} mood`,
          tracks: emotionTracks,
          emotion: emotion
        };
        
        setCurrentPlaylist(newPlaylist);
        return newPlaylist;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading playlist for emotion:', error);
      setError('Failed to load emotion playlist');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Get recommendation by emotion
  const getRecommendationByEmotion = useCallback(async (emotion: string): Promise<MusicTrack | null> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would call an API
      const matchingTracks = mockTracks.filter(
        t => t.emotion === emotion || t.mood === emotion
      );
      
      if (matchingTracks.length > 0) {
        // Get a random track from the matching tracks
        const randomIndex = Math.floor(Math.random() * matchingTracks.length);
        return matchingTracks[randomIndex];
      }
      
      return null;
    } catch (error) {
      console.error('Error getting recommendation by emotion:', error);
      setError('Failed to get music recommendation');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Set emotion for current session
  const setEmotion = useCallback((emotion: string) => {
    loadPlaylistForEmotion(emotion).then(playlist => {
      if (playlist && playlist.tracks.length > 0) {
        playTrack(playlist.tracks[0]);
      }
    });
  }, [loadPlaylistForEmotion, playTrack]);
  
  const contextValue: MusicContextType = {
    currentTrack,
    currentPlaylist,
    playlists,
    isPlaying,
    volume,
    muted,
    duration,
    currentTime,
    isLoading,
    error,
    openDrawer,
    isInitialized,
    
    // Playback controls
    togglePlay,
    toggleMute,
    setVolume: handleSetVolume,
    playTrack,
    nextTrack,
    prevTrack,
    previousTrack: prevTrack,
    pauseTrack,
    resumeTrack,
    play: playTrack,
    pause: pauseTrack,
    resume: resumeTrack,
    next: nextTrack,
    previous: prevTrack,
    seekTo,
    toggleDrawer,
    setOpenDrawer,
    
    // Music management
    loadPlaylistForEmotion,
    getRecommendationByEmotion,
    setEmotion,
    setPlaylist: setCurrentPlaylist,
    setCurrentTrack,
    playPlaylist,
    toggleRepeat: () => {},  // Placeholder
    toggleShuffle: () => {},  // Placeholder
  };
  
  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

// Custom hook to use the MusicContext
export const useMusic = () => {
  const context = useContext(MusicContext);
  
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  
  return context;
};
