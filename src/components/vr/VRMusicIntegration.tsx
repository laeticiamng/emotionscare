
import { useEffect, useState } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { MusicPlaylist, MusicTrack } from '@/types';

export function VRMusicIntegration({ emotion }: { emotion: string }) {
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const musicContext = useMusic();
  
  useEffect(() => {
    const loadMusic = async () => {
      if (emotion) {
        const newPlaylist = await musicContext.loadPlaylistForEmotion(emotion);
        setPlaylist(newPlaylist);
      }
    };
    
    loadMusic();
  }, [emotion]);
  
  const playMusic = (track?: MusicTrack) => {
    if (track) {
      // Ensure track has url
      const trackWithUrl = {
        ...track,
        url: track.url || track.audioUrl || track.audio_url || ''
      };
      musicContext.playTrack(trackWithUrl);
    } else if (playlist?.tracks?.length) {
      const trackWithUrl = {
        ...playlist.tracks[0],
        url: playlist.tracks[0].url || playlist.tracks[0].audioUrl || playlist.tracks[0].audio_url || ''
      };
      musicContext.playTrack(trackWithUrl);
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
