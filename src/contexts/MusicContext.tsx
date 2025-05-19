import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { Track, Playlist } from '@/services/music/types';
import { ensurePlaylist, trackToMusicTrack, musicTrackToTrack } from '@/utils/musicCompatibility';

// Define the complete MusicContextType with all required properties
interface MusicContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  playlist: Playlist | null;
  openDrawer: boolean;
  togglePlay: () => void;
  pauseTrack: () => void;
  toggleDrawer: () => void;
  playTrack: (track: Track) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  previousTrack: () => void;
  setPlaylist: (playlist: Playlist) => void;
  volume: number;
  setVolume: (volume: number) => void;
  currentTime: number;
  duration: number;
  seekTo: (time: number) => void;
  muted: boolean;
  toggleMute: () => void;
  setCurrentTrack: (track: Track) => void;
  setOpenDrawer: (open: boolean) => void;
  isInitialized: boolean;
  loadPlaylistForEmotion: (emotion: string) => void;
}

// Create context with a default value
const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Hook for using the context
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylistState] = useState<Playlist | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Audio element reference for browser compatibility
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element safely
  useEffect(() => {
    // Only create the audio element if we're in a browser environment
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio();
      
      // Set up event listeners
      if (audioRef.current) {
        audioRef.current.addEventListener('timeupdate', () => {
          setCurrentTime(audioRef.current?.currentTime || 0);
        });
        
        audioRef.current.addEventListener('loadedmetadata', () => {
          setDuration(audioRef.current?.duration || 0);
        });
        
        audioRef.current.addEventListener('ended', () => {
          nextTrack();
        });
        
        setIsInitialized(true);
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Toggle play/pause
  const togglePlay = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      pauseTrack();
    } else {
      playCurrentTrack();
    }
  };
  
  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const playCurrentTrack = () => {
    if (!currentTrack || !audioRef.current) return;
    
    const url = currentTrack.url || (currentTrack as any).audioUrl;
    if (!url) return;
    
    audioRef.current.src = url;
    audioRef.current.volume = volume;
    audioRef.current.currentTime = currentTime;
    
    // Use promise to handle autoplay restrictions in browsers
    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        });
    }
  };

  // Toggle drawer open/close
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  // Play a specific track
  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    
    setTimeout(() => {
      if (audioRef.current) {
        const url = track.url || (track as any).audioUrl;
        if (!url) return;
        
        audioRef.current.src = url;
        audioRef.current.volume = volume;
        audioRef.current.currentTime = 0;
        
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.error("Playback failed:", error);
              setIsPlaying(false);
            });
        }
      }
    }, 0);
  };

  // Play next track
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === playlist.tracks.length - 1) {
      // If it's the last track, go back to the first one
      playTrack(playlist.tracks[0]);
    } else {
      // Otherwise go to the next track
      playTrack(playlist.tracks[currentIndex + 1]);
    }
  };

  // Play previous track (alias for prevTrack for compatibility)
  const previousTrack = () => {
    prevTrack();
  };
  
  // Play previous track
  const prevTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === 0) {
      // If it's the first track, go to the last one
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    } else {
      // Otherwise go to the previous track
      playTrack(playlist.tracks[currentIndex - 1]);
    }
  };

  // Set a playlist
  const setPlaylist = (newPlaylist: Playlist) => {
    setPlaylistState(newPlaylist);
    if (newPlaylist.tracks.length > 0 && !currentTrack) {
      setCurrentTrack(newPlaylist.tracks[0]);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      setMuted(!muted);
      audioRef.current.muted = !muted;
    }
  };
  
  // Seek to a specific time
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Load a playlist based on emotion
  const loadPlaylistForEmotion = (emotion: string) => {
    // Mock implementation - in a real app this would fetch from an API
    const mockTracks: Track[] = [
      {
        id: `${emotion}-1`,
        title: `${emotion} track 1`,
        artist: 'EmotionsCare Music',
        duration: 180,
        url: '/sounds/ambient-calm.mp3',
        cover: '/images/covers/calm.jpg'
      },
      {
        id: `${emotion}-2`,
        title: `${emotion} track 2`,
        artist: 'EmotionsCare Music',
        duration: 210,
        url: '/sounds/ambient-calm.mp3',
        cover: '/images/covers/calm.jpg'
      }
    ];
    
    const emotionPlaylist: Playlist = {
      id: `playlist-${emotion}`,
      name: `${emotion} playlist`,
      title: `Music for ${emotion} mood`,
      tracks: mockTracks
    };
    
    setPlaylist(emotionPlaylist);
    playTrack(mockTracks[0]);
  };

  // Update volume effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Update muted state effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  const value = {
    isPlaying,
    currentTrack,
    playlist,
    openDrawer,
    togglePlay,
    pauseTrack,
    toggleDrawer,
    playTrack,
    nextTrack,
    prevTrack,
    previousTrack, // Alias for compatibility
    setPlaylist,
    volume,
    setVolume,
    currentTime,
    duration,
    seekTo,
    muted,
    toggleMute,
    setCurrentTrack,
    setOpenDrawer,
    isInitialized,
    loadPlaylistForEmotion
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;
