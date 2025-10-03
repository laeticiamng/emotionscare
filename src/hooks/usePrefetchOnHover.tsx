import { useCallback } from 'react';

interface PrefetchOptions {
  onMouseEnter?: () => void;
  onFocus?: () => void;
}

/**
 * Hook pour précharger des ressources au survol
 * @param href - URL à précharger
 * @returns Props à ajouter à l'élément
 */
export function usePrefetchOnHover(href: string): PrefetchOptions {
  const prefetch = useCallback(() => {
    if (!href) return;
    
    // Précharger la route
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
    
    // Nettoyer après 5 secondes pour éviter l'accumulation
    setTimeout(() => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    }, 5000);
  }, [href]);

  return {
    onMouseEnter: prefetch,
    onFocus: prefetch
  };
}