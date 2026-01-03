/**
 * Service Worker - EmotionsCare Music Offline
 * Gère le cache des pistes audio pour le mode hors-ligne
 */

const CACHE_NAME = 'emotionscare-music-offline-v1';
const AUDIO_CACHE_NAME = 'emotionscare-audio-v1';

// Assets statiques à mettre en cache
const STATIC_ASSETS = [
  '/app/music',
  '/favicon.ico',
];

// Installation
self.addEventListener('install', (event) => {
  console.log('[SW Music] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activation
self.addEventListener('activate', (event) => {
  console.log('[SW Music] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('emotionscare-') && name !== CACHE_NAME && name !== AUDIO_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch interceptor
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle audio requests
  if (isAudioRequest(event.request)) {
    event.respondWith(handleAudioRequest(event.request));
    return;
  }

  // Handle other requests with network-first strategy
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});

// Check if request is for audio
function isAudioRequest(request) {
  const url = new URL(request.url);
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac'];
  const audioHosts = ['cdn.sunoapi.org', 'cdn1.suno.ai', 'audiopipe.suno.ai'];
  
  return (
    audioExtensions.some(ext => url.pathname.endsWith(ext)) ||
    audioHosts.some(host => url.hostname.includes(host)) ||
    request.headers.get('Accept')?.includes('audio/')
  );
}

// Handle audio requests with cache-first strategy
async function handleAudioRequest(request) {
  const cache = await caches.open(AUDIO_CACHE_NAME);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    console.log('[SW Music] Serving from cache:', request.url);
    return cachedResponse;
  }
  
  // If offline, return error
  if (!navigator.onLine) {
    return new Response('Audio not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
  
  // Fetch from network
  try {
    const networkResponse = await fetch(request);
    
    // Only cache successful responses
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW Music] Fetch failed:', error);
    return new Response('Audio fetch failed', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Message handler for cache operations
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};
  
  switch (type) {
    case 'CACHE_AUDIO':
      cacheAudio(payload.url, payload.trackId)
        .then(() => event.ports[0]?.postMessage({ success: true }))
        .catch((err) => event.ports[0]?.postMessage({ success: false, error: err.message }));
      break;
      
    case 'REMOVE_CACHED_AUDIO':
      removeCachedAudio(payload.url)
        .then(() => event.ports[0]?.postMessage({ success: true }))
        .catch((err) => event.ports[0]?.postMessage({ success: false, error: err.message }));
      break;
      
    case 'GET_CACHE_SIZE':
      getCacheSize()
        .then((size) => event.ports[0]?.postMessage({ success: true, size }))
        .catch((err) => event.ports[0]?.postMessage({ success: false, error: err.message }));
      break;
      
    case 'CLEAR_AUDIO_CACHE':
      caches.delete(AUDIO_CACHE_NAME)
        .then(() => event.ports[0]?.postMessage({ success: true }))
        .catch((err) => event.ports[0]?.postMessage({ success: false, error: err.message }));
      break;
  }
});

// Cache audio file
async function cacheAudio(url, trackId) {
  const cache = await caches.open(AUDIO_CACHE_NAME);
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch audio');
  }
  
  // Add metadata headers
  const headers = new Headers(response.headers);
  headers.set('X-Track-Id', trackId);
  headers.set('X-Cached-At', new Date().toISOString());
  
  const blob = await response.blob();
  const cachedResponse = new Response(blob, { headers });
  
  await cache.put(url, cachedResponse);
  console.log('[SW Music] Cached audio:', trackId);
}

// Remove cached audio
async function removeCachedAudio(url) {
  const cache = await caches.open(AUDIO_CACHE_NAME);
  await cache.delete(url);
  console.log('[SW Music] Removed from cache:', url);
}

// Get total cache size
async function getCacheSize() {
  const cache = await caches.open(AUDIO_CACHE_NAME);
  const keys = await cache.keys();
  
  let totalSize = 0;
  for (const request of keys) {
    const response = await cache.match(request);
    if (response) {
      const blob = await response.blob();
      totalSize += blob.size;
    }
  }
  
  return totalSize;
}

console.log('[SW Music] Service Worker loaded');
