
import { useState, useEffect } from 'react';

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Vérifier au chargement
    checkMobile();
    
    // Ajouter l'écouteur pour les changements de taille
    window.addEventListener('resize', checkMobile);
    
    // Nettoyer l'écouteur
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};
