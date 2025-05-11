
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Track, Playlist } from '@/services/music/types';
import { MusicTrack, MusicPlaylist } from '@/types/music';

interface MusicContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  playlist: Playlist | null;
  volume: number;
  currentPlaylist: Playlist | null;
  playlists?: Playlist[];
  error: string | null;
  openDrawer: boolean;
  currentEmotion?: string;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<Playlist | null>;
  loadPlaylistById?: (id: string) => Promise<Playlist | null>;
  setOpenDrawer: (open: boolean) => void;
  initializeMusicSystem: () => Promise<void>;
}

const MusicContext = createContext<MusicContextType>({
  isPlaying: false,
  currentTrack: null,
  playlist: null,
  volume: 0.5,
  currentPlaylist: null,
  error: null,
  openDrawer: false,
  playTrack: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  toggleRepeat: () => {},
  toggleShuffle: () => {},
  loadPlaylistForEmotion: async () => null,
  setOpenDrawer: () => {},
  initializeMusicSystem: async () => {}
});

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [error, setError] = useState<string | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string | undefined>(undefined);

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

  const toggleRepeat = () => {
    // Implementation placeholder
    console.log('Toggle repeat');
  };

  const toggleShuffle = () => {
    // Implementation placeholder
    console.log('Toggle shuffle');
  };

  const loadPlaylistForEmotion = async (emotion: string): Promise<Playlist | null> => {
    setCurrentEmotion(emotion);
    
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
          cover: '/images/cover1.jpg',
          coverImage: '/images/cover1.jpg',
          coverUrl: '/images/cover1.jpg',
        },
        {
          id: `${emotion}-track-2`,
          title: `${emotion} Track 2`,
          artist: 'Artist 2',
          duration: 210,
          url: '/audio/track2.mp3',
          cover: '/images/cover2.jpg',
          coverImage: '/images/cover2.jpg',
          coverUrl: '/images/cover2.jpg',
        }
      ]
    };
    
    setPlaylist(mockPlaylist);
    setCurrentPlaylist(mockPlaylist);
    return mockPlaylist;
  };

  const loadPlaylistById = async (id: string): Promise<Playlist | null> => {
    // Mock implementation
    const mockPlaylist: Playlist = {
      id: id,
      name: `Playlist ${id}`,
      tracks: [
        {
          id: `${id}-track-1`,
          title: `Track 1`,
          artist: 'Artist 1',
          duration: 180,
          url: '/audio/track1.mp3',
          cover: '/images/cover1.jpg',
          coverImage: '/images/cover1.jpg',
          coverUrl: '/images/cover1.jpg',
        },
        {
          id: `${id}-track-2`,
          title: `Track 2`,
          artist: 'Artist 2',
          duration: 210,
          url: '/audio/track2.mp3',
          cover: '/images/cover2.jpg',
          coverImage: '/images/cover2.jpg',
          coverUrl: '/images/cover2.jpg',
        }
      ]
    };
    
    setPlaylist(mockPlaylist);
    setCurrentPlaylist(mockPlaylist);
    return mockPlaylist;
  };

  const initializeMusicSystem = async () => {
    try {
      // Mock initializing the music system
      setError(null);
      // Generate some mock playlists
      const mockPlaylists = [
        {
          id: 'calm',
          name: 'Calm Vibes',
          tracks: [
            {
              id: 'calm-1',
              title: 'Peaceful Morning',
              artist: 'Ambient Artist',
              duration: 180,
              url: '/audio/calm1.mp3',
              cover: '/images/calm1.jpg',
              coverImage: '/images/calm1.jpg',
              coverUrl: '/images/calm1.jpg',
            }
          ]
        },
        {
          id: 'focus',
          name: 'Deep Focus',
          tracks: [
            {
              id: 'focus-1',
              title: 'Concentration',
              artist: 'Focus Artist',
              duration: 240,
              url: '/audio/focus1.mp3',
              cover: '/images/focus1.jpg',
              coverImage: '/images/focus1.jpg',
              coverUrl: '/images/focus1.jpg',
            }
          ]
        }
      ];
      
      setPlaylists(mockPlaylists);
    } catch (err) {
      setError('Failed to initialize music system');
      console.error(err);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTrack,
        playlist,
        volume,
        currentPlaylist,
        playlists,
        error,
        openDrawer: isDrawerOpen,
        currentEmotion,
        playTrack,
        pauseTrack,
        nextTrack,
        previousTrack,
        setVolume,
        toggleRepeat,
        toggleShuffle,
        loadPlaylistForEmotion,
        loadPlaylistById,
        setOpenDrawer: setIsDrawerOpen,
        initializeMusicSystem
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
