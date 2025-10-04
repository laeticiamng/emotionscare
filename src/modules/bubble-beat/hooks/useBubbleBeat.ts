import { useState, useCallback, useEffect } from 'react';

interface UseBubbleBeatReturn {
  score: number;
  isPlaying: boolean;
  startGame: () => void;
  stopGame: () => void;
}

/**
 * Hook pour gérer le jeu Bubble Beat
 */
export const useBubbleBeat = (): UseBubbleBeatReturn => {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setScore(prev => prev + Math.floor(Math.random() * 10));
      }, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setScore(0);
  }, []);

  const stopGame = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return {
    score,
    isPlaying,
    startGame,
    stopGame,
  };
};
