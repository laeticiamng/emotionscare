
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';

// Create the music context
const MusicContextProvider = createContext<MusicContextType>({
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  muted: false,
  currentTime: 0,
  duration: 0,
  playlist: null,
  togglePlay: () => {},
  playTrack: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  seekTo: () => {},
  loadPlaylistForEmotion: async () => null,
  setOpenDrawer: () => {},
});

// Custom hook for using the music context
export const useMusic = () => {
  const context = useContext(MusicContextProvider);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

// Props for the music provider component
interface MusicProviderProps {
  children: React.ReactNode;
}

// Music provider component
export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  // State
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [recommendations, setRecommendations] = useState<MusicTrack[]>([]);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audioElement = new Audio();
      audioElement.volume = volume;
      setAudio(audioElement);
      
      return () => {
        audioElement.pause();
        audioElement.src = '';
      };
    }
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    if (audio && currentTrack) {
      audio.src = currentTrack.url || currentTrack.audioUrl || '';
      audio.load();
      if (isPlaying) {
        audio.play().catch(err => {
          console.error('Error playing audio:', err);
        });
      }
    }
  }, [audio, currentTrack]);
  
  // Handle play/pause state changes
  useEffect(() => {
    if (audio) {
      if (isPlaying) {
        audio.play().catch(err => {
          console.error('Error playing audio:', err);
        });
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, audio]);
  
  // Handle volume changes
  useEffect(() => {
    if (audio) {
      audio.volume = volume;
    }
  }, [audio, volume]);
  
  // Handle mute state changes
  useEffect(() => {
    if (audio) {
      audio.muted = muted;
    }
  }, [audio, muted]);
  
  // Update time and duration
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
      }
    };
    
    const handleDurationChange = () => {
      if (audio) {
        setDuration(audio.duration);
      }
    };
    
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('durationchange', handleDurationChange);
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
      };
    }
  }, [audio]);

  // Play a track
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };
  
  // Pause playback
  const pauseTrack = () => {
    setIsPlaying(false);
  };
  
  // Resume playback
  const resumeTrack = () => {
    setIsPlaying(true);
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };
  
  // Play next track in playlist
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentTrackIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentTrackIndex !== -1 && currentTrackIndex < playlist.tracks.length - 1) {
      playTrack(playlist.tracks[currentTrackIndex + 1]);
    }
  };
  
  // Play previous track in playlist
  const previousTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentTrackIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentTrackIndex > 0) {
      playTrack(playlist.tracks[currentTrackIndex - 1]);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    setMuted(prev => !prev);
  };
  
  // Seek to a specific time
  const seekTo = (time: number) => {
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Load playlist for a specific emotion
  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    try {
      setIsLoading(true);
      
      // Determine the emotion
      const emotionName = typeof params === 'string' ? params : params.emotion;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock playlist
      const mockPlaylist: MusicPlaylist = {
        id: `playlist-${emotionName}`,
        name: `${emotionName} Music`,
        title: `${emotionName} Music`,
        emotion: emotionName,
        description: `Music to enhance your ${emotionName} mood`,
        tracks: [
          {
            id: `${emotionName}-1`,
            title: 'Track 1',
            artist: 'Artist 1',
            duration: 180,
            url: '/audio/sample1.mp3',
            cover: '/images/cover1.jpg',
            coverUrl: '/images/cover1.jpg'
          },
          {
            id: `${emotionName}-2`,
            title: 'Track 2',
            artist: 'Artist 2',
            duration: 240,
            url: '/audio/sample2.mp3',
            cover: '/images/cover2.jpg',
            coverUrl: '/images/cover2.jpg'
          }
        ]
      };
      
      // Update state
      setPlaylist(mockPlaylist);
      setEmotion(emotionName);
      setRecommendations(mockPlaylist.tracks);
      
      return mockPlaylist;
    } catch (error) {
      console.error('Error loading playlist:', error);
      setError(error instanceof Error ? error : new Error('Unknown error loading playlist'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value: MusicContextType = {
    currentTrack,
    playlist,
    isPlaying,
    volume,
    muted,
    currentTime,
    duration,
    emotion,
    playTrack,
    pauseTrack,
    resumeTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    setVolume,
    toggleMute,
    seekTo,
    loadPlaylistForEmotion,
    setEmotion,
    setOpenDrawer,
    recommendations,
    isLoading,
    error,
  };

  return (
    <MusicContextProvider.Provider value={value}>
      {children}
    </MusicContextProvider.Provider>
  );
};

export default MusicProvider;
