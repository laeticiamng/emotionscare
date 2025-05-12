import React, { createContext, useContext, useState, useCallback } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

// Mock data for different emotions/moods
const MOCK_PLAYLISTS: Record<string, MusicPlaylist> = {
  ambient: {
    id: 'ambient-1',
    name: 'Sons ambiants apaisants',
    description: 'Des sons naturels pour se détendre et se recentrer',
    emotion: 'calm',
    tracks: [
      {
        id: 'ambient-1-1',
        title: 'Forêt au crépuscule',
        artist: 'Nature Sounds',
        url: '/audio/forest-sounds.mp3',
        duration: 180,
        cover_url: '/images/music/forest.jpg'
      },
      {
        id: 'ambient-1-2',
        title: 'Pluie légère',
        artist: 'Ambient Moods',
        url: '/audio/rain.mp3',
        duration: 240,
        cover_url: '/images/music/rain.jpg'
      }
    ]
  },
  upbeat: {
    id: 'upbeat-1',
    name: 'Énergisant',
    description: 'De la musique pour booster votre énergie et votre humeur',
    emotion: 'happy',
    tracks: [
      {
        id: 'upbeat-1-1',
        title: 'Sunshine',
        artist: 'Happy Beats',
        url: '/audio/sunshine.mp3',
        duration: 210,
        cover_url: '/images/music/sunshine.jpg'
      }
    ]
  },
  focus: {
    id: 'focus-1',
    name: 'Concentration',
    description: 'Musique pour améliorer votre concentration',
    emotion: 'neutral',
    tracks: [
      {
        id: 'focus-1-1',
        title: 'Deep Focus',
        artist: 'Concentration',
        url: '/audio/focus.mp3',
        duration: 300,
        cover_url: '/images/music/focus.jpg'
      }
    ]
  },
  calming: {
    id: 'calming-1',
    name: 'Relaxation profonde',
    description: 'Apaiser l\'anxiété et le stress',
    emotion: 'anxious',
    tracks: [
      {
        id: 'calming-1-1',
        title: 'Méditation guidée',
        artist: 'Mindfulness',
        url: '/audio/meditation.mp3',
        duration: 360,
        cover_url: '/images/music/meditation.jpg'
      }
    ]
  },
  gentle: {
    id: 'gentle-1',
    name: 'Douceur et réconfort',
    description: 'Mélodies douces pour les moments difficiles',
    emotion: 'sad',
    tracks: [
      {
        id: 'gentle-1-1',
        title: 'Piano nocturne',
        artist: 'Classical Comfort',
        url: '/audio/piano.mp3',
        duration: 240,
        cover_url: '/images/music/piano.jpg'
      }
    ]
  },
  dance: {
    id: 'dance-1',
    name: 'Musique de danse',
    description: 'Pour bouger et se sentir vivant',
    emotion: 'energetic',
    tracks: [
      {
        id: 'dance-1-1',
        title: 'Dance beats',
        artist: 'Club mix',
        url: '/audio/dance.mp3',
        duration: 180,
        cover_url: '/images/music/dance.jpg'
      }
    ]
  }
};

interface MusicContextValue {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  openDrawer: boolean;
  currentPlaylist: MusicPlaylist | null;
  currentEmotion?: string;
  isInitialized?: boolean;
  error?: string | null;
  playlists?: MusicPlaylist[];
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  loadPlaylistById?: (id: string) => Promise<MusicPlaylist | null>;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  adjustVolume: (adjustment: number) => void;
  setOpenDrawer: (open: boolean) => void;
  initializeMusicSystem?: () => Promise<void>;
}

