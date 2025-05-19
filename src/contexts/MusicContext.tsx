
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Track, Playlist, ensurePlaylist, ensureTrack, convertToPlaylist, convertToTrack } from '@/utils/musicCompatibility';
import { MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';

interface MusicContextType {
  // État de base
  isPlaying: boolean;
  currentTrack: Track | null;
  playlist: Playlist | null;
  openDrawer: boolean;
  
  // Contrôles de base
  togglePlay: () => void;
  toggleDrawer: () => void;
  playTrack: (track: Track | MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  prevTrack: () => void; // Alias pour compatibilité
  setPlaylist: (playlist: Playlist | MusicPlaylist) => void;
  
  // Contrôles avancés
  volume: number;
  setVolume: (volume: number) => void;
  muted: boolean;
  toggleMute: () => void;
  currentTime: number;
  duration: number;
  seekTo: (time: number) => void;
  
  // État du lecteur
  isInitialized: boolean;
  isLoading?: boolean;
  error?: string | null;
  
  // Gestion des émotions
  setEmotion?: (emotion: string) => void;
  loadPlaylistForEmotion: (emotionOrParams: string | EmotionMusicParams) => Promise<void>;
  
  // Gestion des recommandations
  getRecommendationByEmotion: (emotionOrParams: string | EmotionMusicParams) => Promise<Playlist | null>;
  findTracksByMood?: (mood: string) => Promise<Track[]>;
  generateMusic?: (params: any) => Promise<Track[]>;
  
  // Gestion du drawer
  setOpenDrawer: (open: boolean) => void;
  
  // Gestion des tracks
  setCurrentTrack: (track: Track | MusicTrack | null) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrackState] = useState<Track | null>(null);
  const [playlist, setPlaylistState] = useState<Playlist | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isInitialized, setIsInitialized] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState<string>('calm');
  
  // Adaptateurs pour assurer la compatibilité des types
  const setCurrentTrack = useCallback((track: Track | MusicTrack | null) => {
    if (!track) {
      setCurrentTrackState(null);
      return;
    }
    
    const compatibleTrack = ensureTrack(track);
    setCurrentTrackState(compatibleTrack);
  }, []);
  
  const setPlaylist = useCallback((newPlaylist: Playlist | MusicPlaylist) => {
    const compatiblePlaylist = ensurePlaylist(newPlaylist);
    setPlaylistState(compatiblePlaylist);
    
    // Si aucune piste n'est sélectionnée, sélectionner la première
    if (compatiblePlaylist.tracks.length > 0 && !currentTrack) {
      setCurrentTrack(compatiblePlaylist.tracks[0]);
    }
  }, [currentTrack]);
  
  // Fonctions de contrôle de base
  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleDrawer = useCallback(() => {
    setOpenDrawer(!openDrawer);
  }, [openDrawer]);

  const playTrack = useCallback((track: Track | MusicTrack) => {
    const compatibleTrack = ensureTrack(track);
    setCurrentTrackState(compatibleTrack);
    setIsPlaying(true);
  }, []);
  
  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  const resumeTrack = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const nextTrack = useCallback(() => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === playlist.tracks.length - 1) {
      // Si c'est le dernier morceau, on revient au premier
      playTrack(playlist.tracks[0]);
    } else {
      // Sinon on passe au suivant
      playTrack(playlist.tracks[currentIndex + 1]);
    }
  }, [playlist, currentTrack, playTrack]);

  const previousTrack = useCallback(() => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === 0) {
      // Si c'est le premier morceau, on va au dernier
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    } else {
      // Sinon on revient au précédent
      playTrack(playlist.tracks[currentIndex - 1]);
    }
  }, [playlist, currentTrack, playTrack]);
  
  // Alias pour compatibilité
  const prevTrack = previousTrack;
  
  // Fonctions de contrôle avancées
  const toggleMute = useCallback(() => {
    setMuted(!muted);
  }, [muted]);
  
  const seekTo = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);
  
  // Fonctions liées aux émotions
  const setEmotion = useCallback((emotion: string) => {
    setCurrentEmotion(emotion);
  }, []);
  
  // Simuler chargement d'une playlist en fonction de l'émotion
  const loadPlaylistForEmotion = useCallback(async (emotionOrParams: string | EmotionMusicParams) => {
    const emotion = typeof emotionOrParams === 'string' ? emotionOrParams : emotionOrParams.emotion;
    
    // Simuler une playlist par émotion
    const mockPlaylist: Playlist = {
      id: `playlist-${emotion}`,
      name: `${emotion} Playlist`,
      title: `${emotion} Playlist`,
      tracks: [
        {
          id: `track-${emotion}-1`,
          title: `${emotion} Track 1`,
          name: `${emotion} Track 1`,
          artist: "EmotionArtist",
          url: "/sounds/ambient-calm.mp3",
          cover: "https://via.placeholder.com/200",
          duration: 180
        },
        {
          id: `track-${emotion}-2`,
          title: `${emotion} Track 2`,
          name: `${emotion} Track 2`,
          artist: "EmotionArtist",
          url: "/sounds/ambient-calm.mp3",
          cover: "https://via.placeholder.com/200",
          duration: 210
        }
      ]
    };
    
    setPlaylist(mockPlaylist);
    if (mockPlaylist.tracks.length > 0) {
      setCurrentTrack(mockPlaylist.tracks[0]);
    }
  }, [setPlaylist, setCurrentTrack]);
  
  // Simuler recommandation par émotion
  const getRecommendationByEmotion = useCallback(async (emotionOrParams: string | EmotionMusicParams) => {
    const emotion = typeof emotionOrParams === 'string' ? emotionOrParams : emotionOrParams.emotion;
    
    // Simuler une playlist par émotion
    const mockPlaylist: Playlist = {
      id: `recommendation-${emotion}`,
      name: `Recommended for ${emotion}`,
      title: `Recommended for ${emotion}`,
      tracks: [
        {
          id: `rec-track-${emotion}-1`,
          title: `${emotion} Recommendation 1`,
          name: `${emotion} Recommendation 1`,
          artist: "RecommendationAI",
          url: "/sounds/ambient-calm.mp3",
          cover: "https://via.placeholder.com/200",
          duration: 180
        },
        {
          id: `rec-track-${emotion}-2`,
          title: `${emotion} Recommendation 2`,
          name: `${emotion} Recommendation 2`,
          artist: "RecommendationAI",
          url: "/sounds/ambient-calm.mp3",
          cover: "https://via.placeholder.com/200",
          duration: 210
        }
      ]
    };
    
    return mockPlaylist;
  }, []);
  
  // Simuler la recherche par humeur
  const findTracksByMood = useCallback(async (mood: string): Promise<Track[]> => {
    return [
      {
        id: `mood-track-${mood}-1`,
        title: `${mood} Track 1`,
        name: `${mood} Track 1`,
        artist: "MoodArtist",
        url: "/sounds/ambient-calm.mp3",
        cover: "https://via.placeholder.com/200",
        duration: 180
      },
      {
        id: `mood-track-${mood}-2`,
        title: `${mood} Track 2`,
        name: `${mood} Track 2`,
        artist: "MoodArtist",
        url: "/sounds/ambient-calm.mp3",
        cover: "https://via.placeholder.com/200",
        duration: 210
      }
    ];
  }, []);
  
  // Simuler la génération de musique
  const generateMusic = useCallback(async (params: any): Promise<Track[]> => {
    return [
      {
        id: `generated-track-1`,
        title: `Generated Track 1`,
        name: `Generated Track 1`,
        artist: "AI Composer",
        url: "/sounds/ambient-calm.mp3",
        cover: "https://via.placeholder.com/200",
        duration: 180
      },
      {
        id: `generated-track-2`,
        title: `Generated Track 2`,
        name: `Generated Track 2`,
        artist: "AI Composer",
        url: "/sounds/ambient-calm.mp3",
        cover: "https://via.placeholder.com/200",
        duration: 210
      }
    ];
  }, []);

  // Initialisation au montage du composant
  useEffect(() => {
    setIsInitialized(true);
    
    // Charger une playlist par défaut au démarrage
    loadPlaylistForEmotion('calm');
    
    return () => {
      // Nettoyage
      setIsPlaying(false);
      setCurrentTrackState(null);
      setPlaylistState(null);
    };
  }, [loadPlaylistForEmotion]);

  const value = {
    // État de base
    isPlaying,
    currentTrack,
    playlist,
    openDrawer,
    
    // Contrôles de base
    togglePlay,
    toggleDrawer,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    prevTrack,
    setPlaylist,
    
    // Contrôles avancés
    volume,
    setVolume,
    muted,
    toggleMute,
    currentTime,
    duration,
    seekTo,
    
    // État du lecteur
    isInitialized,
    isLoading: false,
    error: null,
    
    // Gestion des émotions
    setEmotion,
    loadPlaylistForEmotion,
    
    // Gestion des recommandations
    getRecommendationByEmotion,
    findTracksByMood,
    generateMusic,
    
    // Gestion du drawer
    setOpenDrawer,
    
    // Gestion des tracks
    setCurrentTrack
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;
