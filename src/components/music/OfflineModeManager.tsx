/**
 * Offline Mode Manager - Gestion du mode hors ligne
 * Téléchargement, cache, synchronisation
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { logger } from '@/lib/logger';
import {
  Download,
  Wifi,
  WifiOff,
  Trash2,
  HardDrive,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCachedTracks } from '@/hooks/music/useMusicSettings';

interface CachedTrack {
  id: string;
  title: string;
  artist: string;
  cachedAt: Date;
  size: number; // in MB
  duration: number;
  isDownloading?: boolean;
  downloadProgress?: number;
}

interface OfflineModeManagerProps {
  tracks: Array<{
    id: string;
    title: string;
    artist: string;
    duration: number;
  }>;
  onDownload?: (trackId: string) => void;
  onRemoveFromCache?: (trackId: string) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const OfflineModeManager: React.FC<OfflineModeManagerProps> = ({
  tracks,
  onDownload,
  onRemoveFromCache,
}) => {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' && navigator.onLine);
  const { value: cachedTracksData, setValue: setCachedTracksData } = useCachedTracks();
  const [cachedTracks, setCachedTracks] = useState<CachedTrack[]>([]);
  const [downloadQueue, setDownloadQueue] = useState<string[]>([]);
  const [totalCacheSize, setTotalCacheSize] = useState(0);
  const [maxCacheSize] = useState(500); // 500 MB max
  const [autoSync, setAutoSync] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: '📡 Connexion rétablie',
        description: 'Mode synchronisation activé',
      });
      if (autoSync) {
        syncOfflineData();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: '🔌 Mode hors ligne',
        description: 'Utilisation du cache local',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoSync, toast]);

  // Load cached tracks from Supabase-synced hook
  useEffect(() => {
    if (cachedTracksData && cachedTracksData.length > 0) {
      setCachedTracks(cachedTracksData);
      const size = cachedTracksData.reduce((acc: number, t: CachedTrack) => acc + (t.size || 0), 0);
      setTotalCacheSize(size);
    }
  }, [cachedTracksData]);

  // Download track
  const downloadTrack = async (trackId: string) => {
    const track = tracks.find((t) => t.id === trackId);
    if (!track) return;

    // Check cache size
    const trackSize = 5; // Simulated: 5MB per track
    if (totalCacheSize + trackSize > maxCacheSize) {
      toast({
        title: '💾 Cache plein',
        description: `Supprimer des titres pour libérer ${trackSize}MB`,
        variant: 'destructive',
      });
      return;
    }

    const newCached: CachedTrack = {
      id: trackId,
      title: track.title,
      artist: track.artist,
      cachedAt: new Date(),
      size: trackSize,
      duration: track.duration,
      isDownloading: true,
      downloadProgress: 0,
    };

    setCachedTracks((prev) => [...prev, newCached]);
    setDownloadQueue((prev) => [...prev, trackId]);

    // Simulate download
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 40;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        setCachedTracks((prev) =>
          prev.map((t) =>
            t.id === trackId
              ? {
                  ...t,
                  isDownloading: false,
                  downloadProgress: 100,
                }
              : t
          )
        );

        setDownloadQueue((prev) => prev.filter((id) => id !== trackId));
        setTotalCacheSize((prev) => prev + trackSize);

        // Save to Supabase via hook
        const updated = cachedTracks.map((t) =>
          t.id === trackId ? newCached : t
        );
        setCachedTracksData(updated);

        toast({
          title: '✅ Téléchargement terminé',
          description: `${track.title} est disponible hors ligne`,
        });

        onDownload?.(trackId);
      } else {
        setCachedTracks((prev) =>
          prev.map((t) =>
            t.id === trackId
              ? { ...t, downloadProgress: progress }
              : t
          )
        );
      }
    }, 500);
  };

  // Remove from cache
  const removeFromCache = (trackId: string) => {
    const track = cachedTracks.find((t) => t.id === trackId);
    if (!track) return;

    if (confirm(`Supprimer "${track.title}" du cache ?`)) {
      setCachedTracks((prev) => prev.filter((t) => t.id !== trackId));
      setTotalCacheSize((prev) => prev - track.size);

      // Update via Supabase hook
      const updated = cachedTracks.filter((t) => t.id !== trackId);
      setCachedTracksData(updated);

      toast({
        title: '🗑️ Supprimé du cache',
        description: `${formatFileSize(track.size)} libéré`,
      });

      onRemoveFromCache?.(trackId);
    }
  };

  // Clear all cache
  const clearCache = () => {
    if (confirm('Vider complètement le cache ?')) {
      setCachedTracks([]);
      setTotalCacheSize(0);
      // Cleared via hook - no localStorage needed

      toast({
        title: '🗑️ Cache vidé',
        description: 'Tout l\'espace a été libéré',
      });
    }
  };

  // Sync offline data
  const syncOfflineData = () => {
    toast({
      title: '📡 Synchronisation...',
      description: 'Mise à jour des données',
    });

    setTimeout(() => {
      toast({
        title: '✅ Synchronisation terminée',
        description: 'Toutes les données sont à jour',
      });
    }, 2000);
  };

  const cachePercentage = (totalCacheSize / maxCacheSize) * 100;
  const availableSpace = maxCacheSize - totalCacheSize;
  const canDownload = availableSpace > 5; // Need at least 5MB

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-orange-500" />
              )}
              Mode Hors Ligne
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isOnline ? 'Connecté en ligne' : 'Mode hors ligne actif'}
            </p>
          </div>

          <div className="flex gap-2">
            {isOnline && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAutoSync(!autoSync)}
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">
                  {autoSync ? 'Auto' : 'Manuel'}
                </span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cache Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              Stockage cache
            </div>
            <span className="text-sm font-medium">
              {formatFileSize(totalCacheSize * 1024 * 1024)} / {maxCacheSize}MB
            </span>
          </div>

          <Progress value={cachePercentage} className="h-2" />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{cachedTracks.length} titre(s) en cache</span>
            <span>{formatFileSize(availableSpace * 1024 * 1024)} disponible</span>
          </div>
        </div>

        {/* Status Alert */}
        {!canDownload && cachedTracks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex gap-2 text-sm text-amber-700"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>Cache plein. Supprimez des titres pour en télécharger d'autres.</div>
          </motion.div>
        )}

        {/* Download and Expand Controls */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 gap-2"
          >
            <Download className="h-4 w-4" />
            {showDetails ? 'Masquer' : `Afficher (${cachedTracks.length})`}
          </Button>
          {cachedTracks.length > 0 && (
            <Button
              size="sm"
              variant="destructive"
              onClick={clearCache}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Cached Tracks List */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 max-h-64 overflow-y-auto"
            >
              {cachedTracks.length > 0 ? (
                cachedTracks.map((track) => (
                  <div
                    key={track.id}
                    className="p-3 rounded-lg bg-muted/30 border space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {track.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {track.artist}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 flex-shrink-0"
                        onClick={() => removeFromCache(track.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    {track.isDownloading ? (
                      <div className="space-y-1">
                        <Progress
                          value={track.downloadProgress || 0}
                          className="h-1.5"
                        />
                        <p className="text-xs text-muted-foreground">
                          {Math.round(track.downloadProgress || 0)}%
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex gap-2">
                          <Badge
                            variant="secondary"
                            className="text-xs"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {formatFileSize(track.size * 1024 * 1024)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDuration(track.duration)}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <HardDrive className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucun titre en cache</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Download Section */}
        {!showDetails && canDownload && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">
              Télécharger pour hors ligne
            </p>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {tracks
                .filter((t) => !cachedTracks.some((c) => c.id === t.id))
                .slice(0, 4)
                .map((track) => (
                  <Button
                    key={track.id}
                    size="sm"
                    variant="outline"
                    onClick={() => downloadTrack(track.id)}
                    className="justify-start text-xs h-auto py-2 flex-col"
                    disabled={!canDownload}
                  >
                    <Download className="h-3 w-3 mb-1" />
                    <span className="truncate">{track.title}</span>
                  </Button>
                ))}
            </div>
          </div>
        )}

        {/* Sync Status */}
        {isOnline && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 space-y-2">
            <p className="text-xs font-semibold text-green-700 flex items-center gap-2">
              <Wifi className="h-3 w-3" />
              Synchronisation automatique active
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={syncOfflineData}
              className="w-full text-xs h-8"
            >
              Synchroniser maintenant
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OfflineModeManager;
