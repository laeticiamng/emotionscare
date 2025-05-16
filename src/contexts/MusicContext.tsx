
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

const defaultValue: MusicContextType = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  playTrack: () => {},
  pauseTrack: () => {},
  setVolume: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  duration: 0,
  currentTime: 0,
  seekTo: () => {},
  loadPlaylistForEmotion: async () => null,
  setEmotion: () => {},
  toggleMute: () => {},
  muted: false,
  isMuted: false,
  setOpenDrawer: () => {},
  openDrawer: false,
  currentEmotion: null,
  playlists: [],
  isInitialized: true,
  initializeMusicSystem: async () => {},
  error: null,
  currentPlaylist: null,
  isShuffled: false,
  isRepeating: false,
  setProgress: () => {},
  progress: 0
};

const MusicContext = createContext<MusicContextType>(defaultValue);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicTrack[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(true);
  
  const { toast } = useToast();
  
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const initializeMusicSystem = useCallback(async () => {
    try {
      // Mock initialization
      setIsInitialized(true);
      return Promise.resolve();
    } catch (err) {
      setError("Erreur d'initialisation du système de musique");
      return Promise.reject(err);
    }
  }, []);
  
  // Play track function
  const playTrack = useCallback((track: MusicTrack) => {
    if (audioRef.current) {
      setCurrentTrack(track);
      
      const source = track.url || track.audioUrl || track.track_url || '';
      audioRef.current.src = source;
      
      audioRef.current.play().catch(error => {
        console.error("Error playing track:", error);
        toast({
          title: "Erreur de lecture",
          description: "Impossible de lire ce morceau. Veuillez réessayer.",
          variant: "destructive"
        });
      });
      
      setIsPlaying(true);
    }
  }, [toast]);
  
  const pauseTrack = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isPlaying]);
  
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    }
  }, [isPlaying, currentTrack, playTrack, pauseTrack]);
  
  const nextTrack = useCallback(() => {
    if (!playlist || !currentTrack || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > -1 && currentIndex < playlist.length - 1) {
      playTrack(playlist[currentIndex + 1]);
    } else {
      // Loop to beginning
      playTrack(playlist[0]);
    }
  }, [playlist, currentTrack, playTrack]);
  
  const previousTrack = useCallback(() => {
    if (!playlist || !currentTrack || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(playlist[currentIndex - 1]);
    } else {
      // Loop to end
      playTrack(playlist[playlist.length - 1]);
    }
  }, [playlist, currentTrack, playTrack]);
  
  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);
  
  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
    if (audioRef.current) {
      audioRef.current.muted = !muted;
    }
  }, [muted]);
  
  const setEmotion = useCallback((emotion: string) => {
    setCurrentEmotion(emotion);
  }, []);

  // Load playlist for an emotion (mock function)
  const loadPlaylistForEmotion = useCallback(async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    try {
      // Extract emotion from params
      const emotion = typeof params === 'string' ? params : params.emotion;
      
      // Simuler un chargement asynchrone
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Créer une playlist factice
      const mockPlaylist: MusicPlaylist = {
        id: `playlist-${Date.now()}`,
        title: `Playlist ${emotion}`,
        emotion: emotion,
        tracks: [
          {
            id: `track1-${Date.now()}`,
            title: 'Tranquillité',
            artist: 'Ambient Masters',
            duration: 180,
            url: '/sounds/welcome.mp3', // Utiliser le son préchargé dans App.tsx
            coverUrl: 'https://via.placeholder.com/300',
            coverImage: 'https://via.placeholder.com/300'
          },
          {
            id: `track2-${Date.now()}`,
            title: 'Sérénité',
            artist: 'Peaceful Melodies',
            duration: 240,
            url: '/sounds/welcome.mp3', // Utiliser le son préchargé dans App.tsx
            coverUrl: 'https://via.placeholder.com/300',
            coverImage: 'https://via.placeholder.com/300'
          }
        ]
      };
      
      // Mettre à jour l'état
      setCurrentPlaylist(mockPlaylist);
      setPlaylist(mockPlaylist.tracks);
      
      return mockPlaylist;
    } catch (error) {
      console.error("Error loading playlist for emotion:", error);
      return null;
    }
  }, []);

  const value = useMemo(() => ({
    currentTrack,
    isPlaying,
    volume,
    playTrack,
    pauseTrack,
    setVolume,
    playlist,
    togglePlay,
    nextTrack,
    previousTrack,
    prevTrack: previousTrack,
    duration,
    currentTime,
    seekTo,
    loadPlaylistForEmotion,
    setEmotion,
    muted,
    isMuted: muted,
    toggleMute,
    openDrawer,
    setOpenDrawer,
    currentEmotion,
    playlists,
    currentPlaylist,
    isInitialized,
    initializeMusicSystem,
    error,
    isShuffled,
    isRepeating,
    progress,
    setProgress,
    play: playTrack,
    pause: pauseTrack,
    resume: () => playTrack(currentTrack!),
    stop: pauseTrack,
    next: nextTrack,
    previous: previousTrack,
    mute: () => setMuted(true),
    unmute: () => setMuted(false),
    toggleShuffle: () => setIsShuffled(prev => !prev),
    toggleRepeat: () => setIsRepeating(prev => !prev),
    setPlaylist: (playlist: MusicPlaylist) => {
      setCurrentPlaylist(playlist);
      setPlaylist(playlist.tracks);
    },
    findRecommendedTracksForEmotion: (emotion: string) => {
      return currentPlaylist?.tracks || [];
    }
  }), [
    currentTrack, isPlaying, volume, playTrack, pauseTrack, setVolume,
    playlist, togglePlay, nextTrack, previousTrack,
    duration, currentTime, seekTo, loadPlaylistForEmotion, setEmotion,
    muted, toggleMute, openDrawer, setOpenDrawer, currentEmotion,
    playlists, currentPlaylist, isInitialized, initializeMusicSystem, error,
    isShuffled, isRepeating, progress, setProgress
  ]);
  
  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
