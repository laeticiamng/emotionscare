
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { useToast } from '@/hooks/use-toast';
import { convertTrackToMusicTrack, convertPlaylistToMusicPlaylist } from '@/services/music/converters';
import { usePlaylistManager } from '@/hooks/usePlaylistManager';
import { useAudioPlayer } from '@/components/music/player/useAudioPlayer';

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
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  
  const { toast } = useToast();
  const { 
    playlists, 
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

  // Fonction pour charger une playlist basée sur une émotion
  const loadPlaylistForEmotion = useCallback((emotion: string) => {
    const playlist = loadPlaylist(emotion);
    setCurrentEmotion(emotion);
    
    if (playlist) {
      return convertPlaylistToMusicPlaylist(playlist);
    }
    
    return null;
  }, [loadPlaylist]);
  
  // Fonctions de contrôle de lecture
  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    playAudioTrack(convertTrackToMusicTrack(track));
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
      closeDrawer
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
