
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { mockMusicTracks } from '@/integrations/music/mockMusicData';

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  mood?: string;
  category?: string;
}

export interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrack: AudioTrack | null;
  tracks: AudioTrack[];
  progress: number;
  duration: number;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (time: number) => void;
  formatTime: (time: number) => string;
  loading: boolean;
}

const defaultContextValue: AudioContextType = {
  isPlaying: false,
  isMuted: false,
  volume: 0.5,
  currentTrack: null,
  tracks: [],
  progress: 0,
  duration: 0,
  playTrack: () => {},
  pauseTrack: () => {},
  togglePlay: () => {},
  toggleMute: () => {},
  setVolume: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  seekTo: () => {},
  formatTime: () => '0:00',
  loading: false
};

const AudioContext = createContext<AudioContextType>(defaultContextValue);

export const useAudio = () => useContext(AudioContext);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Charger les données de mock pour les tests
    setTracks(mockMusicTracks);
    
    // Créer l'élément audio
    const audio = new Audio();
    audioRef.current = audio;
    
    // Gérer le chargement
    audio.addEventListener('loadstart', () => setLoading(true));
    audio.addEventListener('canplaythrough', () => setLoading(false));
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    
    // Gérer la fin de la piste
    audio.addEventListener('ended', handleTrackEnd);
    
    // Retour de volume depuis localStorage si disponible
    const savedVolume = localStorage.getItem('audioVolume');
    if (savedVolume) {
      const parsedVolume = parseFloat(savedVolume);
      setVolume(parsedVolume);
      audio.volume = parsedVolume;
    } else {
      audio.volume = volume;
    }
    
    // Nettoyage
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      audio.removeEventListener('ended', handleTrackEnd);
      audio.pause();
    };
  }, []);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    // Sauvegarder le volume dans localStorage
    localStorage.setItem('audioVolume', volume.toString());
  }, [volume, isMuted]);
  
  const handleTrackEnd = () => {
    nextTrack();
  };
  
  const startProgressTimer = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    
    intervalRef.current = window.setInterval(() => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
      }
    }, 1000);
  };
  
  const playTrack = (track: AudioTrack) => {
    setLoading(true);
    if (audioRef.current) {
      if (currentTrack?.id === track.id) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      } else {
        audioRef.current.src = track.url;
        audioRef.current.play().catch(console.error);
        setCurrentTrack(track);
        setIsPlaying(true);
      }
      startProgressTimer();
    }
  };
  
  const pauseTrack = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };
  
  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    } else if (tracks.length > 0) {
      playTrack(tracks[0]);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = !isMuted ? 0 : volume;
    }
  };
  
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };
  
  const nextTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  };
  
  const prevTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    playTrack(tracks[prevIndex]);
  };
  
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };
  
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const value = {
    isPlaying,
    isMuted,
    volume,
    currentTrack,
    tracks,
    progress,
    duration,
    playTrack,
    pauseTrack,
    togglePlay,
    toggleMute,
    setVolume: handleVolumeChange,
    nextTrack,
    prevTrack,
    seekTo,
    formatTime,
    loading
  };
  
  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};
