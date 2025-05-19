
import { useState, useEffect, useRef, useCallback } from 'react';
import { AudioTrack } from '@/types/audio';
import { getAudioUrl } from '@/lib/audio/audioUtils';

export const useAudio = (initialTrack?: AudioTrack | null) => {
  const [track, setTrack] = useState<AudioTrack | null>(initialTrack || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  // Initialiser l'élément audio
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    
    const audio = audioRef.current;
    
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setError('Erreur lors du chargement de l\'audio');
      setIsPlaying(false);
      setIsLoading(false);
    };
    
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    // Nettoyer les event listeners
    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      
      // Arrêter l'audio et l'intervalle
      audio.pause();
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [volume]);
  
  // Charger la piste quand elle change
  useEffect(() => {
    if (!audioRef.current || !track) return;
    
    const audioUrl = getAudioUrl(track);
    
    if (!audioUrl) {
      setError('URL audio non disponible');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    audioRef.current.src = audioUrl;
    audioRef.current.load();
    
    if (isPlaying) {
      audioRef.current.play()
        .catch(err => {
          console.error("Erreur de lecture audio:", err);
          setError('Erreur de lecture');
          setIsPlaying(false);
          setIsLoading(false);
        });
    }
  }, [track, isPlaying]);
  
  // Mettre à jour le temps actuel périodiquement
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      const updateTime = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime || 0);
        }
      };
      
      // Nettoyer l'intervalle précédent
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      
      // Créer un nouvel intervalle
      intervalRef.current = window.setInterval(updateTime, 1000);
    } else if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);
  
  // Mettre à jour le volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Fonctions de contrôle
  const play = useCallback(() => {
    if (!audioRef.current || !track) return;
    
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setError(null);
      })
      .catch(err => {
        console.error("Erreur de lecture audio:", err);
        setError('Erreur de lecture');
        setIsPlaying(false);
      });
  }, [track]);
  
  const pause = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);
  
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);
  
  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);
  
  const setTrackAndPlay = useCallback((newTrack: AudioTrack) => {
    setTrack(newTrack);
    setIsPlaying(true);
  }, []);
  
  return {
    track,
    isPlaying,
    duration,
    currentTime,
    volume,
    isLoading,
    error,
    setTrack,
    setTrackAndPlay,
    play,
    pause,
    togglePlay,
    seek,
    setVolume
  };
};

export default useAudio;
