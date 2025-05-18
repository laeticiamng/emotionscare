
import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType, EmotionMusicParams } from '@/types/music';
import { musicTracks, mockPlaylists } from '@/data/musicData';
import { useToast } from '@/hooks/use-toast';
import { ensurePlaylist, filterTracksByMood } from '@/utils/musicCompatibility';

// Création du contexte avec une valeur par défaut
const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  playlist: null,
  playlists: [],
  isPlaying: false,
  volume: 0.5,
  isInitialized: false,
  muted: false,
  currentTime: 0,
  duration: 0,
  emotion: null,
  openDrawer: false,
  isRepeating: false,
  isShuffled: false,
  queue: [],
  error: null,
  progress: 0,
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  togglePlay: () => {},
  togglePlayPause: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  previousTrack: () => {},
  seekTo: () => {},
  setVolume: () => {},
  setMute: () => {},
  toggleMute: () => {},
  setProgress: () => {},
  setPlaylist: () => {},
  setCurrentTrack: () => {},
  loadPlaylistForEmotion: async () => null,
  getRecommendationByEmotion: async () => [],
  setOpenDrawer: () => {},
  toggleDrawer: () => {},
  closeDrawer: () => {},
  setEmotion: () => {},
  generateMusic: async () => null,
  toggleRepeat: () => {},
  toggleShuffle: () => {},
  addToQueue: () => {},
  clearQueue: () => {},
  findTracksByMood: () => []
});

