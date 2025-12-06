
interface PWAInstallPrompt {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

class PWAManager {
  private deferredPrompt: PWAInstallPrompt | null = null;
  private isInstalled = false;
  private isStandalone = false;

  constructor() {
    this.init();
  }

  private init() {
    // Détecter si l'app est déjà installée
    this.isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true;

    // Écouter l'événement beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as PWAInstallPrompt;
      this.showInstallButton();
    });

    // Écouter l'installation
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallButton();
      this.trackInstallation();
    });

    // Enregistrer le service worker
    this.registerServiceWorker();
  }

  private async registerServiceWorker() {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker enregistré:', registration);

        // Vérifier les mises à jour
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdatePrompt();
              }
            });
          }
        });
      } catch (error) {
        console.error('Erreur Service Worker:', error);
      }
    }
  }

  async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        this.trackInstallation();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur installation PWA:', error);
      return false;
    } finally {
      this.deferredPrompt = null;
    }
  }

  private showInstallButton() {
    const event = new CustomEvent('pwa-install-available');
    window.dispatchEvent(event);
  }

  private hideInstallButton() {
    const event = new CustomEvent('pwa-install-completed');
    window.dispatchEvent(event);
  }

  private showUpdatePrompt() {
    const event = new CustomEvent('pwa-update-available');
    window.dispatchEvent(event);
  }

  private trackInstallation() {
    // Analytics pour l'installation PWA
    if (typeof gtag !== 'undefined') {
      gtag('event', 'pwa_install', {
        event_category: 'engagement',
        event_label: 'app_install'
      });
    }
  }

  async updateApp(): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.update();
      }
      window.location.reload();
    }
  }

  getInstallStatus() {
    return {
      canInstall: !!this.deferredPrompt,
      isInstalled: this.isInstalled,
      isStandalone: this.isStandalone
    };
  }

  // Gestion du cache offline
  async cacheResources(urls: string[]) {
    if ('caches' in window) {
      const cache = await caches.open('emotionscare-v1');
      await cache.addAll(urls);
    }
  }

  async getCachedData(url: string) {
    if ('caches' in window) {
      const cache = await caches.open('emotionscare-v1');
      const response = await cache.match(url);
      if (response) {
        return response.json();
      }
    }
    return null;
  }
}

export const pwaManager = new PWAManager();
