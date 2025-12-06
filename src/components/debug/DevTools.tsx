// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { apiCache, imageCache, userCache } from '@/utils/cacheStrategies';
import { logger } from '@/lib/logger';

const DevTools: React.FC<{ enabled?: boolean }> = ({ enabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>({});
  const [cacheStats, setCacheStats] = useState<any>({});

  useEffect(() => {
    if (!enabled || import.meta.env.PROD) return;

    const updateMetrics = () => {
      setPerformanceMetrics({
        metrics: performanceMonitor.getMetrics(),
        score: performanceMonitor.getPerformanceScore()
      });

      setCacheStats({
        api: apiCache.getStats(),
        image: imageCache.getStats(),
        user: userCache.getStats()
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled || import.meta.env.PROD) {
    return null;
  }

  const getScoreBadgeVariant = (score: string) => {
    switch (score) {
      case 'good': return 'default';
      case 'needs-improvement': return 'secondary';
      case 'poor': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <>
      {/* Bouton flottant pour ouvrir les DevTools */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 bg-blue-600 hover:bg-blue-700"
        size="sm"
      >
        🔧 DevTools
      </Button>

      {/* Panel des DevTools */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>🔧 DevTools - EmotionsCare</CardTitle>
              <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm">
                ✕
              </Button>
            </CardHeader>
            <CardContent className="overflow-y-auto">
              <Tabs defaultValue="performance" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="cache">Cache</TabsTrigger>
                  <TabsTrigger value="debug">Debug</TabsTrigger>
                </TabsList>

                <TabsContent value="performance" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Score Global</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant={getScoreBadgeVariant(performanceMetrics.score?.overall)}>
                          {performanceMetrics.score?.overall || 'Calculating...'}
                        </Badge>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Temps de Chargement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-2xl font-bold">
                          {performanceMetrics.metrics?.loadTime?.toFixed(0) || '--'}ms
                        </span>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Core Web Vitals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {performanceMetrics.score?.details && Object.entries(performanceMetrics.score.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <Badge variant={getScoreBadgeVariant(value as string)}>
                            {value as string}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="cache" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(cacheStats).map(([cacheName, stats]: [string, any]) => (
                      <Card key={cacheName}>
                        <CardHeader>
                          <CardTitle className="text-sm capitalize">{cacheName} Cache</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs">Hit Rate:</span>
                            <Badge variant={stats?.hitRate > 0.8 ? 'default' : 'secondary'}>
                              {((stats?.hitRate || 0) * 100).toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Hits: {stats?.hits || 0}</span>
                            <span>Size: {stats?.size || 0}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Actions Cache</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button 
                        onClick={() => {
                          apiCache.clear();
                          imageCache.clear();
                          userCache.clear();
                        }}
                        variant="outline" 
                        size="sm"
                        className="w-full"
                      >
                        🗑️ Vider tous les caches
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="debug" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Informations Système</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <span>User Agent:</span>
                        <span className="truncate">{navigator.userAgent.slice(0, 50)}...</span>
                        <span>Memory (MB):</span>
                        <span>{performanceMetrics.metrics?.memoryUsage || 'N/A'}</span>
                        <span>Connection:</span>
                        <span>{(navigator as any).connection?.effectiveType || 'Unknown'}</span>
                        <span>Environment:</span>
                        <span>{import.meta.env.MODE}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Console Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button 
                        onClick={() => performanceMonitor.reportMetrics()}
                        variant="outline" 
                        size="sm"
                        className="w-full"
                      >
                        📊 Log Performance Metrics
                      </Button>
                      <Button 
                        onClick={() => logger.debug('Cache Stats:', cacheStats, 'UI')}
                        variant="outline" 
                        size="sm"
                        className="w-full"
                      >
                        🗂️ Log Cache Stats
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default DevTools;
