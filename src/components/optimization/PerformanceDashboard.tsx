// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Zap, 
  Database, 
  Wifi, 
  HardDrive,
  RefreshCw,
  Download,
  Upload,
  Clock,
  Eye,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useServiceWorker, useCacheManager } from '@/hooks/optimization/useServiceWorker';
import { performanceMonitor } from '@/lib/performance/performanceMonitor';
import { logger } from '@/lib/logger';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

interface PerformanceScore {
  overall: number;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [webVitals, setWebVitals] = useState<any>({});
  const [score, setScore] = useState<PerformanceScore>({
    overall: 0,
    performance: 0,
    accessibility: 0,
    bestPractices: 0,
    seo: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const performanceData = usePerformanceMonitor('dashboard');
  const serviceWorker = useServiceWorker();
  const cacheManager = useCacheManager();

  // Calculer les métriques de performance
  const calculateMetrics = React.useCallback(() => {
    const metrics: PerformanceMetric[] = [];
    
    // Navigation Timing
    if (performance.timing) {
      const navigation = performance.timing;
      const loadTime = navigation.loadEventEnd - navigation.navigationStart;
      const domTime = navigation.domContentLoadedEventEnd - navigation.navigationStart;
      const ttfb = navigation.responseStart - navigation.requestStart;
      
      metrics.push({
        name: 'Temps de chargement',
        value: loadTime,
        unit: 'ms',
        status: loadTime < 2000 ? 'good' : loadTime < 4000 ? 'warning' : 'critical',
        description: 'Temps total de chargement de la page'
      });
      
      metrics.push({
        name: 'Time to First Byte',
        value: ttfb,
        unit: 'ms',
        status: ttfb < 200 ? 'good' : ttfb < 500 ? 'warning' : 'critical',
        description: 'Temps de réponse du serveur'
      });
      
      metrics.push({
        name: 'DOM Content Loaded',
        value: domTime,
        unit: 'ms',
        status: domTime < 1500 ? 'good' : domTime < 3000 ? 'warning' : 'critical',
        description: 'Temps de construction du DOM'
      });
    }
    
    // Memory Usage
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
      
      metrics.push({
        name: 'Mémoire utilisée',
        value: usedMB,
        unit: 'MB',
        status: usedMB < 50 ? 'good' : usedMB < 100 ? 'warning' : 'critical',
        description: 'Consommation mémoire JavaScript'
      });
    }
    
    // Connection Quality
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const speed = connection.downlink || 0;
      
      metrics.push({
        name: 'Vitesse de connexion',
        value: speed,
        unit: 'Mbps',
        status: speed > 10 ? 'good' : speed > 1 ? 'warning' : 'critical',
        description: 'Vitesse de téléchargement estimée'
      });
    }
    
    setMetrics(metrics);
  }, []);

  // Calculer le score de performance
  const calculateScore = React.useCallback(() => {
    let performanceScore = 100;
    let accessibilityScore = 100;
    let bestPracticesScore = 100;
    let seoScore = 100;
    
    // Réduire le score basé sur les métriques
    metrics.forEach(metric => {
      const penalty = metric.status === 'critical' ? 20 : metric.status === 'warning' ? 10 : 0;
      performanceScore = Math.max(0, performanceScore - penalty);
    });
    
    // Vérifications d'accessibilité
    const hasAltTexts = document.querySelectorAll('img:not([alt])').length === 0;
    const hasHeadings = document.querySelectorAll('h1, h2, h3').length > 0;
    const hasLabels = document.querySelectorAll('input:not([aria-label]):not([id])').length === 0;
    
    if (!hasAltTexts) accessibilityScore -= 15;
    if (!hasHeadings) accessibilityScore -= 10;
    if (!hasLabels) accessibilityScore -= 10;
    
    // Vérifications des bonnes pratiques
    const hasHttps = location.protocol === 'https:';
    const hasServiceWorker = serviceWorker.isInstalled;
    const hasManifest = document.querySelector('link[rel="manifest"]') !== null;
    
    if (!hasHttps) bestPracticesScore -= 20;
    if (!hasServiceWorker) bestPracticesScore -= 15;
    if (!hasManifest) bestPracticesScore -= 10;
    
    // Vérifications SEO
    const hasTitle = document.title.length > 0 && document.title.length < 60;
    const hasDescription = document.querySelector('meta[name="description"]') !== null;
    const hasH1 = document.querySelectorAll('h1').length === 1;
    
    if (!hasTitle) seoScore -= 15;
    if (!hasDescription) seoScore -= 10;
    if (!hasH1) seoScore -= 10;
    
    const overall = Math.round((performanceScore + accessibilityScore + bestPracticesScore + seoScore) / 4);
    
    setScore({
      overall,
      performance: Math.round(performanceScore),
      accessibility: Math.round(accessibilityScore),
      bestPractices: Math.round(bestPracticesScore),
      seo: Math.round(seoScore),
    });
  }, [metrics, serviceWorker.isInstalled]);

