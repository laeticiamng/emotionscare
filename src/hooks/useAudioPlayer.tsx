
import { ChangeEvent } from 'react';
import { MusicTrack } from '@/types/music';
import { useAudioPlayerCore } from './audio/useAudioPlayerCore';
import { formatTime } from './audio/audioPlayerUtils';

/**
 * Centralized hook for managing audio playback throughout the application
 */
export function useAudioPlayer() {
  // Use our core implementation
  const audioPlayer = useAudioPlayerCore();
  
  // Add adapter for volume change handler
  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    audioPlayer.setVolume(newVolume);
  };
  
  // Return the public API interface
  return {
    // State
    currentTrack: audioPlayer.currentTrack,
    isPlaying: audioPlayer.isPlaying,
    volume: audioPlayer.volume,
    repeat: audioPlayer.repeat,
    shuffle: audioPlayer.shuffle,
    progress: audioPlayer.progress,
    duration: audioPlayer.duration,
    loading: audioPlayer.loading,
    error: audioPlayer.error,
    currentTime: audioPlayer.currentTime,
    loadingTrack: audioPlayer.loadingTrack,
    
    // Track operations
    playTrack: audioPlayer.playTrack,
    pauseTrack: audioPlayer.pauseTrack,
    resumeTrack: audioPlayer.resumeTrack,
    nextTrack: audioPlayer.nextTrack,
    previousTrack: audioPlayer.previousTrack,
    
    // Player controls
    seekTo: audioPlayer.seekTo,
    setVolume: audioPlayer.setVolume,
    setCurrentTrack: audioPlayer.setCurrentTrack,
    formatTime,
    handleProgressClick: audioPlayer.handleProgressClick,
    handleVolumeChange,
    toggleRepeat: audioPlayer.toggleRepeat,
    toggleShuffle: audioPlayer.toggleShuffle
  };
}

export default useAudioPlayer;
