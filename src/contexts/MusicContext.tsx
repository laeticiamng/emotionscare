
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { useToast } from '@/hooks/use-toast';
import { convertTrackToMusicTrack, convertPlaylistToMusicPlaylist } from '@/services/music/converters';
import { usePlaylistManager } from '@/hooks/usePlaylistManager';
import { useAudioPlayer } from '@/components/music/player/useAudioPlayer';
import { getPlaylist } from '@/services/music/playlist-service';

interface MusicContextType {
  currentTrack: MusicTrack | null;
  setCurrentTrack: (track: MusicTrack | null) => void;
  currentPlaylist: MusicPlaylist | null;
  currentEmotion: string;
  isPlaying: boolean;
  volume: number;
  setVolume: (volume: number) => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  loadPlaylistForEmotion: (emotion: string) => MusicPlaylist | null;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  
  // Nouvelles propriétés nécessaires
  initializeMusicSystem: () => Promise<void>;
  error: string | null;
  playlists: MusicPlaylist[];
  loadPlaylistById: (id: string) => Promise<MusicPlaylist | null>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { toast } = useToast();
  const { 
    playlists: playlistsData, 
    currentPlaylistId, 
    getCurrentPlaylist, 
    loadPlaylistForEmotion: loadPlaylist 
  } = usePlaylistManager();
  
  const { 
    isPlaying, 
    volume, 
    setVolume, 
    playTrack: playAudioTrack,
    pauseTrack: pauseAudioTrack
  } = useAudioPlayer();
  
  // Conversion de la playlist active au format MusicPlaylist
  const currentPlaylist = getCurrentPlaylist() 
    ? convertPlaylistToMusicPlaylist(getCurrentPlaylist()!) 
    : null;

  // Conversion des playlists au format MusicPlaylist[]
  const playlists = Object.values(playlistsData).map(playlist => 
    convertPlaylistToMusicPlaylist(playlist)
  );

  // Initialisation du système musical
  const initializeMusicSystem = useCallback(async () => {
    try {
      setError(null);
      console.log('Initialisation du système musical...');
      // Simuler un chargement asynchrone
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsInitialized(true);
      toast({
        title: "Système musical initialisé",
        description: "Prêt à jouer de la musique"
      });
    } catch (err) {
      console.error('Erreur lors de l\'initialisation du système musical:', err);
      setError('Impossible d\'initialiser le système musical');
      toast({
        title: "Erreur d'initialisation",
        description: "Impossible d'initialiser le système musical",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Fonction pour charger une playlist basée sur une émotion
  const loadPlaylistForEmotion = useCallback((emotion: string) => {
    const playlist = loadPlaylist(emotion);
    setCurrentEmotion(emotion);
    
    if (playlist) {
      return convertPlaylistToMusicPlaylist(playlist);
    }
    
    return null;
  }, [loadPlaylist]);

  // Fonction pour charger une playlist par ID
  const loadPlaylistById = useCallback(async (id: string) => {
    try {
      const playlist = await getPlaylist(id);
      if (playlist) {
        const musicPlaylist = convertPlaylistToMusicPlaylist(playlist);
        if (musicPlaylist.tracks.length > 0) {
          setCurrentTrack(musicPlaylist.tracks[0]);
          playTrack(musicPlaylist.tracks[0]);
        }
        return musicPlaylist;
      }
      return null;
    } catch (err) {
      console.error('Erreur lors du chargement de la playlist:', err);
      toast({
        title: "Erreur",
        description: "Impossible de charger la playlist",
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);
  
  // Fonctions de contrôle de lecture
  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    // Assurons-nous que track a toujours une propriété url
    const trackWithUrl = {
      ...track,
      url: track.url || track.audioUrl
    };
    playAudioTrack(trackWithUrl);
  }, [playAudioTrack]);
  
  const pauseTrack = pauseAudioTrack;
  
  const nextTrack = useCallback(() => {
    if (!currentTrack || !currentPlaylist) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === currentPlaylist.tracks.length - 1) {
      // Si dernière piste ou non trouvée, jouer la première piste
      playTrack(currentPlaylist.tracks[0]);
    } else {
      playTrack(currentPlaylist.tracks[currentIndex + 1]);
    }
  }, [currentTrack, currentPlaylist, playTrack]);
  
  const previousTrack = useCallback(() => {
    if (!currentTrack || !currentPlaylist) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex <= 0) {
      // Si première piste ou non trouvée, jouer la dernière piste
      playTrack(currentPlaylist.tracks[currentPlaylist.tracks.length - 1]);
    } else {
      playTrack(currentPlaylist.tracks[currentIndex - 1]);
    }
  }, [currentTrack, currentPlaylist, playTrack]);
  
  // Fonctions pour le tiroir musical
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  // Initialiser le système musical au chargement du contexte
  useEffect(() => {
    if (!isInitialized) {
      initializeMusicSystem();
    }
  }, [isInitialized, initializeMusicSystem]);

  return (
    <MusicContext.Provider value={{
      currentTrack,
      setCurrentTrack,
      currentPlaylist,
      currentEmotion,
      isPlaying,
      volume,
      setVolume,
      playTrack,
      pauseTrack,
      nextTrack,
      previousTrack,
      loadPlaylistForEmotion,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      // Nouvelles propriétés
      initializeMusicSystem,
      error,
      playlists,
      loadPlaylistById
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  
  return context;
};
