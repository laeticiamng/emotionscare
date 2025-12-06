import { useState, useEffect, useCallback } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isInstalled: boolean;
  isWaitingForUpdate: boolean;
  isOffline: boolean;
  registration: ServiceWorkerRegistration | null;
}

interface ServiceWorkerActions {
  register: () => Promise<void>;
  unregister: () => Promise<void>;
  skipWaiting: () => void;
  updateCache: () => void;
  checkForUpdates: () => Promise<void>;
}

/**
 * Hook pour gérer le Service Worker avec optimisations avancées
 */
export function useServiceWorker(): ServiceWorkerState & ServiceWorkerActions {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isInstalled: false,
    isWaitingForUpdate: false,
    isOffline: !navigator.onLine,
    registration: null,
  });

  // Enregistrer le Service Worker
  const register = useCallback(async () => {
    if (!state.isSupported) {
      console.warn('Service Worker non supporté dans ce navigateur');
      return;
    }

    try {
      console.log('🔧 Enregistrement du Service Worker...');
      
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none', // Toujours vérifier les mises à jour
      });

      setState(prev => ({
        ...prev,
        isInstalled: true,
        registration,
      }));

      console.log('✅ Service Worker enregistré:', registration.scope);

      // Écouter les mises à jour
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nouvelle version disponible
              setState(prev => ({
                ...prev,
                isWaitingForUpdate: true,
              }));
              
              console.log('🔄 Nouvelle version du Service Worker disponible');
            }
          });
        }
      });

      // Vérifier s'il y a déjà un worker en attente
      if (registration.waiting) {
        setState(prev => ({
          ...prev,
          isWaitingForUpdate: true,
        }));
      }

    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement du Service Worker:', error);
    }
  }, [state.isSupported]);

  // Désinstaller le Service Worker
  const unregister = useCallback(async () => {
    if (!state.registration) return;

    try {
      const result = await state.registration.unregister();
      
      setState(prev => ({
        ...prev,
        isInstalled: false,
        registration: null,
      }));

      console.log('🗑️ Service Worker désinstallé:', result);
    } catch (error) {
      console.error('❌ Erreur lors de la désinstallation du Service Worker:', error);
    }
  }, [state.registration]);

  // Activer la nouvelle version
  const skipWaiting = useCallback(() => {
    if (!state.registration?.waiting) return;

    // Envoyer le message au Service Worker
    state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    
    setState(prev => ({
      ...prev,
      isWaitingForUpdate: false,
    }));

    console.log('⏭️ Activation de la nouvelle version du Service Worker');
  }, [state.registration]);

  // Mettre à jour le cache
  const updateCache = useCallback(() => {
    if (!state.registration) return;

    state.registration.active?.postMessage({ type: 'CACHE_UPDATE' });
    console.log('🔄 Mise à jour du cache demandée');
  }, [state.registration]);

  // Vérifier les mises à jour manuellement
  const checkForUpdates = useCallback(async () => {
    if (!state.registration) return;

    try {
      await state.registration.update();
      console.log('🔍 Vérification des mises à jour terminée');
    } catch (error) {
      console.error('❌ Erreur lors de la vérification des mises à jour:', error);
    }
  }, [state.registration]);

  // Écouter les changements de connexion
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOffline: false }));
      console.log('🌐 Connexion rétablie');
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOffline: true }));
      console.log('📡 Connexion perdue - mode hors ligne');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Écouter les messages du Service Worker
  useEffect(() => {
    if (!state.isSupported) return;

    const handleMessage = (event: MessageEvent) => {
      const { data } = event;
      
      if (data && data.type === 'SW_UPDATE_READY') {
        setState(prev => ({
          ...prev,
          isWaitingForUpdate: true,
        }));
      }
      
      if (data && data.type === 'SW_UPDATED') {
        // Recharger la page après la mise à jour
        window.location.reload();
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, [state.isSupported]);

  // Auto-registration si en production
  useEffect(() => {
    if (import.meta.env.PROD && state.isSupported && !state.isInstalled) {
      register();
    }
  }, [state.isSupported, state.isInstalled, register]);

  return {
    ...state,
    register,
    unregister,
    skipWaiting,
    updateCache,
    checkForUpdates,
  };
}

/**
 * Hook pour gérer le cache programmatiquement
 */
export function useCacheManager() {
  const [cacheSize, setCacheSize] = useState(0);
  const [cacheKeys, setCacheKeys] = useState<string[]>([]);

  const calculateCacheSize = useCallback(async () => {
    if (!('caches' in window)) return;

    try {
      const cacheNames = await caches.keys();
      let totalSize = 0;
      
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        for (const request of keys) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }
      }
      
      setCacheSize(totalSize);
      setCacheKeys(cacheNames);
      
    } catch (error) {
      console.error('Erreur lors du calcul de la taille du cache:', error);
    }
  }, []);

  const clearCache = useCallback(async (cacheName?: string) => {
    if (!('caches' in window)) return;

    try {
      if (cacheName) {
        await caches.delete(cacheName);
        console.log(`Cache "${cacheName}" supprimé`);
      } else {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        console.log('Tous les caches supprimés');
      }
      
      await calculateCacheSize();
      
    } catch (error) {
      console.error('Erreur lors de la suppression du cache:', error);
    }
  }, [calculateCacheSize]);

  const preloadResources = useCallback(async (urls: string[]) => {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open('preload-cache');
      await cache.addAll(urls);
      
      console.log(`${urls.length} ressources préchargées`);
      await calculateCacheSize();
      
    } catch (error) {
      console.error('Erreur lors du préchargement:', error);
    }
  }, [calculateCacheSize]);

  // Calculer la taille initiale
  useEffect(() => {
    calculateCacheSize();
  }, [calculateCacheSize]);

  return {
    cacheSize,
    cacheKeys,
    calculateCacheSize,
    clearCache,
    preloadResources,
    formatSize: (bytes: number) => {
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      if (bytes === 0) return '0 Bytes';
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    },
  };
}