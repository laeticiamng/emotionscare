
import React, { createContext, useContext, useState } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types';

export interface Track extends MusicTrack {
  coverUrl?: string;
}

export interface Playlist extends MusicPlaylist {
  title?: string;
}

interface MusicContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  currentTrack: Track | null;
  playTrack: (track: Track) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  currentPlaylist: Playlist | null;
  playlists: Playlist[];
  loadPlaylistById: (id: string) => Promise<Playlist | null>;
  loadPlaylistForEmotion: (emotion: string) => Promise<Playlist | null>;
  initializeMusicSystem: () => Promise<void>;
  error: string | null;
  currentEmotion: string | null;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}

const defaultTracks: Track[] = [
  {
    id: '1',
    title: 'Calm Meditation',
    artist: 'Mindfulness',
    duration: 180,
    coverUrl: '/images/tracks/meditation.jpg'
  },
  {
    id: '2',
    title: 'Focus Session',
    artist: 'Concentration',
    duration: 300,
    coverUrl: '/images/tracks/focus.jpg'
  }
];

const defaultPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Meditation',
    title: 'Meditation Collection',
    description: 'Calm your mind with these tracks',
    tracks: defaultTracks,
    category: 'mindfulness'
  },
  {
    id: '2',
    name: 'Focus',
    title: 'Focus Playlist',
    description: 'Boost your productivity',
    tracks: defaultTracks,
    category: 'productivity'
  }
];

const MusicContext = createContext<MusicContextType>({
  isPlaying: false,
  togglePlay: () => {},
  currentTrack: null,
  playTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  volume: 50,
  setVolume: () => {},
  currentPlaylist: null,
  playlists: [],
  loadPlaylistById: async () => null,
  loadPlaylistForEmotion: async () => null,
  initializeMusicSystem: async () => {},
  error: null,
  currentEmotion: null,
  toggleRepeat: () => {},
  toggleShuffle: () => {}
});

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState(50);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [playlists] = useState<Playlist[]>(defaultPlaylists);
  const [error, setError] = useState<string | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex < currentPlaylist.tracks.length - 1) {
      playTrack(currentPlaylist.tracks[currentIndex + 1] as Track);
    }
  };

  const previousTrack = () => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(currentPlaylist.tracks[currentIndex - 1] as Track);
    }
  };

  const loadPlaylistById = async (id: string): Promise<Playlist | null> => {
    try {
      const playlist = playlists.find(p => p.id === id);
      if (playlist) {
        setCurrentPlaylist(playlist);
        return playlist;
      }
      return null;
    } catch (err) {
      setError('Failed to load playlist');
      return null;
    }
  };

  const loadPlaylistForEmotion = async (emotion: string): Promise<Playlist | null> => {
    setCurrentEmotion(emotion);
    // In a real app, you would fetch a playlist based on the emotion
    // For now, return the first playlist
    return playlists[0];
  };

  const initializeMusicSystem = async () => {
    // Initialize audio system, load resources, etc.
    console.log('Music system initialized');
  };

  const toggleRepeat = () => {
    console.log('Toggle repeat mode');
  };

  const toggleShuffle = () => {
    console.log('Toggle shuffle mode');
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        togglePlay,
        currentTrack,
        playTrack,
        nextTrack,
        previousTrack,
        volume,
        setVolume,
        currentPlaylist,
        playlists,
        loadPlaylistById,
        loadPlaylistForEmotion,
        initializeMusicSystem,
        error,
        currentEmotion,
        toggleRepeat,
        toggleShuffle
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
