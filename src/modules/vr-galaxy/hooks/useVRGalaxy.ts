import { useState, useCallback } from 'react';

interface UseVRGalaxyReturn {
  isImmersed: boolean;
  galaxyType: string;
  enterGalaxy: () => void;
  exitGalaxy: () => void;
}

/**
 * Hook pour gérer l'expérience VR Galaxy
 */
export const useVRGalaxy = (): UseVRGalaxyReturn => {
  const [isImmersed, setIsImmersed] = useState(false);
  const [galaxyType, setGalaxyType] = useState('Nebula');

  const enterGalaxy = useCallback(() => {
    setIsImmersed(true);
    const types = ['Nebula', 'Spiral', 'Elliptical', 'Irregular'];
    setGalaxyType(types[Math.floor(Math.random() * types.length)]);
  }, []);

  const exitGalaxy = useCallback(() => {
    setIsImmersed(false);
  }, []);

  return {
    isImmersed,
    galaxyType,
    enterGalaxy,
    exitGalaxy,
  };
};
