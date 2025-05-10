
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType } from '@/types';

const initialContext: MusicContextType = {
  isPlaying: false,
  currentTrack: null,
  currentPlaylist: null,
  volume: 0.7,
  openDrawer: false,
  error: null,
  togglePlay: () => {},
  playTrack: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  setOpenDrawer: () => {},
  initializeMusicSystem: async () => {},
  playlists: [],
  currentEmotion: 'neutral',
  toggleRepeat: () => {},
  toggleShuffle: () => {},
  loadPlaylistById: async () => null,
  loadPlaylistForEmotion: async () => null
};

const MusicContext = createContext<MusicContextType>(initialContext);

export const useMusic = () => useContext(MusicContext);

// Données simulées pour la démo
const mockPlaylists: Record<string, MusicPlaylist> = {
  'upbeat': {
    id: 'playlist-upbeat',
    name: 'Énergisant et Joyeux',
    description: 'Musique pour booster votre humeur',
    mood: 'upbeat',
    tracks: [
      { id: 'tr-1', title: 'Happy Day', artist: 'Sunshine Band', duration: 180, url: '#', bpm: 128, mood: 'upbeat', intensity: 8 },
      { id: 'tr-2', title: 'Joyful Morning', artist: 'Melody Group', duration: 210, url: '#', bpm: 122, mood: 'upbeat', intensity: 7 }
    ]
  },
  'ambient': {
    id: 'playlist-ambient',
    name: 'Ambiance calme',
    description: 'Musique douce et relaxante',
    mood: 'ambient',
    tracks: [
      { id: 'tr-3', title: 'Ocean Waves', artist: 'Nature Sounds', duration: 240, url: '#', bpm: 80, mood: 'ambient', intensity: 3 },
      { id: 'tr-4', title: 'Forest Dreams', artist: 'The Ambients', duration: 300, url: '#', bpm: 72, mood: 'ambient', intensity: 2 }
    ]
  },
  'calming': {
    id: 'playlist-calming',
    name: 'Apaisement',
    description: 'Musique pour calmer l\'anxiété',
    mood: 'calming',
    tracks: [
      { id: 'tr-5', title: 'Deep Breath', artist: 'Zen Master', duration: 270, url: '#', bpm: 62, mood: 'calming', intensity: 2 },
      { id: 'tr-6', title: 'Moonlight', artist: 'Night Melody', duration: 320, url: '#', bpm: 65, mood: 'calming', intensity: 3 }
    ]
  },
  'gentle': {
    id: 'playlist-gentle',
    name: 'Douce mélancolie',
    description: 'Musique pour accompagner vos moments nostalgiques',
    mood: 'gentle',
    tracks: [
      { id: 'tr-7', title: 'Old Days', artist: 'Memory Lane', duration: 290, url: '#', bpm: 90, mood: 'gentle', intensity: 4 },
      { id: 'tr-8', title: 'Rainy Window', artist: 'The Dreamers', duration: 260, url: '#', bpm: 85, mood: 'gentle', intensity: 5 }
    ]
  },
  'focus': {
    id: 'playlist-focus',
    name: 'Concentration',
    description: 'Musique pour améliorer votre focus',
    mood: 'focus',
    tracks: [
      { id: 'tr-9', title: 'Deep Focus', artist: 'Concentration Zone', duration: 310, url: '#', bpm: 100, mood: 'focus', intensity: 6 },
      { id: 'tr-10', title: 'Study Time', artist: 'Brain Wave', duration: 280, url: '#', bpm: 95, mood: 'focus', intensity: 5 }
    ]
  },
  'dance': {
    id: 'playlist-dance',
    name: 'Énergie et Danse',
    description: 'Musique rythmée pour bouger',
    mood: 'dance',
    tracks: [
      { id: 'tr-11', title: 'Move Your Body', artist: 'Dance Kings', duration: 200, url: '#', bpm: 135, mood: 'dance', intensity: 9 },
      { id: 'tr-12', title: 'Saturday Night', artist: 'Party People', duration: 190, url: '#', bpm: 130, mood: 'dance', intensity: 8 }
    ]
  }
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [volume, setVolumeState] = useState(0.7);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>(Object.values(mockPlaylists));

  // Initialisation du système musical
  const initializeMusicSystem = useCallback(async () => {
    try {
      // Simuler une initialisation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsInitialized(true);
      return;
    } catch (err) {
      console.error('Error initializing music system:', err);
      setError('Erreur lors de l\'initialisation du système musical');
      throw err;
    }
  }, []);

  // Charger une playlist en fonction de l'émotion
  const loadPlaylistForEmotion = useCallback(async (emotion: string): Promise<MusicPlaylist | null> => {
    try {
      // Simuler un chargement depuis l'API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const playlist = mockPlaylists[emotion] || mockPlaylists.focus;
      setCurrentPlaylist(playlist);
      setCurrentEmotion(emotion);
      return playlist;
    } catch (err) {
      console.error('Error loading playlist for emotion:', err);
      setError('Erreur lors du chargement de la playlist');
      return null;
    }
  }, []);

  // Charger une playlist par ID
  const loadPlaylistById = useCallback(async (id: string): Promise<MusicPlaylist | null> => {
    try {
      // Simuler un chargement
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const playlist = playlists.find(p => p.id === id) || null;
      
      if (playlist) {
        setCurrentPlaylist(playlist);
        if (playlist.tracks.length > 0) {
          setCurrentTrack(playlist.tracks[0]);
          setIsPlaying(true);
        }
      }
      
      return playlist;
    } catch (err) {
      console.error('Error loading playlist by id:', err);
      setError('Erreur lors du chargement de la playlist');
      return null;
    }
  }, [playlists]);

  const togglePlay = useCallback(() => {
    if (currentTrack) {
      setIsPlaying(prev => !prev);
    } else if (currentPlaylist && currentPlaylist.tracks.length > 0) {
      // Jouer la première piste si aucune n'est en cours
      setCurrentTrack(currentPlaylist.tracks[0]);
      setIsPlaying(true);
    }
  }, [currentTrack, currentPlaylist]);

  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const nextTrack = useCallback(() => {
    if (currentPlaylist && currentTrack) {
      const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
      if (currentIndex > -1 && currentIndex < currentPlaylist.tracks.length - 1) {
        setCurrentTrack(currentPlaylist.tracks[currentIndex + 1]);
        setIsPlaying(true);
      } else if (currentPlaylist.tracks.length > 0) {
        // Revenir au début de la playlist
        setCurrentTrack(currentPlaylist.tracks[0]);
        setIsPlaying(true);
      }
    }
  }, [currentPlaylist, currentTrack]);

  const previousTrack = useCallback(() => {
    if (currentPlaylist && currentTrack) {
      const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
      if (currentIndex > 0) {
        setCurrentTrack(currentPlaylist.tracks[currentIndex - 1]);
        setIsPlaying(true);
      } else if (currentPlaylist.tracks.length > 0) {
        // Aller à la fin de la playlist
        setCurrentTrack(currentPlaylist.tracks[currentPlaylist.tracks.length - 1]);
        setIsPlaying(true);
      }
    }
  }, [currentPlaylist, currentTrack]);

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeat(prev => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  // Effet pour gérer l'audio en fonction de l'état de lecture
  useEffect(() => {
    // Effet simulé pour le lecteur audio
    if (isPlaying) {
      console.log(`Playing track: ${currentTrack?.title} by ${currentTrack?.artist} at volume ${volume}`);
    } else {
      console.log('Paused playback');
    }
  }, [isPlaying, currentTrack, volume]);

  return (
    <MusicContext.Provider 
      value={{ 
        isPlaying,
        currentTrack,
        currentPlaylist,
        volume,
        openDrawer,
        error,
        togglePlay,
        playTrack,
        pauseTrack,
        nextTrack,
        previousTrack,
        setVolume,
        setOpenDrawer,
        loadPlaylistForEmotion,
        initializeMusicSystem,
        playlists,
        loadPlaylistById,
        currentEmotion,
        toggleRepeat,
        toggleShuffle
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export default MusicProvider;
