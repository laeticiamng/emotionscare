
import { useState, useEffect, useCallback, useRef } from 'react';
import { Track } from '@/types/music';

export interface UseAudioPlayerReturn {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  progress: number;      // seconds écoulés
  duration: number;      // durée totale en secondes
  loading: boolean;
  error: Error | null;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  setVolume: (v: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  seekTo: (seconds: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setCurrentTrack: (track: Track | null) => void;
  
  // Propriétés additionnelles nécessaires pour MusicContext
  currentTime: number;
  loadingTrack: boolean;
  formatTime: (time: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleVolumeChange: (values: number[]) => void;
}

/**
 * Hook centralisé pour gérer la lecture audio dans toute l'application
 */
export function useAudioPlayer(): UseAudioPlayerReturn {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7); // 0 to 1
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  
  // Utilisation d'une ref pour l'élément Audio pour éviter des re-renders inutiles
  const audioRef = useRef<HTMLAudioElement | null>(
    typeof window !== 'undefined' ? new Audio() : null
  );
  const audio = audioRef.current;

  // Gérer les événements audio
  useEffect(() => {
    if (!audio) return;
    
    // Configurez le volume
    audio.volume = volume;

    // Définir les gestionnaires d'événements
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setLoadingTrack(false);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play().catch(handlePlayError);
      } else {
        setIsPlaying(false);
        // Ici on pourrait implémenter la logique pour passer à la piste suivante
      }
    };
    const onError = () => {
      setError(new Error("Erreur de lecture audio"));
      setLoadingTrack(false);
      setIsPlaying(false);
    };
    const onWaiting = () => setLoadingTrack(true);
    const onCanPlay = () => setLoadingTrack(false);

    // Ajouter tous les écouteurs d'événements
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);

    // Nettoyage lors du démontage du composant
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
    };
  }, [audio, volume, repeat]);

  // Mettre à jour la source audio lorsque la piste courante change
  useEffect(() => {
    if (!audio || !currentTrack) return;
    
    const sourceUrl = currentTrack.url || currentTrack.audioUrl;
    if (!sourceUrl) {
      setError(new Error("URL audio manquante pour la piste"));
      return;
    }

    setLoadingTrack(true);
    setError(null);
    audio.src = sourceUrl;
    
    if (isPlaying) {
      audio.play().catch(handlePlayError);
    }
  }, [audio, currentTrack]);

  // Basculer lecture/pause lorsque isPlaying change
  useEffect(() => {
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.play().catch(handlePlayError);
    } else {
      audio.pause();
    }
  }, [audio, isPlaying]);

  // Gestionnaire d'erreur de lecture
  const handlePlayError = useCallback((error: Error) => {
    console.error("Erreur de lecture audio:", error);
    setError(error);
    setIsPlaying(false);
    setLoadingTrack(false);
  }, []);

  // Fonctions pour contrôler la lecture
  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setLoadingTrack(true);
    setError(null);
    setIsPlaying(true);
  }, []);

  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resumeTrack = useCallback(() => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  }, [currentTrack]);

  // Définir le volume (0 à 1)
  const setVolume = useCallback((value: number) => {
    const clampedValue = Math.max(0, Math.min(1, value));
    setVolumeState(clampedValue);
    if (audio) {
      audio.volume = clampedValue;
    }
  }, [audio]);

  const toggleRepeat = useCallback(() => {
    setRepeat(prev => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  const seekTo = useCallback((seconds: number) => {
    if (audio) {
      audio.currentTime = seconds;
      setProgress(seconds);
    }
  }, [audio]);

  // Fonctions pour la navigation dans la playlist
  const nextTrack = useCallback(() => {
    console.log("Piste suivante demandée");
    // Logique pour passer à la piste suivante dans la playlist
  }, []);

  const previousTrack = useCallback(() => {
    console.log("Piste précédente demandée");
    // Logique pour passer à la piste précédente
  }, []);

  // Formater le temps (secondes -> MM:SS)
  const formatTime = useCallback((timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  // Gérer le clic sur la barre de progression
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audio || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;
    const newTime = percentage * duration;
    
    seekTo(newTime);
  }, [audio, duration, seekTo]);

  // Gérer le changement de volume
  const handleVolumeChange = useCallback((values: number[]) => {
    if (values.length > 0) {
      setVolume(values[0] / 100);
    }
  }, [setVolume]);

  return {
    currentTrack,
    isPlaying,
    volume,
    repeat,
    shuffle,
    progress,
    duration,
    loading: loadingTrack,
    error,
    playTrack,
    pauseTrack,
    resumeTrack,
    setVolume,
    toggleRepeat,
    toggleShuffle,
    seekTo,
    nextTrack,
    previousTrack,
    setCurrentTrack,
    // Propriétés additionnelles
    currentTime: progress,
    loadingTrack,
    formatTime,
    handleProgressClick,
    handleVolumeChange
  };
}

export default useAudioPlayer;
