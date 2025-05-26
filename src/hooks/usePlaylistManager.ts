
import { useState } from 'react';
import { MusicPlaylist, MusicTrack } from '@/types/music';

export const usePlaylistManager = () => {
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);

  const createPlaylist = (name: string) => {
    const newPlaylist: MusicPlaylist = {
      id: Date.now().toString(),
      name,
      tracks: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  };

  const addTrackToPlaylist = (playlistId: string, track: MusicTrack) => {
    setPlaylists(prev => 
      prev.map(playlist => 
        playlist.id === playlistId 
          ? { ...playlist, tracks: [...playlist.tracks, track], updatedAt: new Date() }
          : playlist
      )
    );
  };

  return {
    playlists,
    currentPlaylist,
    setCurrentPlaylist,
    createPlaylist,
    addTrackToPlaylist
  };
};
