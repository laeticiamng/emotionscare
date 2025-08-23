// Service Worker optimisé pour EmotionsCare

const CACHE_NAME = 'emotionscare-v1';
const STATIC_CACHE_NAME = 'emotionscare-static-v1';
const DYNAMIC_CACHE_NAME = 'emotionscare-dynamic-v1';
const API_CACHE_NAME = 'emotionscare-api-v1';

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
];

// Ressources critiques
const CRITICAL_ASSETS = [
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
];

// Cache strategies par type de ressource
const CACHE_STRATEGIES = {
  // Images: Cache First avec fallback
  images: 'cacheFirst',
  // API: Network First avec cache de secours
  api: 'networkFirst',
  // Pages: Stale While Revalidate
  pages: 'staleWhileRevalidate',
  // Assets statiques: Cache First
  static: 'cacheFirst',
};

// Installation du Service Worker
self.addEventListener('install', (event: any) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache des ressources statiques
      caches.open(STATIC_CACHE_NAME).then(cache => 
        cache.addAll(STATIC_ASSETS)
      ),
      // Cache des ressources critiques
      caches.open(CACHE_NAME).then(cache => 
        cache.addAll(CRITICAL_ASSETS.filter(asset => asset))
      ),
    ]).then(() => {
      console.log('✅ Service Worker: Installation complete');
      // Forcer l'activation immédiate
      self.skipWaiting();
    })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event: any) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Nettoyer les anciens caches
      caches.keys().then(cacheNames =>
        Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName !== API_CACHE_NAME
            )
            .map(cacheName => caches.delete(cacheName))
        )
      ),
      // Prendre le contrôle de tous les clients
      self.clients.claim(),
    ]).then(() => {
      console.log('✅ Service Worker: Activation complete');
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event: any) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) return;

  // Stratégies par type de ressource
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isPageRequest(request)) {
    event.respondWith(handlePageRequest(request));
  } else {
    event.respondWith(handleStaticRequest(request));
  }
});

// Détection du type de requête
function isImageRequest(request: Request): boolean {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(request.url);
}

function isAPIRequest(request: Request): boolean {
  return request.url.includes('/api/') || 
         request.url.includes('supabase.co') ||
         request.url.includes('/functions/');
}

function isPageRequest(request: Request): boolean {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
}

// Gestionnaires de cache par stratégie

// Cache First pour les images
async function handleImageRequest(request: Request): Promise<Response> {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }

    const response = await fetch(request);
    
    if (response.ok) {
      // Mise en cache uniquement si la réponse est valide
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Fallback vers une image par défaut
    return new Response(
      '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" fill="#6b7280">Image non disponible</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Network First pour les API
async function handleAPIRequest(request: Request): Promise<Response> {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Fallback vers le cache
    const cache = await caches.open(API_CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Réponse d'erreur structurée
    return new Response(
      JSON.stringify({ 
        error: 'Network unavailable', 
        offline: true,
        timestamp: Date.now()
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Stale While Revalidate pour les pages
async function handlePageRequest(request: Request): Promise<Response> {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cached = await cache.match(request);
  
  // Répondre immédiatement avec le cache si disponible
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached || createOfflinePage());
  
  return cached || fetchPromise;
}

// Cache First pour les ressources statiques
async function handleStaticRequest(request: Request): Promise<Response> {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Fallback générique
    return new Response('Resource not available offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Page hors ligne
function createOfflinePage(): Response {
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>EmotionsCare - Hors ligne</title>
      <style>
        body { 
          font-family: system-ui, sans-serif; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          min-height: 100vh; 
          margin: 0; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
        }
        .container { max-width: 400px; padding: 2rem; }
        .icon { font-size: 4rem; margin-bottom: 1rem; }
        h1 { margin-bottom: 1rem; }
        p { opacity: 0.8; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">🌙</div>
        <h1>Mode Hors Ligne</h1>
        <p>Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent être limitées.</p>
        <p>Reconnectez-vous pour accéder à toutes les fonctionnalités d'EmotionsCare.</p>
      </div>
    </body>
    </html>
  `;
  
  return new Response(offlineHTML, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Synchronisation en arrière-plan
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Synchroniser les données hors ligne
    console.log('🔄 Background sync triggered');
    
    // Ici vous pourriez synchroniser les données utilisateur,
    // envoyer les analytics en attente, etc.
    
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Gestion des mises à jour de cache
self.addEventListener('message', (event: any) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    updateCache();
  }
});

async function updateCache() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  
  // Réinstaller le cache
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(STATIC_ASSETS);
  
  console.log('✅ Cache updated');
}

export {};