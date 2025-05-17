
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    
    // Mettre à jour l'état initialement
    setMatches(media.matches);

    // Créer un gestionnaire de callback pour mettre à jour l'état
    const listener = () => setMatches(media.matches);
    
    // Écouter les changements de media query
    // Utiliser la nouvelle API addEventListener si disponible, sinon utiliser addListener
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      // Pour la compatibilité avec les anciens navigateurs
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [query]);

  return matches;
}

// Export pour compatibilité
export default useMediaQuery;
