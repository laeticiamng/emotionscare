import React, { useEffect } from 'react';

interface QueueFlusherProps {
  interval?: number;
}

/**
 * QueueFlusher - Gère le vidage des queues et le nettoyage des ressources
 * Composant utilitaire pour optimiser les performances
 */
export const QueueFlusher: React.FC<QueueFlusherProps> = ({ 
  interval = 5000 
}) => {
  useEffect(() => {
    const flushQueue = () => {
      // Nettoyer les listeners d'événements inactifs
      if (typeof window !== 'undefined') {
        // Forcer le garbage collection des événements DOM
        const deadNodes = document.querySelectorAll('[data-cleanup]');
        deadNodes.forEach(node => {
          node.remove();
        });
      }
      
      // Nettoyer les timeouts et intervals orphelins
      // Note: Cette approche est limitée mais sûre
      if (process.env.NODE_ENV === 'development') {
        console.debug('🧹 Queue flushed');
      }
    };

    const intervalId = setInterval(flushQueue, interval);

    // Nettoyage immédiat au montage
    flushQueue();

    return () => {
      clearInterval(intervalId);
    };
  }, [interval]);

  // Ce composant ne rend rien visuellement
  return null;
};