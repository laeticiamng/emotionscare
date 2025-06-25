
// Utilitaires d'optimisation des performances avec protection d'erreurs
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
        
        if (document.head) {
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
    // Optimiser le chargement des images
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window && images.length > 0) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target instanceof HTMLImageElement) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList?.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
  } catch (error) {
    console.log('⚠️ Image optimization failed:', error);
  }
};
