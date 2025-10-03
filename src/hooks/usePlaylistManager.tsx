
import { useState, useEffect } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { mockPlaylists } from '@/data/mockMusic';

interface UsePlaylistManagerProps {
  autoLoad?: boolean;
}

export function usePlaylistManager({ autoLoad = true }: UsePlaylistManagerProps = {}) {
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load playlists on mount if autoLoad is true
  useEffect(() => {
    if (autoLoad) {
      fetchPlaylists();
    }
  }, [autoLoad]);

  // Fetch playlists from API (mocked)
  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      // Simulated API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPlaylists(mockPlaylists);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch playlists'));
      setLoading(false);
    }
  };

  // Create new playlist
  const createPlaylist = async (
    name: string,
    description?: string,
    tracks: MusicTrack[] = []
  ) => {
    setLoading(true);
    try {
      // Simulated API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const newPlaylist: MusicPlaylist = {
        id: `playlist-${Date.now()}`,
        title: name,
        name,
        description,
        tracks,
        category: 'user-created'
      };
      
      setPlaylists((prevPlaylists) => [...prevPlaylists, newPlaylist]);
      setLoading(false);
      return newPlaylist;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create playlist'));
      setLoading(false);
      throw err;
    }
  };

  // Get a playlist by ID
  const getPlaylist = (id: string) => {
    return playlists.find((playlist) => playlist.id === id) || null;
  };

  // Load playlist by ID
  const loadPlaylist = (id: string) => {
    const playlist = getPlaylist(id);
    if (playlist) {
      setCurrentPlaylist(playlist);
      return playlist;
    }
    return null;
  };

  // Add track to playlist
  const addTrackToPlaylist = (playlistId: string, track: MusicTrack) => {
    const updatedPlaylists = playlists.map((playlist) => {
      if (playlist.id === playlistId) {
        // Check if track is already in playlist
        const trackExists = playlist.tracks.some((t) => t.id === track.id);
        if (!trackExists) {
          return {
            ...playlist,
            tracks: [...playlist.tracks, track]
          };
        }
      }
      return playlist;
    });
    
    setPlaylists(updatedPlaylists);
    
    // Update current playlist if it's the one being modified
    if (currentPlaylist?.id === playlistId) {
      const updatedPlaylist = updatedPlaylists.find((p) => p.id === playlistId);
      if (updatedPlaylist) {
        setCurrentPlaylist(updatedPlaylist);
      }
    }
  };

  return {
    playlists,
    currentPlaylist,
    loading,
    error,
    fetchPlaylists,
    createPlaylist,
    getPlaylist,
    loadPlaylist,
    addTrackToPlaylist,
    setCurrentPlaylist
  };
}
