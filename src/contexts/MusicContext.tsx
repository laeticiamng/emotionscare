
import React, { createContext, useContext, useState } from 'react';
import { MusicTrack, MusicContextType, MusicPlaylist } from '@/types/music';

const MusicContext = createContext<MusicContextType>({
  isPlaying: false,
  currentTrack: null,
  playlist: [],
  progress: 0,
  duration: 0,
  volume: 80,
  isOpen: false,
  openDrawer: false,
  currentEmotion: 'neutral',
  setOpenDrawer: () => {},
  loadPlaylistForEmotion: async () => {},
  play: () => {},
  playTrack: () => {},
  pause: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  previousTrack: () => {},
  toggleRepeat: () => {},
  toggleShuffle: () => {},
  setVolume: () => {},
  seek: () => {},
  currentPlaylist: []
});

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicTrack[]>([]);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isOpen, setIsOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  
  // Mock implementation of required functions
  const loadPlaylistForEmotion = async (emotion: string): Promise<MusicPlaylist | void> => {
    console.log(`Loading playlist for emotion: ${emotion}`);
    // In a real app, this would make an API call to get tracks for the emotion
    const mockTracks: MusicTrack[] = [
      {
        id: '1',
        title: 'Calm Waters',
        artist: 'Nature Sounds',
        duration: 180,
        url: '/sounds/calm-water.mp3',
        emotion: emotion,
      },
      // More tracks would be here...
    ];
    
    const mockPlaylist: MusicPlaylist = {
      id: '1',
      name: `${emotion} Playlist`,
      tracks: mockTracks,
      emotion: emotion
    };
    
    setPlaylist(mockTracks);
    if (mockTracks.length > 0) {
      setCurrentTrack(mockTracks[0]);
    }
    
    return mockPlaylist;
  };
  
  const loadPlaylistById = async (id: string): Promise<void> => {
    console.log(`Loading playlist by ID: ${id}`);
    // Implementation would be similar to loadPlaylistForEmotion
  };
  
  const play = (track?: MusicTrack) => {
    if (track) {
      setCurrentTrack(track);
    }
    setIsPlaying(true);
  };
  
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };
  
  const pause = () => {
    setIsPlaying(false);
  };
  
  const pauseTrack = () => {
    setIsPlaying(false);
  };
  
  const nextTrack = () => {
    if (!currentTrack || !playlist.length) return;
    
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIndex < playlist.length - 1) {
      setCurrentTrack(playlist[currentIndex + 1]);
    } else {
      // Loop back to the first track
      setCurrentTrack(playlist[0]);
    }
  };
  
  const prevTrack = () => {
    if (!currentTrack || !playlist.length) return;
    
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      setCurrentTrack(playlist[currentIndex - 1]);
    } else {
      // Go to the last track
      setCurrentTrack(playlist[playlist.length - 1]);
    }
  };
  
  // Alias for prevTrack for backward compatibility
  const previousTrack = prevTrack;
  
  const toggleRepeat = () => {
    setRepeat(prev => !prev);
  };
  
  const toggleShuffle = () => {
    setShuffle(prev => !prev);
  };
  
  const seek = (time: number) => {
    setProgress(time);
    // In a real app, this would update the audio element's currentTime
  };
  
  const initializeMusicSystem = async (): Promise<void> => {
    try {
      // Mock initialization
      console.log("Initializing music system...");
      await new Promise(resolve => setTimeout(resolve, 500));
      setError(null);
    } catch (err) {
      setError("Failed to initialize music system");
      console.error("Error initializing music system:", err);
    }
  };
  
  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTrack,
        playlist,
        progress,
        duration,
        volume,
        isOpen,
        openDrawer,
        error,
        currentEmotion,
        playlists,
        setOpenDrawer,
        loadPlaylistForEmotion,
        loadPlaylistById,
        play,
        playTrack,
        pause,
        pauseTrack,
        nextTrack,
        prevTrack,
        previousTrack,
        toggleRepeat,
        toggleShuffle,
        setVolume,
        seek,
        currentPlaylist: playlist,
        initializeMusicSystem
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
