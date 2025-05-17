import React, { createContext, useState, useRef, useEffect, useCallback, useContext } from 'react';
import { Howl } from 'howler';
import { AudioPlaylist } from '@/types/other';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface MusicContextType {
  currentTrackIndex: number | null;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  playlist: AudioPlaylist | null;
  howl: Howl | null;
  isInitialized: boolean;
  
  initialize: (playlist: AudioPlaylist) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (position: number) => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  skipToTrack: (trackIndex: number) => void;
}

const MusicContext = createContext<MusicContextType>({
  currentTrackIndex: null,
  isPlaying: false,
  isMuted: false,
  volume: 0.5,
  playlist: null,
  howl: null,
  isInitialized: false,
  
  initialize: () => {},
  play: () => {},
  pause: () => {},
  next: () => {},
  prev: () => {},
  seek: () => {},
  toggleMute: () => {},
  setVolume: () => {},
  skipToTrack: () => {},
});

interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playlist, setPlaylist] = useState<AudioPlaylist | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { preferences } = useUserPreferences();
  
  const howlRef = useRef<Howl | null>(null);
  
  // Initialize Howl instance
  const initialize = useCallback((initialPlaylist: AudioPlaylist) => {
    if (howlRef.current) {
      howlRef.current.unload();
    }
    
    setPlaylist(initialPlaylist);
    setCurrentTrackIndex(0);
    
    howlRef.current = new Howl({
      src: initialPlaylist.tracks.map(track => track.url),
      html5: true,
      volume: volume,
      mute: isMuted,
      onload: () => {
        setIsInitialized(true);
      },
      onend: () => {
        next();
      }
    });
  }, [next, volume, isMuted]);
  
  // Play the current track
  const play = useCallback(() => {
    if (!howlRef.current) return;
    howlRef.current.play();
    setIsPlaying(true);
  }, []);
  
  // Pause the current track
  const pause = useCallback(() => {
    if (!howlRef.current) return;
    howlRef.current.pause();
    setIsPlaying(false);
  }, []);
  
  // Skip to the next track
  const next = useCallback(() => {
    if (!howlRef.current || !playlist) return;
    const nextTrackIndex = (currentTrackIndex === null || currentTrackIndex >= playlist.tracks.length - 1) ? 0 : currentTrackIndex + 1;
    howlRef.current.stop();
    setCurrentTrackIndex(nextTrackIndex);
    howlRef.current.play();
    setIsPlaying(true);
  }, [currentTrackIndex, playlist]);
  
  // Skip to the previous track
  const prev = useCallback(() => {
    if (!howlRef.current || !playlist) return;
    const prevTrackIndex = (currentTrackIndex === null || currentTrackIndex <= 0) ? playlist.tracks.length - 1 : currentTrackIndex - 1;
    howlRef.current.stop();
    setCurrentTrackIndex(prevTrackIndex);
    howlRef.current.play();
    setIsPlaying(true);
  }, [currentTrackIndex, playlist]);
  
  // Seek to a specific position in the current track
  const seek = useCallback((position: number) => {
    if (!howlRef.current) return;
    howlRef.current.seek(position);
  }, []);
  
  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(prevMuted => {
      const newMuted = !prevMuted;
      if (howlRef.current) {
        howlRef.current.mute(newMuted);
      }
      return newMuted;
    });
  }, []);
  
  // Set the volume
  const setVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (howlRef.current) {
      howlRef.current.volume(newVolume);
    }
  }, []);
  
  const skipToTrack = useCallback((trackIndex: number) => {
    if (!howlRef.current || !playlist || trackIndex < 0 || trackIndex >= playlist.tracks.length) return;
    howlRef.current.stop();
    setCurrentTrackIndex(trackIndex);
    howlRef.current.play();
    setIsPlaying(true);
  }, [playlist]);
  
  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(volume);
    }
  }, [volume]);
  
  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.mute(isMuted);
    }
  }, [isMuted]);
  
  useEffect(() => {
    if (preferences?.soundEffects === false) {
      setIsMuted(true);
      setVolume(0);
    } else {
      setIsMuted(false);
      setVolume(0.5);
    }
  }, [preferences?.soundEffects]);
  
  const value: MusicContextType = {
    currentTrackIndex,
    isPlaying,
    isMuted,
    volume,
    playlist,
    howl: howlRef.current,
    isInitialized,
    
    initialize,
    play,
    pause,
    next,
    prev,
    seek,
    toggleMute,
    setVolume,
    skipToTrack
  };
  
  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);

export default MusicProvider;
