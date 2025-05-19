
import React, { createContext, useState, useCallback } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { normalizeTrack, ensurePlaylist } from '@/utils/musicCompatibility';
import { emotionPlaylists } from '@/data/emotionPlaylists';

// Création du contexte avec une valeur par défaut
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
  const loadPlaylistForEmotion = useCallback(async (params: EmotionMusicParams): Promise<MusicPlaylist> => {
    const { emotion, intensity = 0.5 } = params;
    
    // Recherche dans les playlists prédéfinies
    const matchingPlaylists = emotionPlaylists.filter(p => 
      p.emotion?.toLowerCase() === emotion.toLowerCase()
    );
    
    if (matchingPlaylists.length > 0) {
      // Utiliser l'intensité pour choisir une playlist
      const playlistIndex = Math.min(
        Math.floor(intensity * matchingPlaylists.length),
        matchingPlaylists.length - 1
      );
      
      return matchingPlaylists[playlistIndex];
    }
    
    // Playlist par défaut si rien ne correspond
    return {
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
  }, []);

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

  // Fonction pour récupérer une recommendation selon une émotion (alias)
  const getRecommendationByEmotion = useCallback((emotion: string, intensity: number = 0.5) => {
    return loadPlaylistForEmotion({ emotion, intensity });
  }, [loadPlaylistForEmotion]);

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
    isInitialized
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;
