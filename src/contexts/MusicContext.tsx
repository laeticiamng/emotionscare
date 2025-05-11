
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Track, Playlist } from '@/services/music/types';

interface MusicContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  playlist: Playlist | null;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<Playlist | null>;
  setOpenDrawer: (open: boolean) => void;
  isDrawerOpen: boolean;
}

const MusicContext = createContext<MusicContextType>({
  isPlaying: false,
  currentTrack: null,
  playlist: null,
  playTrack: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  loadPlaylistForEmotion: async () => null,
  setOpenDrawer: () => {},
  isDrawerOpen: false
});

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    console.info('Playing track:', track.title);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    console.info('Paused playback');
  };

  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex >= 0 && currentIndex < playlist.tracks.length - 1) {
      playTrack(playlist.tracks[currentIndex + 1]);
    }
  };

  const previousTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(playlist.tracks[currentIndex - 1]);
    }
  };

  const loadPlaylistForEmotion = async (emotion: string): Promise<Playlist | null> => {
    // Mock function to load a playlist based on emotion
    const mockPlaylist: Playlist = {
      id: `playlist-${emotion}`,
      name: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Playlist`,
      emotion: emotion,
      tracks: [
        {
          id: `${emotion}-track-1`,
          title: `${emotion} Track 1`,
          artist: 'Artist 1',
          duration: 180,
          url: '/audio/track1.mp3',
          cover: '/images/cover1.jpg'
        },
        {
          id: `${emotion}-track-2`,
          title: `${emotion} Track 2`,
          artist: 'Artist 2',
          duration: 210,
          url: '/audio/track2.mp3',
          cover: '/images/cover2.jpg'
        }
      ]
    };
    
    setPlaylist(mockPlaylist);
    return mockPlaylist;
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTrack,
        playlist,
        playTrack,
        pauseTrack,
        nextTrack,
        previousTrack,
        loadPlaylistForEmotion,
        setOpenDrawer: setIsDrawerOpen,
        isDrawerOpen
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
