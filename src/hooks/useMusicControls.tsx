
import { useCallback } from 'react';
import { MusicTrack } from '@/types';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

export function useMusicControls() {
  const { 
    playTrack: playAudioTrack,
    pauseTrack: pauseAudioTrack,
    isPlaying,
    currentTime,
    duration,
    repeat,
    shuffle,
    loadingTrack,
    toggleRepeat,
    toggleShuffle,
    handleProgressClick,
    handleVolumeChange,
    formatTime,
    volume,
    setVolume,
    currentTrack: currentAudioTrack
  } = useAudioPlayer();
  
  // Fonctions de contrôle de lecture
  const playTrack = useCallback((track: MusicTrack) => {
    // Assurons-nous que track a toujours une propriété url
    const trackWithUrl = {
      ...track,
      url: track.url || track.audioUrl || ''
    };
    playAudioTrack(trackWithUrl);
  }, [playAudioTrack]);
  
  const pauseTrack = pauseAudioTrack;
  
  const nextTrack = useCallback((currentTrack: MusicTrack | null, currentPlaylist: MusicTrack[] | null) => {
    if (!currentTrack || !currentPlaylist || currentPlaylist.length === 0) return;
    
    const currentIndex = currentPlaylist.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === currentPlaylist.length - 1) {
      // Si dernière piste ou non trouvée, jouer la première piste
      playTrack(currentPlaylist[0]);
    } else {
      playTrack(currentPlaylist[currentIndex + 1]);
    }
  }, [playTrack]);
  
  const previousTrack = useCallback((currentTrack: MusicTrack | null, currentPlaylist: MusicTrack[] | null) => {
    if (!currentTrack || !currentPlaylist || currentPlaylist.length === 0) return;
    
    const currentIndex = currentPlaylist.findIndex(track => track.id === currentTrack.id);
    if (currentIndex <= 0) {
      // Si première piste ou non trouvée, jouer la dernière piste
      playTrack(currentPlaylist[currentPlaylist.length - 1]);
    } else {
      playTrack(currentPlaylist[currentIndex - 1]);
    }
  }, [playTrack]);

  return {
    isPlaying,
    volume,
    setVolume,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    currentTime,
    duration,
    formatTime,
    handleProgressClick,
    handleVolumeChange,
    repeat,
    toggleRepeat,
    shuffle,
    toggleShuffle,
    loadingTrack
  };
}

export default useMusicControls;
