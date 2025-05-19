
import { useCallback } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { useToast } from '@/hooks/use-toast';
import { ensurePlaylist, ensureTrack } from '@/utils/musicCompatibility';

/**
 * Hook for music mutations that provides a unified interface
 * for various music state mutations across different implementations
 */
export const useMusicMutation = () => {
  const music = useMusic();
  const { toast } = useToast();
  
  // Handle playing a track
  const playTrack = useCallback((track: MusicTrack) => {
    const normalizedTrack = ensureTrack(track);
    
    try {
      if (music.playTrack) {
        music.playTrack(normalizedTrack);
      } else if (music.play) {
        music.play(normalizedTrack);
      } else {
        console.error('No play method available in music context');
      }
    } catch (error) {
      console.error('Error playing track:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de lancer la lecture du morceau',
        variant: 'destructive',
      });
    }
  }, [music, toast]);
  
  // Handle playing a playlist
  const playPlaylist = useCallback((playlist: MusicPlaylist) => {
    if (!playlist || !playlist.tracks || playlist.tracks.length === 0) {
      toast({
        title: 'Playlist vide',
        description: 'Cette playlist ne contient aucun morceau',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const normalizedPlaylist = ensurePlaylist(playlist);
      
      if (music.setPlaylist) {
        music.setPlaylist(normalizedPlaylist);
      }
      
      if (normalizedPlaylist.tracks.length > 0) {
        playTrack(normalizedPlaylist.tracks[0]);
      }
      
      // Open music drawer if available
      if (music.setOpenDrawer) {
        music.setOpenDrawer(true);
      } else if (music.toggleDrawer) {
        music.toggleDrawer();
      }
    } catch (error) {
      console.error('Error playing playlist:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de lancer la lecture de la playlist',
        variant: 'destructive',
      });
    }
  }, [music, toast, playTrack]);
  
  return {
    playTrack,
    playPlaylist,
  };
};

export default useMusicMutation;
