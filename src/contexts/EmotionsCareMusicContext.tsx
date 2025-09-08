/**
 * CONTEXTE MUSIQUE EMOTIONSCARE - PLATEFORME PREMIUM
 * Gestionnaire centralisé pour l'intégration musique-émotion via Suno
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { MusicTrack, MusicPlaylist, MusicPlayerState, EmotionMusicParams } from '@/types';
import { useToast } from '@/hooks/use-toast';

// === ACTIONS DU REDUCER ===
type MusicAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PLAYLIST'; payload: MusicPlaylist }
  | { type: 'SET_CURRENT_TRACK'; payload: MusicTrack | null }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_MUTE'; payload: boolean }
  | { type: 'SET_PROGRESS'; payload: { currentTime: number; duration: number } }
  | { type: 'SET_REPEAT'; payload: 'none' | 'one' | 'all' }
  | { type: 'SET_SHUFFLE'; payload: boolean }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREVIOUS_TRACK' }
  | { type: 'SET_ERROR'; payload: string | null };

// === ÉTAT INITIAL ===
const initialState: MusicPlayerState & { error: string | null } = {
  currentTrack: null,
  currentPlaylist: null,
  isPlaying: false,
  isLoading: false,
  volume: 0.7,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  currentIndex: 0,
  shuffle: false,
  repeat: 'none',
  error: null,
};

// === REDUCER ===
const musicReducer = (state: typeof initialState, action: MusicAction): typeof initialState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_PLAYLIST':
      return {
        ...state,
        currentPlaylist: action.payload,
        currentTrack: action.payload.tracks[0] || null,
        currentIndex: 0,
        error: null,
      };
    
    case 'SET_CURRENT_TRACK':
      return { ...state, currentTrack: action.payload };
    
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    
    case 'SET_VOLUME':
      return { ...state, volume: Math.max(0, Math.min(1, action.payload)) };
    
    case 'SET_MUTE':
      return { ...state, isMuted: action.payload };
    
    case 'SET_PROGRESS':
      return { 
        ...state, 
        currentTime: action.payload.currentTime,
        duration: action.payload.duration 
      };
    
    case 'SET_REPEAT':
      return { ...state, repeat: action.payload };
    
    case 'SET_SHUFFLE':
      return { ...state, shuffle: action.payload };
    
    case 'NEXT_TRACK':
      if (!state.currentPlaylist) return state;
      
      let nextIndex: number;
      if (state.shuffle) {
        nextIndex = Math.floor(Math.random() * state.currentPlaylist.tracks.length);
      } else {
        nextIndex = (state.currentIndex + 1) % state.currentPlaylist.tracks.length;
      }
      
      return {
        ...state,
        currentIndex: nextIndex,
        currentTrack: state.currentPlaylist.tracks[nextIndex],
        currentTime: 0,
      };
    
    case 'PREVIOUS_TRACK':
      if (!state.currentPlaylist) return state;
      
      let prevIndex: number;
      if (state.shuffle) {
        prevIndex = Math.floor(Math.random() * state.currentPlaylist.tracks.length);
      } else {
        prevIndex = state.currentIndex === 0 
          ? state.currentPlaylist.tracks.length - 1 
          : state.currentIndex - 1;
      }
      
      return {
        ...state,
        currentIndex: prevIndex,
        currentTrack: state.currentPlaylist.tracks[prevIndex],
        currentTime: 0,
      };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    default:
      return state;
  }
};

// === INTERFACE DU CONTEXTE ===
interface EmotionsCareMusicContextType {
  // État
  state: typeof initialState;
  
  // Actions de base
  loadPlaylist: (playlist: MusicPlaylist) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  
  // Navigation
  nextTrack: () => void;
  previousTrack: () => void;
  selectTrack: (index: number) => void;
  
  // Contrôles
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setRepeat: (mode: 'none' | 'one' | 'all') => void;
  toggleShuffle: () => void;
  
  // Intégration émotionnelle
  generateEmotionPlaylist: (params: EmotionMusicParams) => Promise<void>;
  
  // Utilitaires
  formatTime: (seconds: number) => string;
  getProgressPercentage: () => number;
}

// === CONTEXTE ===
const EmotionsCareMusicContext = createContext<EmotionsCareMusicContextType | undefined>(undefined);

// === PROVIDER ===
export const EmotionsCareMusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(musicReducer, initialState);
  const { toast } = useToast();

  // === ACTIONS DE BASE ===
  const loadPlaylist = useCallback((playlist: MusicPlaylist) => {
    dispatch({ type: 'SET_PLAYLIST', payload: playlist });
    toast({
      title: "Playlist chargée",
      description: `${playlist.name} avec ${playlist.tracks.length} titres`,
    });
  }, [toast]);

  const play = useCallback(() => {
    if (!state.currentTrack) {
      toast({
        title: "Aucun titre sélectionné",
        description: "Veuillez sélectionner une playlist d'abord",
        variant: "destructive",
      });
      return;
    }
    dispatch({ type: 'SET_PLAYING', payload: true });
  }, [state.currentTrack, toast]);

  const pause = useCallback(() => {
    dispatch({ type: 'SET_PLAYING', payload: false });
  }, []);

  const stop = useCallback(() => {
    dispatch({ type: 'SET_PLAYING', payload: false });
    dispatch({ type: 'SET_PROGRESS', payload: { currentTime: 0, duration: state.duration } });
  }, [state.duration]);

  // === NAVIGATION ===
  const nextTrack = useCallback(() => {
    dispatch({ type: 'NEXT_TRACK' });
  }, []);

  const previousTrack = useCallback(() => {
    dispatch({ type: 'PREVIOUS_TRACK' });
  }, []);

  const selectTrack = useCallback((index: number) => {
    if (!state.currentPlaylist || index < 0 || index >= state.currentPlaylist.tracks.length) {
      return;
    }
    
    dispatch({ type: 'SET_CURRENT_TRACK', payload: state.currentPlaylist.tracks[index] });
    // Mettre à jour l'index ici aussi
    dispatch({ type: 'SET_PROGRESS', payload: { currentTime: 0, duration: 0 } });
  }, [state.currentPlaylist]);

  // === CONTRÔLES ===
  const setVolume = useCallback((volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
  }, []);

  const toggleMute = useCallback(() => {
    dispatch({ type: 'SET_MUTE', payload: !state.isMuted });
  }, [state.isMuted]);

  const setRepeat = useCallback((mode: 'none' | 'one' | 'all') => {
    dispatch({ type: 'SET_REPEAT', payload: mode });
  }, []);

  const toggleShuffle = useCallback(() => {
    dispatch({ type: 'SET_SHUFFLE', payload: !state.shuffle });
  }, [state.shuffle]);

  // === INTÉGRATION ÉMOTIONNELLE ===
  const generateEmotionPlaylist = useCallback(async (params: EmotionMusicParams) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Simuler la génération de playlist basée sur l'émotion
      // En production, ceci appellerait l'API Suno via Supabase Edge Function
      const mockPlaylist: MusicPlaylist = {
        id: `emotion-${Date.now()}`,
        name: `Playlist ${params.emotion}`,
        description: `Musique thérapeutique pour l'émotion: ${params.emotion}`,
        emotion: params.emotion,
        tracks: [
          {
            id: '1',
            title: `Titre thérapeutique pour ${params.emotion}`,
            artist: 'EmotionsCare AI',
            duration: 180,
            url: '/audio/generated/track1.mp3',
            emotion: params.emotion,
            energy: params.intensity || 0.5,
            valence: params.emotion === 'happy' ? 0.8 : 0.5,
          },
          {
            id: '2',
            title: `Mélodie apaisante ${params.emotion}`,
            artist: 'EmotionsCare AI',
            duration: 240,
            url: '/audio/generated/track2.mp3',
            emotion: params.emotion,
            energy: (params.intensity || 0.5) * 0.8,
            valence: params.emotion === 'sad' ? 0.3 : 0.7,
          },
        ],
        createdAt: new Date(),
      };

      // Délai simulé pour l'API
      await new Promise(resolve => setTimeout(resolve, 2000));

      loadPlaylist(mockPlaylist);
      
      toast({
        title: "Playlist générée avec succès",
        description: `Musique thérapeutique pour l'émotion "${params.emotion}" créée`,
      });
    } catch (error) {
      console.error('Erreur génération playlist:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la génération de la playlist' });
      
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer la playlist. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [loadPlaylist, toast]);

  // === UTILITAIRES ===
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getProgressPercentage = useCallback((): number => {
    if (state.duration === 0) return 0;
    return (state.currentTime / state.duration) * 100;
  }, [state.currentTime, state.duration]);

  // === GESTION AUTO-NEXT ===
  useEffect(() => {
    if (state.currentTime >= state.duration && state.duration > 0 && state.isPlaying) {
      if (state.repeat === 'one') {
        dispatch({ type: 'SET_PROGRESS', payload: { currentTime: 0, duration: state.duration } });
      } else if (state.repeat === 'all' || state.currentIndex < (state.currentPlaylist?.tracks.length || 0) - 1) {
        nextTrack();
      } else {
        stop();
      }
    }
  }, [state.currentTime, state.duration, state.isPlaying, state.repeat, state.currentIndex, state.currentPlaylist, nextTrack, stop]);

  const contextValue: EmotionsCareMusicContextType = {
    state,
    loadPlaylist,
    play,
    pause,
    stop,
    nextTrack,
    previousTrack,
    selectTrack,
    setVolume,
    toggleMute,
    setRepeat,
    toggleShuffle,
    generateEmotionPlaylist,
    formatTime,
    getProgressPercentage,
  };

  return (
    <EmotionsCareMusicContext.Provider value={contextValue}>
      {children}
    </EmotionsCareMusicContext.Provider>
  );
};

// === HOOK PERSONNALISÉ ===
export const useEmotionsCareMusicContext = (): EmotionsCareMusicContextType => {
  const context = useContext(EmotionsCareMusicContext);
  if (!context) {
    throw new Error('useEmotionsCareMusicContext doit être utilisé dans EmotionsCareMusicProvider');
  }
  return context;
};

export default EmotionsCareMusicProvider;