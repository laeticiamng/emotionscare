
import { useRef, useState, useEffect, useCallback } from 'react';
import { MusicTrack, UseAudioPlayerStateReturn } from '@/types';

export const useAudioPlayerCore = (
  initialTrack?: MusicTrack,
  autoPlay = false
): UseAudioPlayerStateReturn => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const initAudioElement = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.muted = muted;

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
  }, [volume, muted, playbackRate]);

  // Initialize audio element and set source if track is provided
  useEffect(() => {
    initAudioElement();
    
    if (initialTrack && audioRef.current) {
      // Use the camelCase version (audioUrl) with fallback to snake_case (audio_url)
      const audioSource = initialTrack.audioUrl || initialTrack.url;
      audioRef.current.src = audioSource;
      audioRef.current.load();
      
      if (autoPlay) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error attempting to play audio:', error);
            setIsPlaying(false);
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
      const newMuted = !muted;
      audioRef.current.muted = newMuted;
      setMuted(newMuted);
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
    volume,
    muted,
    playbackRate,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate: setPlaybackRateValue,
    audioRef,
  };
};

export default useAudioPlayerCore;
