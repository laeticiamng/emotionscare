
import { useState, useEffect } from 'react';

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Vérifie si l'écran est mobile (largeur inférieure à 768px)
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Vérifier la taille initiale
    checkIfMobile();
    
    // Ajouter un écouteur pour les changements de taille d'écran
    window.addEventListener('resize', checkIfMobile);
    
    // Nettoyer l'écouteur lors du démontage du composant
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  return isMobile;
}
