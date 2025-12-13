// @ts-nocheck

import { logger } from '@/lib/logger';

/** Configuration pour le Service Worker */
export interface ServiceWorkerConfig {
  scope?: string;
  updateViaCache?: 'imports' | 'all' | 'none';
  enableBackgroundSync?: boolean;
  enablePushNotifications?: boolean;
  cacheStrategy?: 'cache-first' | 'network-first' | 'stale-while-revalidate';
}

/** État du Service Worker */
export interface ServiceWorkerState {
  isRegistered: boolean;
  isActive: boolean;
  isWaiting: boolean;
  version?: string;
  lastUpdate?: Date;
}

/** Messages envoyés au Service Worker */
export type ServiceWorkerMessage =
  | { type: 'SKIP_WAITING' }
  | { type: 'CACHE_URLS'; urls: string[] }
  | { type: 'CLEAR_CACHE'; cacheName?: string }
  | { type: 'GET_CACHE_STATUS' }
  | { type: 'SYNC_DATA'; data: unknown }
  | { type: 'PREFETCH'; urls: string[] };

/** Callbacks pour les événements du Service Worker */
export interface ServiceWorkerCallbacks {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
  onMessage?: (event: MessageEvent) => void;
  onStateChange?: (state: ServiceWorkerState) => void;
}

let currentRegistration: ServiceWorkerRegistration | null = null;
let callbacks: ServiceWorkerCallbacks = {};

/** Initialise le Service Worker avec configuration avancée */
export const initServiceWorker = async (config: ServiceWorkerConfig = {}): Promise<ServiceWorkerRegistration> => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Worker not supported');
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: config.scope || '/',
      updateViaCache: config.updateViaCache || 'none'
    });

    currentRegistration = registration;
    logger.info('Service Worker registered successfully', { scope: registration.scope }, 'SYSTEM');

    // Écouter les mises à jour
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            logger.info('New Service Worker available', undefined, 'SYSTEM');
            callbacks.onUpdate?.(registration);
          }
        });
      }
    });

    // Configurer les options avancées
    if (config.enableBackgroundSync) {
      await enableBackgroundSync(registration);
    }

    if (config.enablePushNotifications) {
      await requestPushPermission();
    }

    callbacks.onSuccess?.(registration);
    return registration;
  } catch (error) {
    logger.error('Service Worker registration failed', error as Error, 'SYSTEM');
    callbacks.onError?.(error as Error);
    throw error;
  }
};

/** Configure les callbacks d'événements */
export const setServiceWorkerCallbacks = (newCallbacks: ServiceWorkerCallbacks): void => {
  callbacks = { ...callbacks, ...newCallbacks };

  // Écouter les messages du Service Worker
  if (newCallbacks.onMessage && 'serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', newCallbacks.onMessage);
  }
};

/** Envoie un message au Service Worker */
export const sendMessageToSW = async (message: ServiceWorkerMessage): Promise<unknown> => {
  if (!currentRegistration?.active) {
    throw new Error('No active Service Worker');
  }

  return new Promise((resolve, reject) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      if (event.data.error) {
        reject(new Error(event.data.error));
      } else {
        resolve(event.data);
      }
    };
    currentRegistration!.active!.postMessage(message, [messageChannel.port2]);
  });
};

/** Force la mise à jour du Service Worker */
export const updateServiceWorker = async (): Promise<void> => {
  if (currentRegistration) {
    await currentRegistration.update();
    logger.info('Service Worker update requested', undefined, 'SYSTEM');
  }
};

/** Active le nouveau Service Worker en attente */
export const skipWaiting = async (): Promise<void> => {
  await sendMessageToSW({ type: 'SKIP_WAITING' });
};

/** Obtient l'état actuel du Service Worker */
export const getServiceWorkerState = async (): Promise<ServiceWorkerState> => {
  const registration = currentRegistration || await navigator.serviceWorker.getRegistration();

  return {
    isRegistered: !!registration,
    isActive: !!registration?.active,
    isWaiting: !!registration?.waiting,
    version: registration?.active?.scriptURL.split('?v=')[1],
    lastUpdate: registration ? new Date() : undefined
  };
};

/** Met en cache des URLs spécifiques */
export const cacheUrls = async (urls: string[]): Promise<void> => {
  await sendMessageToSW({ type: 'CACHE_URLS', urls });
  logger.info('URLs cached via Service Worker', { count: urls.length }, 'SYSTEM');
};

/** Vide le cache */
export const clearCache = async (cacheName?: string): Promise<void> => {
  await sendMessageToSW({ type: 'CLEAR_CACHE', cacheName });
  logger.info('Cache cleared', { cacheName: cacheName || 'all' }, 'SYSTEM');
};

/** Précharge des ressources */
export const prefetchResources = async (urls: string[]): Promise<void> => {
  await sendMessageToSW({ type: 'PREFETCH', urls });
};

/** Active la synchronisation en arrière-plan */
const enableBackgroundSync = async (registration: ServiceWorkerRegistration): Promise<void> => {
  if ('sync' in registration) {
    try {
      await (registration as any).sync.register('emotionscare-sync');
      logger.info('Background sync enabled', undefined, 'SYSTEM');
    } catch (error) {
      logger.warn('Background sync not available', undefined, 'SYSTEM');
    }
  }
};

/** Demande la permission pour les notifications push */
const requestPushPermission = async (): Promise<boolean> => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

/** Désenregistre le Service Worker */
export const unregisterServiceWorker = async (): Promise<boolean> => {
  if (currentRegistration) {
    const success = await currentRegistration.unregister();
    if (success) {
      currentRegistration = null;
      logger.info('Service Worker unregistered', undefined, 'SYSTEM');
    }
    return success;
  }
  return false;
};

/** Vérifie si le Service Worker est supporté */
export const isServiceWorkerSupported = (): boolean => {
  return 'serviceWorker' in navigator;
};

/** Obtient la registration actuelle */
export const getRegistration = (): ServiceWorkerRegistration | null => {
  return currentRegistration;
};
