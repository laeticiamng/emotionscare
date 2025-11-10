/**
 * Composant d'affichage du statut du cache Service Worker
 * Pour le dashboard GDPR
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, Database, Wifi, WifiOff } from 'lucide-react';
import { getCacheStatus, clearServiceWorkerCache, syncGDPRMetrics } from '@/lib/serviceWorkerRegistration';
import { toast } from 'sonner';

interface CacheInfo {
  name: string;
  size: number;
}

interface CacheStatusData {
  caches: CacheInfo[];
  version: string;
}

export const CacheStatusCard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheStatus, setCacheStatus] = useState<CacheStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadCacheStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadCacheStatus = async () => {
    setIsLoading(true);
    try {
      const status = await getCacheStatus();
      setCacheStatus(status);
    } catch (error) {
      console.error('Failed to load cache status', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async () => {
    setIsLoading(true);
    try {
      const success = await clearServiceWorkerCache();
      if (success) {
        await loadCacheStatus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncMetrics = async () => {
    setIsSyncing(true);
    try {
      const success = await syncGDPRMetrics();
      if (success) {
        toast.success('Synchronisation des métriques lancée');
      } else {
        toast.info('Synchronisation non disponible');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const totalCacheSize = cacheStatus?.caches?.reduce((acc, cache) => acc + cache.size, 0) || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Cache Offline</CardTitle>
          </div>
          <Badge variant={isOnline ? 'default' : 'destructive'}>
            {isOnline ? (
              <>
                <Wifi className="h-3 w-3 mr-1" />
                En ligne
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 mr-1" />
                Hors ligne
              </>
            )}
          </Badge>
        </div>
        <CardDescription>
          Métriques GDPR disponibles hors connexion
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {cacheStatus ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Version SW</p>
                <p className="text-lg font-semibold">{cacheStatus.version}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entrées cachées</p>
                <p className="text-lg font-semibold">{totalCacheSize}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Détails des caches :</p>
              {cacheStatus.caches.map((cache) => (
                <div key={cache.name} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground truncate">
                    {cache.name.replace('emotionscare-gdpr-', '')}
                  </span>
                  <Badge variant="secondary">{cache.size} items</Badge>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadCacheStatus}
                disabled={isLoading}
                className="flex-1"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncMetrics}
                disabled={isSyncing || !isOnline}
                className="flex-1"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                Sync
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearCache}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Vider
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Service Worker non disponible</p>
            <p className="text-xs mt-2">Le cache offline n'est pas activé</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
