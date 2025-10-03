
import { useRef, useState, useEffect, useCallback } from 'react';
import { MusicTrack } from '@/types/music';
import { UseAudioPlayerStateReturn } from '@/types/audio-player';

export const useAudioPlayerCore = (
  initialTrack?: MusicTrack,
  autoPlay = false
) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);

  const initAudioElement = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.muted = isMuted;

      // Set event listeners
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      
      audioRef.current.addEventListener('durationchange', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
        // Reset to beginning
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
      });
      
      audioRef.current.addEventListener('play', () => {
        setIsPlaying(true);
      });
      
      audioRef.current.addEventListener('pause', () => {
        setIsPlaying(false);
      });
    }
  }, [volume, isMuted, playbackRate]);

  // Initialize audio element and set source if track is provided
  useEffect(() => {
    initAudioElement();
    
    if (initialTrack && audioRef.current) {
      // Use the camelCase version (audioUrl) with fallback to snake_case (audio_url)
      const audioSource = initialTrack.audioUrl || initialTrack.url;
      audioRef.current.src = audioSource;
      audioRef.current.load();
      setCurrentTrack(initialTrack);
      
      if (autoPlay) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error attempting to play audio:', error);
            setIsPlaying(false);
            setError(error);
          });
        }
      }
    }
    
    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
  }, [initialTrack, autoPlay, initAudioElement]);

  // Function to play audio
  const play = async () => {
    if (!audioRef.current) {
      initAudioElement();
    }
    
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        setError(error as Error);
      }
    }
  };

  // Function to pause audio
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Function to toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // Function to seek to a specific time
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Function to set volume
  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolumeState(newVolume);
    }
  };

  // Function to toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  // Function to set playback rate
  const setPlaybackRateValue = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  return {
    isPlaying,
    currentTime,
    duration,
    progress,
    volume,
    error,
    isMuted,
    playbackRate,
    isLoading,
    loadingTrack,
    currentTrack,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate: setPlaybackRateValue,
    setIsPlaying,
    setCurrentTime,
    setProgress,
    setError,
    setIsLoading,
    setLoadingTrack,
    setCurrentTrack,
    setDuration,
    setIsMuted,
    audioRef,
  };
};

export default useAudioPlayerCore;
