
import { useState } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

export const useMusicMutation = () => {
  const music = useMusic();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPlaylist = async (name: string, description?: string, tracks: MusicTrack[] = []) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (music.createPlaylist) {
        music.createPlaylist(name, tracks);
        
        toast({
          title: "Playlist créée",
          description: `Votre playlist "${name}" a été créée avec succès.`,
          variant: "success",
        });
        
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create playlist'));
      
      toast({
        title: "Erreur",
        description: "Impossible de créer la playlist. Veuillez réessayer.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addToPlaylist = async (trackId: string, playlistId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (music.addToPlaylist) {
        music.addToPlaylist(trackId, playlistId);
        
        toast({
          title: "Piste ajoutée",
          description: "La piste a été ajoutée à votre playlist.",
          variant: "success",
        });
        
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add track to playlist'));
      
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la piste à la playlist. Veuillez réessayer.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromPlaylist = async (trackId: string, playlistId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (music.removeFromPlaylist) {
        music.removeFromPlaylist(trackId, playlistId);
        
        toast({
          title: "Piste retirée",
          description: "La piste a été retirée de votre playlist.",
          variant: "success",
        });
        
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove track from playlist'));
      
      toast({
        title: "Erreur",
        description: "Impossible de retirer la piste de la playlist. Veuillez réessayer.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    isLoading,
    error
  };
};

export default useMusicMutation;
