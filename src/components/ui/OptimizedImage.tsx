import React, { useState } from 'react';

/**
 * Composant d'image optimisée avec support formats modernes
 * Phase 2 - Alternative légère à l'optimisation par plugin
 */

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes = '100vw'
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Générer les sources pour différents formats
  const generateSources = (baseSrc: string) => {
    const ext = baseSrc.split('.').pop()?.toLowerCase();
    const pathWithoutExt = baseSrc.replace(/\.[^/.]+$/, '');
    
    return {
      avif: `${pathWithoutExt}.avif`,
      webp: `${pathWithoutExt}.webp`,
      fallback: ext === 'svg' ? baseSrc : `${pathWithoutExt}.${ext === 'jpg' ? 'jpg' : 'png'}`
    };
  };

  const sources = generateSources(src);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Classes pour les transitions de chargement
  const imageClasses = `
    ${className}
    transition-opacity duration-300
    ${isLoaded ? 'opacity-100' : 'opacity-0'}
  `.trim();

  return (
    <div className="relative overflow-hidden">
      {/* Skeleton de chargement */}
      {!isLoaded && !imageError && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse rounded"
          style={{ width: width || 'auto', height: height || 'auto' }}
        />
      )}

      <picture>
        {/* Format AVIF (le plus moderne) */}
        <source srcSet={sources.avif} type="image/avif" sizes={sizes} />
        
        {/* Format WebP (largement supporté) */}
        <source srcSet={sources.webp} type="image/webp" sizes={sizes} />
        
        {/* Fallback image */}
        <img
          src={imageError ? '/placeholder.svg' : sources.fallback}
          alt={alt}
          className={imageClasses}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </picture>

      {/* Indicateur d'erreur */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
          Image non disponible
        </div>
      )}
    </div>
  );
};

/**
 * Hook pour précharger les images critiques
 */
export const usePreloadImages = (images: string[]) => {
  React.useEffect(() => {
    images.forEach(src => {
      const sources = generateSources(src);
      
      // Précharger WebP en priorité
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = sources.webp;
      document.head.appendChild(link);
    });
  }, [images]);
};

// Fonction utilitaire pour générer les sources (disponible en export)
const generateSources = (baseSrc: string) => {
  const ext = baseSrc.split('.').pop()?.toLowerCase();
  const pathWithoutExt = baseSrc.replace(/\.[^/.]+$/, '');
  
  return {
    avif: `${pathWithoutExt}.avif`,
    webp: `${pathWithoutExt}.webp`,
    fallback: ext === 'svg' ? baseSrc : `${pathWithoutExt}.${ext === 'jpg' ? 'jpg' : 'png'}`
  };
};

export { generateSources };