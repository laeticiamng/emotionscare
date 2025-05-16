
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { MusicContextType, MusicPlaylist, MusicTrack, EmotionMusicParams } from '@/types/music';

// Données simulées pour démonstration
const mockPlaylists: Record<string, MusicPlaylist> = {
  calm: {
    id: 'calm-playlist',
    name: 'Calme et Sérénité',
    coverUrl: '/images/playlists/calm-cover.jpg',
    tracks: [
      {
        id: 'calm-1',
        title: 'Méditation Paisible',
        artist: 'Ambient Masters',
        url: '/sounds/ambient-calm.mp3',
        audioUrl: '/sounds/ambient-calm.mp3',
        duration: 180,
        coverUrl: '/images/tracks/meditation.jpg',
        emotionalTone: 'calm'
      },
      {
        id: 'calm-2',
        title: 'Océan Tranquille',
        artist: 'Nature Sounds',
        url: '/sounds/ambient-calm.mp3',
        audioUrl: '/sounds/ambient-calm.mp3',
        duration: 240,
        coverUrl: '/images/tracks/ocean.jpg',
        emotionalTone: 'calm'
      }
    ]
  },
  happy: {
    id: 'happy-playlist',
    name: 'Énergie Positive',
    coverUrl: '/images/playlists/happy-cover.jpg',
    tracks: [
      {
        id: 'happy-1',
        title: 'Journée Ensoleillée',
        artist: 'Happy Vibes',
        url: '/sounds/ambient-calm.mp3',
        audioUrl: '/sounds/ambient-calm.mp3',
        duration: 200,
        coverUrl: '/images/tracks/sunny.jpg',
        emotionalTone: 'happy'
      }
    ]
  },
  focus: {
    id: 'focus-playlist',
    name: 'Concentration',
    coverUrl: '/images/playlists/focus-cover.jpg',
    tracks: [
      {
        id: 'focus-1',
        title: 'Deep Work',
        artist: 'Productivity Sounds',
        url: '/sounds/ambient-calm.mp3',
        audioUrl: '/sounds/ambient-calm.mp3',
        duration: 360,
        coverUrl: '/images/tracks/focus.jpg',
        emotionalTone: 'focus'
      }
    ]
  }
};

export const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  playlist: null,
  isPlaying: false,
  volume: 0.5,
  progress: 0,
  muted: false,
  loadTrack: () => {},
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  adjustVolume: () => {},
  seekTo: () => {},
  togglePlay: () => {},
  setPlaylist: () => {},
  loadPlaylistForEmotion: async () => null,
  setEmotion: () => {}
});

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string>('calm');
  const [openDrawer, setOpenDrawer] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      if (audio.currentTime && audio.duration) {
        setProgress(audio.currentTime);
        setDuration(audio.duration);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      nextTrack();
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.volume = volume;
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const loadTrack = (track: MusicTrack) => {
    try {
      if (audioRef.current) {
        const audio = audioRef.current;
        
        // Determine which URL to use based on what's available
        const audioSource = track.audioUrl || track.url || track.track_url || '';
        
        audio.src = audioSource;
        audio.load();
        setCurrentTrack(track);
        setError(null);
      }
    } catch (err) {
      console.error("Error loading track:", err);
      setError(err instanceof Error ? err : new Error('Unknown error loading track'));
    }
  };

  const playTrack = (track: MusicTrack) => {
    loadTrack(track);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Error playing track:", err);
          setError(err instanceof Error ? err : new Error('Unable to play track'));
        });
    }
  };

  const pauseTrack = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeTrack = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Error resuming track:", err);
          setError(err instanceof Error ? err : new Error('Unable to resume track'));
        });
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex < playlist.tracks.length - 1) {
      playTrack(playlist.tracks[currentIndex + 1]);
    } else {
      // Loop back to first track
      playTrack(playlist.tracks[0]);
    }
  };

  const previousTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(playlist.tracks[currentIndex - 1]);
    } else {
      // Loop to last track
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    }
  };

  const adjustVolume = (increment: boolean) => {
    let newVolume = volume;
    if (increment) {
      newVolume = Math.min(1, volume + 0.1);
    } else {
      newVolume = Math.max(0, volume - 0.1);
    }
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
    if (newVolume > 0 && muted) {
      setMuted(false);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const loadPlaylistForEmotion = async (emotion: string | EmotionMusicParams): Promise<MusicPlaylist | null> => {
    try {
      const emotionName = typeof emotion === 'string' ? emotion : emotion.emotion;
      const playlist = mockPlaylists[emotionName.toLowerCase()];
      
      if (playlist) {
        setPlaylist(playlist);
        setCurrentEmotion(emotionName);
        return playlist;
      } else {
        // Default to calm if no matching playlist
        setPlaylist(mockPlaylists.calm);
        setCurrentEmotion('calm');
        return mockPlaylists.calm;
      }
    } catch (error) {
      console.error("Error loading playlist for emotion:", error);
      return null;
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
        muted,
        error,
        currentEmotion,
        openDrawer,
        setOpenDrawer,
        isMuted: muted,
        loadTrack,
        playTrack,
        pauseTrack,
        resumeTrack,
        nextTrack,
        previousTrack,
        setVolume,
        adjustVolume,
        seekTo,
        togglePlay,
        toggleMute,
        setPlaylist,
        loadPlaylistForEmotion,
        setEmotion: setCurrentEmotion
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
