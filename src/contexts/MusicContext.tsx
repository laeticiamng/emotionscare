import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { EMOTION_TO_MUSIC_MAP } from '@/services/music/emotion-music-mapping';

type Track = {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  cover?: string;
};

type Playlist = {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
};

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  setVolume: (volume: number) => void;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  addPlaylist: (playlist: Playlist) => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<Playlist | null>;
  setOpenDrawer: (isOpen: boolean) => void;
}

const defaultContext: MusicContextType = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  playlists: [],
  currentPlaylist: null,
  setVolume: () => {},
  playTrack: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  addPlaylist: () => {},
  loadPlaylistForEmotion: async () => null,
  setOpenDrawer: () => {}
};

const MusicContext = createContext<MusicContextType>(defaultContext);

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const playTrack = (track: Track) => {
    console.info('Playing track:', track.title);
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    console.info('Paused playback');
    setIsPlaying(false);
  };

  const nextTrack = () => {
    // Logique pour passer à la piste suivante
    console.log('Next track');
  };

  const previousTrack = () => {
    // Logique pour revenir à la piste précédente
    console.log('Previous track');
  };

  const addPlaylist = (playlist: Playlist) => {
    setPlaylists(current => [...current, playlist]);
  };

  const loadPlaylistForEmotion = useCallback(async (emotion: string): Promise<Playlist | null> => {
    try {
      // Simulation du chargement d'une playlist basée sur l'émotion
      console.log(`Loading playlist for emotion: ${emotion}`);
      
      // Dans une implémentation réelle, nous appellerions une API ou une base de données
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Créer une playlist simulée
      const playlist: Playlist = {
        id: `playlist-${Date.now()}`,
        name: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Playlist`,
        description: `Une playlist optimisée pour l'état émotionnel: ${emotion}`,
        tracks: [
          {
            id: `track-${Date.now()}-1`,
            title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Melody`,
            artist: 'EmotionsCare Music',
            url: '/audio/placeholder.mp3',
            duration: 180,
            cover: '/images/cover-art.jpg'
          },
          {
            id: `track-${Date.now()}-2`,
            title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Harmony`,
            artist: 'EmotionsCare Music',
            url: '/audio/placeholder2.mp3',
            duration: 210,
            cover: '/images/cover-art2.jpg'
          }
        ]
      };
      
      setCurrentPlaylist(playlist);
      addPlaylist(playlist);
      
      return playlist;
    } catch (error) {
      console.error('Erreur lors du chargement de la playlist:', error);
      return null;
    }
  }, []);

  const setOpenDrawer = (isOpen: boolean) => {
    setIsDrawerOpen(isOpen);
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        playlists,
        currentPlaylist,
        setVolume,
        playTrack,
        pauseTrack,
        nextTrack,
        previousTrack,
        addPlaylist,
        loadPlaylistForEmotion,
        setOpenDrawer
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
