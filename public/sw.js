/**
 * Service Worker pour EmotionsCare GDPR Dashboard
 * Stratégies de cache offline pour métriques GDPR
 */

const CACHE_VERSION = 'emotionscare-gdpr-v1.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const GDPR_METRICS_CACHE = `${CACHE_VERSION}-gdpr-metrics`;

// Ressources statiques à cacher immédiatement
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/admin/gdpr',
  '/offline.html',
  '/manifest.json',
];

// Patterns d'URLs pour les métriques GDPR
const GDPR_API_PATTERNS = [
  /\/rest\/v1\/monitoring_metrics/,
  /\/rest\/v1\/gdpr_alerts/,
  /\/rest\/v1\/gdpr_violations/,
  /\/rest\/v1\/compliance_audits/,
  /\/rest\/v1\/consent_logs/,
];

// Durée de validité du cache (30 minutes)
const CACHE_DURATION = 30 * 60 * 1000;

/**
 * Installation du Service Worker
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  
  // Force activation immédiate
  self.skipWaiting();
});

/**
 * Activation et nettoyage des anciens caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Supprimer les anciens caches
            return cacheName.startsWith('emotionscare-') && 
                   cacheName !== STATIC_CACHE && 
                   cacheName !== DYNAMIC_CACHE &&
                   cacheName !== GDPR_METRICS_CACHE;
          })
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  
  // Prendre le contrôle immédiatement
  return self.clients.claim();
});

/**
 * Vérifie si une requête est une API GDPR
 */
function isGDPRApiRequest(url) {
  return GDPR_API_PATTERNS.some((pattern) => pattern.test(url));
}

/**
 * Vérifie si une entrée de cache est encore valide
 */
async function isCacheValid(response) {
  if (!response) return false;
  
  const cachedTime = response.headers.get('sw-cached-time');
  if (!cachedTime) return false;
  
  const age = Date.now() - parseInt(cachedTime);
  return age < CACHE_DURATION;
}

/**
 * Ajoute un timestamp au header de la réponse cachée
 */
function addCacheTimestamp(response) {
  const headers = new Headers(response.headers);
  headers.set('sw-cached-time', Date.now().toString());
  headers.set('sw-cache-version', CACHE_VERSION);
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers,
  });
}

/**
 * Stratégie Cache-First pour les métriques GDPR
 * Retourne le cache si valide, sinon fetch et met à jour
 */
async function cacheFirstStrategy(request) {
  const cache = await caches.open(GDPR_METRICS_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Vérifier la validité du cache
  if (cachedResponse && await isCacheValid(cachedResponse)) {
    console.log('[SW] Cache HIT (valid):', request.url);
    return cachedResponse;
  }
  
  console.log('[SW] Cache MISS or expired, fetching:', request.url);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cloner la réponse pour le cache
      const responseToCache = addCacheTimestamp(networkResponse.clone());
      cache.put(request, responseToCache);
      console.log('[SW] Cached new response:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Network failed, serving stale cache:', request.url);
    
    // En cas d'erreur réseau, servir le cache même expiré
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si aucun cache disponible, retourner une réponse d'erreur
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'Données non disponibles hors ligne',
        cached: false,
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Stratégie Network-First pour les ressources dynamiques
 */
async function networkFirstStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Network failed, trying cache:', request.url);
    
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

/**
 * Interception des requêtes
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;
  
  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') {
    return;
  }
  
  // Ignorer les websockets et les requêtes Chrome extensions
  if (url.startsWith('chrome-extension://') || url.includes('ws://') || url.includes('wss://')) {
    return;
  }
  
  // Stratégie pour les APIs GDPR : Cache-First
  if (isGDPRApiRequest(url)) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }
  
  // Stratégie pour les ressources statiques
  if (STATIC_ASSETS.some((asset) => url.endsWith(asset))) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request);
      })
    );
    return;
  }
  
  // Stratégie pour les autres ressources : Network-First
  event.respondWith(networkFirstStrategy(request));
});

/**
 * Synchronisation en arrière-plan
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-gdpr-metrics') {
    console.log('[SW] Background sync triggered: sync-gdpr-metrics');
    
    event.waitUntil(
      // Invalider et recharger les métriques GDPR
      caches.open(GDPR_METRICS_CACHE).then((cache) => {
        return cache.keys().then((requests) => {
          return Promise.all(
            requests.map((request) => {
              return fetch(request)
                .then((response) => {
                  if (response.ok) {
                    return cache.put(request, addCacheTimestamp(response));
                  }
                })
                .catch((error) => {
                  console.warn('[SW] Sync failed for:', request.url, error);
                });
            })
          );
        });
      })
    );
  }
});

/**
 * Messages du client
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Skip waiting requested');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[SW] Clear cache requested');
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith('emotionscare-')) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    console.log('[SW] Cache status requested');
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map(async (cacheName) => {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            return {
              name: cacheName,
              size: keys.length,
            };
          })
        ).then((cacheInfo) => {
          event.ports[0].postMessage({
            type: 'CACHE_STATUS',
            caches: cacheInfo,
            version: CACHE_VERSION,
          });
        });
      })
    );
  }
});

console.log('[SW] Service Worker script loaded', CACHE_VERSION);
