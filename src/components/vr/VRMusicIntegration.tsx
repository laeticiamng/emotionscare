
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
      musicContext.playTrack(track);
    } else if (playlist?.tracks?.length) {
      musicContext.playTrack(playlist.tracks[0]);
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
