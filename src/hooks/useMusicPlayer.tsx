
import { useState, useCallback } from 'react';
import { MusicTrack } from '@/types/music';
import useAudioPlayer from './useAudioPlayer';

export const useMusicPlayer = () => {
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    isRepeating,
    playTrack: play,
    pauseTrack,
    togglePlay: toggle,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    error
  } = useAudioPlayer();
  
  // Play a specific track
  const playTrack = useCallback((track: MusicTrack) => {
    play(track);
  }, [play]);
  
  // Add track to queue
  const addToQueue = useCallback((track: MusicTrack) => {
    setQueue(prev => [...prev, track]);
  }, []);
  
  // Replace the entire queue
  const setQueueAndPlay = useCallback((tracks: MusicTrack[], startIndex: number = 0) => {
    setQueue(tracks);
    setCurrentIndex(startIndex);
    if (tracks[startIndex]) {
      play(tracks[startIndex]);
    }
  }, [play]);
  
  // Play next track in queue
  const nextTrack = useCallback(() => {
    if (queue.length === 0 || currentIndex === -1) return;
    
    let nextIndex = currentIndex + 1;
    if (nextIndex >= queue.length) {
      nextIndex = 0; // Loop back to start
    }
    
    setCurrentIndex(nextIndex);
    play(queue[nextIndex]);
  }, [queue, currentIndex, play]);
  
  // Play previous track in queue
  const previousTrack = useCallback(() => {
    if (queue.length === 0 || currentIndex === -1) return;
    
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1; // Loop to end
    }
    
    setCurrentIndex(prevIndex);
    play(queue[prevIndex]);
  }, [queue, currentIndex, play]);
  
  // Clear the queue
  const clearQueue = useCallback(() => {
    setQueue([]);
    setCurrentIndex(-1);
    pauseTrack();
  }, [pauseTrack]);
  
  return {
    queue,
    currentIndex,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    isRepeating,
    error,
    playTrack,
    pauseTrack,
    togglePlay: toggle,
    addToQueue,
    setQueueAndPlay,
    nextTrack,
    previousTrack,
    clearQueue,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat
  };
};

export default useMusicPlayer;
