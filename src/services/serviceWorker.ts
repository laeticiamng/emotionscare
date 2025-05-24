
/**
 * Service Worker management for offline support
 */

export interface ServiceWorkerConfig {
  updateAvailable?: boolean;
  showUpdatePrompt?: boolean;
  offlineReady?: boolean;
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private callbacks: Set<(config: ServiceWorkerConfig) => void> = new Set();

  async register(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      this.registration = registration;
      console.log('Service Worker registered successfully');

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.notifyCallbacks({ updateAvailable: true, showUpdatePrompt: true });
            }
          });
        }
      });

      // Service worker activated
      if (registration.active) {
        this.notifyCallbacks({ offlineReady: true });
      }

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  async update(): Promise<void> {
    if (this.registration) {
      await this.registration.update();
    }
  }

  async skipWaiting(): Promise<void> {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  onStateChange(callback: (config: ServiceWorkerConfig) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  private notifyCallbacks(config: ServiceWorkerConfig): void {
    this.callbacks.forEach(callback => callback(config));
  }

  // Background sync registration
  async registerBackgroundSync(tag: string): Promise<void> {
    if (!('serviceWorker' in navigator) || !('sync' in window.ServiceWorkerRegistration.prototype)) {
      console.warn('Background Sync not supported');
      return;
    }

    try {
      await this.registration?.sync.register(tag);
      console.log(`Background sync registered: ${tag}`);
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  }

  // Store data for offline sync
  async storeForSync(key: string, data: any): Promise<void> {
    try {
      const stored = localStorage.getItem('offline-sync') || '{}';
      const syncData = JSON.parse(stored);
      
      if (!syncData[key]) {
        syncData[key] = [];
      }
      
      syncData[key].push({
        ...data,
        timestamp: Date.now(),
        id: crypto.randomUUID()
      });
      
      localStorage.setItem('offline-sync', JSON.stringify(syncData));
      
      // Register background sync
      await this.registerBackgroundSync(`${key}-sync`);
    } catch (error) {
      console.error('Failed to store data for sync:', error);
    }
  }
}

export const serviceWorkerManager = new ServiceWorkerManager();

// Initialize on app start
export const initServiceWorker = async (): Promise<void> => {
  await serviceWorkerManager.register();
};

