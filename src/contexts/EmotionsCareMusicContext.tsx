
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { MusicTrack, Playlist } from '@/types/music';

interface EmotionsCareMusicState {
  currentTrack: MusicTrack | null;
  playlist: MusicTrack[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  error: string | null;
}

interface EmotionsCareMusicContextType extends EmotionsCareMusicState {
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  setPlaylist: (tracks: MusicTrack[]) => void;
  seekTo: (time: number) => void;
  clearError: () => void;
}

const EmotionsCareMusicContext = createContext<EmotionsCareMusicContextType | undefined>(undefined);

export const useEmotionsCareMusic = () => {
  const context = useContext(EmotionsCareMusicContext);
  if (!context) {
    throw new Error('useEmotionsCareMusic must be used within EmotionsCareMusicProvider');
  }
  return context;
};

interface EmotionsCareMusicProviderProps {
  children: React.ReactNode;
}

export const EmotionsCareMusicProvider: React.FC<EmotionsCareMusicProviderProps> = ({ children }) => {
  const [state, setState] = useState<EmotionsCareMusicState>({
    currentTrack: null,
    playlist: [],
    currentIndex: 0,
    isPlaying: false,
    volume: 0.7,
    currentTime: 0,
    duration: 0,
    isLoading: false,
    error: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadingRef = useRef<boolean>(false);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const loadTrack = useCallback(async (track: MusicTrack) => {
    if (loadingRef.current) {
      console.log('🎵 EmotionsCare - Chargement déjà en cours, abandon');
      return;
    }

    loadingRef.current = true;
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('🎵 EmotionsCare - Chargement de la piste:', track.title, 'URL:', track.url || track.audioUrl);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }

      const audio = new Audio();
      audioRef.current = audio;

      const audioUrl = track.url || track.audioUrl;
      if (!audioUrl) {
        throw new Error('URL audio manquante');
      }

      audio.src = audioUrl;
      audio.volume = state.volume;
      audio.preload = 'metadata';

      await new Promise((resolve, reject) => {
        const handleCanPlay = () => {
          audio.removeEventListener('canplay', handleCanPlay);
          audio.removeEventListener('error', handleError);
          resolve(void 0);
        };

        const handleError = (e: any) => {
          audio.removeEventListener('canplay', handleCanPlay);
          audio.removeEventListener('error', handleError);
          reject(new Error(`Erreur de chargement audio: ${e.message || 'Inconnue'}`));
        };

        audio.addEventListener('canplay', handleCanPlay, { once: true });
        audio.addEventListener('error', handleError, { once: true });

        audio.load();
      });

      // Événements audio
      audio.addEventListener('timeupdate', () => {
        setState(prev => ({
          ...prev,
          currentTime: audio.currentTime
        }));
      });

      audio.addEventListener('loadedmetadata', () => {
        setState(prev => ({
          ...prev,
          duration: audio.duration || 0
        }));
      });

      audio.addEventListener('ended', () => {
        setState(prev => ({ ...prev, isPlaying: false }));
        // Auto-next track
        setTimeout(() => {
          nextTrack();
        }, 500);
      });

      setState(prev => ({
        ...prev,
        currentTrack: track,
        isLoading: false,
        error: null
      }));

      console.log('✅ EmotionsCare - Piste chargée avec succès');

    } catch (error) {
      console.error('❌ EmotionsCare - Erreur de chargement:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur de chargement'
      }));
    } finally {
      loadingRef.current = false;
    }
  }, [state.volume]);

  const play = useCallback(async () => {
    if (!audioRef.current || loadingRef.current) {
      console.log('🎵 EmotionsCare - Audio non prêt pour la lecture');
      return;
    }

    try {
      clearError();
      await audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true }));
      console.log('▶️ EmotionsCare - Lecture démarrée');
    } catch (error) {
      console.error('❌ EmotionsCare - Erreur de lecture:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur de lecture'
      }));
    }
  }, [clearError]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
      console.log('⏸️ EmotionsCare - Lecture en pause');
    }
  }, []);

  const toggle = useCallback(async () => {
    if (state.isPlaying) {
      pause();
    } else {
      await play();
    }
  }, [state.isPlaying, play, pause]);

  const nextTrack = useCallback(() => {
    if (state.playlist.length === 0) return;
    
    const nextIndex = (state.currentIndex + 1) % state.playlist.length;
    const nextTrack = state.playlist[nextIndex];
    
    setState(prev => ({ ...prev, currentIndex: nextIndex }));
    loadTrack(nextTrack);
  }, [state.playlist, state.currentIndex, loadTrack]);

  const prevTrack = useCallback(() => {
    if (state.playlist.length === 0) return;
    
    const prevIndex = state.currentIndex === 0 ? state.playlist.length - 1 : state.currentIndex - 1;
    const prevTrack = state.playlist[prevIndex];
    
    setState(prev => ({ ...prev, currentIndex: prevIndex }));
    loadTrack(prevTrack);
  }, [state.playlist, state.currentIndex, loadTrack]);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setState(prev => ({ ...prev, volume: clampedVolume }));
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  const setPlaylist = useCallback((tracks: MusicTrack[]) => {
    console.log('📋 EmotionsCare - Nouvelle playlist chargée:', tracks.length, 'morceaux');
    
    // Arrêter la lecture actuelle
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    setState(prev => ({
      ...prev,
      playlist: tracks,
      currentIndex: 0,
      isPlaying: false
    }));

    // Charger le premier morceau
    if (tracks.length > 0) {
      loadTrack(tracks[0]);
    }
  }, [loadTrack]);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  }, []);

  // Nettoyage
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const contextValue: EmotionsCareMusicContextType = {
    ...state,
    play,
    pause,
    toggle,
    nextTrack,
    prevTrack,
    setVolume,
    setPlaylist,
    seekTo,
    clearError,
  };

  return (
    <EmotionsCareMusicContext.Provider value={contextValue}>
      {children}
    </EmotionsCareMusicContext.Provider>
  );
};

export default EmotionsCareMusicProvider;
