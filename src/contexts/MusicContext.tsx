
import React, { createContext, useContext, useState } from 'react';
import { MusicTrack } from '@/types/audio-player';

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  playlist: MusicTrack[];
  progress: number;
  duration: number;
  volume: number;
  isOpen: boolean;
  setOpenDrawer: (open: boolean) => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<void>;
  play: (track?: MusicTrack) => void;
  pause: () => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  setVolume: (value: number) => void;
  seek: (time: number) => void;
  currentPlaylist?: MusicTrack[];
}

const MusicContext = createContext<MusicContextType>({
  isPlaying: false,
  currentTrack: null,
  playlist: [],
  progress: 0,
  duration: 0,
  volume: 80,
  isOpen: false,
  setOpenDrawer: () => {},
  loadPlaylistForEmotion: async () => {},
  play: () => {},
  pause: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
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
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  
  // Mock implementation of required functions
  const loadPlaylistForEmotion = async (emotion: string) => {
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
    
    setPlaylist(mockTracks);
    if (mockTracks.length > 0) {
      setCurrentTrack(mockTracks[0]);
    }
  };
  
  const play = (track?: MusicTrack) => {
    if (track) {
      setCurrentTrack(track);
    }
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
  
  const setOpenDrawer = (open: boolean) => {
    setIsOpen(open);
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
        setOpenDrawer,
        loadPlaylistForEmotion,
        play,
        pause,
        pauseTrack,
        nextTrack,
        prevTrack,
        toggleRepeat,
        toggleShuffle,
        setVolume,
        seek,
        currentPlaylist: playlist
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
