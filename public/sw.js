// Service Worker pour EmotionsCare PWA
// Gère les notifications push en arrière-plan et le cache offline

const CACHE_NAME = 'emotionscare-v3';
const OFFLINE_URL = '/offline.html';
const OFFLINE_DATA_CACHE = 'emotionscare-offline-data';

// Assets statiques à mettre en cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html'
];

// Routes disponibles hors ligne (fonctionnalités core)
const OFFLINE_ROUTES = [
  '/app/breath',
  '/app/journal'
];

// Données de respiration disponibles hors ligne
const BREATH_PATTERNS = {
  '4-7-8': { inhale: 4, hold: 7, exhale: 8, name: 'Relaxation' },
  '4-4-4-4': { inhale: 4, hold: 4, exhale: 4, holdEmpty: 4, name: 'Carré' },
  '4-6-8': { inhale: 4, hold: 6, exhale: 8, name: 'Cohérence' },
  '2-0-4': { inhale: 2, hold: 0, exhale: 4, name: 'Calmant' }
};

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v2...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Cache addAll failed (non-blocking):', err);
      });
    })
  );
  
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  
  self.clients.claim();
});

// Interception des requêtes (stratégie Network First avec fallback cache)
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') return;
  
  // Ignorer les requêtes API/Supabase/externes
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/functions/') || 
      url.hostname.includes('supabase') ||
      url.hostname.includes('api.') ||
      url.protocol !== 'https:' && url.protocol !== 'http:') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache les réponses valides
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback au cache si offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Page offline par défaut
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL).then((offline) => {
              return offline || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
            });
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let notificationData = {
    title: 'EmotionsCare',
    body: 'Nouvelle notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'emotionscare-notification',
    requireInteraction: false,
    data: {}
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      notificationData = {
        ...notificationData,
        ...payload
      };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon || '/icons/icon-192x192.png',
    badge: notificationData.badge || '/icons/icon-72x72.png',
    vibrate: notificationData.vibrate || [200, 100, 200],
    tag: notificationData.tag || 'default',
    requireInteraction: notificationData.requireInteraction || false,
    data: notificationData.data || {},
    actions: notificationData.actions || [
      { action: 'open', title: 'Ouvrir' },
      { action: 'dismiss', title: 'Fermer' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Ouvrir ou focus sur l'app
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Chercher une fenêtre existante
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            if (event.notification.data?.url) {
              client.navigate(urlToOpen);
            }
            return;
          }
        }
        // Ouvrir une nouvelle fenêtre
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});

// Gestion de la fermeture des notifications
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed');
});

// Renouvellement automatique de l'abonnement push
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[SW] Push subscription changed');
  
  event.waitUntil(
    self.registration.pushManager.subscribe(event.oldSubscription?.options || { userVisibleOnly: true })
      .then((subscription) => {
        console.log('[SW] Subscription renewed:', subscription.endpoint);
        // Envoyer la nouvelle subscription au serveur
        return fetch('/functions/v1/push-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'renew',
            subscription: subscription.toJSON()
          })
        });
      })
      .catch((err) => {
        console.error('[SW] Subscription renewal failed:', err);
      })
  );
});

// Background sync pour données offline
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-offline-data') {
    event.waitUntil(syncOfflineData());
  }
  
  if (event.tag === 'sync-journal-drafts') {
    event.waitUntil(syncJournalDrafts());
  }
  
  if (event.tag === 'sync-breath-sessions') {
    event.waitUntil(syncBreathSessions());
  }
});

async function syncOfflineData() {
  try {
    const cache = await caches.open(OFFLINE_DATA_CACHE);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const data = await response.json();
        await fetch(request.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        await cache.delete(request);
      }
    }
    console.log('[SW] Offline data synced successfully');
  } catch (error) {
    console.error('[SW] Sync failed:', error);
    throw error; // Retry later
  }
}

// Sync brouillons journal
async function syncJournalDrafts() {
  try {
    const cache = await caches.open(OFFLINE_DATA_CACHE);
    const draftResponse = await cache.match('journal-drafts');
    
    if (draftResponse) {
      const drafts = await draftResponse.json();
      
      for (const draft of drafts) {
        await fetch('/functions/v1/journal-ai-process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft)
        });
      }
      
      await cache.delete('journal-drafts');
      console.log('[SW] Journal drafts synced');
    }
  } catch (error) {
    console.error('[SW] Journal sync failed:', error);
    throw error;
  }
}

// Sync sessions respiration
async function syncBreathSessions() {
  try {
    const cache = await caches.open(OFFLINE_DATA_CACHE);
    const sessionsResponse = await cache.match('breath-sessions');
    
    if (sessionsResponse) {
      const sessions = await sessionsResponse.json();
      
      for (const session of sessions) {
        await fetch('/functions/v1/breath-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(session)
        });
      }
      
      await cache.delete('breath-sessions');
      console.log('[SW] Breath sessions synced');
    }
  } catch (error) {
    console.error('[SW] Breath sync failed:', error);
    throw error;
  }
}

// API pour sauvegarder données offline depuis l'app
async function saveOfflineData(type, data) {
  const cache = await caches.open(OFFLINE_DATA_CACHE);
  const existing = await cache.match(type);
  let items = [];
  
  if (existing) {
    items = await existing.json();
  }
  
  items.push({ ...data, savedAt: Date.now() });
  
  await cache.put(type, new Response(JSON.stringify(items)));
  console.log(`[SW] Saved offline ${type}:`, items.length, 'items');
}

// Message handler pour communication avec l'app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
  
  // Sauvegarder brouillon journal hors ligne
  if (event.data && event.data.type === 'SAVE_JOURNAL_DRAFT') {
    event.waitUntil(saveOfflineData('journal-drafts', event.data.draft));
    event.ports[0]?.postMessage({ success: true });
  }
  
  // Sauvegarder session respiration hors ligne
  if (event.data && event.data.type === 'SAVE_BREATH_SESSION') {
    event.waitUntil(saveOfflineData('breath-sessions', event.data.session));
    event.ports[0]?.postMessage({ success: true });
  }
  
  // Récupérer patterns de respiration (toujours disponible offline)
  if (event.data && event.data.type === 'GET_BREATH_PATTERNS') {
    event.ports[0]?.postMessage({ patterns: BREATH_PATTERNS });
  }
  
  // Vérifier si en mode offline
  if (event.data && event.data.type === 'CHECK_ONLINE_STATUS') {
    event.ports[0]?.postMessage({ online: navigator.onLine });
  }
});

console.log('[SW] Service Worker loaded v3 - Offline mode enabled');
