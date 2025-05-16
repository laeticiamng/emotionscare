
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
  playlist: null,
  setPlaylist: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  previousTrack: () => {},
  duration: 0,
  currentTime: 0,
  progress: 0,
  seek: () => {},
  seekTo: () => {},
  loadPlaylistForEmotion: async () => null,
  setEmotion: () => {},
  muted: false,
  toggleMute: () => {},
};

const MusicContext = createContext<MusicContextType>(defaultValue);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isOpenDrawer, setOpenDrawer] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | undefined>();
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
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > -1 && currentIndex < playlist.tracks.length - 1) {
      playTrack(playlist.tracks[currentIndex + 1]);
    } else {
      // Loop to beginning
      playTrack(playlist.tracks[0]);
    }
  }, [playlist, currentTrack, playTrack]);
  
  const previousTrack = useCallback(() => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(playlist.tracks[currentIndex - 1]);
    } else {
      // Loop to end
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
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

  // To provide backward compatibility with loadPlaylistForEmotion function that accepts either string or EmotionMusicParams
  const loadPlaylistForEmotion = useCallback(async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    try {
      // Extract emotion from params
      const emotion = typeof params === 'string' ? params : params.emotion;
      
      // Mock function that creates a playlist based on emotion
      const mockPlaylist: MusicPlaylist = {
        id: `playlist-${Date.now()}`,
        title: `${emotion} Playlist`,
        emotion,
        tracks: [
          {
            id: `track1-${Date.now()}`,
            title: 'Tranquility',
            artist: 'Ambient Masters',
            duration: 180,
            source: 'streaming',
            coverUrl: 'https://via.placeholder.com/300'
          },
          {
            id: `track2-${Date.now()}`,
            title: 'Serenity',
            artist: 'Peaceful Melodies',
            duration: 240,
            source: 'streaming',
            coverUrl: 'https://via.placeholder.com/300'
          }
        ]
      };
      
      setPlaylist(mockPlaylist);
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
    setPlaylist,
    togglePlay,
    nextTrack,
    prevTrack: previousTrack,
    previousTrack,
    duration,
    currentTime,
    progress: currentTime,
    seek: seekTo,
    seekTo,
    isOpenDrawer,
    setOpenDrawer,
    loadPlaylistForEmotion,
    setEmotion,
    currentEmotion,
    muted,
    toggleMute,
    playlists: [],
    isInitialized: true,
    initializeMusicSystem: async () => {},
    error: null
  }), [
    currentTrack, isPlaying, volume, playTrack, pauseTrack, setVolume,
    playlist, setPlaylist, togglePlay, nextTrack, previousTrack,
    duration, currentTime, seekTo, isOpenDrawer, setOpenDrawer,
    loadPlaylistForEmotion, setEmotion, currentEmotion, muted, toggleMute
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
