import { useState, useCallback } from 'react';

interface UseNyveeReturn {
  cozyLevel: number;
  increaseCozy: () => void;
  resetCozy: () => void;
}

/**
 * Hook pour gérer le cocoon Nyvee
 */
export const useNyvee = (): UseNyveeReturn => {
  const [cozyLevel, setCozyLevel] = useState(50);

  const increaseCozy = useCallback(() => {
    setCozyLevel(prev => Math.min(prev + 10, 100));
  }, []);

  const resetCozy = useCallback(() => {
    setCozyLevel(50);
  }, []);

  return {
    cozyLevel,
    increaseCozy,
    resetCozy,
  };
};
