
import { useState, useEffect } from 'react';

interface UseVRSessionTimerProps {
  totalDurationSeconds: number;
  isPaused: boolean;
  onComplete: () => void;
}

export function useVRSessionTimer({ 
  totalDurationSeconds,
  isPaused,
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

  // Format time remaining as mm:ss
  const formatTimeRemaining = () => {
    const remainingSeconds = Math.max(totalDurationSeconds - elapsed, 0);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const percentageComplete = Math.min((elapsed / totalDurationSeconds) * 100, 100);

  return {
    elapsed,
    percentageComplete,
    formatTimeRemaining
  };
}
