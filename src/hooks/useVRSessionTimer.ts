// @ts-nocheck

import { useState, useEffect } from 'react';

interface UseVRSessionTimerProps {
  totalDurationSeconds: number;
  isPaused?: boolean;
  onComplete: () => void;
}

export function useVRSessionTimer({ 
  totalDurationSeconds,
  isPaused = false,
  onComplete
}: UseVRSessionTimerProps) {
  const [elapsed, setElapsed] = useState(0);
  
  // Auto-complete session when time is up
  useEffect(() => {
    if (elapsed >= totalDurationSeconds) {
      onComplete();
    }
  }, [elapsed, totalDurationSeconds, onComplete]);

  // Timer logic
  useEffect(() => {
    let timer: number | undefined;
    if (!isPaused && elapsed < totalDurationSeconds) {
      timer = window.setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPaused, elapsed, totalDurationSeconds]);

  // Calculate remaining time in seconds
  const timeRemaining = Math.max(totalDurationSeconds - elapsed, 0);
  
  // Calculate progress percentage (0-100)
  const progress = (elapsed / totalDurationSeconds) * 100;

  // Format time remaining as mm:ss
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Return enhanced hook with timer control functions
  return {
    elapsed,
    timeRemaining,
    percentageComplete: progress,
    progress, // For backwards compatibility
    formatTimeRemaining,
    startTimer: () => setElapsed(0),
    pauseTimer: () => {}, // Pausing is handled via the isPaused prop
    resumeTimer: () => {} // Resuming is handled via the isPaused prop
  };
}
