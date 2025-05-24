
import { useState, useCallback } from 'react';
import { MusicPlaylist, MusicTrack } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

export const usePlaylistManager = () => {
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createPlaylist = useCallback((name: string, tracks: MusicTrack[] = []): MusicPlaylist => {
    const newPlaylist: MusicPlaylist = {
      id: `playlist-${Date.now()}`,
      name,
      tracks,
      creator: 'user',
    };

    setPlaylists(prev => [...prev, newPlaylist]);
    toast({
      title: "Playlist créée",
      description: `La playlist "${name}" a été créée avec succès`,
    });

    return newPlaylist;
  }, [toast]);

  const addTrackToPlaylist = useCallback((playlistId: string, track: MusicTrack) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, tracks: [...playlist.tracks, track] }
        : playlist
    ));

    toast({
      title: "Morceau ajouté",
      description: `"${track.title}" a été ajouté à la playlist`,
    });
  }, [toast]);

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, tracks: playlist.tracks.filter(track => track.id !== trackId) }
        : playlist
    ));

    toast({
      title: "Morceau supprimé",
      description: "Le morceau a été retiré de la playlist",
    });
  }, [toast]);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
    if (currentPlaylist?.id === playlistId) {
      setCurrentPlaylist(null);
    }

    toast({
      title: "Playlist supprimée",
      description: "La playlist a été supprimée avec succès",
    });
  }, [currentPlaylist, toast]);

  return {
    playlists,
    currentPlaylist,
    isLoading,
    setCurrentPlaylist,
    createPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    deletePlaylist,
  };
};

export default usePlaylistManager;
