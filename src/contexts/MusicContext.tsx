
import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockMusicPlaylists } from '@/data/mockMusic';
import { MusicTrack, MusicPlaylist, MusicContextType } from '@/types/music';

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [openDrawer, setOpenDrawer] = useState(false);

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

    const playlist = mockMusicPlaylists.find(p => 
      p.emotion?.toLowerCase() === emotion.toLowerCase()
    ) || mockMusicPlaylists[0];

    if (playlist) {
      setCurrentPlaylist(playlist);
      if (playlist.tracks.length > 0 && !currentTrack) {
        setCurrentTrack(playlist.tracks[0]);
      }
    }

    return playlist;
  }, [currentTrack]);

  const getTracksForEmotion = useCallback((emotion: string): MusicTrack[] => {
    const playlist = mockMusicPlaylists.find(p => 
      p.emotion?.toLowerCase() === emotion.toLowerCase()
    );
    
    return playlist?.tracks || [];
  }, []);

  const value = {
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
    getTracksForEmotion
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
