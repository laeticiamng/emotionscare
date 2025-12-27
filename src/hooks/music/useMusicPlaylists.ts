/**
 * useMusicPlaylists - Hook pour la gestion des playlists avec persistance Supabase
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MusicPlaylist, MusicTrack } from '@/types/music';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

// Fallback localStorage key
const PLAYLISTS_LOCAL_KEY = 'music:playlists';

export function useMusicPlaylists() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);

  // Charger les playlists
  const loadPlaylists = useCallback(async () => {
    setIsLoading(true);
    try {
      if (user) {
        const { data, error } = await supabase
          .from('user_settings')
          .select('value')
          .eq('user_id', user.id)
          .eq('key', PLAYLISTS_LOCAL_KEY)
          .maybeSingle();

        if (!error && data?.value) {
          const parsed = typeof data.value === 'string' 
            ? JSON.parse(data.value) 
            : data.value;
          setPlaylists(parsed as MusicPlaylist[]);
          setIsSynced(true);
          localStorage.removeItem(PLAYLISTS_LOCAL_KEY);
        } else {
          // Migration depuis localStorage
          const localData = localStorage.getItem(PLAYLISTS_LOCAL_KEY);
          if (localData) {
            const parsed = JSON.parse(localData);
            setPlaylists(parsed);
            await savePlaylists(parsed);
            localStorage.removeItem(PLAYLISTS_LOCAL_KEY);
          }
        }
      } else {
        const localData = localStorage.getItem(PLAYLISTS_LOCAL_KEY);
        if (localData) {
          setPlaylists(JSON.parse(localData));
        }
      }
    } catch (error) {
      logger.error('Failed to load playlists', error as Error, 'MUSIC');
      const localData = localStorage.getItem(PLAYLISTS_LOCAL_KEY);
      if (localData) {
        setPlaylists(JSON.parse(localData));
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  // Sauvegarder les playlists
  const savePlaylists = async (data: MusicPlaylist[]) => {
    const jsonValue = JSON.stringify(data);
    
    if (user) {
      try {
        const { error } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            key: PLAYLISTS_LOCAL_KEY,
            value: jsonValue,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,key' });

        if (!error) {
          setIsSynced(true);
          return true;
        }
        throw error;
      } catch (error) {
        logger.error('Failed to save playlists to Supabase', error as Error, 'MUSIC');
        localStorage.setItem(PLAYLISTS_LOCAL_KEY, jsonValue);
        setIsSynced(false);
        return false;
      }
    } else {
      localStorage.setItem(PLAYLISTS_LOCAL_KEY, jsonValue);
      return true;
    }
  };

  // Créer une playlist
  const createPlaylist = useCallback(async (name: string, description?: string) => {
    const newPlaylist: MusicPlaylist = {
      id: uuidv4(),
      name,
      description,
      tracks: [],
      tags: [],
      createdAt: new Date().toISOString()
    } as MusicPlaylist & { createdAt: string };

    const updated = [...playlists, newPlaylist];
    setPlaylists(updated);
    await savePlaylists(updated);

    toast({
      title: '✅ Playlist créée',
      description: `"${name}" a été créée avec succès`
    });

    return newPlaylist;
  }, [playlists, toast]);

  // Supprimer une playlist
  const deletePlaylist = useCallback(async (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    const updated = playlists.filter(p => p.id !== playlistId);
    setPlaylists(updated);
    await savePlaylists(updated);

    if (playlist) {
      toast({
        title: '🗑️ Playlist supprimée',
        description: `"${playlist.name}" a été supprimée`
      });
    }
  }, [playlists, toast]);

  // Mettre à jour une playlist
  const updatePlaylist = useCallback(async (playlist: MusicPlaylist) => {
    const updated = playlists.map(p => p.id === playlist.id ? playlist : p);
    setPlaylists(updated);
    await savePlaylists(updated);
  }, [playlists]);

  // Ajouter un track à une playlist
  const addTrackToPlaylist = useCallback(async (playlistId: string, track: MusicTrack) => {
    const updated = playlists.map(p => {
      if (p.id === playlistId) {
        // Éviter les doublons
        if (p.tracks.some(t => t.id === track.id)) {
          toast({
            title: '⚠️ Déjà présent',
            description: `"${track.title}" est déjà dans cette playlist`
          });
          return p;
        }
        return { ...p, tracks: [...p.tracks, track] };
      }
      return p;
    });
    setPlaylists(updated);
    await savePlaylists(updated);

    toast({
      title: '🎵 Ajouté',
      description: `"${track.title}" ajouté à la playlist`
    });
  }, [playlists, toast]);

  // Supprimer un track d'une playlist
  const removeTrackFromPlaylist = useCallback(async (playlistId: string, trackId: string) => {
    const updated = playlists.map(p => {
      if (p.id === playlistId) {
        return { ...p, tracks: p.tracks.filter(t => t.id !== trackId) };
      }
      return p;
    });
    setPlaylists(updated);
    await savePlaylists(updated);
  }, [playlists]);

  return {
    playlists,
    isLoading,
    isSynced,
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    refreshPlaylists: loadPlaylists
  };
}

export default useMusicPlaylists;
