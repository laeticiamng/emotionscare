import React, { useState, useRef, useCallback, memo } from 'react';
import { useIntersectionObserver } from '@/hooks/optimization/useIntersectionObserver';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  quality?: 'low' | 'medium' | 'high';
  lazy?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Composant d'image ultra-optimisé avec lazy loading, compression et cache
 */
const OptimizedImage = memo<OptimizedImageProps>(({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="100%" height="100%" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af"%3ELoading...%3C/text%3E%3C/svg%3E',
  quality = 'medium',
  lazy = true,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(lazy ? placeholder : src);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Intersection Observer pour lazy loading
  const { isIntersecting, hasIntersected, setTarget } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    enabled: lazy
  });
  
  // Fonction pour générer les URLs optimisées selon la qualité
  const getOptimizedSrc = useCallback((originalSrc: string, targetQuality: string) => {
    // Si l'image est déjà une URL de placeholder, la retourner telle quelle
    if (originalSrc.startsWith('data:')) return originalSrc;
    
    // Pour les images externes, on peut ajouter des paramètres de compression
    // selon le service utilisé (ex: Cloudinary, ImageKit, etc.)
    const url = new URL(originalSrc, window.location.origin);
    
    switch (targetQuality) {
      case 'low':
        url.searchParams.set('q', '60');
        url.searchParams.set('f', 'webp');
        break;
      case 'high':
        url.searchParams.set('q', '90');
        url.searchParams.set('f', 'webp');
        break;
      default: // medium
        url.searchParams.set('q', '75');
        url.searchParams.set('f', 'webp');
    }
    
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    
    return url.toString();
  }, [width, height]);
  
  // Charger l'image quand elle devient visible
  React.useEffect(() => {
    if (!lazy || hasIntersected) {
      const optimizedSrc = getOptimizedSrc(src, quality);
      
      // Précharger l'image
      const img = new Image();
      img.onload = () => {
        setCurrentSrc(optimizedSrc);
        setIsLoaded(true);
        onLoad?.();
      };
      img.onerror = () => {
        setHasError(true);
        onError?.();
      };
      img.src = optimizedSrc;
    }
  }, [lazy, hasIntersected, src, quality, getOptimizedSrc, onLoad, onError]);
  
  // Référence combinée pour l'intersection observer
  const setRef = useCallback((element: HTMLImageElement | null) => {
    imgRef.current = element;
    if (lazy) {
      setTarget(element);
    }
  }, [lazy, setTarget]);
  
  // Classes CSS pour les transitions
  const imageClasses = [
    className,
    'transition-all duration-300 ease-in-out',
    isLoaded ? 'opacity-100' : 'opacity-0',
    hasError ? 'bg-red-100' : 'bg-gray-100',
    'object-cover'
  ].filter(Boolean).join(' ');
  
  return (
    <div className="relative overflow-hidden" style={{ width, height }}>
      <img
        ref={setRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={imageClasses}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        style={{
          width: width ? `${width}px` : 'auto',
          height: height ? `${height}px` : 'auto',
        }}
      />
      
      {/* Indicateur de chargement */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
      
      {/* Indicateur d'erreur */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500">
          <div className="text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <div className="text-sm">Erreur de chargement</div>
          </div>
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;