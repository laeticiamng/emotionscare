/**
 * MUSIC CONTEXT UNIFIÉ - EmotionsCare Premium
 * Gestion centralisée de la musique thérapeutique et génération Suno
 * Version: 2.1 - Cache refresh
 */

import React, { createContext, useContext, useReducer, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { musicOrchestrationService, type MusicOrchestrationPreset } from '@/services/music/orchestration';
import { logger } from '@/lib/logger';

// ==================== TYPES ====================
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  audioUrl: string;
  duration: number;
  emotion?: string;
  mood?: string;
  coverUrl?: string;
  tags?: string;
  isGenerated?: boolean;
  generatedAt?: string;
  sunoTaskId?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  description?: string;
  tags?: string[];
  creator?: string;
  isTherapeutic?: boolean;
}

interface MusicState {
  // Playback
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  isPaused: boolean;
  volume: number;
  currentTime: number;
  duration: number;

  // Orchestration preset
  activePreset: MusicOrchestrationPreset;
  lastPresetChange: string | null;
  
  // Playlist
  playlist: MusicTrack[];
  currentPlaylistIndex: number;
  shuffleMode: boolean;
  repeatMode: 'none' | 'one' | 'all';
  
  // Generation
  isGenerating: boolean;
  generationProgress: number;
  generationError: string | null;
  
  // History
  playHistory: MusicTrack[];
  favorites: string[];
  
  // Therapeutic
  therapeuticMode: boolean;
  emotionTarget: string | null;
  adaptiveVolume: boolean;
}

type MusicAction =
  | { type: 'SET_CURRENT_TRACK'; payload: MusicTrack }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_PAUSED'; payload: boolean }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_ACTIVE_PRESET'; payload: { preset: MusicOrchestrationPreset; timestamp: string } }
  | { type: 'SET_PLAYLIST'; payload: MusicTrack[] }
  | { type: 'SET_PLAYLIST_INDEX'; payload: number }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'SET_REPEAT_MODE'; payload: 'none' | 'one' | 'all' }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_GENERATION_PROGRESS'; payload: number }
  | { type: 'SET_GENERATION_ERROR'; payload: string | null }
  | { type: 'ADD_TO_HISTORY'; payload: MusicTrack }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_THERAPEUTIC_MODE'; payload: boolean }
  | { type: 'SET_EMOTION_TARGET'; payload: string | null }
  | { type: 'SET_ADAPTIVE_VOLUME'; payload: boolean };

// ==================== REDUCER ====================
const initialPreset = musicOrchestrationService.getActivePreset();

const initialState: MusicState = {
  currentTrack: null,
  isPlaying: false,
  isPaused: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  activePreset: initialPreset,
  lastPresetChange: null,
  playlist: [],
  currentPlaylistIndex: 0,
  shuffleMode: false,
  repeatMode: 'none',
  isGenerating: false,
  generationProgress: 0,
  generationError: null,
  playHistory: [],
  favorites: [],
  therapeuticMode: false,
  emotionTarget: null,
  adaptiveVolume: true,
};

const musicReducer = (state: MusicState, action: MusicAction): MusicState => {
  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return { ...state, currentTrack: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload, isPaused: !action.payload };
    case 'SET_PAUSED':
      return { ...state, isPaused: action.payload, isPlaying: !action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: Math.max(0, Math.min(1, action.payload)) };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_ACTIVE_PRESET':
      return {
        ...state,
        activePreset: action.payload.preset,
        lastPresetChange: action.payload.timestamp,
      };
    case 'SET_PLAYLIST':
      return { ...state, playlist: action.payload, currentPlaylistIndex: 0 };
    case 'SET_PLAYLIST_INDEX':
      return { 
        ...state, 
        currentPlaylistIndex: Math.max(0, Math.min(action.payload, state.playlist.length - 1))
      };
    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffleMode: !state.shuffleMode };
    case 'SET_REPEAT_MODE':
      return { ...state, repeatMode: action.payload };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    case 'SET_GENERATION_PROGRESS':
      return { ...state, generationProgress: action.payload };
    case 'SET_GENERATION_ERROR':
      return { ...state, generationError: action.payload };
    case 'ADD_TO_HISTORY':
      return { 
        ...state, 
        playHistory: [action.payload, ...state.playHistory.slice(0, 49)] // Garde 50 max
      };
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload]
      };
    case 'SET_THERAPEUTIC_MODE':
      return { ...state, therapeuticMode: action.payload };
    case 'SET_EMOTION_TARGET':
      return { ...state, emotionTarget: action.payload };
    case 'SET_ADAPTIVE_VOLUME':
      return { ...state, adaptiveVolume: action.payload };
    default:
      return state;
  }
};

