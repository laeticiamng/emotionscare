
import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockPlaylists } from '@/data/mockMusic';
import { MusicTrack, MusicPlaylist, MusicContextType } from '@/types/music';

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [error, setError] = useState<string | null>(null);

  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);

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

  const loadPlaylistForEmotion = useCallback(async (emotion: string): Promise<MusicPlaylist | null> => {
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const playlist = mockPlaylists.find(p => 
      p.emotion?.toLowerCase() === emotion.toLowerCase()
    ) || mockPlaylists[0];

    if (playlist) {
      setCurrentPlaylist(playlist);
      if (playlist.tracks.length > 0 && !currentTrack) {
        setCurrentTrack(playlist.tracks[0]);
      }
      setCurrentEmotion(emotion);
    }

    return playlist;
  }, [currentTrack]);

  const getTracksForEmotion = useCallback((emotion: string): MusicTrack[] => {
    const playlist = mockPlaylists.find(p => 
      p.emotion?.toLowerCase() === emotion.toLowerCase()
    );
    
    return playlist?.tracks || [];
  }, []);
  
  // Add toggleRepeat and toggleShuffle functions
  const toggleRepeat = useCallback(() => {
    // Implementation would go here
    console.log("Toggle repeat functionality");
  }, []);
  
  const toggleShuffle = useCallback(() => {
    // Implementation would go here
    console.log("Toggle shuffle functionality");
  }, []);
  
  // Add initializeMusicSystem function - modify to return void instead of boolean
  const initializeMusicSystem = useCallback(async (): Promise<void> => {
    try {
      // Simulate initialization
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("Music system initialized");
    } catch (err) {
      setError("Failed to initialize music system");
      throw err;
    }
  }, []);
  
  // Add loadPlaylistById function
  const loadPlaylistById = useCallback(async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const playlist = mockPlaylists.find(p => p.id === id);
      if (playlist) {
        setCurrentPlaylist(playlist);
        if (playlist.tracks.length > 0) {
          setCurrentTrack(playlist.tracks[0]);
          setIsPlaying(true);
        }
        return playlist;
      }
      return null;
    } catch (err) {
      console.error("Error loading playlist by ID:", err);
      return null;
    }
  }, []);

  const value: MusicContextType = {
    currentTrack,
    currentPlaylist,
    isPlaying,
    volume,
    openDrawer,
    setOpenDrawer,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    setVolume,
    loadPlaylistForEmotion,
    getTracksForEmotion,
    currentEmotion,
    toggleRepeat,
    toggleShuffle,
    initializeMusicSystem,
    error,
    playlists: mockPlaylists,
    loadPlaylistById
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
