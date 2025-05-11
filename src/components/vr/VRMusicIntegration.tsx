
import { useEffect, useState } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { MusicPlaylist, MusicTrack } from '@/types/music';

export function VRMusicIntegration({ emotion }: { emotion: string }) {
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const musicContext = useMusic();
  
  useEffect(() => {
    const loadMusic = async () => {
      if (emotion) {
        const newPlaylist = await musicContext.loadPlaylistForEmotion?.(emotion);
        setPlaylist(newPlaylist);
      }
    };
    
    loadMusic();
  }, [emotion, musicContext]);
  
  const playMusic = (track?: MusicTrack) => {
    if (track) {
      // Make sure the track has all required properties
      const trackWithRequiredProps: MusicTrack = {
        ...track,
        url: track.url || track.audioUrl || track.audio_url || '',
        duration: track.duration || 0
      };
      musicContext.playTrack(trackWithRequiredProps);
    } else if (playlist?.tracks?.length) {
      const trackWithRequiredProps: MusicTrack = {
        ...playlist.tracks[0],
        url: playlist.tracks[0].url || playlist.tracks[0].audioUrl || playlist.tracks[0].audio_url || '',
        duration: playlist.tracks[0].duration || 0
      };
      musicContext.playTrack(trackWithRequiredProps);
    }
  };
  
  const pauseMusic = () => {
    musicContext.pauseTrack();
  };
  
  const nextTrack = () => {
    musicContext.nextTrack();
  };
  
  const prevTrack = () => {
    musicContext.previousTrack();
  };
  
  return {
    playlist,
    playMusic,
    pauseMusic,
    nextTrack,
    prevTrack,
    isPlaying: musicContext.isPlaying,
    currentTrack: musicContext.currentTrack
  };
}
