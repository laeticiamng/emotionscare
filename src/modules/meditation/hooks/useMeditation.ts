import { useState, useCallback, useEffect } from 'react';

interface UseMeditationReturn {
  isActive: boolean;
  duration: number;
  startMeditation: () => void;
  stopMeditation: () => void;
}

/**
 * Hook pour gérer les sessions de méditation
 */
export const useMeditation = (): UseMeditationReturn => {
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const startMeditation = useCallback(() => {
    setIsActive(true);
    setDuration(0);
  }, []);

  const stopMeditation = useCallback(() => {
    setIsActive(false);
  }, []);

  return {
    isActive,
    duration,
    startMeditation,
    stopMeditation,
  };
};
