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

  // Calculer l'aspect ratio pour éviter le CLS
  const aspectRatio = width && height ? (height / width) * 100 : undefined;

  return (
    <div
      className="relative overflow-hidden"
      style={aspectRatio ? { paddingBottom: `${aspectRatio}%` } : undefined}
    >
      {/* Skeleton de chargement */}
      {!isLoaded && !imageError && (
        <div
          className="absolute inset-0 bg-muted animate-pulse rounded"
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
          className={`${imageClasses} ${aspectRatio ? 'absolute inset-0 w-full h-full object-cover' : ''}`}
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

/**
 * Composant d'avatar optimisé avec fallback intelligent
 */
interface OptimizedAvatarProps extends OptimizedImageProps {
  name?: string;
}

export const OptimizedAvatar: React.FC<OptimizedAvatarProps> = ({
  name,
  alt,
  src,
  className = '',
  ...props
}) => {
  // Générer un avatar SVG avec initiales en fallback
  const getInitials = (fullName?: string): string => {
    if (!fullName) return '?';
    const names = fullName.split(' ');
    return names
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const initials = getInitials(name || alt);
  const _fallbackSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%236366f1' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='white' font-family='sans-serif' font-weight='600'%3E${initials}%3C/text%3E%3C/svg%3E`;

  return (
    <div className={`${className} rounded-full overflow-hidden`}>
      <OptimizedImage
        src={src}
        alt={alt}
        {...props}
      />
    </div>
  );
};