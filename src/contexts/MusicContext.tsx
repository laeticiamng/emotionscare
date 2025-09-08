/**
 * 🎵 CONTEXTE MUSICAL UNIFIÉ
 * Gestion centralisée de l'état musical avec intégration Suno
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { MusicTrack, MusicPlaylist, MusicPlayerState, AdaptiveMusicConfig } from '@/types/music';
import { useToast } from '@/hooks/use-toast';
import { useMusicGeneration } from '@/hooks/useMusicGeneration';

// Export des types pour compatibilité
export type { MusicTrack as Track, MusicPlaylist };

interface MusicContextType extends MusicPlayerState {
  playlist: MusicTrack[];
  setPlaylist: (tracks: MusicTrack[]) => void;
  play: (track?: MusicTrack) => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  toggleShuffle: () => void;
  setRepeat: (mode: 'none' | 'one' | 'all') => void;
  loadPlaylistForEmotion: (params: { emotion: string; intensity: number }) => Promise<MusicPlaylist | null>;
  adaptiveConfig: AdaptiveMusicConfig;
  setAdaptiveConfig: (config: Partial<AdaptiveMusicConfig>) => void;
  generateMusicForEmotion: (emotion: string, intensity?: number) => Promise<void>;
}

interface MusicAction {
  type: 'SET_TRACK' | 'SET_PLAYING' | 'SET_VOLUME' | 'SET_MUTED' | 'SET_TIME' | 'SET_DURATION' | 
        'SET_PLAYLIST' | 'SET_INDEX' | 'SET_SHUFFLE' | 'SET_REPEAT' | 'SET_ADAPTIVE_CONFIG';
  payload?: any;
}

const initialState: MusicPlayerState = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  playlist: [],
  currentIndex: -1,
  shuffle: false,
  repeat: 'none'
};

const initialAdaptiveConfig: AdaptiveMusicConfig = {
  enabled: true,
  emotionSensitivity: 0.8,
  autoTransition: true,
  fadeInDuration: 2000,
  fadeOutDuration: 1500,
  volumeAdjustment: true
};

function musicReducer(state: MusicPlayerState, action: MusicAction): MusicPlayerState {
  switch (action.type) {
    case 'SET_TRACK':
      return { ...state, currentTrack: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload, isMuted: false };
    case 'SET_MUTED':
      return { ...state, isMuted: action.payload };
    case 'SET_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_PLAYLIST':
      return { ...state, playlist: action.payload, currentIndex: action.payload.length > 0 ? 0 : -1 };
    case 'SET_INDEX':
      return { ...state, currentIndex: action.payload, currentTrack: state.playlist[action.payload] || null };
    case 'SET_SHUFFLE':
      return { ...state, shuffle: action.payload };
    case 'SET_REPEAT':
      return { ...state, repeat: action.payload };
    default:
      return state;
  }
}

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(musicReducer, initialState);
  const [adaptiveConfig, setAdaptiveConfigState] = React.useState(initialAdaptiveConfig);
  const { toast } = useToast();
  const { generateMusic, isGenerating } = useMusicGeneration();

  const setPlaylist = useCallback((tracks: MusicTrack[]) => {
    dispatch({ type: 'SET_PLAYLIST', payload: tracks });
  }, []);

  const play = useCallback((track?: MusicTrack) => {
    if (track) {
      const index = state.playlist.findIndex(t => t.id === track.id);
      if (index >= 0) {
        dispatch({ type: 'SET_INDEX', payload: index });
      } else {
        dispatch({ type: 'SET_TRACK', payload: track });
      }
    }
    dispatch({ type: 'SET_PLAYING', payload: true });
    
    toast({
      title: "Lecture en cours",
      description: `${track?.title || state.currentTrack?.title} - ${track?.artist || state.currentTrack?.artist}`,
      duration: 2000,
    });
  }, [state.playlist, state.currentTrack, toast]);

  const pause = useCallback(() => {
    dispatch({ type: 'SET_PLAYING', payload: false });
  }, []);

  const stop = useCallback(() => {
    dispatch({ type: 'SET_PLAYING', payload: false });
    dispatch({ type: 'SET_TIME', payload: 0 });
  }, []);

  const next = useCallback(() => {
    let nextIndex = state.currentIndex + 1;
    if (state.shuffle) {
      nextIndex = Math.floor(Math.random() * state.playlist.length);
    } else if (nextIndex >= state.playlist.length) {
      nextIndex = state.repeat === 'all' ? 0 : state.currentIndex;
    }
    if (nextIndex !== state.currentIndex) {
      dispatch({ type: 'SET_INDEX', payload: nextIndex });
    }
  }, [state.currentIndex, state.playlist.length, state.shuffle, state.repeat]);

  const previous = useCallback(() => {
    let prevIndex = state.currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = state.repeat === 'all' ? state.playlist.length - 1 : 0;
    }
    dispatch({ type: 'SET_INDEX', payload: prevIndex });
  }, [state.currentIndex, state.playlist.length, state.repeat]);

  const setVolume = useCallback((volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: Math.max(0, Math.min(1, volume)) });
  }, []);

  const toggleMute = useCallback(() => {
    dispatch({ type: 'SET_MUTED', payload: !state.isMuted });
  }, [state.isMuted]);

  const seekTo = useCallback((time: number) => {
    dispatch({ type: 'SET_TIME', payload: Math.max(0, Math.min(state.duration, time)) });
  }, [state.duration]);

  const toggleShuffle = useCallback(() => {
    dispatch({ type: 'SET_SHUFFLE', payload: !state.shuffle });
  }, [state.shuffle]);

  const setRepeat = useCallback((mode: 'none' | 'one' | 'all') => {
    dispatch({ type: 'SET_REPEAT', payload: mode });
  }, []);

  const loadPlaylistForEmotion = useCallback(async (params: { emotion: string; intensity: number }): Promise<MusicPlaylist | null> => {
    try {
      // Simuler le chargement d'une playlist basée sur l'émotion
      const mockPlaylist: MusicPlaylist = {
        id: `emotion-${params.emotion}`,
        name: `Playlist ${params.emotion}`,
        description: `Musique adaptée à l'émotion ${params.emotion}`,
        tracks: [
          {
            id: `track-${params.emotion}-1`,
            title: `Musique pour ${params.emotion}`,
            artist: 'AI Generated',
            duration: 180,
            url: '/audio/generated.mp3',
            emotion: params.emotion,
            energy: params.intensity,
            valence: params.intensity
          }
        ],
        emotion: params.emotion
      };

      setPlaylist(mockPlaylist.tracks);
      return mockPlaylist;
    } catch (error) {
      console.error('Erreur lors du chargement de la playlist:', error);
      return null;
    }
  }, [setPlaylist]);

  const generateMusicForEmotion = useCallback(async (emotion: string, intensity = 0.7) => {
    try {
      const generatedTrack = await generateMusic(emotion, undefined, undefined, intensity);
      if (generatedTrack) {
        const track: MusicTrack = {
          id: generatedTrack.id,
          title: generatedTrack.title,
          artist: generatedTrack.artist,
          duration: generatedTrack.duration,
          url: generatedTrack.audioUrl,
          emotion,
          coverUrl: generatedTrack.coverUrl
        };
        
        setPlaylist([track]);
        play(track);
        
        toast({
          title: "Musique générée !",
          description: `"${track.title}" créé pour l'émotion ${emotion}`,
        });
      }
    } catch (error) {
      console.error('Erreur génération musique:', error);
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer la musique",
        variant: "destructive"
      });
    }
  }, [generateMusic, setPlaylist, play, toast]);

  const setAdaptiveConfig = useCallback((config: Partial<AdaptiveMusicConfig>) => {
    setAdaptiveConfigState(prev => ({ ...prev, ...config }));
  }, []);

  const contextValue: MusicContextType = {
    ...state,
    setPlaylist,
    play,
    pause,
    stop,
    next,
    previous,
    setVolume,
    toggleMute,
    seekTo,
    toggleShuffle,
    setRepeat,
    loadPlaylistForEmotion,
    adaptiveConfig,
    setAdaptiveConfig,
    generateMusicForEmotion
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export { MusicContext };