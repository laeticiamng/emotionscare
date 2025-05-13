
import { useState, useEffect, useRef } from 'react';
import { MusicTrack } from '@/types/music';
import { formatTime as formatTimeUtil } from './audioPlayerUtils';

export function useAudioPlayerCore() {
  // Référence audio
  const audioRef = useRef<HTMLAudioElement | null>(
    typeof Audio !== 'undefined' ? new Audio() : null
  );
  
  // État du lecteur
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7); // 0 à 1
  const [isMuted, setIsMuted] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [loadingTrack, setLoadingTrack] = useState(false);

  // Configurer les écouteurs d'événements pour l'élément audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setLoading(false);
      setLoadingTrack(false);
    };

    const handleEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = () => {
      setError('Erreur lors de la lecture audio');
      setLoading(false);
      setLoadingTrack(false);
      setIsPlaying(false);
    };
    
    const handleCanPlayThrough = () => {
      setLoadingTrack(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [repeat]);

  // Jouer une piste spécifique
  const playTrack = (track: MusicTrack) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Stop current playback
    audio.pause();
    
    // Update state
    setCurrentTrack(track);
    setLoadingTrack(true);
    setError(null);
    
    // Set source and volume
    audio.src = track.url || track.audioUrl || track.audio_url || '';
    audio.volume = isMuted ? 0 : volume;
    
    // Load and play
    audio.load();
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.error('Erreur de lecture:', err);
        setError(`Erreur de lecture: ${err.message}`);
        setLoadingTrack(false);
      });
  };

  // Mettre en pause
  const pauseTrack = () => {
    const audio = audioRef.current;
    if (audio && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // Reprendre la lecture
  const resumeTrack = () => {
    const audio = audioRef.current;
    if (audio && currentTrack && !isPlaying) {
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          setError(`Erreur de reprise: ${err.message}`);
        });
    }
  };

  // Passer à la piste suivante (simulation)
  const nextTrack = () => {
    console.log("Fonction nextTrack appelée");
    // Dans une vraie application, ceci serait implémenté
  };

  // Revenir à la piste précédente (simulation)
  const previousTrack = () => {
    console.log("Fonction previousTrack appelée");
    // Dans une vraie application, ceci serait implémenté
  };

  // Régler le volume
  const setVolume = (newVolume: number) => {
    const audio = audioRef.current;
    const clampedVolume = Math.min(1, Math.max(0, newVolume));
    
    setVolumeState(clampedVolume);
    
    if (audio) {
      audio.volume = isMuted ? 0 : clampedVolume;
    }
  };

  // Activer/désactiver le mode muet
  const toggleMute = () => {
    const audio = audioRef.current;
    const newMuteState = !isMuted;
    
    setIsMuted(newMuteState);
    
    if (audio) {
      audio.volume = newMuteState ? 0 : volume;
    }
  };

  // Chercher une position dans la piste
  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.min(Math.max(0, time), audio.duration || 0);
      setProgress(audio.currentTime);
    }
  };

  // Activer/désactiver le mode répétition
  const toggleRepeat = () => {
    setRepeat(!repeat);
  };

  // Activer/désactiver le mode aléatoire
  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };
  
  // Gérer les clics sur la barre de progression
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;
    const newTime = percentage * duration;
    
    seekTo(newTime);
  };
  
  // Formater le temps (mm:ss)
  const formatTime = (seconds: number): string => {
    return formatTimeUtil(seconds);
  };

  // Nettoyer lors du démontage
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  return {
    // État
    currentTrack,
    isPlaying,
    volume,
    repeat,
    shuffle,
    progress,
    duration,
    loading,
    error,
    currentTime,
    loadingTrack,
    isMuted,
    
    // Actions
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    setVolume,
    toggleMute,
    seekTo,
    toggleRepeat,
    toggleShuffle,
    handleProgressClick,
    formatTime,
    
    // Référence directe à l'élément audio (pour des utilisations avancées)
    audioElement: audioRef.current
  };
}
