
import React, { createContext, useContext, useState } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types';

interface MusicContextType {
  // Playback control
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  
  // Backward compatibility
  play: (track: MusicTrack) => void;
  pause: () => void;
  resumeTrack: () => void;
  
  // Drawer control
  setOpenDrawer: (open: boolean) => void;
  openDrawer: boolean;
  
  // Track & playlist state
  tracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  playlists: MusicPlaylist[];
  loadPlaylistById: (id: string) => void;
  currentPlaylist: MusicPlaylist | null;
  
  // Emotion-based recommendation
  currentEmotion: string;
  setEmotion: (emotion: string) => void;
  
  // Volume & mute control
  isMuted: boolean;
  toggleMute: () => void;
  adjustVolume: (value: number) => void;
  volume: number;
  setVolume: (value: number) => void;
  
  // System state
  isInitialized: boolean;
  initializeMusicSystem: () => void;
  error?: string | null;
  isPlaying?: boolean;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  
  // Metadata
  currentTrackDuration?: number;
  currentTime?: number;
  loading?: boolean;
}

// Create context with default values
const MusicContext = createContext<MusicContextType>({
  // Playback control
  playTrack: () => {},
  pauseTrack: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  
  // Backward compatibility
  play: () => {},
  pause: () => {},
  resumeTrack: () => {},
  
  // Drawer control
  setOpenDrawer: () => {},
  openDrawer: false,
  
  // Track & playlist state
  tracks: [],
  currentTrack: null,
  playlists: [],
  loadPlaylistById: () => {},
  currentPlaylist: null,
  
  // Emotion-based recommendation
  currentEmotion: '',
  setEmotion: () => {},
  
  // Volume & mute control
  isMuted: false,
  toggleMute: () => {},
  adjustVolume: () => {},
  volume: 0.5,
  setVolume: () => {},
  
  // System state
  isInitialized: false,
  initializeMusicSystem: () => {},
  isPlaying: false,
  loadPlaylistForEmotion: async () => null,
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
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTrackDuration, setCurrentTrackDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  
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
  
  const resumeTrack = () => {
    setIsPlaying(true);
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
        setVolume,
        playTrack,
        pauseTrack,
        togglePlay,
        nextTrack,
        previousTrack,
        openDrawer,
        setOpenDrawer,
        currentEmotion,
        setEmotion,
        toggleMute,
        adjustVolume,
        playlists,
        loadPlaylistById,
        loadPlaylistForEmotion,
        currentPlaylist,
        currentTime,
        currentTrackDuration,
        loading,
        // Add backward compatibility properties
        play: playTrack,
        pause: pauseTrack,
        resumeTrack
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
