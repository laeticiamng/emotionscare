
import { useState, useEffect, useCallback } from 'react';

interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'original';
  lazy?: boolean;
  placeholder?: string;
}

/**
 * Hook pour l'optimisation automatique des images
 */
export const useImageOptimization = (
  src: string, 
  options: ImageOptimizationOptions = {}
) => {
  const [optimizedSrc, setOptimizedSrc] = useState<string>(options.placeholder || '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { quality = 85, format = 'webp', lazy = true } = options;

  const optimizeImage = useCallback(async (originalSrc: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Vérifier le support du format
      const canvas = document.createElement('canvas');
      const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      const supportsAvif = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;

      let finalFormat = format;
      if (format === 'webp' && !supportsWebP) finalFormat = 'original';
      if (format === 'avif' && !supportsAvif) finalFormat = 'webp';
      if (finalFormat === 'webp' && !supportsWebP) finalFormat = 'original';

      // Pour les images externes, on utilise un service d'optimisation
      if (originalSrc.startsWith('http')) {
        if (finalFormat !== 'original') {
          // Simuler l'optimisation avec un service externe
          const optimizedUrl = `${originalSrc}?format=${finalFormat}&quality=${quality}`;
          setOptimizedSrc(optimizedUrl);
        } else {
          setOptimizedSrc(originalSrc);
        }
      } else {
        setOptimizedSrc(originalSrc);
      }
    } catch (err) {
      setError('Failed to optimize image');
      setOptimizedSrc(src); // Fallback vers l'image originale
    } finally {
      setIsLoading(false);
    }
  }, [src, format, quality]);

  useEffect(() => {
    if (src) {
      if (lazy) {
        // Lazy loading avec Intersection Observer
        const img = new Image();
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                optimizeImage(src);
                observer.disconnect();
              }
            });
          },
          { threshold: 0.1 }
        );
        
        // Observer un élément temporaire
        const tempDiv = document.createElement('div');
        observer.observe(tempDiv);
        document.body.appendChild(tempDiv);
        
        return () => {
          observer.disconnect();
          document.body.removeChild(tempDiv);
        };
      } else {
        optimizeImage(src);
      }
    }
  }, [src, lazy, optimizeImage]);

  return { src: optimizedSrc, isLoading, error };
};