// ==================== CONTEXT ====================
interface MusicContextType {
  state: MusicState;
  
  // Playback controls
  play: (track?: MusicTrack) => Promise<void>;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  
  // Playlist management
  setPlaylist: (tracks: MusicTrack[]) => void;
  addToPlaylist: (track: MusicTrack) => void;
  removeFromPlaylist: (trackId: string) => void;
  shufflePlaylist: () => void;
  
  // Generation Suno
  generateMusicForEmotion: (emotion: string, prompt?: string) => Promise<MusicTrack | null>;
  checkGenerationStatus: (taskId: string) => Promise<MusicTrack | null>;
  getEmotionMusicDescription: (emotion: string) => string;
  
  // Therapeutic features
  enableTherapeuticMode: (emotion: string) => void;
  disableTherapeuticMode: () => void;
  adaptVolumeToEmotion: (emotion: string, intensity: number) => void;
  
  // Utilities
  toggleFavorite: (trackId: string) => void;
  getRecommendationsForEmotion: (emotion: string) => Promise<MusicTrack[]>;
}

const MusicContext = createContext<MusicContextType | null>(null);

// Export du context pour compatibilité
export { MusicContext };

// ==================== PROVIDER ====================
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(musicReducer, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeUpdateIntervalRef = useRef<number>();
  const crossfadeFrameRef = useRef<number>();
  const isPlayingRef = useRef(initialState.isPlaying);

  // ==================== AUDIO SETUP ====================
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = 'anonymous';
    
    const audio = audioRef.current;
    
    // Event listeners
    const handleLoadedMetadata = () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration });
    };
    
    const handleTimeUpdate = () => {
      dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime });
    };
    
    const handleEnded = () => {
      dispatch({ type: 'SET_PLAYING', payload: false });
      if (state.repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };
    
    const handleError = () => {
      dispatch({ type: 'SET_PLAYING', payload: false });
      toast.error('Erreur lors de la lecture du fichier audio');
    };
    
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    isPlayingRef.current = state.isPlaying;
  }, [state.isPlaying]);

  // ==================== PLAYBACK CONTROLS ====================
  const play = useCallback(async (track?: MusicTrack) => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (track) {
        dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
        audio.src = track.audioUrl || track.url;
        audio.load();
        
        // Ajouter à l'historique
        dispatch({ type: 'ADD_TO_HISTORY', payload: track });
      }
      
      await audio.play();
      dispatch({ type: 'SET_PLAYING', payload: true });
      
      // Mode thérapeutique - ajustement automatique
      if (state.therapeuticMode && track?.emotion) {
        adaptVolumeToEmotion(track.emotion, 0.7);
      }
    } catch (error) {
      logger.error('Audio playback error', error as Error, 'MUSIC');
      toast.error('Impossible de lire ce fichier audio');
      dispatch({ type: 'SET_PLAYING', payload: false });
    }
  }, [state.therapeuticMode]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      dispatch({ type: 'SET_PAUSED', payload: true });
    }
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      dispatch({ type: 'SET_PLAYING', payload: false });
      dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
    }
  }, []);

  const next = useCallback(() => {
    if (state.playlist.length === 0) return;
    
    let nextIndex: number;
    if (state.shuffleMode) {
      nextIndex = Math.floor(Math.random() * state.playlist.length);
    } else {
      nextIndex = (state.currentPlaylistIndex + 1) % state.playlist.length;
    }
    
    dispatch({ type: 'SET_PLAYLIST_INDEX', payload: nextIndex });
    play(state.playlist[nextIndex]);
  }, [state.playlist, state.currentPlaylistIndex, state.shuffleMode, play]);

  const previous = useCallback(() => {
    if (state.playlist.length === 0) return;
    
    const prevIndex = state.currentPlaylistIndex === 0 
      ? state.playlist.length - 1 
      : state.currentPlaylistIndex - 1;
    
    dispatch({ type: 'SET_PLAYLIST_INDEX', payload: prevIndex });
    play(state.playlist[prevIndex]);
  }, [state.playlist, state.currentPlaylistIndex, play]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      dispatch({ type: 'SET_CURRENT_TIME', payload: time });
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current;
    if (audio) {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      audio.volume = clampedVolume;
      dispatch({ type: 'SET_VOLUME', payload: clampedVolume });
    }
  }, []);

  const applyPresetProfile = useCallback(
    (preset: MusicOrchestrationPreset, options?: { immediate?: boolean }) => {
      const timestamp = new Date().toISOString();
      dispatch({ type: 'SET_ACTIVE_PRESET', payload: { preset, timestamp } });

      const audio = audioRef.current;
      const clampedVolume = Math.max(0, Math.min(1, preset.volume));

      if (!audio) {
        dispatch({ type: 'SET_VOLUME', payload: clampedVolume });
        return;
      }

      audio.playbackRate = preset.playbackRate;

      try {
        (audio as any).preservesPitch = true;
        (audio as any).mozPreservesPitch = true;
      } catch (_) {
        // Ignore unsupported properties
      }

      const shouldFade = isPlayingRef.current && !options?.immediate && preset.crossfadeMs > 0;

      if (!shouldFade) {
        setVolume(clampedVolume);
        return;
      }

      if (typeof window === 'undefined' || typeof window.requestAnimationFrame === 'undefined') {
        setVolume(clampedVolume);
        return;
      }

      if (crossfadeFrameRef.current) {
        window.cancelAnimationFrame(crossfadeFrameRef.current);
        crossfadeFrameRef.current = undefined;
      }

      const startVolume = audio.volume;
      const startTime = window.performance?.now?.() ?? Date.now();
      const duration = preset.crossfadeMs;

      const step = (time: number) => {
        const now = time ?? (window.performance?.now?.() ?? Date.now());
        const progress = Math.min(1, (now - startTime) / duration);
        const interpolated = startVolume + (clampedVolume - startVolume) * progress;
        audio.volume = Math.max(0, Math.min(1, interpolated));

        if (progress < 1) {
          crossfadeFrameRef.current = window.requestAnimationFrame(step);
        } else {
          crossfadeFrameRef.current = undefined;
          setVolume(clampedVolume);
        }
      };

      crossfadeFrameRef.current = window.requestAnimationFrame(step);
    },
    [dispatch, setVolume]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let mounted = true;

    const bootstrap = async () => {
      const resumePreset = musicOrchestrationService.getActivePreset();
      applyPresetProfile(resumePreset, { immediate: true });

      const evaluation = await musicOrchestrationService.refreshFromClinicalSignals();
      if (!mounted) return;

      applyPresetProfile(evaluation.preset, { immediate: !evaluation.changed });
    };

    bootstrap().catch(error => {
      logger.error('Failed to initialize music orchestration preset', error as Error, 'MUSIC');
    });

    const handleMoodUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ valence?: number; arousal?: number; timestamp?: string }>;
      if (!customEvent.detail) return;

      const { valence, arousal, timestamp } = customEvent.detail;
      const parsedValence = Number(valence);
      const parsedArousal = Number(arousal);
      const safeValence = Number.isFinite(parsedValence)
        ? Math.max(0, Math.min(100, parsedValence))
        : 50;
      const safeArousal = Number.isFinite(parsedArousal)
        ? Math.max(0, Math.min(100, parsedArousal))
        : 50;
      const evaluation = musicOrchestrationService.handleMoodUpdate({
        valence: safeValence,
        arousal: safeArousal,
        timestamp: timestamp || new Date().toISOString(),
      });

      applyPresetProfile(evaluation.preset, { immediate: !evaluation.changed });
    };

    window.addEventListener('mood.updated', handleMoodUpdate as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener('mood.updated', handleMoodUpdate as EventListener);
      if (crossfadeFrameRef.current) {
        window.cancelAnimationFrame(crossfadeFrameRef.current);
        crossfadeFrameRef.current = undefined;
      }
    };
  }, [applyPresetProfile]);

  // ==================== PLAYLIST MANAGEMENT ====================
  const setPlaylist = useCallback((tracks: MusicTrack[]) => {
    dispatch({ type: 'SET_PLAYLIST', payload: tracks });
  }, []);

  const addToPlaylist = useCallback((track: MusicTrack) => {
    const newPlaylist = [...state.playlist, track];
    dispatch({ type: 'SET_PLAYLIST', payload: newPlaylist });
  }, [state.playlist]);

  const removeFromPlaylist = useCallback((trackId: string) => {
    const newPlaylist = state.playlist.filter(track => track.id !== trackId);
    dispatch({ type: 'SET_PLAYLIST', payload: newPlaylist });
  }, [state.playlist]);

  const shufflePlaylist = useCallback(() => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  }, []);

  // ==================== SUNO GENERATION ====================
  const generateMusicForEmotion = useCallback(async (
    emotion: string, 
    prompt?: string
  ): Promise<MusicTrack | null> => {
    dispatch({ type: 'SET_GENERATING', payload: true });
    dispatch({ type: 'SET_GENERATION_ERROR', payload: null });
    dispatch({ type: 'SET_GENERATION_PROGRESS', payload: 0 });

    try {
      // Utiliser suno-music (la vraie edge function)
      const { data, error } = await supabase.functions.invoke('suno-music', {
        body: {
          action: 'generate',
          emotion,
          prompt: prompt || `Musique thérapeutique apaisante pour émotion ${emotion}`,
          style: 'therapeutic ambient',
          instrumental: true,
          model: 'V4_5'
        }
      });

      if (error) {
        logger.error('Suno music generation invoke error', error as Error, 'MUSIC');
        dispatch({ type: 'SET_GENERATION_ERROR', payload: 'Erreur lors de la génération de musique' });
        toast.error('Erreur lors de la génération de musique');
        return null;
      }

      dispatch({ type: 'SET_GENERATION_PROGRESS', payload: 30 });

      // Si on a un taskId, on doit poller pour le statut
      if (data?.data?.taskId) {
        const taskId = data.data.taskId;
        let attempts = 0;
        const maxAttempts = 30; // 5 minutes max

        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 10000));
          attempts++;
          dispatch({
            type: 'SET_GENERATION_PROGRESS',
            payload: 30 + (attempts / maxAttempts) * 60
          });

          const statusData = await checkGenerationStatus(taskId);

          if (statusData) {
            dispatch({ type: 'SET_GENERATION_PROGRESS', payload: 100 });
            toast.success('Musique thérapeutique générée avec succès !');
            return statusData;
          }
        }

        // Timeout
        dispatch({ type: 'SET_GENERATION_ERROR', payload: 'Timeout - Génération trop longue' });
        toast.error('La génération prend trop de temps, veuillez réessayer');
        return null;
      }

      // Réponse directe avec audio (fallback Pixabay)
      if (data?.data?.audio_url || data?.data?.audioUrl) {
        const track: MusicTrack = {
          id: data.data.id || `generated-${Date.now()}`,
          title: data.data.title || `Musique ${emotion}`,
          artist: data.data.artist || 'Suno AI',
          url: data.data.audio_url || data.data.audioUrl,
          audioUrl: data.data.audio_url || data.data.audioUrl,
          duration: data.data.duration || 120,
          coverUrl: data.data.image_url || data.data.imageUrl,
          isGenerated: true,
          generatedAt: new Date().toISOString(),
          emotion,
          mood: emotion
        };

        dispatch({ type: 'SET_GENERATION_PROGRESS', payload: 100 });
        toast.success('Musique thérapeutique générée avec succès !');
        return track;
      }

      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur génération musique';
      dispatch({ type: 'SET_GENERATION_ERROR', payload: errorMessage });
      toast.error(`Erreur: ${errorMessage}`);
      return null;
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
      dispatch({ type: 'SET_GENERATION_PROGRESS', payload: 0 });
    }
  }, []);

  const checkGenerationStatus = useCallback(async (taskId: string): Promise<MusicTrack | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('suno-music', {
        body: {
          action: 'status',
          taskId
        }
      });

      if (error) {
        logger.error('Error checking generation status', error as Error, 'MUSIC');
        return null;
      }

      const status = data?.data?.status;
      if ((status === 'completed' || status === 'complete') && (data.data.audio_url || data.data.audioUrl)) {
        const track: MusicTrack = {
          id: taskId,
          title: data.data.title || 'Musique générée',
          artist: 'Suno AI',
          url: data.data.audio_url || data.data.audioUrl,
          audioUrl: data.data.audio_url || data.data.audioUrl,
          duration: data.data.duration || 120,
          coverUrl: data.data.image_url || data.data.imageUrl,
          isGenerated: true,
          generatedAt: new Date().toISOString(),
          sunoTaskId: taskId,
          emotion: data.data.emotion,
          mood: data.data.mood,
          tags: data.data.tags
        };

        return track;
      }

      return null;
    } catch (error) {
      logger.error('Generation status check error', error as Error, 'MUSIC');
      return null;
    }
  }, []);

  // ==================== THERAPEUTIC FEATURES ====================
  const enableTherapeuticMode = useCallback((emotion: string) => {
    dispatch({ type: 'SET_THERAPEUTIC_MODE', payload: true });
    dispatch({ type: 'SET_EMOTION_TARGET', payload: emotion });
    dispatch({ type: 'SET_ADAPTIVE_VOLUME', payload: true });
  }, []);

  const disableTherapeuticMode = useCallback(() => {
    dispatch({ type: 'SET_THERAPEUTIC_MODE', payload: false });
    dispatch({ type: 'SET_EMOTION_TARGET', payload: null });
  }, []);

  const adaptVolumeToEmotion = useCallback((emotion: string, intensity: number) => {
    if (!state.adaptiveVolume) return;

    let targetVolume = state.volume;
    
    // Ajustement basé sur l'émotion
    switch (emotion.toLowerCase()) {
      case 'calm':
      case 'relaxed':
        targetVolume = Math.max(0.3, intensity * 0.6);
        break;
      case 'energetic':
      case 'happy':
        targetVolume = Math.min(0.8, intensity * 0.8);
        break;
      case 'sad':
      case 'melancholy':
        targetVolume = Math.max(0.2, intensity * 0.4);
        break;
      case 'focused':
        targetVolume = Math.max(0.4, intensity * 0.5);
        break;
      default:
        targetVolume = intensity * 0.7;
    }
    
    setVolume(targetVolume);
  }, [state.volume, state.adaptiveVolume, setVolume]);

  // ==================== UTILITIES ====================
  const toggleFavorite = useCallback((trackId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: trackId });
  }, []);

  const getRecommendationsForEmotion = useCallback(async (emotion: string): Promise<MusicTrack[]> => {
    try {
      // Utiliser emotion-music-ai qui existe avec action get-recommendations
      const { data, error } = await supabase.functions.invoke('emotion-music-ai', {
        body: {
          action: 'get-recommendations',
          emotion,
          count: 10
        }
      });

      if (error) throw error;
      
      // Mapper les tracks du format DB au format MusicTrack
      const recommendations = data?.recommendations || data?.tracks || [];
      return recommendations.map((track: any) => ({
        id: track.id,
        title: track.title || track.prompt || 'Musique générée',
        artist: track.artist || 'Suno AI',
        url: track.audio_url || track.audioUrl || '',
        audioUrl: track.audio_url || track.audioUrl || '',
        duration: track.duration || 120,
        coverUrl: track.image_url || track.imageUrl,
        emotion: track.emotion,
        mood: track.mood,
        tags: track.tags
      }));
    } catch (error) {
      logger.error('Music recommendations error', error as Error, 'MUSIC');
      return [];
    }
  }, []);

  const getEmotionMusicDescription = useCallback((emotion: string): string => {
    const descriptions: Record<string, string> = {
      calm: 'Musique douce et apaisante pour retrouver la sérénité',
      energetic: 'Sons dynamiques et motivants pour booster votre énergie',
      happy: 'Mélodies joyeuses pour célébrer votre bonne humeur',
      sad: 'Compositions réconfortantes pour traverser les moments difficiles',
      focused: 'Ambiances propices à la concentration et la productivité',
      relaxed: 'Atmosphères relaxantes pour décompresser en douceur',
      anxious: 'Harmonies apaisantes pour calmer l\'anxiété',
      melancholy: 'Pièces contemplatives pour accompagner la mélancolie',
    };
    
    return descriptions[emotion.toLowerCase()] || 'Musique thérapeutique adaptée à votre état émotionnel';
  }, []);

  // ==================== CONTEXT VALUE ====================
  const contextValue: MusicContextType = {
    state,
    
    // Playback controls
    play,
    pause,
    stop,
    next,
    previous,
    seek,
    setVolume,
    
    // Playlist management
    setPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    shufflePlaylist,
    
    // Generation
    generateMusicForEmotion,
    checkGenerationStatus,
    getEmotionMusicDescription,
    
    // Therapeutic
    enableTherapeuticMode,
    disableTherapeuticMode,
    adaptVolumeToEmotion,
    
    // Utilities
    toggleFavorite,
    getRecommendationsForEmotion,
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

// ==================== HOOK & FINAL EXPORTS ====================
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

// Assurer que tous les exports sont disponibles
export type { MusicContextType, MusicState };