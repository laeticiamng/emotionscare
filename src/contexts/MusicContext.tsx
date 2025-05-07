
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { usePlaylistManager } from '@/hooks/usePlaylistManager';
import { useDrawerState } from '@/hooks/useDrawerState';
import { Track, Playlist } from '@/services/music/types';

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  playlist: Playlist | null;
  currentEmotion: string;
  isDrawerOpen: boolean;
  repeat: boolean;
  shuffle: boolean;
  playTrack: (track: Track) => void;
  loadTrack: (track: any) => void; // Add loadTrack method
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<void>;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  // Use our custom hooks to manage different aspects of the music player
  const {
    currentTrack,
    isPlaying,
    volume,
    repeat,
    shuffle,
    playTrack,
    pauseTrack,
    setVolume,
    toggleRepeat,
    toggleShuffle,
    setCurrentTrack
  } = useAudioPlayer();

  const {
    playlist,
    currentEmotion,
    loadPlaylistForEmotion: loadPlaylist,
    getNextTrack,
    getPreviousTrack
  } = usePlaylistManager();

  const {
    isDrawerOpen,
    openDrawer,
    closeDrawer
  } = useDrawerState();

  // Load initial playlist
  useEffect(() => {
    loadPlaylist('neutral');
  }, []);

  // Handle loading of playlist and set first track
  const loadPlaylistForEmotion = async (emotion: string) => {
    const newPlaylist = await loadPlaylist(emotion);
    if (newPlaylist && newPlaylist.tracks.length > 0) {
      setCurrentTrack(newPlaylist.tracks[0]);
    }
  };
  
  // Add loadTrack method
  const loadTrack = (track: any) => {
    setCurrentTrack(track);
  };

  // Navigation functions
  const nextTrack = () => {
    if (!currentTrack || !playlist) return;
    
    const nextTrackItem = getNextTrack(currentTrack, shuffle);
    playTrack(nextTrackItem);
  };
  
  const previousTrack = () => {
    if (!currentTrack || !playlist) return;
    
    const prevTrackItem = getPreviousTrack(currentTrack, shuffle);
    playTrack(prevTrackItem);
  };

  return (
    <MusicContext.Provider value={{
      currentTrack,
      isPlaying,
      volume,
      playlist,
      currentEmotion,
      isDrawerOpen,
      repeat,
      shuffle,
      playTrack,
      loadTrack, // Added loadTrack
      pauseTrack,
      nextTrack,
      previousTrack,
      setVolume,
      toggleRepeat,
      toggleShuffle,
      loadPlaylistForEmotion,
      openDrawer,
      closeDrawer,
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
