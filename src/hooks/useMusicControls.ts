
import { useState, useRef, useCallback, useEffect } from 'react';
import { MusicTrack } from '@/types/music';

export const useMusicControls = () => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialiser l'audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);
    const handleLoadedData = () => {
      setDuration(audio.duration || 0);
      console.log('Audio chargé, durée:', audio.duration);
    };
    const handleError = (e: Event) => {
      console.error('Erreur audio:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadedmetadata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadedmetadata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Gérer le volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playTrack = useCallback(async (track: MusicTrack) => {
    if (!audioRef.current) return;

    try {
      console.log('Lecture de:', track.title, 'URL:', track.url || track.audioUrl);
      
      const audioUrl = track.url || track.audioUrl;
      if (!audioUrl) {
        console.error('Pas d\'URL audio pour ce morceau');
        return;
      }

      if (currentTrack?.id !== track.id) {
        audioRef.current.src = audioUrl;
        setCurrentTrack(track);
        setCurrentTime(0);
      }

      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Erreur lecture audio:', error);
      setIsPlaying(false);
    }
  }, [currentTrack]);

  const play = useCallback(async () => {
    if (!audioRef.current || !currentTrack) return;
    
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Erreur play:', error);
    }
  }, [currentTrack]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playTrack,
    play,
    pause,
    seek,
    setVolume,
    toggleMute
  };
};
