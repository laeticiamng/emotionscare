/**
 * MUSIC CONTEXT - EmotionsCare Premium
 * Provider principal avec audio management
 */

import React, { createContext, useReducer, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { musicReducer, initialState } from './reducer';
import { MusicContextType, MusicTrack } from './types';
import { useMusicPlayback } from './useMusicPlayback';
import { useMusicPlaylist } from './useMusicPlaylist';
import { useMusicGeneration } from './useMusicGeneration';
import { useMusicTherapeutic } from './useMusicTherapeutic';
import { logger } from '@/lib/logger';

export const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(musicReducer, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Setup audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = 'anonymous';
    
    const audio = audioRef.current;
    
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
        audio.play().catch(err => logger.error('Auto-replay failed', err, 'MUSIC'));
      }
    };
    
    const handleError = (e: Event) => {
      dispatch({ type: 'SET_PLAYING', payload: false });
      const audioElement = e.target as HTMLAudioElement;
      const errorCode = audioElement.error?.code;
      
      let errorMessage = 'Erreur de lecture audio';
      if (errorCode === 2) errorMessage = 'Erreur réseau - Fichier introuvable';
      else if (errorCode === 3) errorMessage = 'Erreur de décodage audio';
      else if (errorCode === 4) errorMessage = 'Format audio non supporté';
      
      toast.error(errorMessage);
      logger.error('Audio element error', new Error(`Code ${errorCode}: ${errorMessage}`), 'MUSIC');
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
  }, [state.repeatMode]);

  // Custom hooks pour modularité
  const playbackControls = useMusicPlayback(audioRef, state, dispatch);
  const playlistControls = useMusicPlaylist(state, dispatch, playbackControls.play);
  const generationControls = useMusicGeneration(dispatch);
  const therapeuticControls = useMusicTherapeutic(dispatch);

  const contextValue: MusicContextType = {
    state,
    ...playbackControls,
    ...playlistControls,
    ...generationControls,
    ...therapeuticControls,
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export type { MusicContextType } from './types';
