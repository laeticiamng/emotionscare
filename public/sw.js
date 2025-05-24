
// Service Worker pour le support offline
const CACHE_NAME = 'emotionscare-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  // Styles critiques
  'https://rsms.me/inter/inter.css',
  // Sons essentiels
  '/sounds/click.mp3',
  '/sounds/hover.mp3'
];

// Ressources à mettre en cache dynamiquement
const CACHE_STRATEGIES = {
  // Cache first pour les assets statiques
  static: [
    /\.(js|css|png|jpg|jpeg|svg|woff2|mp3)$/,
    /\/assets\//
  ],
  // Network first pour les API calls
  networkFirst: [
    /\/api\//,
    /supabase/
  ],
  // Stale while revalidate pour les pages
  staleWhileRevalidate: [
    /\/dashboard/,
    /\/meditation/,
    /\/music/
  ]
};

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Cache installation failed:', error);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Stratégie de cache intelligente
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignore non-GET requests
  if (request.method !== 'GET') return;
  
  // Strategy selection
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request));
  } else if (isApiCall(request.url)) {
    event.respondWith(networkFirst(request));
  } else if (isPageRequest(request.url)) {
    event.respondWith(staleWhileRevalidate(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

// Cache first strategy
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network first strategy
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback pour les pages
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  return cachedResponse || fetchPromise;
}

// Helper functions
function isStaticAsset(url) {
  return CACHE_STRATEGIES.static.some(pattern => pattern.test(url));
}

function isApiCall(url) {
  return CACHE_STRATEGIES.networkFirst.some(pattern => pattern.test(url));
}

function isPageRequest(url) {
  return CACHE_STRATEGIES.staleWhileRevalidate.some(pattern => pattern.test(url));
}

// Background sync pour les actions hors ligne
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'emotion-scan-sync') {
    event.waitUntil(syncEmotionScans());
  } else if (event.tag === 'music-preference-sync') {
    event.waitUntil(syncMusicPreferences());
  }
});

// Sync des scans émotionnels en attente
async function syncEmotionScans() {
  try {
    const pendingScans = await getStoredEmotionScans();
    for (const scan of pendingScans) {
      await submitEmotionScan(scan);
    }
    await clearStoredEmotionScans();
    console.log('[SW] Emotion scans synced successfully');
  } catch (error) {
    console.error('[SW] Emotion scan sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received');
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: data.tag || 'emotionscare',
      requireInteraction: data.requireInteraction || false,
      actions: data.actions || [],
      data: data.data || {}
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Gestion des clics sur notifications
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  const data = event.notification.data;
  const url = data.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Chercher une fenêtre existante
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Ouvrir une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

