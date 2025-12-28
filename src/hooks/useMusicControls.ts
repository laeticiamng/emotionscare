import { useState, useRef, useEffect, useCallback } from 'react';
import type { MusicTrack } from '@/types/music';
import { logger } from '@/lib/logger';

export type RepeatMode = 'off' | 'all' | 'one';

export const useMusicControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousVolumeRef = useRef(0.7);

  // Créer l'élément audio si nécessaire
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
      
      // Event listeners
      audioRef.current.addEventListener('loadstart', () => setIsLoading(true));
      audioRef.current.addEventListener('loadeddata', () => setIsLoading(false));
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      audioRef.current.addEventListener('ended', handleTrackEnd);
      audioRef.current.addEventListener('error', (e) => {
        logger.error('Audio error', { error: e }, 'MUSIC');
        setIsLoading(false);
        setIsPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Gérer la fin de piste
  const handleTrackEnd = useCallback(() => {
    if (repeatMode === 'one') {
      // Répéter la piste actuelle
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (queue.length > 0) {
      // Passer à la piste suivante
      const nextIndex = getNextIndex();
      if (nextIndex !== -1) {
        setCurrentIndex(nextIndex);
        const nextTrack = queue[nextIndex];
        if (nextTrack) {
          playTrack(nextTrack);
        }
      } else if (repeatMode === 'all') {
        // Recommencer la queue
        setCurrentIndex(0);
        if (queue[0]) playTrack(queue[0]);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [repeatMode, queue]);

  // Calculer l'index suivant (avec shuffle si activé)
  const getNextIndex = useCallback((): number => {
    if (queue.length === 0) return -1;
    
    if (shuffle) {
      // Random index différent de l'actuel
      const availableIndices = queue
        .map((_, i) => i)
        .filter(i => i !== currentIndex);
      if (availableIndices.length === 0) return currentIndex;
      return availableIndices[Math.floor(Math.random() * availableIndices.length)];
    }
    
    const nextIdx = currentIndex + 1;
    return nextIdx < queue.length ? nextIdx : -1;
  }, [shuffle, currentIndex, queue]);

  // Mettre à jour le volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playTrack = async (track: MusicTrack) => {
    if (!audioRef.current || !track.url) {
      logger.error('No audio element or track URL', undefined, 'MUSIC');
      return;
    }

    try {
      setIsLoading(true);
      setCurrentTrack(track);
      
      // Arrêter la lecture actuelle si elle existe
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
      
      audioRef.current.src = track.url;
      await audioRef.current.load();
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      logger.error('Error playing track', error as Error, 'MUSIC');
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const play = async () => {
    if (audioRef.current && currentTrack) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        logger.error('Error playing', error as Error, 'MUSIC');
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolumeLevel = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (clampedVolume > 0) {
      previousVolumeRef.current = clampedVolume;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolumeRef.current);
    } else {
      previousVolumeRef.current = volume;
    }
    setIsMuted(!isMuted);
  };

  const loadTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    if (audioRef.current && track.url) {
      audioRef.current.src = track.url;
      audioRef.current.load();
    }
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  const cycleRepeatMode = () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const currentIdx = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIdx + 1) % modes.length]);
  };

  const next = () => {
    const nextIdx = getNextIndex();
    if (nextIdx !== -1 && queue[nextIdx]) {
      setCurrentIndex(nextIdx);
      playTrack(queue[nextIdx]);
    }
  };

  const previous = () => {
    // Si on est > 3 secondes, revenir au début de la piste
    if (currentTime > 3) {
      seek(0);
      return;
    }
    
    const prevIdx = currentIndex - 1;
    if (prevIdx >= 0 && queue[prevIdx]) {
      setCurrentIndex(prevIdx);
      playTrack(queue[prevIdx]);
    }
  };

  const setPlayQueue = (tracks: MusicTrack[], startIndex: number = 0) => {
    setQueue(tracks);
    setCurrentIndex(startIndex);
    if (tracks[startIndex]) {
      playTrack(tracks[startIndex]);
    }
  };

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    currentTrack,
    shuffle,
    repeatMode,
    queue,
    currentIndex,
    playTrack,
    play,
    pause,
    seek,
    setVolume: setVolumeLevel,
    toggleMute,
    loadTrack,
    toggleShuffle,
    cycleRepeatMode,
    next,
    previous,
    setPlayQueue,
  };
};
