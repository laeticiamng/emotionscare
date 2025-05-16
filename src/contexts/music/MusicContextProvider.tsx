
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { MusicContextType, MusicPlaylist, MusicTrack, EmotionMusicParams } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

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

const initialMusicContext: MusicContextType = {
  isPlaying: false,
  currentTrack: null,
  play: () => {},
  playTrack: () => {},
  pause: () => {},
  pauseTrack: () => {},
  resume: () => {},
  stop: () => {},
  next: () => {},
  nextTrack: () => {},
  previous: () => {},
  previousTrack: () => {},
  volume: 0.5,
  setVolume: () => {},
  mute: () => {},
  unmute: () => {},
  isMuted: false,
  muted: false,
  progress: 0,
  duration: 0,
  togglePlay: () => {},
  toggleMute: () => {},
  seekTo: () => {},
  setPlaylist: () => {},
  playlists: Object.values(mockPlaylists),
  currentPlaylist: null,
  currentTime: 0,
  openDrawer: false,
  setOpenDrawer: () => {},
  isInitialized: true,
  initializeMusicSystem: async () => {},
  error: null,
  loadPlaylistForEmotion: async () => null,
  currentEmotion: null,
  setEmotion: () => {}
};

export const MusicContext = createContext<MusicContextType>(initialMusicContext);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>('calm');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [playlists] = useState<MusicPlaylist[]>(Object.values(mockPlaylists));
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [isInitialized] = useState(true);
  
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
      next();
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

  // Load track function
  const loadTrack = (track: MusicTrack) => {
    try {
      if (audioRef.current) {
        const audio = audioRef.current;
        
        // Determine which URL to use based on what's available
        const audioSource = track.audioUrl || track.url || '';
        
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

  // Play function (alias for playTrack)
  const play = (track: MusicTrack) => playTrack(track);

  // Play track function
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
          toast({
            title: "Erreur de lecture",
            description: "Impossible de lire ce morceau. Veuillez réessayer.",
            variant: "destructive"
          });
        });
    }
  };

  // Pause function (alias for pauseTrack)
  const pause = () => pauseTrack();

  // Pause track function
  const pauseTrack = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Resume track function
  const resume = () => {
    if (audioRef.current && !isPlaying && currentTrack) {
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

  // Stop track function
  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
    }
  };

  // Toggle play function
  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      resume();
    } else if (playlist && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  };

  // Next track function
  const next = () => nextTrack();
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

  // Previous track function
  const previous = () => previousTrack();
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

  // Set volume function
  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      const vol = Math.min(1, Math.max(0, newVolume));
      audioRef.current.volume = vol;
      setVolumeState(vol);
      
      // Automatically unmute when volume > 0
      if (vol > 0 && muted) {
        setMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  // Mute/unmute functions
  const mute = () => {
    if (audioRef.current) {
      audioRef.current.muted = true;
      setMuted(true);
    }
  };

  const unmute = () => {
    if (audioRef.current) {
      audioRef.current.muted = false;
      setMuted(false);
    }
  };

  // Toggle mute function
  const toggleMute = () => {
    if (muted) {
      unmute();
    } else {
      mute();
    }
  };

  // Seek to time function
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  // Set playlist function
  const setPlaylistFunc = (newPlaylist: MusicPlaylist) => {
    setPlaylist(newPlaylist);
    setCurrentPlaylist(newPlaylist);
    if (newPlaylist.tracks.length > 0) {
      loadTrack(newPlaylist.tracks[0]);
    }
  };

  // Initialize music system
  const initializeMusicSystem = async () => {
    // In a real app, this would initialize audio contexts, load configurations, etc.
    return Promise.resolve();
  };

  // Load playlist for emotion
  const loadPlaylistForEmotion = async (emotion: string | EmotionMusicParams): Promise<MusicPlaylist | null> => {
    try {
      const emotionName = typeof emotion === 'string' ? emotion : emotion.emotion;
      const matchedPlaylist = mockPlaylists[emotionName.toLowerCase()];
      
      if (matchedPlaylist) {
        setPlaylist(matchedPlaylist);
        setCurrentPlaylist(matchedPlaylist);
        setCurrentEmotion(emotionName);
        return matchedPlaylist;
      } else {
        // Default to calm if no matching playlist
        setPlaylist(mockPlaylists.calm);
        setCurrentPlaylist(mockPlaylists.calm);
        setCurrentEmotion('calm');
        return mockPlaylists.calm;
      }
    } catch (err) {
      console.error("Error loading playlist for emotion:", err);
      setError(err instanceof Error ? err : new Error('Failed to load emotion playlist'));
      return null;
    }
  };

  // Set emotion function
  const setEmotion = (emotion: string) => {
    setCurrentEmotion(emotion);
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTrack,
        play,
        playTrack,
        pause,
        pauseTrack,
        resume,
        stop,
        next,
        nextTrack,
        previous,
        previousTrack,
        volume,
        setVolume,
        mute,
        unmute,
        isMuted: muted,
        muted,
        progress,
        duration,
        playlist,
        setPlaylist: setPlaylistFunc,
        playlists,
        currentPlaylist,
        togglePlay,
        toggleMute,
        seekTo,
        currentTime: progress,
        openDrawer,
        setOpenDrawer,
        isInitialized,
        initializeMusicSystem,
        error,
        loadPlaylistForEmotion,
        currentEmotion,
        setEmotion
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
