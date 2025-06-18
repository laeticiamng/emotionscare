
import { useState, useEffect } from 'react';

interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'original';
  lazy?: boolean;
  placeholder?: string;
}

interface ImageOptimizationResult {
  src: string;
  isLoading: boolean;
  error: Error | null;
}

export const useImageOptimization = (
  originalSrc: string,
  options: ImageOptimizationOptions = {}
): ImageOptimizationResult => {
  const [optimizedSrc, setOptimizedSrc] = useState<string>(options.placeholder || '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!originalSrc) {
      setIsLoading(false);
      return;
    }

    const optimizeImage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Vérifier le support des formats modernes
        const supportsWebP = await checkWebPSupport();
        const supportsAVIF = await checkAVIFSupport();

        let finalSrc = originalSrc;

        // Appliquer le format optimal
        if (options.format === 'avif' && supportsAVIF) {
          finalSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif');
        } else if (options.format === 'webp' && supportsWebP) {
          finalSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }

        // Précharger l'image
        const img = new Image();
        img.onload = () => {
          setOptimizedSrc(finalSrc);
          setIsLoading(false);
        };
        img.onerror = () => {
          // Fallback vers l'image originale
          setOptimizedSrc(originalSrc);
          setIsLoading(false);
          setError(new Error('Failed to load optimized image'));
        };
        img.src = finalSrc;

      } catch (err) {
        setError(err as Error);
        setOptimizedSrc(originalSrc);
        setIsLoading(false);
      }
    };

    optimizeImage();
  }, [originalSrc, options.format]);

  return {
    src: optimizedSrc,
    isLoading,
    error
  };
};

// Utilitaires de détection de support
const checkWebPSupport = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webp = new Image();
    webp.onload = webp.onerror = () => resolve(webp.height === 2);
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

const checkAVIFSupport = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = avif.onerror = () => resolve(avif.height === 2);
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
};
