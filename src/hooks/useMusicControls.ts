import { useState, useRef, useEffect } from 'react';
import type { MusicTrack } from '@/types/music';
import { logger } from '@/lib/logger';

export const useMusicControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
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
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    currentTrack,
    playTrack,
    play,
    pause,
    seek,
    setVolume: setVolumeLevel,
    toggleMute,
  };
};
