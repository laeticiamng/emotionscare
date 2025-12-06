import React, { useState, useRef, useEffect } from 'react';
import { useImageOptimization } from '@/hooks/useImageOptimization';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  lazy?: boolean;
  placeholder?: string;
  fallback?: string;
}

const OptimizedImage = React.memo<OptimizedImageProps>(({
  src,
  alt,
  quality = 85,
  format = 'webp',
  lazy = true,
  placeholder,
  fallback,
  className,
  onLoad,
  onError,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const { optimizeImageUrl } = useImageOptimization();
  const optimizedSrc = isInView ? optimizeImageUrl(src, { quality, format }) : '';
  const isLoading = !optimizedSrc && isInView;

  // Intersection Observer pour lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    if (onError) onError(e);
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(false);
    if (onLoad) onLoad(e);
  };

  // Afficher le fallback ou placeholder en cas d'erreur
  if (imageError && fallback) {
    return (
      <img
        ref={imgRef}
        src={fallback}
        alt={alt}
        className={cn('transition-opacity duration-300', className)}
        onLoad={handleLoad}
        {...props}
      />
    );
  }

  return (
    <img
      ref={imgRef}
      src={optimizedSrc || placeholder || ''}
      alt={alt}
      className={cn(
        'transition-opacity duration-300',
        isLoading && 'opacity-50',
        className
      )}
      onLoad={handleLoad}
      onError={handleError}
      loading={lazy ? 'lazy' : 'eager'}
      {...props}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export { OptimizedImage };
