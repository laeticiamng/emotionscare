
// Utilitaires d'optimisation des performances avec protection d'erreurs renforcée
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.log('⚠️ Window or document not available for preloading');
    return;
  }

  try {
    // Précharger les ressources critiques
    const criticalResources = [
      '/fonts/inter-var.woff2',
      '/sounds/click.mp3',
      '/sounds/hover.mp3'
    ];
    
    criticalResources.forEach(resource => {
      try {
        const link = document.createElement('link');
        if (!link) return;
        
        link.rel = 'preload';
        if (resource.includes('.woff')) {
          link.as = 'font';
          link.type = 'font/woff2';
          link.crossOrigin = '';
        } else if (resource.includes('.mp3')) {
          link.as = 'audio';
        }
        link.href = resource;
        
        if (document.head && typeof document.head.appendChild === 'function') {
          document.head.appendChild(link);
        }
      } catch (error) {
        console.log(`⚠️ Failed to preload resource ${resource}:`, error);
      }
    });
  } catch (error) {
    console.log('⚠️ Critical resources preloading failed:', error);
  }
};

export const optimizeImageLoading = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  try {
    // Optimiser le chargement des images avec vérifications renforcées
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window && images.length > 0) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target instanceof HTMLImageElement) {
            const img = entry.target;
            if (img && img.dataset && img.dataset.src) {
              img.src = img.dataset.src;
              // Vérification sécurisée pour classList
              if (img.classList && typeof img.classList.remove === 'function') {
                img.classList.remove('lazy');
              }
              imageObserver.unobserve(img);
            }
          }
        });
      });
      
      images.forEach(img => {
        if (img && typeof imageObserver.observe === 'function') {
          imageObserver.observe(img);
        }
      });
    }
  } catch (error) {
    console.log('⚠️ Image optimization failed:', error);
  }
};

// Nouvelle fonction pour mesurer les Web Vitals de manière sécurisée
export const measureWebVitals = async () => {
  if (typeof window === 'undefined' || typeof performance === 'undefined') {
    return {};
  }

  try {
    const vitals: {[key: string]: number} = {};
    
    // Performance Navigation Timing
    if (performance.timing) {
      const timing = performance.timing;
      vitals.loadTime = timing.loadEventEnd - timing.navigationStart;
      vitals.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
    }

    // Performance Observer si disponible
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          try {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.name === 'first-contentful-paint') {
                vitals.fcp = entry.startTime;
              }
              if (entry.name === 'largest-contentful-paint') {
                vitals.lcp = entry.startTime;
              }
            });
          } catch (error) {
            console.log('⚠️ Performance entries processing failed:', error);
          }
        });

        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
        
        // Nettoyer l'observer après 10 secondes
        setTimeout(() => {
          try {
            observer.disconnect();
          } catch (error) {
            console.log('⚠️ Observer disconnect failed:', error);
          }
        }, 10000);
      } catch (error) {
        console.log('⚠️ PerformanceObserver setup failed:', error);
      }
    }

    return vitals;
  } catch (error) {
    console.log('⚠️ Web Vitals measurement failed:', error);
    return {};
  }
};
