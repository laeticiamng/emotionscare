/**
 * Service Worker Complet - EmotionsCare Phase 4
 * Gestion offline complète + cache strategies + push notifications
 */

const CACHE_NAME = 'emotionscare-v1';
const OFFLINE_FALLBACK_PAGE = '/offline.html';
const API_CACHE_NAME = 'emotionscare-api-v1';
const IMAGE_CACHE_NAME = 'emotionscare-images-v1';
const AUDIO_CACHE_NAME = 'emotionscare-audio-v1';

// Assets à mettre en cache au moment de l'installation
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
];

/**
 * Installation du service worker
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching essential assets');
        return Promise.all([
          cache.addAll(ASSETS_TO_CACHE).catch(() => {
            console.warn('[SW] Failed to cache some assets');
          }),
        ]);
      })
      .then(() => {
        console.log('[SW] Skipping waiting, ready for immediate activation');
        return self.skipWaiting();
      })
  );
});

/**
 * Activation du service worker
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Nettoyer les anciens caches
            if (cacheName !== CACHE_NAME &&
                !cacheName.startsWith('emotionscare-')) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Claiming all clients');
        return self.clients.claim();
      })
  );
});

/**
 * Stratégies de cache
 */

// Stale-While-Revalidate: Utiliser le cache si dispo, revalider en arrière-plan
function staleWhileRevalidate(request) {
  return caches.open(API_CACHE_NAME)
    .then((cache) => {
      return cache.match(request).then((response) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        }).catch(() => {
          console.log('[SW] Network request failed, using cached response');
          return response;
        });

        return response || fetchPromise;
      });
    })
    .catch(() => {
      return new Response(
        JSON.stringify({
          error: 'Network unavailable and no cached response',
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        }
      );
    });
}

// Network-First: Essayer le réseau, fallback au cache
function networkFirst(request, cacheName = API_CACHE_NAME) {
  return fetch(request)
    .then((response) => {
      // Mettre en cache les réponses réussies
      if (response.ok) {
        return caches.open(cacheName).then((cache) => {
          cache.put(request, response.clone());
          return response;
        });
      }
      return response;
    })
    .catch(() => {
      // Fallback au cache
      return caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Using cached response for:', request.url);
            return cachedResponse;
          }

          // Si pas de cache, retourner une réponse offline
          if (request.destination === 'document') {
            return caches.match(OFFLINE_FALLBACK_PAGE);
          }

          return new Response(
            JSON.stringify({
              error: 'Offline - No cached response available',
            }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
            }
          );
        });
    });
}

// Cache-First: Utiliser le cache d'abord, fallback au réseau
function cacheFirst(request, cacheName) {
  return caches.match(request)
    .then((response) => {
      if (response) {
        return response;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            return caches.open(cacheName).then((cache) => {
              cache.put(request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback pour les images/audio
          if (request.destination === 'image') {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#ddd" width="100" height="100"/></svg>',
              {
                headers: { 'Content-Type': 'image/svg+xml' },
              }
            );
          }

          throw new Error('Network request failed');
        });
    });
}

/**
 * Gestion des requêtes fetch
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ne pas mettre en cache les requêtes non-GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignorer les APIs de signaling
  if (url.pathname.includes('/api/signin') ||
      url.pathname.includes('/api/auth') ||
      url.pathname.includes('/_next/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Stratégie par type de contenu
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/i)) {
    // Images: Cache-First
    event.respondWith(cacheFirst(request, IMAGE_CACHE_NAME));
  } else if (url.pathname.match(/\.(mp3|wav|m4a|ogg)$/i)) {
    // Audio: Cache-First
    event.respondWith(cacheFirst(request, AUDIO_CACHE_NAME));
  } else if (url.pathname.match(/\.(js|css|woff|woff2|ttf|eot|otf)$/i)) {
    // Assets statiques: Cache-First
    event.respondWith(cacheFirst(request, CACHE_NAME));
  } else if (url.origin === self.location.origin) {
    // Pages locales: Network-First
    event.respondWith(networkFirst(request));
  } else if (url.hostname.includes('supabase') ||
             url.hostname.includes('openai') ||
             url.hostname.includes('api')) {
    // APIs externes: Stale-While-Revalidate
    event.respondWith(staleWhileRevalidate(request));
  } else {
    // Par défaut: Network-First
    event.respondWith(networkFirst(request));
  }
});

/**
 * Gestion des push notifications (existant)
 */
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const options = {
    body: data.body || 'Nouvelle notification EmotionsCare',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    data: data.data || {},
    vibrate: [200, 100, 200],
    tag: data.tag || 'default',
    requireInteraction: false,
    actions: data.actions || [],
    vibrate: [100, 50, 100],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'EmotionsCare', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});

