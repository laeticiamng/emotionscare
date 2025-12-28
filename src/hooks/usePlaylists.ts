/**
 * usePlaylists Hook
 * Gestion des playlists avec persistance Supabase
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import type { MusicPlaylist, MusicTrack } from '@/types/music';

interface DBPlaylist {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  tracks: MusicTrack[];
  tags: string[] | null;
  is_therapeutic: boolean;
  target_emotion: string | null;
  created_at: string;
  updated_at: string;
}

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
      if (session) loadPlaylists();
      else setPlaylists([]);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Convert DB playlist to app format
  const convertFromDB = (dbPlaylist: DBPlaylist): MusicPlaylist => ({
    id: dbPlaylist.id,
    name: dbPlaylist.name,
    description: dbPlaylist.description || undefined,
    tracks: dbPlaylist.tracks || [],
    tags: dbPlaylist.tags || [],
    isTherapeutic: dbPlaylist.is_therapeutic,
    targetEmotion: dbPlaylist.target_emotion || undefined,
    duration: (dbPlaylist.tracks || []).reduce((acc, t) => acc + (t.duration || 0), 0)
  });

  // Load playlists from DB
  const loadPlaylists = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('music_playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const converted = (data || []).map(convertFromDB);
      setPlaylists(converted);
      logger.debug('Playlists loaded', { count: converted.length }, 'MUSIC');
    } catch (error) {
      logger.error('Failed to load playlists', error as Error, 'MUSIC');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load on mount
  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  // Create playlist
  const createPlaylist = useCallback(async (name: string, description?: string): Promise<MusicPlaylist | null> => {
    if (!isAuthenticated) {
      toast.error('Connecte-toi pour créer une playlist');
      return null;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('music_playlists')
        .insert({
          user_id: user.id,
          name,
          description,
          tracks: [],
          is_therapeutic: false
        })
        .select()
        .single();

      if (error) throw error;

      const newPlaylist = convertFromDB(data);
      setPlaylists(prev => [newPlaylist, ...prev]);
      logger.info('Playlist created', { name }, 'MUSIC');
      return newPlaylist;
    } catch (error) {
      logger.error('Failed to create playlist', error as Error, 'MUSIC');
      toast.error('Erreur lors de la création');
      return null;
    }
  }, [isAuthenticated]);

  // Update playlist
  const updatePlaylist = useCallback(async (playlist: MusicPlaylist): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('music_playlists')
        .update({
          name: playlist.name,
          description: playlist.description,
          tracks: playlist.tracks,
          tags: playlist.tags,
          is_therapeutic: playlist.isTherapeutic,
          target_emotion: playlist.targetEmotion,
          updated_at: new Date().toISOString()
        })
        .eq('id', playlist.id);

      if (error) throw error;

      setPlaylists(prev => prev.map(p => p.id === playlist.id ? playlist : p));
      logger.debug('Playlist updated', { id: playlist.id }, 'MUSIC');
      return true;
    } catch (error) {
      logger.error('Failed to update playlist', error as Error, 'MUSIC');
      return false;
    }
  }, []);

  // Delete playlist
  const deletePlaylist = useCallback(async (playlistId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('music_playlists')
        .delete()
        .eq('id', playlistId);

      if (error) throw error;

      setPlaylists(prev => prev.filter(p => p.id !== playlistId));
      logger.info('Playlist deleted', { id: playlistId }, 'MUSIC');
      return true;
    } catch (error) {
      logger.error('Failed to delete playlist', error as Error, 'MUSIC');
      return false;
    }
  }, []);

  // Add track to playlist
  const addTrackToPlaylist = useCallback(async (playlistId: string, track: MusicTrack): Promise<boolean> => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return false;

    // Check duplicate
    if (playlist.tracks.some(t => t.id === track.id)) {
      toast.info('Ce morceau est déjà dans la playlist');
      return false;
    }

    const updatedPlaylist: MusicPlaylist = {
      ...playlist,
      tracks: [...playlist.tracks, track],
      duration: (playlist.duration || 0) + (track.duration || 0)
    };

    const success = await updatePlaylist(updatedPlaylist);
    if (success) {
      toast.success(`Ajouté à "${playlist.name}"`);
    }
    return success;
  }, [playlists, updatePlaylist]);

  // Remove track from playlist
  const removeTrackFromPlaylist = useCallback(async (playlistId: string, trackId: string): Promise<boolean> => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return false;

    const track = playlist.tracks.find(t => t.id === trackId);
    const updatedPlaylist: MusicPlaylist = {
      ...playlist,
      tracks: playlist.tracks.filter(t => t.id !== trackId),
      duration: (playlist.duration || 0) - (track?.duration || 0)
    };

    return await updatePlaylist(updatedPlaylist);
  }, [playlists, updatePlaylist]);

  // Reorder tracks in playlist
  const reorderTracks = useCallback(async (playlistId: string, fromIndex: number, toIndex: number): Promise<boolean> => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return false;

    const tracks = [...playlist.tracks];
    const [removed] = tracks.splice(fromIndex, 1);
    tracks.splice(toIndex, 0, removed);

    const updatedPlaylist: MusicPlaylist = { ...playlist, tracks };
    return await updatePlaylist(updatedPlaylist);
  }, [playlists, updatePlaylist]);

  // Get playlist by ID
  const getPlaylist = useCallback((playlistId: string): MusicPlaylist | undefined => {
    return playlists.find(p => p.id === playlistId);
  }, [playlists]);

  // Duplicate playlist
  const duplicatePlaylist = useCallback(async (playlistId: string): Promise<MusicPlaylist | null> => {
    const original = playlists.find(p => p.id === playlistId);
    if (!original) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('music_playlists')
        .insert({
          user_id: user.id,
          name: `${original.name} (copie)`,
          description: original.description,
          tracks: original.tracks,
          tags: original.tags,
          is_therapeutic: original.isTherapeutic,
          target_emotion: original.targetEmotion
        })
        .select()
        .single();

      if (error) throw error;

      const newPlaylist = convertFromDB(data);
      setPlaylists(prev => [newPlaylist, ...prev]);
      toast.success('Playlist dupliquée');
      return newPlaylist;
    } catch (error) {
      logger.error('Failed to duplicate playlist', error as Error, 'MUSIC');
      return null;
    }
  }, [playlists]);

  return {
    playlists,
    isLoading,
    isAuthenticated,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    reorderTracks,
    getPlaylist,
    duplicatePlaylist,
    refresh: loadPlaylists
  };
};

export default usePlaylists;
