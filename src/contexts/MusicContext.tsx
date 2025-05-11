
import React, { createContext, useContext, useState } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types';

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  playlists: MusicPlaylist[];
  queue: MusicTrack[];
  currentPlaylist: MusicPlaylist | null;
  currentEmotion: string;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  addTrackToQueue: (track: MusicTrack) => void;
  clearQueue: () => void;
  duration: number;
  currentTime: number;
  seek: (time: number) => void;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  loadPlaylistById: (id: string) => Promise<MusicPlaylist | null>;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  initializeMusicSystem: () => Promise<void>;
  error: string | null;
}

const defaultMusicContext: MusicContextType = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  playlists: [],
  queue: [],
  currentPlaylist: null,
  currentEmotion: 'neutral',
  playTrack: () => {},
  pauseTrack: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  addTrackToQueue: () => {},
  clearQueue: () => {},
  duration: 0,
  currentTime: 0,
  seek: () => {},
  openDrawer: false,
  setOpenDrawer: () => {},
  loadPlaylistForEmotion: async () => null,
  loadPlaylistById: async () => null,
  toggleRepeat: () => {},
  toggleShuffle: () => {},
  initializeMusicSystem: async () => {},
  error: null
};

const MusicContext = createContext<MusicContextType>(defaultMusicContext);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [error, setError] = useState<string | null>(null);
  
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };
  
  const pauseTrack = () => {
    setIsPlaying(false);
  };
  
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };
  
  const nextTrack = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      const newQueue = queue.slice(1);
      setCurrentTrack(nextTrack);
      setQueue(newQueue);
      setIsPlaying(true);
    }
  };
  
  const prevTrack = () => {
    // Mock implementation - would need track history
    console.log('Previous track');
  };
  
  const previousTrack = () => {
    // Alias for prevTrack for compatibility
    prevTrack();
  };
  
  const addTrackToQueue = (track: MusicTrack) => {
    setQueue(prev => [...prev, track]);
  };
  
  const clearQueue = () => {
    setQueue([]);
  };
  
  const seek = (time: number) => {
    setCurrentTime(time);
    // Would also set the audio element's current time
  };
  
  const loadPlaylistForEmotion = async (emotion: string): Promise<MusicPlaylist | null> => {
    try {
      console.log(`Loading playlist for emotion: ${emotion}`);
      // Mock implementation - would call API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockPlaylist: MusicPlaylist = {
        id: `playlist-${emotion}`,
        name: `${emotion} Playlist`,
        description: `A playlist for ${emotion} mood`,
        tracks: [
          {
            id: `track-${emotion}-1`,
            title: `${emotion} Track 1`,
            artist: 'AI Music',
            duration: 180,
            url: '/audio/track1.mp3',
            cover_url: '/images/cover1.jpg'
          },
          {
            id: `track-${emotion}-2`,
            title: `${emotion} Track 2`,
            artist: 'AI Music',
            duration: 240,
            url: '/audio/track2.mp3',
            cover_url: '/images/cover2.jpg'
          }
        ]
      };
      
      setCurrentPlaylist(mockPlaylist);
      setCurrentEmotion(emotion);
      return mockPlaylist;
    } catch (err) {
      console.error(`Error loading playlist for emotion ${emotion}:`, err);
      setError(`Failed to load playlist for ${emotion}`);
      return null;
    }
  };
  
  const loadPlaylistById = async (id: string): Promise<MusicPlaylist | null> => {
    try {
      console.log(`Loading playlist by ID: ${id}`);
      // Mock implementation - would call API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockPlaylist: MusicPlaylist = {
        id,
        name: `Playlist ${id}`,
        description: `A playlist with ID ${id}`,
        tracks: [
          {
            id: `track-${id}-1`,
            title: `Track 1 from playlist ${id}`,
            artist: 'AI Music',
            duration: 180,
            url: '/audio/track1.mp3',
            cover_url: '/images/cover1.jpg'
          }
        ]
      };
      
      setCurrentPlaylist(mockPlaylist);
      return mockPlaylist;
    } catch (err) {
      console.error(`Error loading playlist by ID ${id}:`, err);
      setError(`Failed to load playlist ${id}`);
      return null;
    }
  };
  
  const toggleRepeat = () => {
    console.log('Toggle repeat mode');
  };
  
  const toggleShuffle = () => {
    console.log('Toggle shuffle mode');
  };
  
  const initializeMusicSystem = async () => {
    try {
      console.log('Initializing music system...');
      // Mock initialization
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Music system initialized successfully');
    } catch (err) {
      console.error('Failed to initialize music system:', err);
      setError('Failed to initialize music system');
    }
  };

  return (
    <MusicContext.Provider value={{
      currentTrack,
      isPlaying,
      volume,
      playlists,
      queue,
      currentPlaylist,
      currentEmotion,
      playTrack,
      pauseTrack,
      togglePlay,
      nextTrack,
      prevTrack,
      previousTrack,
      setVolume,
      addTrackToQueue,
      clearQueue,
      duration,
      currentTime,
      seek,
      openDrawer,
      setOpenDrawer,
      loadPlaylistForEmotion,
      loadPlaylistById,
      toggleRepeat,
      toggleShuffle,
      initializeMusicSystem,
      error
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
