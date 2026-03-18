import { useState, useEffect } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

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

  // Fetch playlists from Supabase
  const fetchPlaylists = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPlaylists([]);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('music_playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(`Failed to fetch playlists: ${fetchError.message}`);
      }

      setPlaylists(data || []);
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Failed to fetch playlists');
      logger.error('Playlist fetch failed', e, 'MUSIC');
      setError(e);
    } finally {
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
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error: insertError } = await supabase
        .from('music_playlists')
        .insert({
          user_id: user.id,
          name,
          description,
          tracks: JSON.stringify(tracks),
        })
        .select('*')
        .single();

      if (insertError) {
        throw new Error(`Failed to create playlist: ${insertError.message}`);
      }

      const newPlaylist: MusicPlaylist = {
        id: data.id,
        title: name,
        name,
        description,
        tracks,
        category: 'user-created'
      };

      setPlaylists((prevPlaylists) => [newPlaylist, ...prevPlaylists]);
      return newPlaylist;
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Failed to create playlist');
      logger.error('Playlist creation failed', e, 'MUSIC');
      setError(e);
      throw e;
    } finally {
      setLoading(false);
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
