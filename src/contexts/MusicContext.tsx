
import React, { createContext, useState, useCallback, useContext } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { normalizeTrack } from '@/utils/musicCompatibility';

// Create the context with a default value
export const MusicContext = createContext<MusicContextType>({} as MusicContextType);

interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true);

  // Fonction pour charger une playlist selon une émotion
  const loadPlaylistForEmotion = useCallback(async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    const emotion = typeof params === 'string' ? params : params.emotion;
    const intensity = typeof params === 'string' ? 0.5 : (params.intensity ?? 0.5);
    
    // Simulate loading a playlist
    const mockPlaylist: MusicPlaylist = {
      id: `emotion-${Date.now()}`,
      name: `Playlist ${emotion}`,
      title: `Playlist ${emotion}`,
      description: `Musique générée pour l'émotion ${emotion}`,
      emotion: emotion,
      tracks: [
        {
          id: 'default-track-1',
          title: 'Ambient Melody',
          artist: 'EmotionsCare',
          duration: 180,
          url: '/audio/samples/ambient.mp3',
          cover: '/images/covers/ambient.jpg',
          coverUrl: '/images/covers/ambient.jpg',
          audioUrl: '/audio/samples/ambient.mp3',
          emotion: emotion,
          mood: [emotion],
          genre: 'Ambient',
          album: 'Emotions',
          tags: [emotion]
        }
      ],
      source: 'generated',
      coverImage: '/images/covers/ambient.jpg',
      mood: [emotion]
    };
    
    return mockPlaylist;
  }, []);

  // Alias for backward compatibility
  const getRecommendationByEmotion = useCallback((emotion: string | EmotionMusicParams, intensity: number = 0.5) => {
    if (typeof emotion === 'string') {
      return loadPlaylistForEmotion({ emotion, intensity });
    }
    return loadPlaylistForEmotion(emotion);
  }, [loadPlaylistForEmotion]);

  // Fonction pour générer une musique à partir d'un prompt
  const generateMusic = useCallback(async (prompt: string): Promise<MusicTrack> => {
    // Simulation
    return {
      id: `generated-${Date.now()}`,
      title: `Musique basée sur: ${prompt.substring(0, 20)}...`,
      artist: 'IA Music Generator',
      duration: 180,
      url: '/audio/samples/generated.mp3',
      cover: '/images/covers/generated.jpg',
      coverUrl: '/images/covers/generated.jpg',
      audioUrl: '/audio/samples/generated.mp3',
      emotion: 'custom',
      mood: ['custom'],
      genre: 'AI Generated',
      album: 'Generated Music',
      tags: ['generated']
    };
  }, []);

  // Fonctions de contrôle de lecture
  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(normalizeTrack(track));
    setIsPlaying(true);
  }, []);

  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resumeTrack = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const previousTrack = useCallback(() => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      const prevTrack = playlist.tracks[currentIndex - 1];
      setCurrentTrack(prevTrack);
      setIsPlaying(true);
    }
  }, [playlist, currentTrack]);

  const nextTrack = useCallback(() => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex < playlist.tracks.length - 1) {
      const nextTrack = playlist.tracks[currentIndex + 1];
      setCurrentTrack(nextTrack);
      setIsPlaying(true);
    }
  }, [playlist, currentTrack]);

  const seekTo = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
  }, []);

  // Set emotion function
  const setEmotion = useCallback((emotion: string) => {
    console.log(`Setting emotion to ${emotion}`);
  }, []);

  // Find tracks by mood
  const findTracksByMood = useCallback((mood: string): MusicTrack[] => {
    return [];
  }, []);

  // Toggle drawer function
  const toggleDrawer = useCallback(() => {
    setOpenDrawer(prev => !prev);
  }, []);

  // Define togglePlay function for compatibility
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Valeur du contexte
  const contextValue: MusicContextType = {
    currentTrack,
    setCurrentTrack,
    playlist,
    setPlaylist,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    muted,
    setMuted,
    openDrawer,
    setOpenDrawer,
    playTrack,
    pauseTrack,
    resumeTrack,
    previousTrack,
    nextTrack,
    seekTo,
    toggleMute,
    loadPlaylistForEmotion,
    getRecommendationByEmotion,
    generateMusic,
    isInitialized,
    setEmotion,
    findTracksByMood,
    toggleDrawer,
    isShuffled: false,
    isRepeating: false,
    toggleShuffle: () => {},
    toggleRepeat: () => {},
    queue: [],
    addToQueue: () => {},
    clearQueue: () => {},
    loadPlaylist: () => {},
    shufflePlaylist: () => {},
    error: null,
    setIsInitialized,
    playlists: [],
    togglePlay
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

// Export the hook for direct usage
export const useMusic = () => {
  const context = useContext(MusicContext);
  
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  
  return context;
};

export default MusicContext;