self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    self.registration.pushManager.subscribe(event.oldSubscription.options)
      .then((subscription) => {
        console.log('[SW] Subscription renewed:', subscription);
      })
  );
});

/**
 * Gestion des messages du client
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] SKIP_WAITING received, activating new SW');
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(API_CACHE_NAME)
        .then(() => caches.delete(IMAGE_CACHE_NAME))
        .then(() => caches.delete(AUDIO_CACHE_NAME))
        .then(() => {
          console.log('[SW] All caches cleared');
          event.ports[0].postMessage({ success: true });
        })
    );
  } else if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    event.waitUntil(
      Promise.all([
        caches.open(API_CACHE_NAME).then((cache) => {
          return cache.keys().then((requests) => ({
            name: API_CACHE_NAME,
            size: requests.length,
          }));
        }),
        caches.open(IMAGE_CACHE_NAME).then((cache) => {
          return cache.keys().then((requests) => ({
            name: IMAGE_CACHE_NAME,
            size: requests.length,
          }));
        }),
        caches.open(AUDIO_CACHE_NAME).then((cache) => {
          return cache.keys().then((requests) => ({
            name: AUDIO_CACHE_NAME,
            size: requests.length,
          }));
        }),
      ]).then((cacheStats) => {
        event.ports[0].postMessage({
          type: 'CACHE_STATUS',
          caches: cacheStats,
          timestamp: new Date().toISOString(),
        });
      })
    );
  }
});

/**
 * Background Sync pour les émotions et données
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);

  if (event.tag === 'sync-emotions') {
    event.waitUntil(syncEmotions());
  } else if (event.tag === 'sync-gdpr-metrics') {
    event.waitUntil(syncGDPRMetrics());
  }
});

async function syncEmotions() {
  try {
    // Récupérer les émotions en queue depuis IndexedDB
    const db = await openDB();
    const queue = await db.getAll('emotion-queue');

    if (queue.length === 0) {
      console.log('[SW] No emotions to sync');
      return;
    }

    console.log(`[SW] Syncing ${queue.length} emotions...`);

    for (const emotion of queue) {
      try {
        const response = await fetch(`/api/emotions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emotion.data),
        });

        if (response.ok) {
          await db.delete('emotion-queue', emotion.id);
          console.log(`[SW] Synced emotion ${emotion.id}`);
        }
      } catch (err) {
        console.error(`[SW] Failed to sync emotion ${emotion.id}:`, err);
      }
    }
  } catch (err) {
    console.error('[SW] Sync emotions error:', err);
    throw err;
  }
}

async function syncGDPRMetrics() {
  try {
    console.log('[SW] Syncing GDPR metrics...');
    // À implémenter selon vos besoins GDPR
  } catch (err) {
    console.error('[SW] Sync GDPR metrics error:', err);
  }
}

// Helpers pour IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EmotionsCareDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;

      // Créer les stores s'ils n'existent pas
      if (!db.objectStoreNames.contains('emotion-queue')) {
        if (request.result.version === 1) {
          db.createObjectStore('emotion-queue', { keyPath: 'id', autoIncrement: true });
        }
      }

      resolve({
        getAll(storeName) {
          return new Promise((res, rej) => {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const query = store.getAll();
            query.onerror = () => rej(query.error);
            query.onsuccess = () => res(query.result);
          });
        },
        delete(storeName, key) {
          return new Promise((res, rej) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const query = store.delete(key);
            query.onerror = () => rej(query.error);
            query.onsuccess = () => res();
          });
        },
      });
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('emotion-queue')) {
        db.createObjectStore('emotion-queue', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

console.log('[SW] Service Worker loaded - Phase 4 Offline Mode Ready');
