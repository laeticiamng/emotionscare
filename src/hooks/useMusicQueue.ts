/**
 * useMusic Queue Hook - Gestion de la queue de lecture
 * Drag-and-drop, shuffle, repeat modes
 */

import { useState, useCallback, useEffect } from 'react';

interface QueueTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  mood: string;
  color: string;
}

export const useMusicQueue = (initialTracks: QueueTrack[] = []) => {
  const [queue, setQueue] = useState<QueueTrack[]>(initialTracks);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [shuffleMode, setShuffleMode] = useState(false);
  const [originalQueue, setOriginalQueue] = useState<QueueTrack[]>(initialTracks);

  // Initialize queue
  useEffect(() => {
    setQueue(initialTracks);
    setOriginalQueue(initialTracks);
  }, [initialTracks]);

  // Get current track
  const currentTrack = queue[currentIndex] || null;

  // Add track to queue
  const addTrack = useCallback((track: QueueTrack, position?: number) => {
    setQueue((prev) => {
      const newQueue = [...prev];
      if (position !== undefined && position >= 0) {
        newQueue.splice(position, 0, track);
      } else {
        newQueue.push(track);
      }
      return newQueue;
    });
  }, []);

  // Remove track from queue
  const removeTrack = useCallback((trackId: string) => {
    setQueue((prev) => {
      const newQueue = prev.filter((t) => t.id !== trackId);
      if (currentIndex >= newQueue.length && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
      return newQueue;
    });
  }, [currentIndex]);

  // Reorder queue (for drag-and-drop)
  const reorderQueue = useCallback((newOrder: QueueTrack[]) => {
    setQueue(newOrder);
    if (shuffleMode) {
      setOriginalQueue(newOrder);
    }
  }, [shuffleMode]);

  // Play next track
  const playNext = useCallback(() => {
    if (queue.length === 0) return;

    let nextIndex = currentIndex + 1;

    if (nextIndex >= queue.length) {
      if (repeatMode === 'off') {
        return; // Stop at end
      } else if (repeatMode === 'all') {
        nextIndex = 0; // Loop to beginning
      } else if (repeatMode === 'one') {
        return; // Stay on current track
      }
    }

    setCurrentIndex(nextIndex);
  }, [currentIndex, queue.length, repeatMode]);

  // Play previous track
  const playPrevious = useCallback(() => {
    let prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      prevIndex = queue.length - 1; // Loop to end
    }

    setCurrentIndex(prevIndex);
  }, [currentIndex, queue.length]);

  // Jump to specific track
  const jumpToTrack = useCallback((trackId: string) => {
    const index = queue.findIndex((t) => t.id === trackId);
    if (index >= 0) {
      setCurrentIndex(index);
    }
  }, [queue]);

  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    if (!shuffleMode) {
      // Enable shuffle
      const shuffled = [...queue].sort(() => Math.random() - 0.5);
      setOriginalQueue(queue);
      setQueue(shuffled);
      setShuffleMode(true);
    } else {
      // Disable shuffle - restore original order
      setQueue(originalQueue);
      setShuffleMode(false);
    }
  }, [shuffleMode, queue, originalQueue]);

  // Toggle repeat mode
  const toggleRepeatMode = useCallback(() => {
    const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
    const currentModeIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  }, [repeatMode]);

  // Clear queue
  const clearQueue = useCallback(() => {
    setQueue([]);
    setCurrentIndex(0);
  }, []);

  // Load playlist
  const loadPlaylist = useCallback((tracks: QueueTrack[]) => {
    setQueue(tracks);
    setOriginalQueue(tracks);
    setCurrentIndex(0);
    setShuffleMode(false);
  }, []);

  // Get queue info
  const getQueueInfo = useCallback(() => {
    const totalDuration = queue.reduce((acc, t) => acc + t.duration, 0);
    const totalMinutes = Math.floor(totalDuration / 60);
    const totalHours = Math.floor(totalMinutes / 60);

    return {
      length: queue.length,
      currentIndex,
      totalDuration,
      totalMinutes,
      totalHours,
      shuffleMode,
      repeatMode,
    };
  }, [queue, currentIndex, shuffleMode, repeatMode]);

  return {
    // State
    queue,
    currentTrack,
    currentIndex,
    repeatMode,
    shuffleMode,

    // Actions
    addTrack,
    removeTrack,
    reorderQueue,
    playNext,
    playPrevious,
    jumpToTrack,
    toggleShuffle,
    toggleRepeatMode,
    clearQueue,
    loadPlaylist,
    setCurrentIndex,

    // Info
    getQueueInfo,
  };
};

export default useMusicQueue;
