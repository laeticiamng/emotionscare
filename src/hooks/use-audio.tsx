
import { useState, useRef, useEffect, useMemo, useCallback, MutableRefObject } from 'react';
import { toast } from '@/hooks/use-toast';

export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  url: string;
  coverUrl?: string;
  duration?: number;
  description?: string;
}

export interface UseAudioReturn {
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  currentTrack: AudioTrack | null;
  loading: boolean;
  isMuted: boolean;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  formatTime: (time: number) => string;
}

const useAudio = (): UseAudioReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [loading, setLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialiser l'élément audio
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    
    audio.volume = volume;
    
    // Événements
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setLoading(false);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    const handleCanPlay = () => {
      setLoading(false);
    };
    
    const handleError = (e: ErrorEvent) => {
      setLoading(false);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'audio",
        variant: "destructive",
      });
      console.error("Audio error:", e);
    };
    
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError as EventListener);
    
    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError as EventListener);
    };
  }, []);
  
  // Fonctions
  const play = useCallback(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Play error:", err);
        });
    }
  }, [currentTrack]);
  
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);
  
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);
  
  const setVolume = useCallback((value: number) => {
    const clampedValue = Math.max(0, Math.min(1, value));
    setVolumeState(clampedValue);
    if (audioRef.current) {
      audioRef.current.volume = clampedValue;
    }
  }, []);
  
  const toggleMute = useCallback(() => {
    setMuted(!muted);
    if (audioRef.current) {
      audioRef.current.muted = !muted;
    }
  }, [muted]);
  
  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);
  
  const playTrack = useCallback((track: AudioTrack) => {
    setCurrentTrack(track);
    setLoading(true);
    
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Error playing track:", err);
          setLoading(false);
        });
    }
  }, []);
  
  const pauseTrack = useCallback(() => {
    pause();
  }, [pause]);
  
  const formatTime = useCallback((time: number): string => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);
  
  const progress = useMemo(() => {
    return currentTime;
  }, [currentTime]);
  
  const isMuted = useMemo(() => {
    return muted;
  }, [muted]);
  
  return {
    isPlaying,
    volume,
    muted,
    currentTime,
    duration,
    play,
    pause,
    togglePlay,
    setVolume,
    toggleMute,
    seekTo,
    audioRef,
    playTrack,
    pauseTrack,
    progress,
    currentTrack,
    formatTime,
    loading,
    isMuted
  };
};

// Export default pour useAudio
export default useAudio;
