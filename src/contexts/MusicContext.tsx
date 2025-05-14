
import React, { createContext, useContext, useState } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist } from '@/types/types';

// Create context with default values
const MusicContext = createContext<MusicContextType>({
  // Playback control
  playTrack: () => {},
  pauseTrack: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  
  // Drawer control
  setOpenDrawer: () => {},
  
  // Track & playlist state
  tracks: [],
  currentTrack: null,
  playlists: [],
  loadPlaylistById: () => {},
  
  // Emotion-based recommendation
  currentEmotion: '',
  setEmotion: () => {},
  
  // Volume & mute control
  isMuted: false,
  toggleMute: () => {},
  adjustVolume: () => {},
  
  // System state
  isInitialized: false,
  initializeMusicSystem: () => {},
  isPlaying: false,
  
  // Additional properties
  volume: 0.5,
  loadPlaylistForEmotion: async () => null,
  currentPlaylist: null,
});

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentEmotion, setCurrentEmotion] = useState('');
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  
  // Mock loading playlists function until real implementation
  const loadPlaylistById = (id: string) => {
    console.log(`Loading playlist with ID: ${id}`);
    // Implementation would go here
  };
  
  const loadPlaylistForEmotion = async (emotion: string): Promise<MusicPlaylist | null> => {
    console.log(`Loading playlist for emotion: ${emotion}`);
    // Implementation would go here
    return null;
  };
  
  const initializeMusicSystem = () => {
    setIsInitialized(true);
  };
  
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };
  
  const pauseTrack = () => {
    setIsPlaying(false);
  };
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const nextTrack = () => {
    // Implementation would go here
  };
  
  const previousTrack = () => {
    // Implementation would go here
  };
  
  const setOpenDrawer = (open: boolean) => {
    // Implementation would go here
  };
  
  const setEmotion = (emotion: string) => {
    setCurrentEmotion(emotion);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const adjustVolume = (value: number) => {
    setVolume(value);
  };
  
  return (
    <MusicContext.Provider
      value={{
        isInitialized,
        initializeMusicSystem,
        tracks,
        currentTrack,
        isPlaying,
        isMuted,
        volume,
        playTrack,
        pauseTrack,
        togglePlay,
        nextTrack,
        previousTrack,
        setOpenDrawer,
        currentEmotion,
        setEmotion,
        toggleMute,
        adjustVolume,
        playlists,
        loadPlaylistById,
        loadPlaylistForEmotion,
        currentPlaylist,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
