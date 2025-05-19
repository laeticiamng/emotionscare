
import { useState, useEffect, useRef } from 'react';
import { AudioTrack } from '@/types/audio';

export interface UseAudioPlayerReturn {
  track: AudioTrack | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  isLoading: boolean;
  error: string;
  muted: boolean;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setTrack: (track: AudioTrack) => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  playTrack: (track: AudioTrack) => void;
  currentTrack: AudioTrack | null;
}

export const useAudioPlayer = (): UseAudioPlayerReturn => {
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [muted, setMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevVolume = useRef(volume);
  
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    
    const handleLoadStart = () => setIsLoading(true);
    const handleLoadedData = () => {
      setIsLoading(false);
      setDuration(audio.duration);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setError('Error loading audio');
      setIsLoading(false);
    };
    
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    return () => {
      audio.pause();
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);
  
  const playTrack = (newTrack: AudioTrack) => {
    if (!audioRef.current || !newTrack.url) {
      setError('Invalid audio track');
      return;
    }
    
    setTrack(newTrack);
    
    try {
      audioRef.current.src = newTrack.url;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setError('');
      }).catch(err => {
        console.error('Audio play error:', err);
        setError('Failed to play audio');
        setIsPlaying(false);
      });
    } catch (err) {
      console.error('Audio error:', err);
      setError('Audio playback error');
    }
  };
  
  const play = () => {
    if (!audioRef.current) return;
    
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      setError('');
    }).catch(err => {
      console.error('Audio play error:', err);
      setError('Failed to play audio');
    });
  };
  
  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };
  
  const togglePlay = () => {
    isPlaying ? pause() : play();
  };
  
  const seekTo = (time: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };
  
  const toggleMute = () => {
    if (muted) {
      setMuted(false);
      setVolume(prevVolume.current);
    } else {
      prevVolume.current = volume;
      setMuted(true);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }
  };
  
  return {
    track,
    isPlaying,
    duration,
    currentTime,
    volume,
    isLoading,
    error,
    muted,
    play,
    pause,
    togglePlay,
    setTrack,
    setCurrentTime,
    setVolume,
    toggleMute,
    seekTo,
    playTrack,
    currentTrack: track // Alias for compatibility
  };
};

export default useAudioPlayer;
