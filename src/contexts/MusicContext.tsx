
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MusicTrack } from '@/types';
import { MusicPlaylist } from '@/types/music';

interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  setVolume: (volume: number) => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  currentEmotion: string | null;
  loadPlaylistById: (id: string) => void;
  loadPlaylistForEmotion: (emotion: string) => MusicPlaylist | null;
  initializeMusicSystem: () => void;
  error: string | null;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
}

// Export the context so it can be imported elsewhere
export const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusicMock = (): MusicContextType => {
  // État local pour le contexte musical
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  // Simulations des fonctions de lecture
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    console.log('Playing track:', track.title);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    console.log('Paused track');
  };

  const nextTrack = () => {
    if (!currentPlaylist || !currentTrack) return;
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
    playTrack(currentPlaylist.tracks[nextIndex]);
  };

  const previousTrack = () => {
    if (!currentPlaylist || !currentTrack) return;
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + currentPlaylist.tracks.length) % currentPlaylist.tracks.length;
    playTrack(currentPlaylist.tracks[prevIndex]);
  };

  const loadPlaylistById = (id: string) => {
    const playlist = playlists.find(p => p.id === id);
    if (playlist) {
      setCurrentPlaylist(playlist);
      if (playlist.tracks.length > 0) {
        setCurrentTrack(playlist.tracks[0]);
      }
    }
  };

  const loadPlaylistForEmotion = (emotion: string) => {
    console.log(`Loading playlist for emotion: ${emotion}`);
    setCurrentEmotion(emotion);
    
    // Simuler un chargement de playlist basé sur l'émotion
    const mockPlaylist: MusicPlaylist = {
      id: `emotion-${emotion}-${Date.now()}`,
      name: `Playlist pour ${emotion}`,
      description: `Musique adaptée pour l'émotion: ${emotion}`,
      emotion: emotion,
      tracks: [
        {
          id: '1',
          title: 'Track 1',
          artist: 'Artist 1',
          duration: 180,
          url: '/path/to/audio1.mp3',
        },
        {
          id: '2',
          title: 'Track 2',
          artist: 'Artist 2',
          duration: 210,
          url: '/path/to/audio2.mp3',
        },
        {
          id: '3',
          title: 'Track 3',
          artist: 'Artist 3',
          duration: 195,
          url: '/path/to/audio3.mp3',
        }
      ]
    };

    setPlaylists(prev => [...prev, mockPlaylist]);
    setCurrentPlaylist(mockPlaylist);
    if (mockPlaylist.tracks.length > 0) {
      setCurrentTrack(mockPlaylist.tracks[0]);
    }
    
    return mockPlaylist;
  };

  const initializeMusicSystem = () => {
    console.log('Initializing music system');
    // Simuler le chargement des playlists par défaut
    const defaultPlaylists: MusicPlaylist[] = [
      {
        id: 'relaxation',
        name: 'Relaxation',
        description: 'Musique calme pour se détendre',
        tracks: [
          {
            id: 'r1',
            title: 'Calme intérieur',
            artist: 'RelaxArtist',
            duration: 240,
            url: '/path/to/relax1.mp3',
          },
          {
            id: 'r2',
            title: 'Vagues apaisantes',
            artist: 'OceanSounds',
            duration: 300,
            url: '/path/to/relax2.mp3',
          }
        ]
      },
      {
        id: 'energy',
        name: 'Énergie',
        description: 'Musique pour se motiver',
        tracks: [
          {
            id: 'e1',
            title: 'Boost matinal',
            artist: 'EnergyArtist',
            duration: 190,
            url: '/path/to/energy1.mp3',
          },
          {
            id: 'e2',
            title: 'Motivation maximale',
            artist: 'MotivationalArtist',
            duration: 220,
            url: '/path/to/energy2.mp3',
          }
        ]
      }
    ];

    setPlaylists(defaultPlaylists);
  };

  return {
    currentTrack,
    isPlaying,
    volume,
    setVolume,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    playlists,
    currentPlaylist,
    currentEmotion,
    loadPlaylistById,
    loadPlaylistForEmotion,
    initializeMusicSystem,
    error,
    openDrawer,
    setOpenDrawer
  };
};

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const musicMock = useMusicMock();

  return (
    <MusicContext.Provider value={musicMock}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
