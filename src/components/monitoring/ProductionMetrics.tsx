// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Activity, Users, Zap, HardDrive } from 'lucide-react';
import { useProductionMonitoring } from '@/hooks/useProductionMonitoring';
import { GlobalInterceptor } from '@/utils/globalInterceptor';

const ProductionMetrics: React.FC = () => {
  const { metrics, alerts } = useProductionMonitoring();
  const apiStats = GlobalInterceptor.getAggregateStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Afficher seulement en développement ou si explicitement activé
  if (import.meta.env.PROD && !localStorage.getItem('show-metrics')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 w-80 z-50 space-y-2">
      {/* Alertes */}
      {alerts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {alerts.map((alert, index) => (
              <div key={index}>{alert}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Métriques principales */}
      <Card className="bg-background/95 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitoring Production
          </CardTitle>
          <CardDescription className="text-xs">
            Métriques temps réel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {/* Statut système */}
          <div className="flex justify-between items-center">
            <span>Statut système:</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(metrics.healthStatus)}`} />
              <span className="capitalize">{metrics.healthStatus}</span>
            </div>
          </div>

          {/* Performance */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Performance:</span>
              <span className={getPerformanceColor(metrics.performanceScore)}>
                {metrics.performanceScore}%
              </span>
            </div>
            <Progress value={metrics.performanceScore} className="h-1" />
          </div>

          {/* Utilisateurs actifs */}
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Utilisateurs:
            </span>
            <Badge variant="outline">{metrics.userCount}</Badge>
          </div>

          {/* Latence API */}
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              API latence:
            </span>
            <Badge variant={apiStats.averageLatency > 500 ? 'destructive' : 'default'}>
              {apiStats.averageLatency}ms
            </Badge>
          </div>

          {/* Mémoire */}
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              Mémoire:
            </span>
            <Badge variant="outline">{metrics.memoryUsage}MB</Badge>
          </div>

          {/* Erreurs */}
          {metrics.errorCount > 0 && (
            <div className="flex justify-between items-center">
              <span>Erreurs (1h):</span>
              <Badge variant="destructive">{metrics.errorCount}</Badge>
            </div>
          )}

          {/* Taux d'erreur API */}
          {apiStats.errorRate > 0 && (
            <div className="flex justify-between items-center">
              <span>Erreurs API:</span>
              <Badge variant="destructive">{apiStats.errorRate}%</Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionMetrics;
