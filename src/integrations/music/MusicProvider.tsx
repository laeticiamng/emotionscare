import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { mockMusicTracks, mockPlaylists } from './mockMusicData';

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  emotion: string | null;
  openDrawer: boolean;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setEmotion: (emotion: string) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams) => Promise<MusicPlaylist | null>;
  setOpenDrawer: (open: boolean) => void;
}

export const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  playlist: null,
  isPlaying: false,
  volume: 0.5,
  progress: 0,
  duration: 0,
  emotion: null,
  openDrawer: false,
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  setProgress: () => {},
  setEmotion: () => {},
  loadPlaylistForEmotion: async () => null,
  setOpenDrawer: () => {},
});

export const useMusic = () => useContext(MusicContext);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    setIsPlaying(true);
  };

  const nextTrack = () => {
    // Logic to play the next track in the playlist
  };

  const previousTrack = () => {
    // Logic to play the previous track in the playlist
  };

  const loadPlaylistForEmotion = async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    // Placeholder logic to load a playlist based on emotion
    return null;
  };

  return (
    <MusicContext.Provider value={{
      currentTrack,
      playlist,
      isPlaying,
      volume,
      progress,
      duration,
      emotion,
      openDrawer,
      playTrack,
      pauseTrack,
      resumeTrack,
      nextTrack,
      previousTrack,
      setVolume,
      setProgress,
      setEmotion,
      loadPlaylistForEmotion,
      setOpenDrawer
    }}>
      {children}
    </MusicContext.Provider>
  );
};
