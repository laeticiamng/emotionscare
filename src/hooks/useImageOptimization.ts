
import { useState, useEffect, useCallback } from 'react';

interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  lazy?: boolean;
  preload?: boolean;
}

export const useImageOptimization = () => {
  const [supportsWebP, setSupportsWebP] = useState(false);
  const [supportsAVIF, setSupportsAVIF] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'fast'>('fast');

  useEffect(() => {
    // Détection du support WebP
    const webpTest = new Image();
    webpTest.onload = webpTest.onerror = () => {
      setSupportsWebP(webpTest.height === 2);
    };
    webpTest.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';

    // Détection du support AVIF
    const avifTest = new Image();
    avifTest.onload = avifTest.onerror = () => {
      setSupportsAVIF(avifTest.height === 2);
    };
    avifTest.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';

    // Détection de la vitesse de connexion
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const speed = connection.effectiveType;
      setConnectionSpeed(['slow-2g', '2g', '3g'].includes(speed) ? 'slow' : 'fast');
    }
  }, []);

  const optimizeImageUrl = useCallback((src: string, options: ImageOptimizationOptions = {}) => {
    const { quality = connectionSpeed === 'slow' ? 70 : 85, format = 'auto' } = options;
    
    // Si c'est déjà un data URL ou une URL externe, retourner tel quel
    if (src.startsWith('data:') || src.startsWith('http')) {
      return src;
    }

    // Déterminer le meilleur format
    let bestFormat = 'jpg';
    if (format === 'auto') {
      if (supportsAVIF) bestFormat = 'avif';
      else if (supportsWebP) bestFormat = 'webp';
    } else if (format === 'webp' && supportsWebP) {
      bestFormat = 'webp';
    } else if (format === 'avif' && supportsAVIF) {
      bestFormat = 'avif';
    }

    // Ajouter les paramètres d'optimisation
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}format=${bestFormat}&quality=${quality}`;
  }, [supportsWebP, supportsAVIF, connectionSpeed]);

  const preloadImage = useCallback((src: string, options: ImageOptimizationOptions = {}) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      const optimizedSrc = optimizeImageUrl(src, options);
      
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to preload image: ${optimizedSrc}`));
      img.src = optimizedSrc;
    });
  }, [optimizeImageUrl]);

  return {
    optimizeImageUrl,
    preloadImage,
    supportsWebP,
    supportsAVIF,
    connectionSpeed
  };
};
