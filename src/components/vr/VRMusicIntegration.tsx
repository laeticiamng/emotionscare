
import { useEffect, useState } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { MusicPlaylist, MusicTrack } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

export function VRMusicIntegration({ emotion }: { emotion: string }) {
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const { 
    loadPlaylistForEmotion, 
    playTrack, 
    pauseTrack, 
    nextTrack,
    previousTrack,
    toggleMute,
    isMuted,
    isPlaying,
    currentTrack,
    volume,
    setVolume
  } = useMusic();
  
  const { toast } = useToast();
  
  useEffect(() => {
    const loadMusic = async () => {
      if (emotion) {
        try {
          const newPlaylist = await loadPlaylistForEmotion?.(emotion);
          setPlaylist(newPlaylist);
          
          // Notifier l'utilisateur du chargement de la playlist
          if (newPlaylist) {
            toast({
              title: "Musique VR chargée",
              description: `Playlist "${newPlaylist.name}" chargée pour votre session VR`
            });
          }
        } catch (error) {
          console.error('Erreur lors du chargement de la musique pour VR:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger la musique pour votre session VR",
            variant: "destructive"
          });
        }
      }
    };
    
    loadMusic();
    
    // Nettoyage lors du démontage du composant
    return () => {
      pauseTrack();
    };
  }, [emotion, loadPlaylistForEmotion, pauseTrack, toast]);
  
  const playMusic = (track?: MusicTrack) => {
    if (track) {
      // S'assurer que la piste a toutes les propriétés requises
      const trackWithRequiredProps: MusicTrack = {
        ...track,
        url: track.url || track.audioUrl || track.audio_url || '',
        duration: track.duration || 0
      };
      playTrack(trackWithRequiredProps);
      
      toast({
        title: "Lecture musicale",
        description: `Lecture de "${track.title}" par ${track.artist}`
      });
    } else if (playlist?.tracks?.length) {
      const trackWithRequiredProps: MusicTrack = {
        ...playlist.tracks[0],
        url: playlist.tracks[0].url || playlist.tracks[0].audioUrl || playlist.tracks[0].audio_url || '',
        duration: playlist.tracks[0].duration || 0
      };
      playTrack(trackWithRequiredProps);
      
      toast({
        title: "Lecture musicale",
        description: `Lecture de "${playlist.tracks[0].title}" par ${playlist.tracks[0].artist}`
      });
    }
  };
  
  return {
    playlist,
    playMusic,
    pauseTrack,
    nextTrack,
    prevTrack: previousTrack,
    toggleMute,
    isMuted,
    isPlaying,
    currentTrack,
    volume,
    setVolume
  };
}
