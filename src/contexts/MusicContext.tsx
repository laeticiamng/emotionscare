
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { usePlaylistManager } from '@/hooks/usePlaylistManager';
import { useDrawerState } from '@/hooks/useDrawerState';
import { Track, Playlist } from '@/services/music/types';

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  playlist: Playlist | null;
  playlists: Playlist[]; // Ajout de la propriété playlists
  currentEmotion: string;
  isDrawerOpen: boolean;
  repeat: boolean;
  shuffle: boolean;
  playTrack: (track: Track) => void;
  loadTrack: (track: any) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<void>;
  loadPlaylistById: (id: string) => Promise<void>; // Ajout de la méthode loadPlaylistById
  openDrawer: () => void;
  closeDrawer: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]); // État pour stocker les playlists

  // Use our custom hooks to manage different aspects of the music player
  const {
    currentTrack,
    isPlaying,
    volume,
    repeat,
    shuffle,
    playTrack,
    pauseTrack,
    setVolume,
    toggleRepeat,
    toggleShuffle,
    setCurrentTrack
  } = useAudioPlayer();

  const {
    playlist,
    currentEmotion,
    loadPlaylistForEmotion: loadPlaylist,
    getNextTrack,
    getPreviousTrack
  } = usePlaylistManager();

  const {
    isDrawerOpen,
    openDrawer,
    closeDrawer
  } = useDrawerState();

  // Load initial playlist and available playlists
  useEffect(() => {
    loadPlaylist('neutral');
    
    // Initialize some default playlists for demo
    const defaultPlaylists: Playlist[] = [
      {
        id: 'calm-playlist',
        name: 'Musique Calme',
        emotion: 'calm',
        tracks: []
      },
      {
        id: 'focus-playlist',
        name: 'Concentration',
        emotion: 'focused',
        tracks: []
      },
      {
        id: 'energy-playlist',
        name: 'Boost d\'Énergie',
        emotion: 'energetic',
        tracks: []
      },
      {
        id: 'relaxation-playlist',
        name: 'Relaxation Profonde',
        emotion: 'calm',
        tracks: []
      }
    ];
    
    setPlaylists(defaultPlaylists);
  }, []);

  // Handle loading of playlist and set first track
  const loadPlaylistForEmotion = async (emotion: string) => {
    const newPlaylist = await loadPlaylist(emotion);
    if (newPlaylist && newPlaylist.tracks.length > 0) {
      setCurrentTrack(newPlaylist.tracks[0]);
    }
  };
  
  // Add loadPlaylistById method
  const loadPlaylistById = async (id: string) => {
    // Trouver la playlist correspondante dans la liste des playlists
    const playlist = playlists.find(pl => pl.id === id);
    if (playlist) {
      // Charger la playlist basée sur l'émotion associée
      await loadPlaylistForEmotion(playlist.emotion || 'neutral');
    }
  };
  
  // Add loadTrack method
  const loadTrack = (track: any) => {
    setCurrentTrack(track);
  };

  // Navigation functions
  const nextTrack = () => {
    if (!currentTrack || !playlist) return;
    
    const nextTrackItem = getNextTrack(currentTrack, shuffle);
    playTrack(nextTrackItem);
  };
  
  const previousTrack = () => {
    if (!currentTrack || !playlist) return;
    
    const prevTrackItem = getPreviousTrack(currentTrack, shuffle);
    playTrack(prevTrackItem);
  };

  return (
    <MusicContext.Provider value={{
      currentTrack,
      isPlaying,
      volume,
      playlist,
      playlists, // Ajout des playlists à la valeur du contexte
      currentEmotion,
      isDrawerOpen,
      repeat,
      shuffle,
      playTrack,
      loadTrack,
      pauseTrack,
      nextTrack,
      previousTrack,
      setVolume,
      toggleRepeat,
      toggleShuffle,
      loadPlaylistForEmotion,
      loadPlaylistById, // Ajout de la méthode dans la valeur du contexte
      openDrawer,
      closeDrawer,
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
