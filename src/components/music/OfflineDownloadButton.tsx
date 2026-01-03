/**
 * OfflineDownloadButton - Télécharger une piste pour écoute hors-ligne
 * Utilise l'API Cache pour stockage local
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  Loader2, 
  CheckCircle, 
  Trash2, 
  WifiOff,
  AlertCircle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
import type { MusicTrack } from '@/types/music';

interface OfflineDownloadButtonProps {
  track: MusicTrack;
  variant?: 'default' | 'ghost' | 'outline' | 'icon';
  size?: 'default' | 'sm' | 'icon';
  className?: string;
}

const CACHE_NAME = 'emotionscare-music-offline-v1';

export const OfflineDownloadButton: React.FC<OfflineDownloadButtonProps> = ({
  track,
  variant = 'ghost',
  size = 'sm',
  className,
}) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const audioUrl = track.audioUrl || track.url;

  // Vérifier si déjà téléchargé
  useEffect(() => {
    if (!audioUrl) return;
    
    const checkCache = async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(audioUrl);
        setIsDownloaded(!!cached);
      } catch (err) {
        logger.warn('Cache check failed', err as Error, 'MUSIC');
      }
    };
    
    checkCache();
  }, [audioUrl]);

  const handleDownload = async () => {
    if (!audioUrl || isDownloading) return;

    setIsDownloading(true);
    setProgress(0);
    setError(null);

    try {
      // Fetch avec suivi de progression
      const response = await fetch(audioUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const chunks: Uint8Array[] = [];
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        received += value.length;
        
        if (total > 0) {
          setProgress(Math.round((received / total) * 100));
        }
      }

      // Reconstituer le blob - convertir les chunks en ArrayBuffer
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }
      
      const blob = new Blob([combined.buffer], { type: 'audio/mpeg' });
      const cachedResponse = new Response(blob, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'X-Track-Id': track.id,
          'X-Track-Title': encodeURIComponent(track.title),
          'X-Cached-At': new Date().toISOString(),
        },
      });

      // Mettre en cache
      const cache = await caches.open(CACHE_NAME);
      await cache.put(audioUrl, cachedResponse);

      setIsDownloaded(true);
      setProgress(100);
      
      toast({
        title: '📥 Téléchargé',
        description: `"${track.title}" disponible hors-ligne`,
      });

      logger.info('Track downloaded for offline', { trackId: track.id }, 'MUSIC');

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      logger.error('Download failed', err as Error, 'MUSIC');
      
      toast({
        title: 'Erreur de téléchargement',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRemove = async () => {
    if (!audioUrl) return;

    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.delete(audioUrl);
      setIsDownloaded(false);
      
      toast({
        title: 'Supprimé',
        description: `"${track.title}" retiré du stockage hors-ligne`,
      });
    } catch (err) {
      logger.error('Remove from cache failed', err as Error, 'MUSIC');
    }
  };

  if (!audioUrl) return null;

  // Mode icon uniquement
  if (variant === 'icon' || size === 'icon') {
    return (
      <Button
        size="icon"
        variant="ghost"
        onClick={isDownloaded ? handleRemove : handleDownload}
        disabled={isDownloading}
        className={cn("h-8 w-8", className)}
        title={isDownloaded ? 'Supprimer du stockage hors-ligne' : 'Télécharger pour hors-ligne'}
      >
        {isDownloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isDownloaded ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : error ? (
          <AlertCircle className="h-4 w-4 text-destructive" />
        ) : (
          <Download className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {isDownloading && progress > 0 && (
        <Progress value={progress} className="h-1" />
      )}
      
      {isDownloaded ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-green-600">
            <WifiOff className="h-4 w-4" />
            Disponible hors-ligne
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRemove}
            className="gap-1 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
            Supprimer
          </Button>
        </div>
      ) : (
        <Button
          size={size}
          variant={variant}
          onClick={handleDownload}
          disabled={isDownloading}
          className="gap-1"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {progress > 0 ? `${progress}%` : 'Téléchargement...'}
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Hors-ligne
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default OfflineDownloadButton;
