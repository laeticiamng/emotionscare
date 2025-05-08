
import { useCallback } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types';
import { getPlaylist } from '@/services/music/playlist-service';
import { useToast } from '@/hooks/use-toast';
import { usePlaylistManager } from '@/hooks/usePlaylistManager';
import { convertPlaylistToMusicPlaylist } from '@/services/music/converters';

export function useMusicPlaylist() {
  const { toast } = useToast();
  const { 
    playlists: playlistsData, 
    getCurrentPlaylist, 
    loadPlaylistForEmotion: loadPlaylist 
  } = usePlaylistManager();
  
  // Conversion de la playlist active au format MusicPlaylist
  const currentPlaylist = getCurrentPlaylist() 
    ? convertPlaylistToMusicPlaylist(getCurrentPlaylist()!) 
    : null;

  // Conversion des playlists au format MusicPlaylist[]
  const playlists = Object.values(playlistsData).map(playlist => 
    convertPlaylistToMusicPlaylist(playlist)
  );

  // Fonction pour charger une playlist basée sur une émotion
  const loadPlaylistForEmotion = useCallback((emotion: string) => {
    const playlist = loadPlaylist(emotion);
    
    if (playlist) {
      return convertPlaylistToMusicPlaylist(playlist);
    }
    
    return null;
  }, [loadPlaylist]);

  // Fonction pour charger une playlist par ID
  const loadPlaylistById = useCallback(async (id: string) => {
    try {
      const playlist = await getPlaylist(id);
      if (playlist) {
        return convertPlaylistToMusicPlaylist(playlist);
      }
      return null;
    } catch (err) {
      console.error('Erreur lors du chargement de la playlist:', err);
      toast({
        title: "Erreur",
        description: "Impossible de charger la playlist",
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);

  return {
    currentPlaylist,
    playlists,
    loadPlaylistForEmotion,
    loadPlaylistById
  };
}

export default useMusicPlaylist;