const MusicContext = createContext<MusicContextValue | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [playlists] = useState<MusicPlaylist[]>(Object.values(MOCK_PLAYLISTS));
  const { toast } = useToast();
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Initialize audio element only once
  React.useEffect(() => {
    if (typeof window !== 'undefined' && !audioElement) {
      const audio = new Audio();
      audio.volume = volume;
      setAudioElement(audio);
      
      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, []);

  // Initialize the music system
  const initializeMusicSystem = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      console.log('Initializing music system...');
      // Simulate async loading
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsInitialized(true);
      toast({
        title: "Music system initialized",
        description: "Ready to play music"
      });
    } catch (err) {
      console.error('Error initializing music system:', err);
      setError('Unable to initialize music system');
      toast({
        title: "Initialization error",
        description: "Unable to initialize music system",
        variant: "destructive"
      });
    }
  }, [toast]);

  const loadPlaylistById = useCallback(async (id: string): Promise<MusicPlaylist | null> => {
    // In a real app, this would call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find the playlist by ID or fallback to focus
        const playlist = Object.values(MOCK_PLAYLISTS).find(p => p.id === id) || MOCK_PLAYLISTS.focus;
        setCurrentPlaylist(playlist);
        setCurrentEmotion(playlist.emotion || 'neutral');
        resolve(playlist);
      }, 500);
    });
  }, []);

  const loadPlaylistForEmotion = useCallback(async (emotion: string): Promise<MusicPlaylist | null> => {
    // In a real app, this would call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Match the emotion to a playlist type or fallback to focus
        const playlistKey = emotion.toLowerCase() in MOCK_PLAYLISTS
          ? emotion.toLowerCase()
          : 'focus';
        
        const playlist = MOCK_PLAYLISTS[playlistKey];
        setCurrentPlaylist(playlist);
        setCurrentEmotion(emotion);
        resolve(playlist);
      }, 500);
    });
  }, []);

  const playTrack = useCallback((track: MusicTrack) => {
    if (!audioElement) return;
    
    setCurrentTrack(track);
    
    // Check if the URL is valid
    if (!track.url) {
      console.error("Track URL is missing", track);
      toast({
        title: "Erreur de lecture",
        description: "Le fichier audio n'est pas disponible",
        variant: "destructive"
      });
      return;
    }
    
    // Different property names could exist in different data sources
    const trackUrl = track.url || track.audioUrl || track.audio_url;
    
    try {
      audioElement.src = trackUrl;
      audioElement.volume = volume;
      audioElement.play().catch(error => {
        console.error("Error playing audio:", error);
        toast({
          title: "Erreur de lecture",
          description: "Impossible de lire le fichier audio",
          variant: "destructive"
        });
      });
      setIsPlaying(true);
    } catch (error) {
      console.error("Error setting up audio:", error);
      toast({
        title: "Erreur",
        description: "Problème lors du chargement de l'audio",
        variant: "destructive"
      });
    }
  }, [audioElement, volume, toast]);

  const pauseTrack = useCallback(() => {
    if (audioElement) {
      audioElement.pause();
    }
    setIsPlaying(false);
  }, [audioElement]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    } else if (currentPlaylist?.tracks?.length) {
      playTrack(currentPlaylist.tracks[0]);
    }
  }, [isPlaying, currentTrack, currentPlaylist, pauseTrack, playTrack]);

  const nextTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > -1 && currentIndex < currentPlaylist.tracks.length - 1) {
      playTrack(currentPlaylist.tracks[currentIndex + 1]);
    }
  }, [currentPlaylist, currentTrack, playTrack]);

  const previousTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(currentPlaylist.tracks[currentIndex - 1]);
    }
  }, [currentPlaylist, currentTrack, playTrack]);

  const toggleMute = useCallback(() => {
    if (audioElement) {
      const newMutedState = !isMuted;
      audioElement.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  }, [audioElement, isMuted]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    
    if (audioElement) {
      audioElement.volume = clampedVolume;
      
      // If volume is set to 0, mute. If volume is increased from 0, unmute
      if (clampedVolume === 0 && !isMuted) {
        setIsMuted(true);
      } else if (clampedVolume > 0 && isMuted) {
        setIsMuted(false);
      }
    }
    
    setVolumeState(clampedVolume);
  }, [audioElement, isMuted]);

  const adjustVolume = useCallback((adjustment: number) => {
    setVolume(volume + adjustment);
  }, [volume, setVolume]);

  const value: MusicContextValue = {
    currentTrack,
    isPlaying,
    isMuted,
    volume,
    openDrawer,
    currentPlaylist,
    currentEmotion,
    isInitialized,
    error,
    playlists: Object.values(MOCK_PLAYLISTS),
    loadPlaylistForEmotion,
    loadPlaylistById,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    togglePlay,
    toggleMute,
    setVolume,
    adjustVolume,
    setOpenDrawer,
    initializeMusicSystem
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextValue => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
