
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { useAuth } from './AuthContext';

// Create the context with default values
const MusicContext = createContext<MusicContextType>({
  isInitialized: false,
  isPlaying: false,
  currentTrack: null,
  volume: 0.7,
  duration: 0,
  currentTime: 0,
  muted: false,
  playlist: null,
  emotion: null,
  openDrawer: false,
  
  setVolume: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  prevTrack: () => {}, // Alias for previousTrack
  seekTo: () => {},
  toggleMute: () => {},
  setCurrentTrack: () => {},
  setPlaylist: () => {},
  getRecommendationByEmotion: async () => ({ id: '', name: '', tracks: [] }),
  setOpenDrawer: () => {},
  generateMusic: async () => null
});

// Sample playlists for demonstration
const SAMPLE_PLAYLISTS: Record<string, MusicPlaylist> = {
  calm: {
    id: 'calm-playlist',
    name: 'Calm & Relaxing',
    cover: '/images/music/calm.jpg',
    mood: 'calm',
    tracks: [
      { id: 'calm-1', name: 'Peaceful Mind', artist: 'Nature Sounds', cover: '/images/music/calm.jpg', audioUrl: '/audio/calm-1.mp3' },
      { id: 'calm-2', name: 'Ocean Waves', artist: 'Meditation Music', cover: '/images/music/calm.jpg', audioUrl: '/audio/calm-2.mp3' },
    ]
  },
  focus: {
    id: 'focus-playlist',
    name: 'Deep Focus',
    cover: '/images/music/focus.jpg',
    mood: 'focus',
    tracks: [
      { id: 'focus-1', name: 'Concentration', artist: 'Brain Waves', cover: '/images/music/focus.jpg', audioUrl: '/audio/focus-1.mp3' },
      { id: 'focus-2', name: 'Study Session', artist: 'Alpha Waves', cover: '/images/music/focus.jpg', audioUrl: '/audio/focus-2.mp3' },
    ]
  },
  happy: {
    id: 'happy-playlist',
    name: 'Upbeat & Happy',
    cover: '/images/music/happy.jpg',
    mood: 'happy',
    tracks: [
      { id: 'happy-1', name: 'Sunny Day', artist: 'Mood Lifters', cover: '/images/music/happy.jpg', audioUrl: '/audio/happy-1.mp3' },
      { id: 'happy-2', name: 'Good Vibes', artist: 'Positive Energy', cover: '/images/music/happy.jpg', audioUrl: '/audio/happy-2.mp3' },
    ]
  }
};

interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isAuthenticated } = useAuth();
  
  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      
      const audio = audioRef.current;
      audio.volume = volume;
      
      // Set up event listeners
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleDurationChange = () => setDuration(audio.duration);
      const handleEnded = () => nextTrack();
      
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('ended', handleEnded);
      
      setIsInitialized(true);
      
      // Clean up
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      };
    }
  }, []);
  
  // Update audio when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    
    // Get URL from any available property
    const audioUrl = currentTrack.audioUrl || currentTrack.src || currentTrack.url;
    
    if (audioUrl) {
      audio.src = audioUrl;
      audio.load();
      
      if (isPlaying) {
        audio.play().catch(err => {
          console.error('Failed to play audio:', err);
          setIsPlaying(false);
        });
      }
      
      // Update emotion based on track mood
      if (currentTrack.mood) {
        setEmotion(currentTrack.mood);
      }
    }
  }, [currentTrack, isPlaying]);
  
  // Handle volume changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted]);
  
  // Toggle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => {
        console.error('Failed to play audio:', err);
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Next track
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex < 0 || currentIndex >= playlist.tracks.length - 1) {
      // Either track not found or last track
      setCurrentTrack(playlist.tracks[0]);
    } else {
      setCurrentTrack(playlist.tracks[currentIndex + 1]);
    }
  };
  
  // Previous track
  const previousTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex <= 0) {
      // First track or not found
      setCurrentTrack(playlist.tracks[playlist.tracks.length - 1]);
    } else {
      setCurrentTrack(playlist.tracks[currentIndex - 1]);
    }
  };
  
  // Seek to time
  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = time;
    setCurrentTime(time);
  };
  
  // Toggle mute
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = !audio.muted;
    setMuted(!muted);
  };
  
  // Get recommendation by emotion
  const getRecommendationByEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist> => {
    // Extract emotion string from params object if needed
    const emotion = typeof params === 'string' ? params : params.emotion;
    
    // Mock API call - in real app, this would call a music recommendation API
    return new Promise((resolve) => {
      setTimeout(() => {
        setEmotion(emotion);
        
        // Get matching playlist or default to calm
        const matchedPlaylist = SAMPLE_PLAYLISTS[emotion.toLowerCase()] || SAMPLE_PLAYLISTS.calm;
        resolve(matchedPlaylist);
      }, 500);
    });
  };
  
  // Generate music with AI (mock)
  const generateMusic = async (prompt: string): Promise<MusicTrack | null> => {
    // Mock API call - in real app, this would call a music generation API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a mock track based on the prompt
        const track: MusicTrack = {
          id: `generated-${Date.now()}`,
          name: `AI Music: ${prompt.substring(0, 20)}${prompt.length > 20 ? '...' : ''}`,
          artist: 'AI Composer',
          audioUrl: '/audio/generated.mp3',
          cover: '/images/music/ai-generated.jpg',
        };
        
        resolve(track);
      }, 1500);
    });
  };
  
  // Value to provide
  const value: MusicContextType = {
    isInitialized,
    isPlaying,
    currentTrack,
    volume,
    duration,
    currentTime,
    muted,
    playlist,
    emotion,
    openDrawer,
    
    setVolume,
    togglePlay,
    nextTrack,
    previousTrack,
    prevTrack: previousTrack, // Alias for previousTrack
    seekTo,
    toggleMute,
    setCurrentTrack,
    setPlaylist,
    getRecommendationByEmotion,
    setOpenDrawer,
    generateMusic
  };
  
  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

// Hook for using the music context
export const useMusic = () => useContext(MusicContext);
