
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
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  previousTrack: () => void; // Alias for prevTrack
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setEmotion: (emotion: string) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams) => Promise<MusicPlaylist | null>;
  setOpenDrawer: (open: boolean) => void;
  togglePlay: () => void;
  seekTo: (time: number) => void;
  toggleMute: () => void;
  muted: boolean;
  currentTime: number;
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
  isInitialized: false,
  isLoading: false,
  error: null,
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  previousTrack: () => {}, // Alias for prevTrack
  setVolume: () => {},
  setProgress: () => {},
  setEmotion: () => {},
  loadPlaylistForEmotion: async () => null,
  setOpenDrawer: () => {},
  togglePlay: () => {},
  seekTo: () => {},
  toggleMute: () => {},
  muted: false,
  currentTime: 0,
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
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize when component mounts
  useEffect(() => {
    setIsInitialized(true);
  }, []);

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

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const nextTrack = () => {
    // Logic to play the next track in the playlist
    console.log("Next track");
  };

  const prevTrack = () => {
    // Logic to play the previous track in the playlist
    console.log("Previous track");
  };

  const previousTrack = () => {
    // Alias for prevTrack for backward compatibility
    prevTrack();
  };

  const toggleMute = () => {
    setMuted(prev => !prev);
  };

  const seekTo = (time: number) => {
    setCurrentTime(time);
  };

  const loadPlaylistForEmotion = async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    try {
      // Placeholder logic to load a playlist based on emotion
      const foundPlaylist = mockPlaylists.find(p => p.emotion?.toLowerCase() === params.emotion.toLowerCase()) || null;
      if (foundPlaylist) {
        setPlaylist(foundPlaylist);
      }
      return foundPlaylist;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
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
      isInitialized,
      isLoading,
      error,
      playTrack,
      pauseTrack,
      resumeTrack,
      togglePlay,
      nextTrack,
      prevTrack,
      previousTrack,
      setVolume,
      setProgress,
      setEmotion,
      loadPlaylistForEmotion,
      setOpenDrawer,
      seekTo,
      toggleMute,
      muted,
      currentTime
    }}>
      {children}
    </MusicContext.Provider>
  );
};
