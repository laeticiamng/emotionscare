
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover?: string;
}

interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
}

interface MusicContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  playlist: Playlist | null;
  openDrawer: boolean;
  togglePlay: () => void;
  toggleDrawer: () => void;
  playTrack: (track: Track) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setPlaylist: (playlist: Playlist) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylistState] = useState<Playlist | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === playlist.tracks.length - 1) {
      // Si c'est le dernier morceau, on revient au premier
      playTrack(playlist.tracks[0]);
    } else {
      // Sinon on passe au suivant
      playTrack(playlist.tracks[currentIndex + 1]);
    }
  };

  const prevTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === 0) {
      // Si c'est le premier morceau, on va au dernier
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    } else {
      // Sinon on revient au précédent
      playTrack(playlist.tracks[currentIndex - 1]);
    }
  };

  const setPlaylist = (newPlaylist: Playlist) => {
    setPlaylistState(newPlaylist);
    if (newPlaylist.tracks.length > 0 && !currentTrack) {
      setCurrentTrack(newPlaylist.tracks[0]);
    }
  };

  const value = {
    isPlaying,
    currentTrack,
    playlist,
    openDrawer,
    togglePlay,
    toggleDrawer,
    playTrack,
    nextTrack,
    prevTrack,
    setPlaylist
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};
