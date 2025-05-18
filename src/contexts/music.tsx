
import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { MusicTrack, MusicPreset } from '@/types/music';
import { musicPresets, allTracks } from '@/data/musicData';

interface MusicContextType {
  currentTrack: MusicTrack | null;
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  presets: MusicPreset[];
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlayback: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  playPreset: (preset: MusicPreset) => void;
  findTracksByMood: (mood: string) => MusicTrack[];
}

const defaultContext: MusicContextType = {
  currentTrack: null,
  audioRef: { current: null },
  isPlaying: false,
  volume: 0.5,
  currentTime: 0,
  duration: 0,
  presets: musicPresets,
  playTrack: () => {},
  pauseTrack: () => {},
  togglePlayback: () => {},
  setVolume: () => {},
  seek: () => {},
  playNextTrack: () => {},
  playPreviousTrack: () => {},
  playPreset: () => {},
  findTracksByMood: () => []
};

const MusicContext = createContext<MusicContextType>(defaultContext);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle audio time updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  // Handle track end
  const handleTrackEnd = () => {
    playNextTrack();
  };

  // Play a specific track
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // Audio element will autoplay when src changes
  };

  // Pause current track
  const pauseTrack = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
  };

  // Toggle playback
  const togglePlayback = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      if (currentTrack) {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    }
  };

  // Set volume
  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Seek to position
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Play next track in playlist
  const playNextTrack = () => {
    if (!currentTrack) return;
    
    // Find current index
    const currentIndex = allTracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    // Get next index (loop back to start if at the end)
    const nextIndex = (currentIndex + 1) % allTracks.length;
    playTrack(allTracks[nextIndex]);
  };

  // Play previous track in playlist
  const playPreviousTrack = () => {
    if (!currentTrack) return;
    
    // Find current index
    const currentIndex = allTracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    // Get previous index (loop to end if at the start)
    const prevIndex = (currentIndex - 1 + allTracks.length) % allTracks.length;
    playTrack(allTracks[prevIndex]);
  };

  // Play a preset (collection of tracks)
  const playPreset = (preset: MusicPreset) => {
    const tracksInPreset = allTracks.filter(track => preset.trackIds.includes(track.id));
    if (tracksInPreset.length > 0) {
      playTrack(tracksInPreset[0]);
    }
  };

  // Find tracks by mood
  const findTracksByMood = (mood: string): MusicTrack[] => {
    return allTracks.filter(track => 
      track.metadata?.mood?.toLowerCase() === mood.toLowerCase()
    );
  };

  // Effect to handle play/pause state
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(err => {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrack]);

  // Effect to set initial volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  return (
    <MusicContext.Provider value={{
      currentTrack,
      audioRef,
      isPlaying,
      volume,
      currentTime,
      duration,
      presets: musicPresets,
      playTrack,
      pauseTrack,
      togglePlayback,
      setVolume,
      seek,
      playNextTrack,
      playPreviousTrack,
      playPreset,
      findTracksByMood
    }}>
      {children}
      {currentTrack && (
        <audio 
          ref={audioRef}
          src={currentTrack.url} 
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleTrackEnd}
        />
      )}
    </MusicContext.Provider>
  );
};

// Export the hook for easy usage
export const useMusic = () => useContext(MusicContext);

export default MusicContext;
