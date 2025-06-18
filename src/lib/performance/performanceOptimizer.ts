
interface OptimizationConfig {
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableCodeSplitting: boolean;
  enablePreloading: boolean;
  bundleAnalysis: boolean;
}

class PerformanceOptimizer {
  private config: OptimizationConfig;
  private observer?: IntersectionObserver;
  private criticalResources: Set<string> = new Set();

  constructor(config: Partial<OptimizationConfig> = {}) {
    this.config = {
      enableLazyLoading: true,
      enableImageOptimization: true,
      enableCodeSplitting: true,
      enablePreloading: true,
      bundleAnalysis: false,
      ...config
    };

    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') return;

    // Initialiser le lazy loading
    if (this.config.enableLazyLoading) {
      this.setupLazyLoading();
    }

    // Précharger les ressources critiques
    if (this.config.enablePreloading) {
      this.preloadCriticalResources();
    }

    // Optimiser les images automatiquement
    if (this.config.enableImageOptimization) {
      this.optimizeImages();
    }

    // Analyser les performances au chargement
    this.measurePerformance();
  }

  private setupLazyLoading(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            this.loadElement(element);
            this.observer?.unobserve(element);
          }
        });
      },
      { 
        rootMargin: '50px 0px',
        threshold: 0.1 
      }
    );
  }

  private loadElement(element: HTMLElement): void {
    // Charger une image lazy
    if (element.tagName === 'IMG') {
      const img = element as HTMLImageElement;
      const src = img.dataset.src;
      if (src) {
        img.src = src;
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-loaded');
      }
    }

    // Charger un composant lazy
    if (element.dataset.lazyComponent) {
      const componentName = element.dataset.lazyComponent;
      this.loadComponent(componentName);
    }
  }

  private async loadComponent(componentName: string): Promise<void> {
    try {
      // Mapping des composants lazy
      const componentMap: Record<string, () => Promise<any>> = {
        'music-player': () => import('@/components/music/player/SimpleMusicPlayer'),
        'coach-chat': () => import('@/components/coach/CoachChatInterface'),
        'vr-interface': () => import('@/components/vr/VRInterface'),
        'dashboard-charts': () => import('@/components/dashboard/charts')
      };

      const loader = componentMap[componentName];
      if (loader) {
        await loader();
        console.log(`✅ Lazy loaded component: ${componentName}`);
      }
    } catch (error) {
      console.error(`❌ Failed to lazy load component: ${componentName}`, error);
    }
  }

  private preloadCriticalResources(): void {
    // Précharger les polices critiques
    this.preloadFont('/fonts/inter-var.woff2');
    
    // Précharger les images hero
    this.preloadImage('/hero/hero-fallback.webp');
    
    // Préconnexion aux domaines critiques
    this.preconnectDomain('https://yaincoxihiqdksxgrsrk.supabase.co');
  }

  private preloadFont(href: string): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = href;
    document.head.appendChild(link);
  }

  private preloadImage(href: string): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = href;
    document.head.appendChild(link);
  }

  private preconnectDomain(href: string): void {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  private optimizeImages(): void {
    // Optimiser automatiquement les images existantes
    const images = document.querySelectorAll('img[data-optimize]');
    images.forEach((img) => {
      if (this.observer) {
        this.observer.observe(img);
      }
    });
  }

  private measurePerformance(): void {
    if (!window.performance) return;

    // Mesurer les métriques importantes
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const metrics = {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: this.getFirstPaint(),
        firstContentfulPaint: this.getFirstContentfulPaint()
      };

      if (import.meta.env.DEV) {
        console.table(metrics);
      }

      // Reporter les métriques si nécessaire
      this.reportMetrics(metrics);
    });
  }

  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint?.startTime || 0;
  }

  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp?.startTime || 0;
  }

  private reportMetrics(metrics: any): void {
    // En production, envoyer les métriques à un service d'analytics
    if (import.meta.env.PROD) {
      // Exemple : envoyer à Google Analytics, Sentry, etc.
      console.log('📊 Performance metrics collected:', metrics);
    }
  }

  // API publique
  observeElement(element: HTMLElement): void {
    if (this.observer) {
      this.observer.observe(element);
    }
  }

  unobserveElement(element: HTMLElement): void {
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  addCriticalResource(url: string): void {
    this.criticalResources.add(url);
  }

  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Instance globale
export const performanceOptimizer = new PerformanceOptimizer();

// Hook React pour l'optimisation
export const usePerformanceOptimization = () => {
  return {
    observeElement: performanceOptimizer.observeElement.bind(performanceOptimizer),
    unobserveElement: performanceOptimizer.unobserveElement.bind(performanceOptimizer),
    addCriticalResource: performanceOptimizer.addCriticalResource.bind(performanceOptimizer)
  };
};
