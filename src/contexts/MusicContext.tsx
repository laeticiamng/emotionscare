import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist } from '@/types/music';

// Initial state
const initialState: MusicContextType = {
  currentTrack: null,
  playlist: null,
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  duration: 0,
  isMuted: false,
  isRepeating: false,
  isShuffling: false,
  currentTime: 0,
  togglePlay: () => {},
  toggleMute: () => {},
  toggleRepeat: () => {},
  toggleShuffle: () => {},
  setVolume: () => {},
  setProgress: () => {},
  playTrack: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  addTrack: () => {},
  setPlaylist: () => {},
  setCurrentTime: () => {},
  setDuration: () => {},
  setIsPlaying: () => {}, 
  setIsInitialized: () => {}
};

// Create context
export const MusicContext = createContext<MusicContextType>(initialState);

// Context provider component
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isRepeating, setIsRepeating] = useState<boolean>(false);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // Audio element reference
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Save reference to history
  const history: MusicTrack[] = [];
  
  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    
    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  // Update audio source when track changes
  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;
    
    const audioUrl = currentTrack.audioUrl || currentTrack.url;
    
    if (!audioUrl) {
      console.error('No audio URL available for track:', currentTrack);
      return;
    }
    
    // Set new audio source
    audioRef.current.src = audioUrl;
    audioRef.current.load();
    
    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error('Error playing track:', error);
      });
    }
    
    // Update duration when metadata is loaded
    const handleMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };
    
    // Update progress during playback
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      }
    };
    
    // Handle track end
    const handleEnded = () => {
      if (isRepeating) {
        audioRef.current?.play();
      } else {
        nextTrack();
      }
    };
    
    audioRef.current.addEventListener('loadedmetadata', handleMetadata);
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('ended', handleEnded);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadedmetadata', handleMetadata);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentTrack, isPlaying, isRepeating]);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  // Toggle play/pause
  const togglePlay = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(error => {
        console.error('Error playing track:', error);
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Toggle repeat
  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };
  
  // Toggle shuffle
  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };
  
  // Play specific track
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };
  
  // Play next track
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    let nextIndex;
    
    if (isShuffling) {
      // Random track except current
      nextIndex = Math.floor(Math.random() * (playlist.tracks.length - 1));
      if (nextIndex >= currentIndex) nextIndex += 1; // Adjust to skip current
    } else {
      // Next track with wrap-around
      nextIndex = (currentIndex + 1) % playlist.tracks.length;
    }
    
    if (history && currentTrack) {
      history.push(currentTrack);
    }
    
    setCurrentTrack(playlist.tracks[nextIndex]);
    setIsPlaying(true);
  };
  
  // Play previous track
  const prevTrack = () => {
    if (!playlist || !currentTrack) return;
    
    // If we have history and we're past the first 3 seconds
    if (history.length > 0 && currentTime <= 3) {
      const previousTrack = history.pop();
      if (previousTrack) {
        setCurrentTrack(previousTrack);
        setIsPlaying(true);
        return;
      }
    }
    
    // Otherwise, go to previous track in playlist
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    // Previous track with wrap-around
    const prevIndex = (currentIndex - 1 + playlist.tracks.length) % playlist.tracks.length;
    
    setCurrentTrack(playlist.tracks[prevIndex]);
    setIsPlaying(true);
  };
  
  // Add track to playlist
  const addTrack = (track: MusicTrack) => {
    if (!playlist) {
      // Create new playlist with this track
      setPlaylist({
        id: 'custom',
        name: 'Custom Playlist',
        tracks: [track]
      });
      return;
    }
    
    // Add to existing playlist if not already present
    if (!playlist.tracks.some(t => t.id === track.id)) {
      setPlaylist({
        ...playlist,
        tracks: [...playlist.tracks, track]
      });
    }
  };
  
  // Seek to position
  const seekTo = (percent: number) => {
    if (audioRef.current) {
      const time = (percent / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(percent);
    }
  };
  
  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        playlist,
        isPlaying,
        volume,
        progress,
        duration,
        isMuted,
        isRepeating,
        isShuffling,
        currentTime,
        togglePlay,
        toggleMute,
        toggleRepeat,
        toggleShuffle,
        setVolume,
        setProgress: seekTo,
        playTrack,
        nextTrack,
        prevTrack,
        addTrack,
        setPlaylist,
        setCurrentTime,
        setDuration,
        setIsPlaying,
        setIsInitialized
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

// Custom hook to use music context
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default useMusic;
