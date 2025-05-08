
import { useState, useEffect, useCallback } from 'react';
import { Track, Playlist } from '@/services/music/types';
import { MusicTrack, MusicPlaylist } from '@/types';
import { 
  convertMusicTrackToTrack, 
  convertTrackToMusicTrack,
  convertMusicPlaylistToPlaylist, 
  convertPlaylistToMusicPlaylist 
} from '@/services/music/converters';
import { useToast } from '@/hooks/use-toast';
import { 
  EMOTION_PLAYLISTS, 
  getPlaylistByEmotion 
} from '@/services/music/playlist-data';

export const usePlaylistManager = () => {
  const [playlists, setPlaylists] = useState<Record<string, Playlist>>({});
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialiser les playlists au chargement du hook
  useEffect(() => {
    const convertedPlaylists: Record<string, Playlist> = {};
    
    Object.entries(EMOTION_PLAYLISTS).forEach(([emotion, musicPlaylist]) => {
      convertedPlaylists[emotion] = convertMusicPlaylistToPlaylist(musicPlaylist);
    });
    
    setPlaylists(convertedPlaylists);
  }, []);

  // Obtenir la playlist actuelle
  const getCurrentPlaylist = useCallback(() => {
    if (!currentPlaylistId || !playlists[currentPlaylistId]) return null;
    return playlists[currentPlaylistId];
  }, [currentPlaylistId, playlists]);

  // Charger une playlist pour une émotion spécifique
  const loadPlaylistForEmotion = useCallback((emotion: string) => {
    const normalizedEmotion = emotion.toLowerCase();
    
    if (playlists[normalizedEmotion]) {
      setCurrentPlaylistId(normalizedEmotion);
      return playlists[normalizedEmotion];
    } else if (playlists['neutral']) {
      // Fallback sur la playlist neutre si l'émotion n'existe pas
      setCurrentPlaylistId('neutral');
      toast({
        title: "Playlist indisponible",
        description: `La playlist pour "${emotion}" n'existe pas. Utilisation de la playlist neutre.`,
      });
      return playlists['neutral'];
    } else {
      toast({
        title: "Erreur de musique",
        description: "Impossible de charger une playlist. Veuillez réessayer.",
        variant: "destructive"
      });
      return null;
    }
  }, [playlists, toast]);

  return {
    playlists,
    setPlaylists,
    currentPlaylistId,
    setCurrentPlaylistId,
    getCurrentPlaylist,
    loadPlaylistForEmotion
  };
};

export default usePlaylistManager;
