/**
 * Music Playback Hook - Contrôles lecture audio
 */

import { useCallback, useRef, MutableRefObject, Dispatch, useEffect } from 'react';
import { MusicState, MusicAction, MusicTrack } from './types';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';
import { saveHistoryEntry, updateHistoryEntry, calculateCompletionRate } from '@/services/music/history-service';
import { supabase } from '@/integrations/supabase/client';

export const useMusicPlayback = (
  audioRef: MutableRefObject<HTMLAudioElement | null>,
  state: MusicState,
  dispatch: Dispatch<MusicAction>
) => {
  // Tracker pour calcul de durée d'écoute
  const playStartTime = useRef<number | null>(null);
  const accumulatedTime = useRef<number>(0); // Temps accumulé entre pause/play
  const currentHistoryEntryId = useRef<string | null>(null);
  const currentTrackRef = useRef<MusicTrack | null>(null);

  /**
   * Valide et nettoie une URL audio avant utilisation
   */
  const sanitizeAudioUrl = useCallback((url: string | undefined): string | null => {
    if (!url) return null;
    
    // URLs valides connues - domaines CDN audio
    const validDomains = [
      'cdn.pixabay.com',
      'cdn.sunoapi.org',
      'cdn1.suno.ai',
      'cdn2.suno.ai',
      'audiopipe.suno.ai',
      'suno.ai',
      'sunoapi.org',
      's3.amazonaws.com',
      'cloudfront.net',
    ];
    
    try {
      const urlObj = new URL(url);
      
      // Accepter les URLs de domaines connus
      if (validDomains.some(domain => urlObj.hostname.includes(domain))) {
        // Corriger les URLs Pixabay /download/ vers /audio/
        if (url.includes('cdn.pixabay.com/download/')) {
          return url.replace('/download/', '/');
        }
        return url;
      }
      
      // Refuser les URLs Supabase Storage génériques (fichiers placeholder)
      if (url.includes('supabase.co/storage') && !url.includes('.mp3') && !url.includes('.wav')) {
        logger.warn('Rejecting Supabase storage placeholder URL', { url }, 'MUSIC');
        return null;
      }
      
      // Accepter les URLs avec extensions audio valides
      if (url.match(/\.(mp3|wav|ogg|m4a|aac|webm)(\?|$)/i)) {
        return url;
      }
      
      // Accepter les URLs HTTPS génériques (autres CDNs)
      if (urlObj.protocol === 'https:') {
        return url;
      }
      
      logger.warn('Rejecting non-HTTPS audio URL', { url }, 'MUSIC');
      return null;
    } catch {
      logger.warn('Invalid audio URL format', { url }, 'MUSIC');
      return null;
    }
  }, []);

  /**
   * Sauvegarde la durée d'écoute dans l'historique
   */
  const saveListenDuration = useCallback(async (isFinal: boolean = false) => {
    if (!playStartTime.current || !currentTrackRef.current) return;

    const audio = audioRef.current;
    const now = Date.now();
    const sessionDuration = Math.round((now - playStartTime.current) / 1000);
    const totalListenDuration = accumulatedTime.current + sessionDuration;
    const trackDuration = currentTrackRef.current.duration || audio?.duration || 0;
    const completionRate = calculateCompletionRate(totalListenDuration, trackDuration);

    logger.info('Saving listen duration', { 
      totalListenDuration, 
      completionRate, 
      isFinal,
      entryId: currentHistoryEntryId.current 
    }, 'MUSIC');

    if (currentHistoryEntryId.current) {
      // Mettre à jour l'entrée existante
      await updateHistoryEntry(currentHistoryEntryId.current, {
        listen_duration: totalListenDuration,
        completion_rate: completionRate,
      });
    }

    if (isFinal) {
      // Reset pour la prochaine piste
      playStartTime.current = null;
      accumulatedTime.current = 0;
      currentHistoryEntryId.current = null;
      currentTrackRef.current = null;
    } else {
      // Accumuler le temps et reset le timer de session
      accumulatedTime.current = totalListenDuration;
      playStartTime.current = null;
    }
  }, [audioRef]);

  const play = useCallback(async (track?: MusicTrack) => {
    const audio = audioRef.current;
    if (!audio) {
      toast.error('Lecteur audio non disponible');
      return;
    }

    try {
      if (track) {
        // Nouvelle piste - sauvegarder la précédente si en cours
        if (currentTrackRef.current && currentTrackRef.current.id !== track.id) {
          await saveListenDuration(true);
        }

        // Valider l'URL audio avant de l'utiliser
        const rawUrl = track.audioUrl || track.url;
        const audioUrl = sanitizeAudioUrl(rawUrl);
        
        if (!audioUrl) {
          toast.error('URL audio invalide ou inaccessible');
          logger.error('Invalid audio URL rejected', new Error(`URL rejected: ${rawUrl}`), 'MUSIC');
          return;
        }
        
        dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
        logger.info(`Loading audio from: ${audioUrl}`, 'MUSIC');
        audio.src = audioUrl;
        audio.load();
        dispatch({ type: 'ADD_TO_HISTORY', payload: track });
        
        // Reset trackers pour nouvelle piste
        accumulatedTime.current = 0;
        currentTrackRef.current = track;
        
        // Créer une entrée d'historique et stocker l'ID
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('music_history')
            .insert({
              user_id: user.id,
              track_id: track.id,
              track_title: track.title,
              track_artist: track.artist,
              track_url: audioUrl,
              track_duration: track.duration,
              listen_duration: null, // Sera mis à jour
              completion_rate: null, // Sera mis à jour
              emotion: track.emotion || null,
              mood: track.mood || null,
              device: detectDevice(),
              source: 'player',
            })
            .select('id')
            .single();

          if (!error && data) {
            currentHistoryEntryId.current = data.id;
            logger.info('History entry created', { entryId: data.id }, 'MUSIC');
          }
        }
      }
      
      // Démarrer le timer de session
      playStartTime.current = Date.now();
      
      logger.info('Starting audio playback', 'MUSIC');
      await audio.play();
      dispatch({ type: 'SET_PLAYING', payload: true });
      
      if (state.therapeuticMode && (track?.emotion || currentTrackRef.current?.emotion)) {
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
      
      throw error;
    }
  }, [audioRef, dispatch, state.therapeuticMode, state.volume, sanitizeAudioUrl, saveListenDuration]);

  const pause = useCallback(async () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      dispatch({ type: 'SET_PAUSED', payload: true });
      
      // Sauvegarder la durée accumulée (pas final)
      await saveListenDuration(false);
    }
  }, [audioRef, dispatch, saveListenDuration]);

  const stop = useCallback(async () => {
    const audio = audioRef.current;
    if (audio) {
      // Sauvegarder avant d'arrêter (final)
      await saveListenDuration(true);
      
      audio.pause();
      audio.currentTime = 0;
      dispatch({ type: 'SET_PLAYING', payload: false });
      dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
    }
  }, [audioRef, dispatch, saveListenDuration]);

  // Gérer l'événement ended pour sauvegarder la durée finale
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = async () => {
      await saveListenDuration(true);
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef, saveListenDuration]);

  // Sauvegarder la durée quand l'utilisateur quitte la page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (playStartTime.current && currentHistoryEntryId.current) {
        // Utiliser sendBeacon pour une sauvegarde fiable avant fermeture
        const totalListenDuration = accumulatedTime.current + 
          Math.round((Date.now() - playStartTime.current) / 1000);
        
        // Note: sendBeacon n'est pas idéal avec Supabase, mais on log au moins
        logger.info('Page unload - listen duration', { totalListenDuration }, 'MUSIC');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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

// Helper
function detectDevice(): string {
  if (typeof window === 'undefined') return 'server';
  
  const ua = navigator.userAgent.toLowerCase();
  
  if (/mobile|android|iphone|ipad|ipod/.test(ua)) {
    return 'mobile';
  }
  
  if (/tablet|ipad/.test(ua)) {
    return 'tablet';
  }
  
  return 'desktop';
}
