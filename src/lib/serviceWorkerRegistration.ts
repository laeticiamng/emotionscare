/**
 * Service Worker Registration pour EmotionsCare
 * Gestion de l'installation et des mises à jour
 */

import { logger } from '@/lib/logger';
import { toast } from 'sonner';

interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onOfflineReady?: () => void;
}

/**
 * Vérifie si le SW doit être enregistré
 */
function shouldRegisterSW(): boolean {
  // Ne pas enregistrer en développement (sauf si forcé)
  if (import.meta.env.DEV && !import.meta.env.VITE_SW_DEV) {
    return false;
  }

  // Vérifier le support du Service Worker
  if (!('serviceWorker' in navigator)) {
    logger.warn('[SW] Service Workers are not supported', undefined, 'SYSTEM');
    return false;
  }

  return true;
}

/**
 * Affiche une notification de mise à jour disponible
 */
function showUpdateNotification(registration: ServiceWorkerRegistration): void {
  toast('Nouvelle version disponible', {
    description: 'Cliquez pour mettre à jour l\'application',
    duration: 10000,
    action: {
      label: 'Mettre à jour',
      onClick: () => {
        // Envoyer un message au SW pour skip waiting
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        
        // Recharger la page
        window.location.reload();
      },
    },
  });
}

/**
 * Enregistre le Service Worker
 */
export async function registerServiceWorker(
  config: ServiceWorkerConfig = {}
): Promise<ServiceWorkerRegistration | null> {
  if (!shouldRegisterSW()) {
    return null;
  }

  try {
    logger.info('[SW] Registering Service Worker...', {}, 'SYSTEM');

    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    logger.info('[SW] Service Worker registered', { scope: registration.scope }, 'SYSTEM');

    // Gérer les mises à jour
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (!newWorker) return;

      logger.info('[SW] New Service Worker found', {}, 'SYSTEM');

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // Nouvelle version disponible
            logger.info('[SW] New version available', {}, 'SYSTEM');
            showUpdateNotification(registration);
            config.onUpdate?.(registration);
          } else {
            // Première installation
            logger.info('[SW] Content cached for offline use', {}, 'SYSTEM');
            config.onOfflineReady?.();
            config.onSuccess?.(registration);
          }
        }
      });
    });

    // Vérifier les mises à jour toutes les heures
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);

    // Écouter les messages du SW
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'CACHE_STATUS') {
        logger.debug('[SW] Cache status received', event.data, 'SYSTEM');
      }
    });

    return registration;
  } catch (error) {
    logger.error('[SW] Failed to register Service Worker', error as Error, 'SYSTEM');
    return null;
  }
}

/**
 * Désinstalle le Service Worker (utile pour debug)
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    for (const registration of registrations) {
      await registration.unregister();
      logger.info('[SW] Service Worker unregistered', {}, 'SYSTEM');
    }

    return true;
  } catch (error) {
    logger.error('[SW] Failed to unregister Service Worker', error as Error, 'SYSTEM');
    return false;
  }
}

/**
 * Vérifie le statut du cache
 */
export async function getCacheStatus(): Promise<any> {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return null;
  }

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    
    messageChannel.port1.onmessage = (event) => {
      if (event.data && event.data.type === 'CACHE_STATUS') {
        resolve(event.data);
      }
    };

    const controller = navigator.serviceWorker.controller;
    if (controller) {
      controller.postMessage(
        { type: 'GET_CACHE_STATUS' },
        [messageChannel.port2]
      );
    } else {
      resolve(null);
    }

    // Timeout après 2 secondes
    setTimeout(() => resolve(null), 2000);
  });
}

/**
 * Nettoie le cache du Service Worker
 */
export async function clearServiceWorkerCache(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return false;
  }

  try {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
    logger.info('[SW] Cache cleared', {}, 'SYSTEM');
    toast.success('Cache nettoyé avec succès');
    return true;
  } catch (error) {
    logger.error('[SW] Failed to clear cache', error as Error, 'SYSTEM');
    toast.error('Échec du nettoyage du cache');
    return false;
  }
}

/**
 * Force la synchronisation des métriques GDPR
 */
export async function syncGDPRMetrics(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    if (!('sync' in registration)) {
      logger.warn('[SW] Background Sync not supported', undefined, 'SYSTEM');
      return false;
    }

    await (registration as any).sync.register('sync-gdpr-metrics');
    logger.info('[SW] GDPR metrics sync registered', {}, 'SYSTEM');
    return true;
  } catch (error) {
    logger.error('[SW] Failed to register sync', error as Error, 'SYSTEM');
    return false;
  }
}