  // Mesurer les Web Vitals
  const measureWebVitals = React.useCallback(() => {
    const vitals: any = {};
    
    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              vitals.fcp = Math.round(entry.startTime);
            }
            if (entry.name === 'largest-contentful-paint') {
              vitals.lcp = Math.round(entry.startTime);
            }
          });
          setWebVitals({ ...vitals });
        });
        
        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
        
        setTimeout(() => observer.disconnect(), 5000);
      } catch (error) {
        logger.warn('PerformanceObserver non supporté', error as Error, 'SYSTEM');
      }
    }
    
    // Cumulative Layout Shift approximation
    let cls = 0;
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      if (el.getBoundingClientRect().width === 0) cls += 0.01;
    });
    vitals.cls = Math.round(cls * 1000) / 1000;
    
    setWebVitals({ ...vitals });
  }, []);

  // Actualiser les données
  const refreshData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        calculateMetrics(),
        measureWebVitals(),
        cacheManager.calculateCacheSize(),
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [calculateMetrics, measureWebVitals, cacheManager]);

  // Initialisation
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Recalculer le score quand les métriques changent
  useEffect(() => {
    calculateScore();
  }, [calculateScore]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 90) return 'good';
    if (score >= 70) return 'warning';
    return 'critical';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de bord Performance</h1>
          <p className="text-muted-foreground">
            Surveillez et optimisez les performances de votre application
          </p>
        </div>
        <Button 
          onClick={refreshData} 
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Score global */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Score de Performance Global
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(score.overall)}`}>
                {score.overall}
              </div>
              <div className="text-sm text-muted-foreground">Global</div>
              <Progress 
                value={score.overall} 
                className="mt-2"
                // @ts-ignore
                variant={getScoreStatus(score.overall)}
              />
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(score.performance)}`}>
                {score.performance}
              </div>
              <div className="text-sm text-muted-foreground">Performance</div>
              <Progress 
                value={score.performance} 
                className="mt-2"
                // @ts-ignore
                variant={getScoreStatus(score.performance)}
              />
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(score.accessibility)}`}>
                {score.accessibility}
              </div>
              <div className="text-sm text-muted-foreground">Accessibilité</div>
              <Progress 
                value={score.accessibility} 
                className="mt-2"
                // @ts-ignore
                variant={getScoreStatus(score.accessibility)}
              />
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(score.bestPractices)}`}>
                {score.bestPractices}
              </div>
              <div className="text-sm text-muted-foreground">Bonnes pratiques</div>
              <Progress 
                value={score.bestPractices} 
                className="mt-2"
                // @ts-ignore
                variant={getScoreStatus(score.bestPractices)}
              />
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(score.seo)}`}>
                {score.seo}
              </div>
              <div className="text-sm text-muted-foreground">SEO</div>
              <Progress 
                value={score.seo} 
                className="mt-2"
                // @ts-ignore
                variant={getScoreStatus(score.seo)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Métriques</TabsTrigger>
          <TabsTrigger value="vitals">Web Vitals</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
          <TabsTrigger value="network">Réseau</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.name}
                  </CardTitle>
                  {metric.status === 'good' && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {metric.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                  {metric.status === 'critical' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metric.value.toLocaleString()} {metric.unit}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                  <Badge 
                    variant={metric.status === 'good' ? 'default' : 'destructive'}
                    className="mt-2"
                  >
                    {metric.status === 'good' ? 'Bon' : 
                     metric.status === 'warning' ? 'Attention' : 'Critique'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">First Contentful Paint</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {webVitals.fcp || 0} ms
                </div>
                <Badge variant={!webVitals.fcp || webVitals.fcp < 1500 ? 'default' : 'destructive'}>
                  {!webVitals.fcp || webVitals.fcp < 1500 ? 'Bon' : 'À améliorer'}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Largest Contentful Paint</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {webVitals.lcp || 0} ms
                </div>
                <Badge variant={!webVitals.lcp || webVitals.lcp < 2500 ? 'default' : 'destructive'}>
                  {!webVitals.lcp || webVitals.lcp < 2500 ? 'Bon' : 'À améliorer'}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cumulative Layout Shift</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {webVitals.cls || 0}
                </div>
                <Badge variant={!webVitals.cls || webVitals.cls < 0.1 ? 'default' : 'destructive'}>
                  {!webVitals.cls || webVitals.cls < 0.1 ? 'Bon' : 'À améliorer'}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cache" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Cache Storage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taille totale</span>
                    <span className="font-mono">
                      {cacheManager.formatSize(cacheManager.cacheSize)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Nombre de caches</span>
                    <span className="font-mono">{cacheManager.cacheKeys.length}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => cacheManager.clearCache()}
                  >
                    Vider le cache
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={cacheManager.calculateCacheSize}
                  >
                    Actualiser
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Service Worker
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Statut</span>
                    <Badge variant={serviceWorker.isInstalled ? 'default' : 'destructive'}>
                      {serviceWorker.isInstalled ? 'Installé' : 'Non installé'}
                    </Badge>
                  </div>
                  
                  {serviceWorker.isWaitingForUpdate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mise à jour</span>
                      <Button 
                        size="sm"
                        onClick={serviceWorker.skipWaiting}
                      >
                        Activer
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hors ligne</span>
                    <Badge variant={serviceWorker.isOffline ? 'destructive' : 'default'}>
                      {serviceWorker.isOffline ? 'Oui' : 'Non'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {!serviceWorker.isInstalled && (
                    <Button 
                      size="sm"
                      onClick={serviceWorker.register}
                    >
                      Installer
                    </Button>
                  )}
                  
                  {serviceWorker.isInstalled && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={serviceWorker.checkForUpdates}
                    >
                      Vérifier mises à jour
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Informations Réseau
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {('connection' in navigator) && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm">Type de connexion</span>
                      <span className="font-mono">
                        {(navigator as any).connection?.effectiveType || 'Inconnu'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Débit descendant</span>
                      <span className="font-mono">
                        {(navigator as any).connection?.downlink || 0} Mbps
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">RTT</span>
                      <span className="font-mono">
                        {(navigator as any).connection?.rtt || 0} ms
                      </span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between">
                  <span className="text-sm">Statut</span>
                  <Badge variant={navigator.onLine ? 'default' : 'destructive'}>
                    {navigator.onLine ? 'En ligne' : 'Hors ligne'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceDashboard;