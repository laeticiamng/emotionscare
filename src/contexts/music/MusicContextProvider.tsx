
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { toast } from '@/hooks/use-toast';

// Quelques données de test pour la démo
const SAMPLE_TRACKS: MusicTrack[] = [
  {
    id: "track-1",
    title: "Summer Vibes",
    artist: "Happy Artist",
    emotion: "happy",
    duration: 180,
    intensity: 0.7,
    coverUrl: "/images/covers/happy.jpg",
    url: "/audio/happy.mp3",
  },
  {
    id: "track-2",
    title: "Calm Waters",
    artist: "Peaceful Mind",
    emotion: "calm",
    duration: 240,
    intensity: 0.3,
    coverUrl: "/images/covers/calm.jpg",
    url: "/audio/calm.mp3",
  },
  {
    id: "track-3",
    title: "Focus Mode",
    artist: "Concentration",
    emotion: "focus",
    duration: 300,
    intensity: 0.5,
    coverUrl: "/images/covers/focus.jpg",
    url: "/audio/focus.mp3",
  },
];

const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  muted: false,
  playlist: [],
  duration: 0,
  currentTime: 0,
  playTrack: () => {},
  pauseTrack: () => {},
  setVolume: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  seekTo: () => {},
  toggleMute: () => {},
  loadPlaylistForEmotion: async () => null,
  setEmotion: () => {},
});

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [playlist, setPlaylist] = useState<MusicTrack[]>([]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentEmotion, setCurrentEmotion] = useState<string | undefined>(undefined);
  const [openDrawer, setOpenDrawer] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const loadedData = () => {
      setDuration(audio.duration);
    };
    
    const ended = () => {
      nextTrack();
    };
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadeddata', loadedData);
    audio.addEventListener('ended', ended);
    
    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadeddata', loadedData);
      audio.removeEventListener('ended', ended);
    };
  }, []);
  
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (currentTrack) {
      const source = currentTrack.url || currentTrack.audioUrl || '';
      audioRef.current.src = source;
      audioRef.current.load();
      
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack]);
  
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);
  
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);
  
  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    toast({
      title: 'Now Playing',
      description: `${track.title} - ${track.artist || 'Unknown Artist'}`,
    });
  }, []);
  
  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
  }, []);
  
  const togglePlay = useCallback(() => {
    if (!currentTrack && playlist.length > 0) {
      setCurrentTrack(playlist[0]);
      setIsPlaying(true);
      return;
    }
    setIsPlaying(prev => !prev);
  }, [currentTrack, playlist]);
  
  const nextTrack = useCallback(() => {
    if (playlist.length === 0) return;
    
    const currentIndex = currentTrack 
      ? playlist.findIndex(track => track.id === currentTrack.id) 
      : -1;
    
    const nextIndex = currentIndex + 1 < playlist.length ? currentIndex + 1 : 0;
    setCurrentTrack(playlist[nextIndex]);
    setIsPlaying(true);
  }, [currentTrack, playlist]);
  
  const previousTrack = useCallback(() => {
    if (playlist.length === 0) return;
    
    const currentIndex = currentTrack 
      ? playlist.findIndex(track => track.id === currentTrack.id) 
      : -1;
    
    if (currentIndex <= 0) {
      // Si on est au début, aller à la fin de la playlist
      setCurrentTrack(playlist[playlist.length - 1]);
    } else {
      setCurrentTrack(playlist[currentIndex - 1]);
    }
    setIsPlaying(true);
  }, [currentTrack, playlist]);
  
  const seekTo = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);
  
  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
  }, []);
  
  const loadPlaylistForEmotion = useCallback(async (params: EmotionMusicParams | string) => {
    try {
      let emotion: string;
      let intensity: number = 0.5;
      
      if (typeof params === 'string') {
        emotion = params;
      } else {
        emotion = params.emotion;
        intensity = params.intensity || 0.5;
      }
      
      // Simule une API call pour obtenir des chansons basées sur l'émotion
      // Dans un vrai cas, cela serait une requête API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filtrer les pistes pour cette émotion
      const matchingTracks = SAMPLE_TRACKS.filter(track => 
        track.emotion === emotion.toLowerCase()
      );
      
      // Si aucune piste n'est trouvée, utiliser toutes les pistes
      const playlistTracks = matchingTracks.length > 0 ? matchingTracks : SAMPLE_TRACKS;
      
      const emotionPlaylist: MusicPlaylist = {
        id: `playlist-${emotion}-${Date.now()}`,
        title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Vibes`,
        emotion: emotion,
        tracks: playlistTracks,
      };
      
      setPlaylist(emotionPlaylist.tracks);
      setCurrentEmotion(emotion);
      
      toast({
        title: 'Playlist Created',
        description: `Created playlist for ${emotion} emotion`,
      });
      
      // Si aucune piste n'est en cours de lecture, lancer la première
      if (!currentTrack && emotionPlaylist.tracks.length > 0) {
        setCurrentTrack(emotionPlaylist.tracks[0]);
        setIsPlaying(true);
      }
      
      return emotionPlaylist;
    } catch (error) {
      console.error("Error loading playlist for emotion:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load music for this emotion',
      });
      return null;
    }
  }, [currentTrack]);
  
  const setEmotion = useCallback((emotion: string) => {
    setCurrentEmotion(emotion);
  }, []);
  
  const contextValue: MusicContextType = {
    currentTrack,
    isPlaying,
    volume,
    muted,
    playlist,
    duration,
    currentTime,
    playTrack,
    pauseTrack,
    setVolume,
    togglePlay,
    nextTrack,
    previousTrack,
    seekTo,
    toggleMute,
    loadPlaylistForEmotion,
    setEmotion,
    setOpenDrawer,
    currentEmotion,
  };
  
  return (
    <MusicContext.Provider value={contextValue}>
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

export default MusicContext;
