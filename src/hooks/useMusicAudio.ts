/**
 * useMusicAudio - Audio Element Management
 * Gère HTMLAudioElement et connecte les événements au store Zustand
 */

import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { useMusicStore } from '@/store/music.store';
import { logger } from '@/lib/logger';
import { saveHistoryEntry } from '@/services/music/history-service';
import type { MusicTrack } from '@/types/music';

// ============================================================================
// HOOK useMusicAudio
// ============================================================================

export const useMusicAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playStartTime = useRef<number | null>(null);
  const currentTrackId = useRef<string | null>(null);

  // Store selectors (optimized with Zustand selectors)
  const currentTrack = useMusicStore.use.currentTrack();
  const isPlaying = useMusicStore.use.isPlaying();
  const volume = useMusicStore.use.volume();
  const therapeuticMode = useMusicStore.use.therapeuticMode();
  const repeatMode = useMusicStore.use.repeatMode();
  const playlist = useMusicStore.use.playlist();
  const currentPlaylistIndex = useMusicStore.use.currentPlaylistIndex();
  const shuffleMode = useMusicStore.use.shuffleMode();

  // Store actions
  const setPlaying = useMusicStore.use.setPlaying();
  const setPaused = useMusicStore.use.setPaused();
  const setCurrentTime = useMusicStore.use.setCurrentTime();
  const setDuration = useMusicStore.use.setDuration();
  const setPlaylistIndex = useMusicStore.use.setPlaylistIndex();

  // ============================================================================
  // AUDIO ELEMENT SETUP
  // ============================================================================

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = 'anonymous';

    const audio = audioRef.current;

    // Event: Loaded Metadata
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    // Event: Time Update
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    // Event: Ended
    const handleEnded = () => {
      setPlaying(false);

      // Repeat mode handling
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch((err) => logger.error('Auto-replay failed', err, 'MUSIC'));
      } else if (repeatMode === 'all' && playlist.length > 0) {
        // Auto-play next track
        nextTrack();
      }
    };

    // Event: Error
    const handleError = (e: Event) => {
      setPlaying(false);
      const audioElement = e.target as HTMLAudioElement;
      const errorCode = audioElement.error?.code;

      let errorMessage = 'Erreur de lecture audio';
      let errorDetails = '';

      if (errorCode === 1) {
        errorMessage = 'Lecture annulée';
        errorDetails = 'La lecture a été interrompue';
      } else if (errorCode === 2) {
        errorMessage = 'Erreur réseau';
        errorDetails = `Fichier introuvable: ${audioElement.src}`;
      } else if (errorCode === 3) {
        errorMessage = 'Erreur de décodage';
        errorDetails = 'Le format audio ne peut pas être lu';
      } else if (errorCode === 4) {
        errorMessage = 'Format non supporté';
        errorDetails = `URL non accessible: ${audioElement.src}`;
      }

      console.error('Audio error details:', {
        code: errorCode,
        src: audioElement.src,
        networkState: audioElement.networkState,
        readyState: audioElement.readyState,
        error: audioElement.error,
      });

      toast.error(`${errorMessage} - ${errorDetails}`);
      logger.error('Audio element error', new Error(`Code ${errorCode}: ${errorMessage}`), 'MUSIC');
    };

    // Attach event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Cleanup on unmount
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audioRef.current = null;
    };
  }, [repeatMode, playlist.length]); // Recreate if repeat mode or playlist changes

  // ============================================================================
  // PLAYBACK CONTROL METHODS
  // ============================================================================

  const play = useCallback(
    async (track?: MusicTrack) => {
      const audio = audioRef.current;
      if (!audio) {
        toast.error('Lecteur audio non disponible');
        return;
      }

      try {
        // If a new track is provided, load it
        if (track) {
          useMusicStore.getState().setCurrentTrack(track);
          const audioUrl = track.audioUrl || track.url;
          logger.info(`Loading audio from: ${audioUrl}`, 'MUSIC');
          audio.src = audioUrl;
          audio.load();

          // Save to history
          currentTrackId.current = track.id;
          playStartTime.current = Date.now();

          await saveHistoryEntry({
            track,
            device: undefined, // Auto-detected
            source: 'player',
          });
        }

        logger.info('Starting audio playback', 'MUSIC');
        await audio.play();
        setPlaying(true);

        // Therapeutic mode volume adjustment
        if (therapeuticMode && track?.emotion) {
          const targetVolume = volume * 0.8;
          audio.volume = targetVolume;
        } else {
          audio.volume = volume;
        }
      } catch (error) {
        const err = error as Error;
        logger.error('Audio playback error', err, 'MUSIC');
        setPlaying(false);

        // User-friendly error messages
        if (err.name === 'NotAllowedError') {
          toast.error('Lecture bloquée par le navigateur. Clique pour autoriser.');
        } else if (err.name === 'NotSupportedError') {
          toast.error('Format audio non supporté.');
        } else {
          toast.error('Erreur de lecture audio. Réessaye.');
        }

        throw error;
      }
    },
    [therapeuticMode, volume, setPlaying]
  );

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setPaused(true);
    }
  }, [setPaused]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
      setCurrentTime(0);
    }
  }, [setPlaying, setCurrentTime]);

  const seek = useCallback(
    (time: number) => {
      const audio = audioRef.current;
      if (audio && !isNaN(time) && time >= 0 && time <= audio.duration) {
        audio.currentTime = time;
        setCurrentTime(time);
      }
    },
    [setCurrentTime]
  );

  const setAudioVolume = useCallback(
    (newVolume: number) => {
      const audio = audioRef.current;
      const clampedVolume = Math.max(0, Math.min(1, newVolume));

      if (audio) {
        audio.volume = clampedVolume;
      }
      useMusicStore.getState().setVolume(clampedVolume);
    },
    []
  );

  const nextTrack = useCallback(() => {
    if (playlist.length === 0) return;

    let nextIndex: number;
    if (shuffleMode) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentPlaylistIndex + 1) % playlist.length;
    }

    setPlaylistIndex(nextIndex);
    const track = playlist[nextIndex];
    if (track) {
      play(track);
    }
  }, [playlist, shuffleMode, currentPlaylistIndex, setPlaylistIndex, play]);

  const previousTrack = useCallback(() => {
    if (playlist.length === 0) return;

    const prevIndex =
      currentPlaylistIndex === 0 ? playlist.length - 1 : currentPlaylistIndex - 1;

    setPlaylistIndex(prevIndex);
    const track = playlist[prevIndex];
    if (track) {
      play(track);
    }
  }, [playlist, currentPlaylistIndex, setPlaylistIndex, play]);

  // ============================================================================
  // VOLUME SYNC
  // ============================================================================

  // Sync audio element volume with store
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  // ============================================================================
  // RETURN API
  // ============================================================================

  return {
    // Control methods
    play,
    pause,
    stop,
    seek,
    setVolume: setAudioVolume,
    next: nextTrack,
    previous: previousTrack,

    // State (from store)
    isPlaying,
    currentTrack,
  };
};

export default useMusicAudio;
