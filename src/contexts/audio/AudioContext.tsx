
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AudioContextType {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (value: number) => void;
  playSound: (soundUrl: string, options?: { volume?: number }) => void;
  playTrack?: (track: any) => void;
}

const AudioContext = createContext<AudioContextType>({
  isMuted: false,
  volume: 0.5,
  toggleMute: () => {},
  setVolume: () => {},
  playSound: () => {},
});

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('audio_muted') === 'true';
  });
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('audio_volume');
    return savedVolume ? parseFloat(savedVolume) : 0.5;
  });
  
  useEffect(() => {
    localStorage.setItem('audio_muted', isMuted.toString());
  }, [isMuted]);
  
  useEffect(() => {
    localStorage.setItem('audio_volume', volume.toString());
  }, [volume]);
  
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };
  
  const handleVolumeChange = (value: number) => {
    setVolume(Math.max(0, Math.min(1, value)));
  };
  
  const playSound = (soundUrl: string, options?: { volume?: number }) => {
    if (isMuted) return;
    
    try {
      const audio = new Audio(soundUrl);
      audio.volume = options?.volume !== undefined ? options.volume : volume;
      audio.play().catch(error => {
        console.error("Error playing sound:", error);
      });
    } catch (error) {
      console.error("Error creating audio element:", error);
    }
  };

  // Simple playTrack method for compatibility
  const playTrack = (track: any) => {
    if (track && track.url) {
      playSound(track.url);
    }
  };
  
  return (
    <AudioContext.Provider value={{
      isMuted,
      volume,
      toggleMute,
      setVolume: handleVolumeChange,
      playSound,
      playTrack
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);

export default AudioContext;
