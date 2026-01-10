/**
 * usePlaylistManager Hook
 * Gestion complète des playlists avec persistance Supabase
 */

import { useState, useCallback, useEffect } from 'react';
import { MusicPlaylist, MusicTrack } from '@/types/music';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

const STORAGE_KEY = 'emotionscare_playlists';

export const usePlaylistManager = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load playlists on mount
  useEffect(() => {
    const loadPlaylists = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // Load from Supabase if logged in
          const { data, error } = await supabase
            .from('music_playlists')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (!error && data) {
            const loadedPlaylists: MusicPlaylist[] = data.map(p => ({
              id: p.id,
              name: p.name,
              tracks: (p.tracks as unknown as MusicTrack[]) || [],
              tags: (p.tags as string[]) || [],
              creator: p.creator_name || 'user',
              description: p.description,
              mood: p.mood,
              isPublic: p.is_public
            }));
            setPlaylists(loadedPlaylists);
          }
        } else {
          // Load from localStorage for anonymous users
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            setPlaylists(JSON.parse(stored));
          }
        }
      } catch (error) {
        logger.error('Failed to load playlists', error as Error, 'MUSIC');
      } finally {
        setIsLoading(false);
      }
    };

    loadPlaylists();
  }, [user]);

  // Persist to localStorage for anonymous users
  const persistLocally = useCallback((updatedPlaylists: MusicPlaylist[]) => {
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlaylists));
    }
  }, [user]);

  const createPlaylist = useCallback(async (name: string, tracks: MusicTrack[] = []): Promise<MusicPlaylist> => {
    setIsLoading(true);
    try {
      const playlist: MusicPlaylist = {
        id: crypto.randomUUID(),
        name,
        tracks,
        tags: [],
        creator: user?.email || 'user'
      };

      if (user) {
        // Save to Supabase
        const { data, error } = await supabase
          .from('music_playlists')
          .insert({
            id: playlist.id,
            user_id: user.id,
            name: playlist.name,
            tracks: tracks as unknown as Record<string, unknown>[],
            tags: [],
            creator_name: user.email || 'user',
            is_public: false
          })
          .select()
          .single();

        if (error) throw error;
        playlist.id = data.id;
      }

      setPlaylists(prev => {
        const updated = [...prev, playlist];
        persistLocally(updated);
        return updated;
      });

      return playlist;
    } finally {
      setIsLoading(false);
    }
  }, [user, persistLocally]);

  const addTrackToPlaylist = useCallback(async (playlistId: string, track: MusicTrack) => {
    setPlaylists(prev => {
      const updated = prev.map(playlist => 
        playlist.id === playlistId 
          ? { ...playlist, tracks: [...playlist.tracks, track] }
          : playlist
      );
      persistLocally(updated);
      return updated;
    });

    // Sync with Supabase
    if (user) {
      const playlist = playlists.find(p => p.id === playlistId);
      if (playlist) {
        const updatedTracks = [...playlist.tracks, track];
        await supabase
          .from('music_playlists')
          .update({ tracks: updatedTracks as unknown as Record<string, unknown>[] })
          .eq('id', playlistId);
      }
    }
  }, [user, playlists, persistLocally]);

  const removeTrackFromPlaylist = useCallback(async (playlistId: string, trackId: string) => {
    setPlaylists(prev => {
      const updated = prev.map(playlist => 
        playlist.id === playlistId 
          ? { ...playlist, tracks: playlist.tracks.filter(track => track.id !== trackId) }
          : playlist
      );
      persistLocally(updated);
      return updated;
    });

    // Sync with Supabase
    if (user) {
      const playlist = playlists.find(p => p.id === playlistId);
      if (playlist) {
        const updatedTracks = playlist.tracks.filter(t => t.id !== trackId);
        await supabase
          .from('music_playlists')
          .update({ tracks: updatedTracks as unknown as Record<string, unknown>[] })
          .eq('id', playlistId);
      }
    }
  }, [user, playlists, persistLocally]);

  const deletePlaylist = useCallback(async (playlistId: string) => {
    setPlaylists(prev => {
      const updated = prev.filter(playlist => playlist.id !== playlistId);
      persistLocally(updated);
      return updated;
    });

    if (currentPlaylist?.id === playlistId) {
      setCurrentPlaylist(null);
    }

    // Delete from Supabase
    if (user) {
      await supabase
        .from('music_playlists')
        .delete()
        .eq('id', playlistId);
    }
  }, [currentPlaylist, user, persistLocally]);

  const updatePlaylist = useCallback(async (playlistId: string, updates: Partial<MusicPlaylist>) => {
    setPlaylists(prev => {
      const updated = prev.map(playlist => 
        playlist.id === playlistId 
          ? { ...playlist, ...updates }
          : playlist
      );
      persistLocally(updated);
      return updated;
    });

    // Sync with Supabase
    if (user) {
      await supabase
        .from('music_playlists')
        .update({
          name: updates.name,
          description: updates.description,
          mood: updates.mood,
          tags: updates.tags,
          is_public: updates.isPublic
        })
        .eq('id', playlistId);
    }
  }, [user, persistLocally]);

  return {
    playlists,
    currentPlaylist,
    setCurrentPlaylist,
    createPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    deletePlaylist,
    updatePlaylist,
    isLoading
  };
};
