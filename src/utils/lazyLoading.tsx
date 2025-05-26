
/**
 * Utilitaires pour le lazy loading et l'optimisation des performances
 */

import { lazy, ComponentType } from 'react';

/**
 * Créer un composant lazy avec gestion d'erreur
 */
export function createLazyComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  fallback?: ComponentType
): T {
  const LazyComponent = lazy(factory);
  
  // Wrapper avec gestion d'erreur intégrée
  return lazy(async () => {
    try {
      const component = await factory();
      return component;
    } catch (error) {
      console.error('Error loading lazy component:', error);
      
      // Fallback component si fourni
      if (fallback) {
        return { default: fallback };
      }
      
      // Composant d'erreur par défaut
      const ErrorComponent: ComponentType = () => (
        <div className="p-4 text-center text-red-600">
          <p>Erreur lors du chargement du composant</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-100 rounded hover:bg-red-200"
          >
            Recharger
          </button>
        </div>
      );
      
      return { default: ErrorComponent };
    }
  }) as T;
}

/**
 * Précharger un composant lazy
 */
export function preloadComponent(factory: () => Promise<any>): void {
  const componentImport = factory();
  
  // Ignorer les erreurs de préchargement
  componentImport.catch(() => {});
}

/**
 * Hook pour précharger au hover
 */
export function usePreloadOnHover(factory: () => Promise<any>) {
  return {
    onMouseEnter: () => preloadComponent(factory),
    onFocus: () => preloadComponent(factory)
  };
}

/**
 * Intersection Observer pour lazy loading des images
 */
export class LazyImageLoader {
  private observer: IntersectionObserver;
  private loadedImages = new Set<string>();

  constructor(options: IntersectionObserverInit = {}) {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options
      }
    );
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        this.loadImage(img);
        this.observer.unobserve(img);
      }
    });
  }

  private loadImage(img: HTMLImageElement) {
    const src = img.dataset.src;
    if (!src || this.loadedImages.has(src)) return;

    img.src = src;
    img.classList.remove('lazy');
    img.classList.add('loaded');
    this.loadedImages.add(src);

    // Animation fade-in
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s';
    
    img.onload = () => {
      img.style.opacity = '1';
    };
  }

  observe(element: HTMLElement) {
    this.observer.observe(element);
  }

  unobserve(element: HTMLElement) {
    this.observer.unobserve(element);
  }

  disconnect() {
    this.observer.disconnect();
  }
}

/**
 * Instance globale du lazy loader
 */
export const lazyImageLoader = new LazyImageLoader();

/**
 * Hook React pour lazy loading des images
 */
export function useLazyImage() {
  return {
    ref: (node: HTMLImageElement | null) => {
      if (node) {
        lazyImageLoader.observe(node);
      }
    },
    loading: "lazy" as const,
    className: "lazy opacity-0 transition-opacity duration-300"
  };
}

/**
 * Utilitaire pour créer des chunks optimisés
 */
export const LazyComponents = {
  // Pages principales
  Dashboard: createLazyComponent(() => import('@/pages/b2c/DashboardPage')),
  LoginPage: createLazyComponent(() => import('@/pages/b2c/LoginPage')),
  
  // Modules métier
  MusicPlayer: createLazyComponent(() => import('@/components/music/player/SimpleMusicPlayer')),
  CoachChat: createLazyComponent(() => import('@/components/coach/CoachChatInterface')),
  
  // Outils de développement
  DevTools: createLazyComponent(() => import('@/components/debug/DevTools')),
  PerformanceMonitor: createLazyComponent(() => import('@/components/monitoring/PerformanceMonitor'))
};

/**
 * Configuration du prefetching intelligent
 */
export function setupIntelligentPrefetching() {
  // Précharger les composants critiques après l'idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      preloadComponent(() => import('@/pages/b2c/DashboardPage'));
      preloadComponent(() => import('@/components/music/player/SimpleMusicPlayer'));
    });
  } else {
    // Fallback pour les navigateurs non supportés
    setTimeout(() => {
      preloadComponent(() => import('@/pages/b2c/DashboardPage'));
    }, 2000);
  }
}
