// @ts-nocheck
import React, { useState, useCallback } from 'react';
import { ImageIcon, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';

interface PosterArtProps {
  src?: string;
  alt?: string;
  title?: string;
  className?: string;
  downloadable?: boolean;
}

const PosterArt: React.FC<PosterArtProps> = ({ 
  src, 
  alt, 
  title,
  className = '',
  downloadable = false 
}) => {
  const [isLoading, setIsLoading] = useState(!!src);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Génération automatique d'alt-text descriptif
  const getAltText = useCallback(() => {
    if (alt) return alt;
    if (title) return `Illustration de la scène : ${title}`;
    return 'Illustration générée pour la scène actuelle';
  }, [alt, title]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    logger.warn('Failed to load story artwork', { src }, 'UI');
  }, [src]);

  const handleDownload = useCallback(async () => {
    if (!src || !downloadable) return;
    
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `story-art-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      logger.error('Download failed', error as Error, 'UI');
    }
  }, [src, downloadable]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Mode placeholder
  if (!src || hasError) {
    return (
      <div className={`poster-art ${className}`}>
        <div className="aspect-[4/5] bg-gradient-to-br from-muted to-muted/50 rounded-lg border flex items-center justify-center">
          <div className="text-center space-y-3 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto opacity-30" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {hasError ? 'Image non disponible' : 'Génération en cours...'}
              </p>
              <p className="text-xs">
                {hasError ? 'L\'histoire continue sans visuel' : 'Votre cover arrive bientôt'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`poster-art ${className}`}>
        <div className="relative group">
          {/* Image principale */}
          <div className="aspect-[4/5] overflow-hidden rounded-lg border shadow-lg">
            <img
              src={src}
              alt={getAltText()}
              className={`
                w-full h-full object-cover
                transition-all duration-300
                ${isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}
                group-hover:scale-102 cursor-pointer
              `}
              onLoad={handleLoad}
              onError={handleError}
              onClick={toggleFullscreen}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Overlay de chargement */}
            {isLoading && (
              <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
                <div className="space-y-2 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
                  <p className="text-xs text-muted-foreground">Génération...</p>
                </div>
              </div>
            )}

            {/* Contrôles overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-8 h-8 bg-black/50 hover:bg-black/70 border-none"
                  onClick={toggleFullscreen}
                  aria-label="Voir en plein écran"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
                
                {downloadable && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="w-8 h-8 bg-black/50 hover:bg-black/70 border-none"
                    onClick={handleDownload}
                    aria-label="Télécharger l'image"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Titre/description */}
          {title && (
            <div className="mt-3 text-center">
              <p className="text-sm font-medium text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Illustration générée par IA
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal plein écran */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={toggleFullscreen}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={src}
              alt={getAltText()}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Bouton fermer */}
            <Button
              variant="secondary"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
              onClick={toggleFullscreen}
            >
              ✕
            </Button>

            {/* Actions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {downloadable && (
                <Button
                  variant="secondary"
                  onClick={handleDownload}
                  className="bg-black/50 hover:bg-black/70"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PosterArt;