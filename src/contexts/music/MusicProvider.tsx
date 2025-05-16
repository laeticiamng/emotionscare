
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';

// Define the context type
export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  playlist: MusicTrack[];
  duration: number;
  currentTime: number;
  progress?: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  setVolume: (level: number) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  toggleMute: () => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  setEmotion: (emotion: string) => void;
  currentEmotion?: string;
  setOpenDrawer: (open: boolean) => void;
  openDrawer?: boolean;
  playlists?: MusicPlaylist[];
  isInitialized: boolean;
  initializeMusicSystem: () => Promise<boolean>;
  error?: Error | null;
  play?: (track: MusicTrack) => void;
  pause?: () => void;
  resume?: () => void;
  stop?: () => void;
  next?: () => void;
  previous?: () => void;
  prevTrack?: () => void;
  mute?: () => void;
  unmute?: () => void;
  isMuted?: boolean;
  setPlaylist?: (playlist: MusicPlaylist) => void;
  currentPlaylist?: MusicPlaylist | null;
}

// Create the context with a default value
const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  muted: false,
  playlist: [],
  duration: 0,
  currentTime: 0,
  playTrack: () => {},
  pauseTrack: () => {},
  setVolume: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  seekTo: () => {},
  toggleMute: () => {},
  loadPlaylistForEmotion: async () => null,
  setEmotion: () => {},
  setOpenDrawer: () => {},
  isInitialized: false,
  initializeMusicSystem: async () => false
});

// Create a provider for the context
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [playlist, setPlaylistState] = useState<MusicTrack[]>([]);

  // Initialize the music system
  const initializeMusicSystem = async () => {
    setIsInitialized(true);
    return true;
  };

  // Load a playlist based on emotion
  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    // Determine the emotion from the parameters
    const emotion = typeof params === 'string' ? params : params.emotion;
    
    // Simulating an API request
    console.log(`Loading playlist for emotion: ${emotion}`);
    
    // Wait to simulate a network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create a mock playlist
    const mockPlaylist: MusicPlaylist = {
      id: `playlist-${emotion}`,
      name: `${emotion} Tracks`,
      title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Mood`,
      tracks: [
        {
          id: `track-${emotion}-1`,
          title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Melody`,
          artist: "EmotionsCare Audio",
          duration: 180,
          url: "/sounds/ambient-calm.mp3",
          coverUrl: "/images/covers/calm.jpg"
        },
        {
          id: `track-${emotion}-2`,
          title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Harmony`,
          artist: "EmotionsCare Audio",
          duration: 210,
          url: "/sounds/ambient-calm.mp3",
          coverUrl: "/images/covers/calm-alt.jpg"
        }
      ]
    };
    
    setCurrentEmotion(emotion);
    setCurrentPlaylist(mockPlaylist);
    setPlaylistState(mockPlaylist.tracks);
    
    return mockPlaylist;
  };
  
  // Play a track
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    setCurrentTime(0);
    setDuration(track.duration || 0);
  };
  
  // Pause the current track
  const pauseTrack = () => {
    setIsPlaying(false);
  };
  
  // Resume playing
  const resumeTrack = () => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  };
  
  // Stop playing
  const stopTrack = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };
  
  // Toggle mute
  const toggleMute = () => {
    setMuted(!muted);
  };

  // Set volume
  const setVolume = (level: number) => {
    setVolumeState(level);
  };
  
  // Go to next track
  const nextTrack = () => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === currentPlaylist.tracks.length - 1) {
      // If last track or not found, play first track
      playTrack(currentPlaylist.tracks[0]);
    } else {
      // Play next track
      playTrack(currentPlaylist.tracks[currentIndex + 1]);
    }
  };
  
  // Go to previous track
  const previousTrack = () => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === 0) {
      // If first track or not found, play last track
      playTrack(currentPlaylist.tracks[currentPlaylist.tracks.length - 1]);
    } else {
      // Play previous track
      playTrack(currentPlaylist.tracks[currentIndex - 1]);
    }
  };
  
  // Seek to a specific position
  const seekTo = (position: number) => {
    setCurrentTime(position);
    setProgress((position / duration) * 100);
  };
  
  // Set a playlist
  const setPlaylist = (playlist: MusicPlaylist) => {
    setCurrentPlaylist(playlist);
    setPlaylistState(playlist.tracks);
    if (playlist.tracks.length > 0 && !currentTrack) {
      playTrack(playlist.tracks[0]);
    }
  };

  // Context value to be provided
  const contextValue: MusicContextType = {
    currentTrack,
    isPlaying,
    volume,
    muted,
    isMuted: muted,
    progress,
    currentTime,
    duration,
    currentPlaylist,
    currentEmotion: currentEmotion || undefined,
    playlist,
    play: playTrack,
    playTrack,
    pause: pauseTrack,
    pauseTrack,
    resume: resumeTrack,
    stop: stopTrack,
    next: nextTrack,
    nextTrack,
    previous: previousTrack,
    previousTrack,
    prevTrack: previousTrack,
    setVolume,
    togglePlay,
    toggleMute,
    mute: () => setMuted(true),
    unmute: () => setMuted(false),
    seekTo,
    setPlaylist,
    loadPlaylistForEmotion,
    setEmotion: setCurrentEmotion,
    openDrawer,
    setOpenDrawer,
    playlists,
    isInitialized,
    initializeMusicSystem,
    error
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

// Hook to use the music context
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default MusicContext;
