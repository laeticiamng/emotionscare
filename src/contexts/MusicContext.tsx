
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { mockTracks, mockPlaylists } from '@/data/mockMusic';
import { ensurePlaylist, normalizeTrack } from '@/utils/musicCompatibility';

// Création du contexte avec une valeur par défaut
const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylistState] = useState<MusicPlaylist | null>(null);
  const [emotion, setEmotionState] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [queue, setQueue] = useState<MusicTrack[]>([]);

  // Initialiser avec des données mock
  useEffect(() => {
    try {
      setPlaylists(mockPlaylists || []);
      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to initialize music data:", error);
      setIsInitialized(true); // Toujours initialiser pour éviter de bloquer l'UI
    }
  }, []);

  const toggleMute = () => setMuted(!muted);
  
  const seekTo = (time: number) => {
    setCurrentTime(time);
    // Dans une implémentation réelle, nous contrôlerions aussi l'élément audio
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const togglePlay = togglePlayPause;

  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(track.duration || 0);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === playlist.tracks.length - 1) return;
    
    const nextTrack = playlist.tracks[currentIndex + 1];
    playTrack(nextTrack);
  };

  const prevTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex <= 0) return;
    
    const prevTrack = playlist.tracks[currentIndex - 1];
    playTrack(prevTrack);
  };

  // Alias pour prevTrack pour gérer les incohérences de nommage
  const previousTrack = prevTrack;

  const setPlaylist = (input: MusicPlaylist | MusicTrack[]) => {
    if (Array.isArray(input)) {
      setPlaylistState({
        id: 'custom-playlist',
        name: 'Custom Playlist',
        tracks: input,
      });
    } else {
      setPlaylistState(input);
    }
  };

  const addToQueue = (track: MusicTrack) => {
    setQueue(prevQueue => [...prevQueue, track]);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const toggleDrawer = () => setOpenDrawer(!openDrawer);
  const closeDrawer = () => setOpenDrawer(false);

  // Pour la compatibilité avec les composants existants
  const getRecommendationByEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | MusicTrack[]> => {
    try {
      const emotionName = typeof params === 'string' ? params : params.emotion;
      
      const matchingPlaylist = playlists.find(p => 
        p.emotion?.toLowerCase() === emotionName.toLowerCase()
      );
      
      if (matchingPlaylist) {
        return matchingPlaylist;
      }
      
      if (playlists.length > 0) {
        return playlists[0];  // Fallback à la première playlist
      }
      
      return [];
    } catch (error) {
      console.error("Error getting recommendations:", error);
      return [];
    }
  };

  // Implémentation mock de génération de musique IA
  const generateMusic = async (prompt: string): Promise<MusicTrack | null> => {
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Créer une piste générée mock
      const generatedTrack: MusicTrack = {
        id: `generated-${Date.now()}`,
        title: `Generated from: ${prompt.slice(0, 20)}...`,
        artist: "AI Composer",
        duration: 180,
        audioUrl: "/audio/generated-track.mp3",
        coverUrl: "/images/ai-generated.jpg",
        album: "AI Generated Music",
        year: new Date().getFullYear(),
        tags: ["ai", "generated", prompt.split(" ")[0]],
        genre: "Electronic"
      };
      
      return generatedTrack;
    } catch (error) {
      console.error('Error generating music:', error);
      setError(error instanceof Error ? error : new Error('Failed to generate music'));
      return null;
    }
  };

  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    try {
      const emotionName = typeof params === 'string' ? params : params.emotion;
      
      // Dans une vraie app, ce serait un appel API
      const emotionPlaylist = playlists.find(p => 
        p.emotion?.toLowerCase() === emotionName.toLowerCase()
      );
      
      if (emotionPlaylist) {
        setPlaylistState(emotionPlaylist);
        setEmotionState(emotionName);
        
        // Si pas de piste courante, définir la première piste
        if (!currentTrack && emotionPlaylist.tracks.length > 0) {
          setCurrentTrack(emotionPlaylist.tracks[0]);
        }
        
        return emotionPlaylist;
      }
      
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const setEmotion = setEmotionState;

  // Valeur du contexte avec toutes les propriétés et fonctions requises
  const value: MusicContextType = {
    isInitialized,
    isPlaying,
    currentTrack,
    volume,
    setVolume,
    duration,
    currentTime,
    muted,
    setMute: setMuted,
    toggleMute,
    seekTo,
    togglePlayPause,
    togglePlay,
    playlist,
    emotion,
    openDrawer,
    toggleDrawer,
    closeDrawer,
    setOpenDrawer,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    prevTrack,
    previousTrack,
    setEmotion,
    loadPlaylistForEmotion,
    setPlaylist,
    generateMusic,
    setCurrentTrack,
    error,
    getRecommendationByEmotion,
    playlists,
    isRepeating,
    isShuffled,
    toggleRepeat,
    toggleShuffle,
    queue,
    addToQueue,
    clearQueue
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default MusicContext;
