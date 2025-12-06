// @ts-nocheck

import { logger } from '@/lib/logger';

/**
 * Utilitaire de débogage pour l'application
 * 
 * Ce fichier contient diverses fonctions utiles pour le débogage
 */

export const checkEnvironment = () => {
  logger.info('🔍 Vérification de l\'environnement', {
    NODE_ENV: import.meta.env.NODE_ENV,
    VITE_API_URL: import.meta.env.VITE_API_URL || 'Non défini',
    BASE_URL: import.meta.env.BASE_URL,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD
  }, 'SYSTEM');
};

export const checkDOMElement = (id: string) => {
  const element = document.getElementById(id);
  logger.info(`📌 Élément #${id} existe`, { exists: !!element }, 'UI');
  if (element) {
    logger.info(`📌 Contenu de #${id}`, { content: element.innerHTML.substring(0, 100) + '...' }, 'UI');
  }
};

export const logRouterState = (router: any) => {
  try {
    logger.info('🧭 État du Router', {
      routes: router.routes,
      location: window.location.pathname
    }, 'SYSTEM');
  } catch (error) {
    logger.error('Erreur lors de l\'affichage de l\'état du router', error as Error, 'SYSTEM');
  }
};

// Ajouter cet utilitaire à window pour l'utiliser dans la console
if (typeof window !== 'undefined') {
  (window as any).__DEBUG_UTILS__ = {
    checkEnvironment,
    checkDOMElement,
    logRouterState
  };
}
