
import { useState, useCallback } from 'react';
import { MusicPlaylist, MusicTrack } from '@/types/music';

export const usePlaylistManager = () => {
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createPlaylist = useCallback(async (name: string, tracks: MusicTrack[] = []): Promise<MusicPlaylist> => {
    const playlist: MusicPlaylist = {
      id: Date.now().toString(),
      name,
      tracks,
      tags: [],
      creator: 'user'
    };

    setPlaylists(prev => [...prev, playlist]);
    return playlist;
  }, []);

  const addTrackToPlaylist = useCallback((playlistId: string, track: MusicTrack) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, tracks: [...playlist.tracks, track] }
        : playlist
    ));
  }, []);

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, tracks: playlist.tracks.filter(track => track.id !== trackId) }
        : playlist
    ));
  }, []);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
    if (currentPlaylist?.id === playlistId) {
      setCurrentPlaylist(null);
    }
  }, [currentPlaylist]);

  return {
    playlists,
    currentPlaylist,
    setCurrentPlaylist,
    createPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    deletePlaylist,
    isLoading
  };
};
