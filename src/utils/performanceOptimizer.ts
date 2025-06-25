
// Utilitaires d'optimisation des performances
export const preloadCriticalResources = () => {
  // Précharger les ressources critiques
  const criticalResources = [
    '/fonts/inter-var.woff2',
    '/sounds/click.mp3',
    '/sounds/hover.mp3'
  ];
  
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    if (resource.includes('.woff')) {
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = '';
    } else if (resource.includes('.mp3')) {
      link.as = 'audio';
    }
    link.href = resource;
    document.head.appendChild(link);
  });
};

export const optimizeImageLoading = () => {
  // Optimiser le chargement des images
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
};
