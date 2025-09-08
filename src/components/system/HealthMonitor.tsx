/**
 * Moniteur de santé système pour production
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Database, 
  Zap, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { logger } from '@/lib/logger';
import { performanceMonitor } from '@/lib/performance/performanceMonitor';
import { memoryManager } from '@/lib/performance/optimizations';
import { queryOptimizer } from '@/lib/database/queryOptimizer';

interface HealthStatus {
  component: string;
  status: 'healthy' | 'warning' | 'critical';
  message: string;
  metrics?: Record<string, any>;
}

export const HealthMonitor: React.FC = () => {
  const [healthData, setHealthData] = React.useState<HealthStatus[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const checkSystemHealth = React.useCallback(async () => {
    setIsLoading(true);
    const checks: HealthStatus[] = [];

    try {
      // Performance Check
      const perfMetrics = performanceMonitor.getMetrics();
      const avgPerformance = perfMetrics.reduce((acc, m) => acc + m.value, 0) / perfMetrics.length;
      
      checks.push({
        component: 'Performance',
        status: avgPerformance > 100 ? 'warning' : avgPerformance > 300 ? 'critical' : 'healthy',
        message: `Temps de réponse moyen: ${avgPerformance.toFixed(2)}ms`,
        metrics: { avgPerformance, totalMetrics: perfMetrics.length }
      });

      // Memory Check
      const memStats = memoryManager.getCacheStats();
      const memoryUsage = performance.memory ? {
        used: Math.round(performance.memory?.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory?.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory?.jsHeapSizeLimit / 1024 / 1024)
      } : null;

      checks.push({
        component: 'Memory',
        status: memoryUsage && memoryUsage.used > memoryUsage.limit * 0.8 ? 'warning' : 'healthy',
        message: memoryUsage 
          ? `Mémoire: ${memoryUsage.used}MB / ${memoryUsage.limit}MB`
          : 'Informations mémoire non disponibles',
        metrics: { cache: memStats, memory: memoryUsage }
      });

      // Database Cache Check
      const cacheStats = queryOptimizer.getCacheStats();
      checks.push({
        component: 'Database Cache',
        status: cacheStats.size > 80 ? 'warning' : 'healthy',
        message: `Cache: ${cacheStats.size} entrées`,
        metrics: cacheStats
      });

      // Error Rate Check
      const logs = logger.getLogs();
      const errorLogs = logs.filter(l => l.level === 0); // LogLevel.ERROR = 0
      const errorRate = logs.length > 0 ? (errorLogs.length / logs.length) * 100 : 0;

      checks.push({
        component: 'Error Rate',
        status: errorRate > 10 ? 'critical' : errorRate > 5 ? 'warning' : 'healthy',
        message: `Taux d'erreur: ${errorRate.toFixed(1)}%`,
        metrics: { 
          errors: errorLogs.length, 
          total: logs.length, 
          rate: errorRate 
        }
      });

      // Network Check (simple)
      const startTime = performance.now();
      try {
        await fetch('/favicon.ico', { method: 'HEAD' });
        const networkLatency = performance.now() - startTime;
        
        checks.push({
          component: 'Network',
          status: networkLatency > 1000 ? 'warning' : 'healthy',
          message: `Latence réseau: ${networkLatency.toFixed(0)}ms`,
          metrics: { latency: networkLatency }
        });
      } catch {
        checks.push({
          component: 'Network',
          status: 'critical',
          message: 'Connexion réseau échouée',
          metrics: {}
        });
      }

      // Local Storage Check
      try {
        localStorage.setItem('health-check', 'test');
        localStorage.removeItem('health-check');
        
        checks.push({
          component: 'Storage',
          status: 'healthy',
          message: 'LocalStorage fonctionnel',
          metrics: { available: true }
        });
      } catch {
        checks.push({
          component: 'Storage',
          status: 'warning',
          message: 'LocalStorage non disponible',
          metrics: { available: false }
        });
      }

      setHealthData(checks);
    } catch (error) {
      logger.error('Health check failed', error, 'HEALTH');
      checks.push({
        component: 'Health Monitor',
        status: 'critical',
        message: 'Erreur lors du contrôle de santé',
        metrics: {}
      });
      setHealthData(checks);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [checkSystemHealth]);

  const getStatusIcon = (status: HealthStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: HealthStatus['status']) => {
    const variants = {
      healthy: 'default',
      warning: 'secondary',
      critical: 'destructive'
    } as const;

    const labels = {
      healthy: 'Sain',
      warning: 'Attention',
      critical: 'Critique'
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const criticalIssues = healthData.filter(h => h.status === 'critical').length;
  const warnings = healthData.filter(h => h.status === 'warning').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Santé du système</h2>
          <p className="text-muted-foreground">
            Monitoring en temps réel des composants critiques
          </p>
        </div>
        <Button onClick={checkSystemHealth} disabled={isLoading}>
          <Activity className="h-4 w-4 mr-2" />
          {isLoading ? 'Vérification...' : 'Actualiser'}
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">État Général</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {criticalIssues === 0 ? 'Sain' : 'Problèmes'}
            </div>
            <p className="text-xs text-muted-foreground">
              {healthData.length} composants surveillés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Critiques</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{criticalIssues}</div>
            <p className="text-xs text-muted-foreground">
              Nécessitent une attention immédiate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avertissements</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{warnings}</div>
            <p className="text-xs text-muted-foreground">
              À surveiller de près
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Issues Alert */}
      {criticalIssues > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{criticalIssues} problème(s) critique(s) détecté(s).</strong>
            {' '}Une intervention immédiate est recommandée pour maintenir les performances optimales.
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            État détaillé des composants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Vérification de la santé du système...</p>
              </div>
            ) : (
              healthData.map((health, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(health.status)}
                    <div>
                      <h4 className="font-medium">{health.component}</h4>
                      <p className="text-sm text-muted-foreground">{health.message}</p>
                      {health.metrics && Object.keys(health.metrics).length > 0 && (
                        <details className="text-xs text-muted-foreground mt-1">
                          <summary className="cursor-pointer">Détails techniques</summary>
                          <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto">
                            {JSON.stringify(health.metrics, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(health.status)}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                memoryManager.clear();
                logger.clearLogs();
                logger.info('Manual cleanup executed', {}, 'HEALTH');
              }}
            >
              Nettoyer le cache
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                queryOptimizer.clearCache();
                logger.info('Database cache cleared', {}, 'HEALTH');
              }}
            >
              Vider le cache DB
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                window.location.reload();
              }}
            >
              Redémarrer l'application
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};