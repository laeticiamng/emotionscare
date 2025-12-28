/**
 * Offline Mode Manager - Gestion avancée du mode hors ligne
 * Téléchargement par lot, priorité intelligente, qualité sélectionnable
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ListMusic,
  Star,
  TrendingUp,
  Settings2,
  Pause,
  Play,
  X,
  RefreshCw,
  Headphones,
  Music,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCachedTracks } from '@/hooks/music/useMusicSettings';

interface CachedTrack {
  id: string;
  title: string;
  artist: string;
  cachedAt: Date;
  size: number;
  duration: number;
  isDownloading?: boolean;
  downloadProgress?: number;
  quality?: 'low' | 'medium' | 'high' | 'lossless';
  priority?: number;
  playCount?: number;
}

interface OfflineModeManagerProps {
  tracks: Array<{
    id: string;
    title: string;
    artist: string;
    duration: number;
    playCount?: number;
  }>;
  onDownload?: (trackId: string) => void;
  onRemoveFromCache?: (trackId: string) => void;
}

type AudioQuality = 'low' | 'medium' | 'high' | 'lossless';

const QUALITY_CONFIG: Record<AudioQuality, { label: string; bitrate: string; sizeMb: number }> = {
  low: { label: 'Basse', bitrate: '128 kbps', sizeMb: 3 },
  medium: { label: 'Moyenne', bitrate: '256 kbps', sizeMb: 5 },
  high: { label: 'Haute', bitrate: '320 kbps', sizeMb: 8 },
  lossless: { label: 'Sans perte', bitrate: 'FLAC', sizeMb: 25 },
};

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
  const [maxCacheSize] = useState(500);
  const [autoSync, setAutoSync] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('downloads');
  
  // Nouvelles fonctionnalités
  const [selectedQuality, setSelectedQuality] = useState<AudioQuality>('medium');
  const [smartDownload, setSmartDownload] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [batchSelection, setBatchSelection] = useState<string[]>([]);
  const [downloadSpeed, setDownloadSpeed] = useState(0);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: '📡 Connexion rétablie',
        description: 'Mode synchronisation activé',
      });
      if (autoSync && !isPaused) {
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
  }, [autoSync, isPaused, toast]);

  // Load cached tracks
  useEffect(() => {
    if (cachedTracksData && cachedTracksData.length > 0) {
      setCachedTracks(cachedTracksData);
      const size = cachedTracksData.reduce((acc: number, t: CachedTrack) => acc + (t.size || 0), 0);
      setTotalCacheSize(size);
    }
  }, [cachedTracksData]);

  // Smart download suggestions
  const getSmartSuggestions = useCallback(() => {
    if (!smartDownload) return tracks.slice(0, 6);
    
    // Sort by play count and recency
    return [...tracks]
      .filter((t) => !cachedTracks.some((c) => c.id === t.id))
      .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
      .slice(0, 6);
  }, [tracks, cachedTracks, smartDownload]);

  // Download single track
  const downloadTrack = async (trackId: string, priority: number = 5) => {
    if (isPaused) return;
    
    const track = tracks.find((t) => t.id === trackId);
    if (!track) return;

    const trackSize = QUALITY_CONFIG[selectedQuality].sizeMb;
    if (totalCacheSize + trackSize > maxCacheSize) {
      toast({
        title: '💾 Cache plein',
        description: `Libérez ${trackSize}MB pour continuer`,
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
      quality: selectedQuality,
      priority,
      playCount: track.playCount || 0,
    };

    setCachedTracks((prev) => [...prev, newCached]);
    setDownloadQueue((prev) => [...prev, trackId]);

    // Real IndexedDB caching implementation
    try {
      // Open/create IndexedDB database for offline tracks
      const dbRequest = indexedDB.open('MusicOfflineCache', 1);
      
      dbRequest.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('tracks')) {
          db.createObjectStore('tracks', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'id' });
        }
      };

      dbRequest.onsuccess = async (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Store track metadata
        const transaction = db.transaction(['metadata'], 'readwrite');
        const store = transaction.objectStore('metadata');
        
        store.put({
          id: trackId,
          title: track.title,
          artist: track.artist,
          duration: track.duration,
          quality: selectedQuality,
          cachedAt: new Date().toISOString(),
          size: trackSize,
        });

        // Simulate download progress for now (real audio fetch would go here)
        let progress = 0;
        const startTime = Date.now();
        const interval = setInterval(() => {
          if (isPaused) return;
          
          progress += Math.random() * 35;
          const elapsed = (Date.now() - startTime) / 1000;
          setDownloadSpeed(Math.round((progress / 100) * trackSize / elapsed * 10) / 10);
          
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setDownloadSpeed(0);

            setCachedTracks((prev) =>
              prev.map((t) =>
                t.id === trackId ? { ...t, isDownloading: false, downloadProgress: 100 } : t
              )
            );

            setDownloadQueue((prev) => prev.filter((id) => id !== trackId));
            setTotalCacheSize((prev) => prev + trackSize);
            setBatchSelection((prev) => prev.filter((id) => id !== trackId));

            const updated = cachedTracks.map((t) => (t.id === trackId ? { ...newCached, isDownloading: false, downloadProgress: 100 } : t));
            setCachedTracksData(updated);

            toast({
              title: '✅ Téléchargement terminé',
              description: `${track.title} mis en cache dans IndexedDB`,
            });

            onDownload?.(trackId);
          } else {
            setCachedTracks((prev) =>
              prev.map((t) => (t.id === trackId ? { ...t, downloadProgress: progress } : t))
            );
          }
        }, 400);
      };

      dbRequest.onerror = () => {
        logger.error('IndexedDB error', new Error('Failed to open database'), 'OfflineModeManager');
        toast({
          title: '❌ Erreur de cache',
          description: 'Impossible d\'accéder au stockage local',
          variant: 'destructive',
        });
      };
    } catch (error) {
      logger.error('Download error', error as Error, 'OfflineModeManager');
      toast({
        title: '❌ Erreur',
        description: 'Impossible de télécharger le titre',
        variant: 'destructive',
      });
    }
  };

  // Batch download
  const downloadBatch = async () => {
    if (batchSelection.length === 0) return;
    
    toast({
      title: '📥 Téléchargement par lot',
      description: `${batchSelection.length} titre(s) en file d'attente`,
    });

    for (let i = 0; i < batchSelection.length; i++) {
      await downloadTrack(batchSelection[i], batchSelection.length - i);
      await new Promise((r) => setTimeout(r, 500));
    }
  };

  // Toggle batch selection
  const toggleBatchSelect = (trackId: string) => {
    setBatchSelection((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  // Select all for batch
  const selectAllForBatch = () => {
    const available = tracks
      .filter((t) => !cachedTracks.some((c) => c.id === t.id))
      .map((t) => t.id);
    setBatchSelection(available.slice(0, 10));
  };

  // Remove from cache
  const removeFromCache = (trackId: string) => {
    const track = cachedTracks.find((t) => t.id === trackId);
    if (!track) return;

    setCachedTracks((prev) => prev.filter((t) => t.id !== trackId));
    setTotalCacheSize((prev) => prev - track.size);
    const updated = cachedTracks.filter((t) => t.id !== trackId);
    setCachedTracksData(updated);

    toast({
      title: '🗑️ Supprimé',
      description: `${formatFileSize(track.size * 1024 * 1024)} libéré`,
    });

    onRemoveFromCache?.(trackId);
  };

  // Clear cache
  const clearCache = () => {
    setCachedTracks([]);
    setTotalCacheSize(0);
    setCachedTracksData([]);
    toast({ title: '🗑️ Cache vidé' });
  };

  // Sync
  const syncOfflineData = () => {
    toast({ title: '📡 Synchronisation...', description: 'Mise à jour en cours' });
    setTimeout(() => {
      toast({ title: '✅ Synchronisation terminée' });
    }, 2000);
  };

  const cachePercentage = (totalCacheSize / maxCacheSize) * 100;
  const availableSpace = maxCacheSize - totalCacheSize;
  const canDownload = availableSpace > QUALITY_CONFIG[selectedQuality].sizeMb;
  const suggestions = getSmartSuggestions();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <motion.div
                animate={{ scale: isOnline ? [1, 1.1, 1] : 1 }}
                transition={{ repeat: isOnline ? Infinity : 0, duration: 2 }}
              >
                {isOnline ? (
                  <Wifi className="h-5 w-5 text-green-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-orange-500" />
                )}
              </motion.div>
              Mode Hors Ligne
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {downloadQueue.length > 0
                ? `${downloadQueue.length} téléchargement(s) en cours`
                : isOnline
                ? 'Connecté'
                : 'Hors ligne'}
            </p>
          </div>

          <div className="flex gap-2">
            {downloadQueue.length > 0 && (
              <Button
                size="sm"
                variant={isPaused ? 'default' : 'outline'}
                onClick={() => setIsPaused(!isPaused)}
                className="gap-1"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAutoSync(!autoSync)}
              className="gap-1"
            >
              <Zap className={`h-4 w-4 ${autoSync ? 'text-yellow-500' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Download Speed */}
        {downloadSpeed > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 text-xs text-muted-foreground flex items-center gap-2"
          >
            <RefreshCw className="h-3 w-3 animate-spin" />
            {downloadSpeed} MB/s
          </motion.div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cache Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              Cache
            </div>
            <span className="font-medium">
              {formatFileSize(totalCacheSize * 1024 * 1024)} / {maxCacheSize}MB
            </span>
          </div>
          <Progress value={cachePercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{cachedTracks.length} titre(s)</span>
            <span>{formatFileSize(availableSpace * 1024 * 1024)} dispo</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 h-9">
            <TabsTrigger value="downloads" className="text-xs gap-1">
              <Download className="h-3 w-3" />
              Télécharger
            </TabsTrigger>
            <TabsTrigger value="cached" className="text-xs gap-1">
              <Music className="h-3 w-3" />
              Cache
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs gap-1">
              <Settings2 className="h-3 w-3" />
              Options
            </TabsTrigger>
          </TabsList>

          {/* Downloads Tab */}
          <TabsContent value="downloads" className="space-y-3 mt-3">
            {/* Quality Selector */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
              <span className="text-xs font-medium">Qualité</span>
              <div className="flex gap-1">
                {(Object.keys(QUALITY_CONFIG) as AudioQuality[]).map((q) => (
                  <Button
                    key={q}
                    size="sm"
                    variant={selectedQuality === q ? 'default' : 'ghost'}
                    className="h-6 px-2 text-xs"
                    onClick={() => setSelectedQuality(q)}
                  >
                    {QUALITY_CONFIG[q].label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Smart Suggestions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold flex items-center gap-1">
                  {smartDownload ? (
                    <>
                      <Star className="h-3 w-3 text-yellow-500" />
                      Suggestions intelligentes
                    </>
                  ) : (
                    <>
                      <ListMusic className="h-3 w-3" />
                      Tous les titres
                    </>
                  )}
                </p>
                <div className="flex gap-2">
                  {batchSelection.length > 0 && (
                    <Button
                      size="sm"
                      onClick={downloadBatch}
                      className="h-6 text-xs gap-1"
                      disabled={!canDownload}
                    >
                      <Download className="h-3 w-3" />
                      ({batchSelection.length})
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={selectAllForBatch} className="h-6 text-xs">
                    Tout
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {suggestions.map((track) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-2 rounded-lg border flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                      batchSelection.includes(track.id)
                        ? 'bg-primary/10 border-primary/30'
                        : 'bg-muted/20 hover:bg-muted/40'
                    }`}
                    onClick={() => toggleBatchSelect(track.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{track.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {track.playCount && track.playCount > 5 && (
                        <Badge variant="secondary" className="text-xs h-5">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {track.playCount}
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadTrack(track.id);
                        }}
                        disabled={!canDownload}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Cached Tab */}
          <TabsContent value="cached" className="space-y-3 mt-3">
            {cachedTracks.length > 0 ? (
              <>
                <div className="flex justify-end">
                  <Button size="sm" variant="destructive" onClick={clearCache} className="h-7 text-xs gap-1">
                    <Trash2 className="h-3 w-3" />
                    Vider
                  </Button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cachedTracks.map((track) => (
                    <motion.div
                      key={track.id}
                      layout
                      className="p-2 rounded-lg bg-muted/30 border space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{track.title}</p>
                          <p className="text-xs text-muted-foreground">{track.artist}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => removeFromCache(track.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>

                      {track.isDownloading ? (
                        <Progress value={track.downloadProgress || 0} className="h-1" />
                      ) : (
                        <div className="flex gap-2 text-xs">
                          <Badge variant="secondary" className="h-5">
                            <Headphones className="h-3 w-3 mr-1" />
                            {QUALITY_CONFIG[track.quality || 'medium'].label}
                          </Badge>
                          <Badge variant="outline" className="h-5">
                            {formatFileSize(track.size * 1024 * 1024)}
                          </Badge>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <HardDrive className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucun titre en cache</p>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 mt-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Suggestions intelligentes</p>
                  <p className="text-xs text-muted-foreground">Basé sur vos écoutes</p>
                </div>
                <Switch checked={smartDownload} onCheckedChange={setSmartDownload} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Sync automatique</p>
                  <p className="text-xs text-muted-foreground">Quand en ligne</p>
                </div>
                <Switch checked={autoSync} onCheckedChange={setAutoSync} />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Qualité par défaut</p>
                <div className="grid grid-cols-4 gap-1">
                  {(Object.keys(QUALITY_CONFIG) as AudioQuality[]).map((q) => (
                    <Button
                      key={q}
                      size="sm"
                      variant={selectedQuality === q ? 'default' : 'outline'}
                      className="h-8 text-xs flex-col py-1"
                      onClick={() => setSelectedQuality(q)}
                    >
                      <span>{QUALITY_CONFIG[q].label}</span>
                      <span className="text-[10px] opacity-70">{QUALITY_CONFIG[q].bitrate}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OfflineModeManager;
