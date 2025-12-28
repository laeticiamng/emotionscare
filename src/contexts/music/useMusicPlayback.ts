/**
 * Music Playback Hook - Contrôles lecture audio
 */

import { useCallback, useRef, MutableRefObject, Dispatch } from 'react';
import { MusicState, MusicAction, MusicTrack } from './types';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';
import { saveHistoryEntry, calculateCompletionRate } from '@/services/music/history-service';

export const useMusicPlayback = (
  audioRef: MutableRefObject<HTMLAudioElement | null>,
  state: MusicState,
  dispatch: Dispatch<MusicAction>
) => {
  // Tracker pour calcul de durée d'écoute
  const playStartTime = useRef<number | null>(null);
  const currentTrackId = useRef<string | null>(null);

  const play = useCallback(async (track?: MusicTrack) => {
    const audio = audioRef.current;
    if (!audio) {
      toast.error('Lecteur audio non disponible');
      return;
    }

    try {
      if (track) {
        dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
        const audioUrl = track.audioUrl || track.url;
        logger.info(`Loading audio from: ${audioUrl}`, 'MUSIC');
        audio.src = audioUrl;
        audio.load();
        dispatch({ type: 'ADD_TO_HISTORY', payload: track });
        
        // Sauvegarder dans DB au démarrage de la lecture
        currentTrackId.current = track.id;
        playStartTime.current = Date.now();
        
        // Save initial history entry (sera mis à jour à la fin)
        await saveHistoryEntry({
          track,
          device: undefined, // Auto-détecté
          source: 'player',
        });
      }
      
      logger.info('Starting audio playback', 'MUSIC');
      await audio.play();
      dispatch({ type: 'SET_PLAYING', payload: true });
      
      if (state.therapeuticMode && track?.emotion) {
        const targetVolume = state.volume * 0.8; // Ajustement thérapeutique
        audio.volume = targetVolume;
      }
    } catch (error) {
      const err = error as Error;
      logger.error('Audio playback error', err, 'MUSIC');
      dispatch({ type: 'SET_PLAYING', payload: false });
      
      // Messages d'erreur utilisateur
      if (err.name === 'NotAllowedError') {
        toast.error('Lecture bloquée par le navigateur. Clique pour autoriser.');
      } else if (err.name === 'NotSupportedError') {
        toast.error('Format audio non supporté.');
      } else {
        toast.error('Erreur de lecture audio. Réessaye.');
      }
      
      throw error; // Re-throw pour propagation
    }
  }, [audioRef, dispatch, state.therapeuticMode, state.volume]);

  const pause = useCallback(async () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      dispatch({ type: 'SET_PAUSED', payload: true });
      
      // Calculer et sauvegarder la durée d'écoute réelle
      if (playStartTime.current && currentTrackId.current && state.currentTrack) {
        const listenDurationMs = Date.now() - playStartTime.current;
        const listenDurationSec = Math.round(listenDurationMs / 1000);
        const trackDuration = state.currentTrack.duration || audio.duration || 0;
        const completionRate = calculateCompletionRate(listenDurationSec, trackDuration);
        
        // Sauvegarder dans l'historique avec durée réelle
        await saveHistoryEntry({
          track: state.currentTrack,
          listenDuration: listenDurationSec,
          completionRate,
          source: 'player',
        });
        
        playStartTime.current = null;
      }
    }
  }, [audioRef, dispatch, state.currentTrack]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      dispatch({ type: 'SET_PLAYING', payload: false });
      dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
    }
  }, [audioRef, dispatch]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio && !isNaN(time) && time >= 0 && time <= audio.duration) {
      audio.currentTime = time;
      dispatch({ type: 'SET_CURRENT_TIME', payload: time });
    }
  }, [audioRef, dispatch]);

  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current;
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    if (audio) {
      audio.volume = clampedVolume;
    }
    dispatch({ type: 'SET_VOLUME', payload: clampedVolume });
  }, [audioRef, dispatch]);

  const next = useCallback(() => {
    if (state.playlist.length === 0) return;

    let nextIndex: number;
    if (state.shuffleMode) {
      nextIndex = Math.floor(Math.random() * state.playlist.length);
    } else {
      nextIndex = (state.currentPlaylistIndex + 1) % state.playlist.length;
    }

    dispatch({ type: 'SET_PLAYLIST_INDEX', payload: nextIndex });
    const nextTrack = state.playlist[nextIndex];
    if (nextTrack) {
      play(nextTrack);
    }
  }, [state.playlist, state.shuffleMode, state.currentPlaylistIndex, dispatch, play]);

  const previous = useCallback(() => {
    if (state.playlist.length === 0) return;

    const prevIndex = state.currentPlaylistIndex === 0 
      ? state.playlist.length - 1 
      : state.currentPlaylistIndex - 1;

    dispatch({ type: 'SET_PLAYLIST_INDEX', payload: prevIndex });
    const prevTrack = state.playlist[prevIndex];
    if (prevTrack) {
      play(prevTrack);
    }
  }, [state.playlist, state.currentPlaylistIndex, dispatch, play]);

  return {
    play,
    pause,
    stop,
    next,
    previous,
    seek,
    setVolume,
  };
};
