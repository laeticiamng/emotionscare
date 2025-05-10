
import { useCallback } from 'react';
import { MusicTrack } from '@/types/music';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useAudioPlayerState } from '@/hooks/audio/useAudioPlayerState';
import { UseMusicControlsReturn } from '@/types/audio-player';

export function useMusicControls(): UseMusicControlsReturn {
  const {
    playTrack: playAudioTrack,
    pauseTrack: pauseAudioTrack,
    formatTime,
    handleProgressClick,
    handleVolumeChange,
    setVolume
  } = useAudioPlayer();
  
  const {
    currentTrack: currentAudioTrack,
    isPlaying,
    currentTime,
    duration,
    repeat,
    shuffle,
    loadingTrack,
    toggleRepeat,
    toggleShuffle,
    volume
  } = useAudioPlayerState();
  
  // Track playback control functions
  const playTrack = useCallback((track: MusicTrack) => {
    // Ensure track always has url and duration properties
    const trackWithUrl = {
      ...track,
      url: track.url || track.audioUrl || '',
      duration: track.duration || 0
    };
    playAudioTrack(trackWithUrl);
  }, [playAudioTrack]);
  
  const pauseTrack = pauseAudioTrack;
  
  const nextTrack = useCallback((currentTrack: MusicTrack | null, currentPlaylist: MusicTrack[] | null) => {
    if (!currentTrack || !currentPlaylist || currentPlaylist.length === 0) return;
    
    const currentIndex = currentPlaylist.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === currentPlaylist.length - 1) {
      // If it's the last track or not found, play the first track
      playTrack(currentPlaylist[0]);
    } else {
      playTrack(currentPlaylist[currentIndex + 1]);
    }
  }, [playTrack]);
  
  const previousTrack = useCallback((currentTrack: MusicTrack | null, currentPlaylist: MusicTrack[] | null) => {
    if (!currentTrack || !currentPlaylist || currentPlaylist.length === 0) return;
    
    const currentIndex = currentPlaylist.findIndex(track => track.id === currentTrack.id);
    if (currentIndex <= 0) {
      // If it's the first track or not found, play the last track
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