// Hook custom pour utiliser le contexte
export const useMusic = () => {
  const context = React.useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

// Provider du contexte
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // États
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>(mockPlaylists);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  
  // Référence à l'élément audio
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialisation de l'élément audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Configuration des événements audio
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', handleTrackEnded);
      audioRef.current.addEventListener('error', handleError);
      
      // Initialisation de l'application
      setIsInitialized(true);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleTrackEnded);
        audioRef.current.removeEventListener('error', handleError);
      }
    };
  }, []);
  
  // Gestionnaires d'événements audio
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  const handleTrackEnded = () => {
    if (isRepeating) {
      // Répéter la piste actuelle
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      // Passer à la piste suivante
      nextTrack();
    }
  };
  
  const handleError = (event: Event) => {
    console.error('Audio playback error:', event);
    setError(new Error('Erreur lors de la lecture audio'));
    toast({
      title: "Erreur de lecture",
      description: "Impossible de lire ce morceau. Veuillez réessayer.",
      variant: "destructive",
    });
  };
  
  // Actions de base
  const playTrack = (track: MusicTrack) => {
    if (!track) return;
    
    try {
      setCurrentTrack(track);
      setCurrentTime(0);
      
      if (audioRef.current) {
        const audioUrl = track.audioUrl || track.url || track.src || track.track_url;
        
        if (!audioUrl) {
          console.error('No audio URL found for track:', track);
          toast({
            title: "Erreur de lecture",
            description: "URL audio manquante pour cette piste.",
            variant: "destructive",
          });
          return;
        }
        
        audioRef.current.src = audioUrl;
        audioRef.current.volume = muted ? 0 : volume;
        
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.error('Error playing track:', err);
            setError(err);
            toast({
              title: "Erreur de lecture",
              description: "Impossible de lire ce morceau. Veuillez réessayer.",
              variant: "destructive",
            });
          });
      }
    } catch (error) {
      console.error('Error in playTrack:', error);
      setError(error instanceof Error ? error : new Error('Erreur inconnue'));
    }
  };
  
  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const resumeTrack = () => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error('Error resuming track:', err);
          setError(err);
        });
    }
  };
  
  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      resumeTrack();
    } else if (playlist && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  };
  
  // Alias pour togglePlay par souci de compatibilité
  const togglePlayPause = togglePlay;
  
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    
    if (currentIndex === -1 || currentIndex >= playlist.tracks.length - 1) {
      if (isRepeating) {
        // Si répétition activée, revenir au début de la playlist
        playTrack(playlist.tracks[0]);
      } else {
        pauseTrack();
      }
    } else {
      playTrack(playlist.tracks[currentIndex + 1]);
    }
  };
  
  const previousTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    
    if (currentIndex <= 0) {
      // Au début, revenir au début de la piste actuelle
      if (audioRef.current && audioRef.current.currentTime > 3) {
        audioRef.current.currentTime = 0;
      } else {
        playTrack(playlist.tracks[0]);
      }
    } else {
      playTrack(playlist.tracks[currentIndex - 1]);
    }
  };
  
  // Alias pour previousTrack
  const prevTrack = previousTrack;
  
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  const handleSetVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : clampedVolume;
    }
  };
  
  const handleSetMute = (muted: boolean) => {
    setMuted(muted);
    
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  };
  
  const toggleMute = () => {
    handleSetMute(!muted);
  };
  
  // Gestion des playlists
  const handleSetPlaylist = (input: MusicPlaylist | MusicTrack[]) => {
    const formattedPlaylist = ensurePlaylist(input);
    setPlaylist(formattedPlaylist);
    
    // Si pas de piste en cours, jouer la première de la nouvelle playlist
    if (!currentTrack && formattedPlaylist.tracks.length > 0) {
      setCurrentTrack(formattedPlaylist.tracks[0]);
    }
  };
  
  // Gestion des émotions
  const handleSetEmotion = (newEmotion: string) => {
    setEmotion(newEmotion);
  };
  
  // Chargement de playlist par émotion
  const loadPlaylistForEmotion = async (params: string | EmotionMusicParams): Promise<MusicPlaylist | null> => {
    try {
      const emotionName = typeof params === 'string' ? params : params.emotion;
      
      // Dans une app réelle, ce serait un appel API
      const emotionPlaylist = mockPlaylists.find(p => 
        p.emotion?.toLowerCase() === emotionName.toLowerCase() ||
        p.mood?.toLowerCase() === emotionName.toLowerCase()
      );
      
      if (emotionPlaylist) {
        setPlaylist(emotionPlaylist);
        
        // Jouer automatiquement la première piste si aucune en cours
        if (!currentTrack && emotionPlaylist.tracks.length > 0) {
          setCurrentTrack(emotionPlaylist.tracks[0]);
          setTimeout(() => playTrack(emotionPlaylist.tracks[0]), 100);
        }
        
        return emotionPlaylist;
      }
      
      // Si pas de playlist trouvée, en créer une avec les pistes disponibles
      const tracksForEmotion = filterTracksByMood(musicTracks, emotionName);
      
      if (tracksForEmotion.length > 0) {
        const newPlaylist: MusicPlaylist = {
          id: `emotion-${emotionName}-${Date.now()}`,
          name: `Playlist ${emotionName}`,
          title: `Playlist ${emotionName}`,
          emotion: emotionName,
          tracks: tracksForEmotion
        };
        
        setPlaylist(newPlaylist);
        
        if (!currentTrack && newPlaylist.tracks.length > 0) {
          setCurrentTrack(newPlaylist.tracks[0]);
          setTimeout(() => playTrack(newPlaylist.tracks[0]), 100);
        }
        
        return newPlaylist;
      }
      
      return null;
    } catch (err) {
      console.error('Error loading playlist for emotion:', err);
      setError(err instanceof Error ? err : new Error('Erreur de chargement'));
      return null;
    }
  };
  
  // Recommandations par émotion
  const getRecommendationByEmotion = async (params: string | EmotionMusicParams): Promise<MusicPlaylist | MusicTrack[]> => {
    try {
      const emotionName = typeof params === 'string' ? params : params.emotion;
      
      // Dans une app réelle, ce serait un appel API
      const tracksForEmotion = filterTracksByMood(musicTracks, emotionName);
      
      if (tracksForEmotion.length > 0) {
        const recommendedPlaylist: MusicPlaylist = {
          id: `recommendation-${emotionName}-${Date.now()}`,
          name: `Recommandations ${emotionName}`,
          title: `Recommandations ${emotionName}`,
          emotion: emotionName,
          tracks: tracksForEmotion
        };
        
        return recommendedPlaylist;
      }
      
      // Fallback si aucune correspondance
      return musicTracks.slice(0, 3);
    } catch (err) {
      console.error('Error getting recommendations:', err);
      return [];
    }
  };
  
  // Recherche de pistes par humeur
  const findTracksByMood = (mood: string): MusicTrack[] => {
    return filterTracksByMood(musicTracks, mood);
  };
  
  // Gestion du drawer
  const toggleDrawer = () => setOpenDrawer(!openDrawer);
  const closeDrawer = () => setOpenDrawer(false);
  
  // Gestion de la répétition et du shuffle
  const toggleRepeat = () => setIsRepeating(!isRepeating);
  const toggleShuffle = () => setIsShuffled(!isShuffled);
  
  // Gestion de la queue
  const addToQueue = (track: MusicTrack) => {
    setQueue(prevQueue => [...prevQueue, track]);
  };
  
  const clearQueue = () => {
    setQueue([]);
  };
  
  // Génération de musique (placeholder)
  const generateMusic = async (prompt: string): Promise<MusicTrack | null> => {
    try {
      // Simulation d'une API de génération
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Création d'une piste générée factice
      const generatedTrack: MusicTrack = {
        id: `generated-${Date.now()}`,
        title: `Généré à partir de: ${prompt.slice(0, 30)}...`,
        artist: "IA Composer",
        duration: 180,
        audioUrl: "/audio/sample-generated.mp3",
        coverUrl: "/images/generated-music.jpg",
        emotion: "calm",
        tags: ["generated", "ia", prompt.split(" ")[0]],
        genre: "Ambient",
        year: new Date().getFullYear()
      };
      
      return generatedTrack;
    } catch (error) {
      console.error('Error generating music:', error);
      setError(error instanceof Error ? error : new Error('Erreur de génération'));
      return null;
    }
  };
  
  // Valeur du contexte exposée aux composants
  const contextValue: MusicContextType = {
    // États
    currentTrack,
    playlist,
    playlists,
    isPlaying,
    volume,
    isInitialized,
    muted,
    currentTime,
    duration,
    emotion,
    openDrawer,
    isRepeating,
    isShuffled,
    queue,
    error,
    progress,
    
    // Actions de base
    playTrack,
    pauseTrack,
    resumeTrack,
    togglePlay,
    togglePlayPause,
    nextTrack,
    prevTrack,
    previousTrack,
    seekTo,
    setVolume: handleSetVolume,
    setMute: handleSetMute,
    toggleMute,
    setProgress,
    
    // Gestion de playlist
    setPlaylist: handleSetPlaylist,
    setCurrentTrack,
    loadPlaylistForEmotion,
    getRecommendationByEmotion,
    
    // UI
    setOpenDrawer,
    toggleDrawer,
    closeDrawer,
    setEmotion: handleSetEmotion,
    
    // Features avancées
    generateMusic,
    toggleRepeat,
    toggleShuffle,
    addToQueue,
    clearQueue,
    findTracksByMood
  };
  
  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;
