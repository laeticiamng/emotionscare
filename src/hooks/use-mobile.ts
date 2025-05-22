
import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Fonction pour vérifier la taille de l'écran
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Considère comme mobile si la largeur est inférieure à 768px
    };
    
    // Vérifie immédiatement lors du montage du composant
    checkIfMobile();
    
    // Ajoute un écouteur d'événement pour les changements de taille de la fenêtre
    window.addEventListener('resize', checkIfMobile);
    
    // Nettoie l'écouteur d'événement lors du démontage
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return isMobile;
}
