
import React, { createContext, useContext, useState } from 'react';

interface Track {
  id: string;
  title: string;
  artist?: string;
  url: string;
  cover?: string;
  duration?: number;
  emotion?: string;
  intensity?: number;
  category?: string;
}

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  tracks: Track[];
  queue: Track[];
  emotionMode: boolean;
  currentEmotion: string | null;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
  setEmotionMode: (enabled: boolean) => void;
  setCurrentEmotion: (emotion: string | null) => void;
  findRecommendedTracksForEmotion: (emotion: string, intensity?: number) => Track[];
}

const defaultContext: MusicContextType = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  tracks: [],
  queue: [],
  emotionMode: false,
  currentEmotion: null,
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  addToQueue: () => {},
  clearQueue: () => {},
  setEmotionMode: () => {},
  setCurrentEmotion: () => {},
  findRecommendedTracksForEmotion: () => []
};

export const MusicContext = createContext<MusicContextType>(defaultContext);

export const MusicProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [queue, setQueue] = useState<Track[]>([]);
  const [emotionMode, setEmotionMode] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);

  // Exemple de tracks prédéfinis
  const tracks: Track[] = [
    {
      id: '1',
      title: 'Peaceful Morning',
      artist: 'Nature Sounds',
      url: '/audio/peaceful-morning.mp3',
      cover: '/images/covers/peaceful.jpg',
      emotion: 'calm',
      intensity: 2
    },
    {
      id: '2',
      title: 'Energy Boost',
      artist: 'Workout Mix',
      url: '/audio/energy-boost.mp3',
      cover: '/images/covers/energy.jpg',
      emotion: 'happy',
      intensity: 4
    },
    {
      id: '3',
      title: 'Melancholy Evening',
      artist: 'Piano Solo',
      url: '/audio/melancholy.mp3',
      cover: '/images/covers/melancholy.jpg',
      emotion: 'sad',
      intensity: 3
    }
  ];

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      const newQueue = queue.slice(1);
      setCurrentTrack(nextTrack);
      setQueue(newQueue);
      setIsPlaying(true);
    } else if (currentTrack) {
      const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
      if (currentIndex < tracks.length - 1) {
        setCurrentTrack(tracks[currentIndex + 1]);
      } else {
        setCurrentTrack(tracks[0]);
      }
    }
  };

  const previousTrack = () => {
    if (currentTrack) {
      const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
      if (currentIndex > 0) {
        setCurrentTrack(tracks[currentIndex - 1]);
      } else {
        setCurrentTrack(tracks[tracks.length - 1]);
      }
    }
  };

  const addToQueue = (track: Track) => {
    setQueue([...queue, track]);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const findRecommendedTracksForEmotion = (emotion: string, intensity?: number): Track[] => {
    // Filtrer les pistes qui correspondent à l'émotion
    let filtered = tracks.filter(track => track.emotion === emotion);
    
    // Si l'intensité est définie, filtrer par intensité proche
    if (intensity !== undefined) {
      filtered = filtered.sort((a, b) => {
        const aDiff = Math.abs((a.intensity || 0) - (intensity || 0));
        const bDiff = Math.abs((b.intensity || 0) - (intensity || 0));
        return aDiff - bDiff;
      });
    }
    
    return filtered;
  };

  const value = {
    currentTrack,
    isPlaying,
    volume,
    tracks,
    queue,
    emotionMode,
    currentEmotion,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    setVolume,
    addToQueue,
    clearQueue,
    setEmotionMode,
    setCurrentEmotion,
    findRecommendedTracksForEmotion
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export const useMusicContext = () => useContext(MusicContext);
