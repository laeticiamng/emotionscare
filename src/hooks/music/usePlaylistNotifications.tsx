
import { useToast } from '@/hooks/use-toast';

export function usePlaylistNotifications() {
  const { toast } = useToast();
  
  const notifyPlaylistError = (message: string = "Unable to load the playlist") => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive"
    });
  };
  
  const notifyPlaylistLoaded = (playlistName: string) => {
    toast({
      title: "Playlist loaded",
      description: `The playlist "${playlistName}" has been loaded successfully`
    });
  };
  
  return {
    notifyPlaylistError,
    notifyPlaylistLoaded
  };
}
