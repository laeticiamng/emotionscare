// @ts-nocheck
/**
 * Dashboard de monitoring des APIs
 * Affiche l'état de toutes les APIs en temps réel
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Clock,
  Activity,
  Server,
  Zap
} from 'lucide-react';
import { useApiMonitoring } from '@/hooks/useApiMonitoring';
import { ApiStatus } from '@/services/apiMonitoring';

const ApiStatusDashboard: React.FC = () => {
  const {
    report,
    isLoading,
    error,
    lastUpdate,
    refresh,
    quickCheck,
    isHealthy,
    isDegraded,
    isCritical,
    healthyCount,
    failedCount,
    totalCount,
    averageResponseTime,
    healthyApis,
    failedApis
  } = useApiMonitoring({
    autoRefresh: true,
    refreshInterval: 30000, // 30 secondes
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (isConnected: boolean) => {
    return isConnected ? 'success' : 'destructive';
  };

  const ApiStatusCard: React.FC<{ api: ApiStatus }> = ({ api }) => (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {api.isConnected ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="font-medium text-sm">{api.name}</span>
          </div>
          <Badge variant={getStatusColor(api.isConnected)} className="text-xs">
            {api.isConnected ? 'OK' : 'ERREUR'}
          </Badge>
        </div>
        
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Temps de réponse:</span>
            <span className="font-mono">{Math.round(api.responseTime)}ms</span>
          </div>
          
          <div className="flex justify-between">
            <span>Dernière vérif:</span>
            <span className="font-mono">
              {api.lastChecked.toLocaleTimeString()}
            </span>
          </div>
          
          {api.error && (
            <div className="text-red-500 text-xs mt-2 p-2 bg-red-50 rounded">
              {api.error}
            </div>
          )}
          
          {api.details && (
            <div className="text-gray-500 text-xs mt-2 p-2 bg-gray-50 rounded font-mono">
              {JSON.stringify(api.details, null, 2).substring(0, 100)}...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            Erreur de monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec statut global */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Monitoring des APIs
              </CardTitle>
              <CardDescription>
                Surveillance en temps réel de toutes les APIs critiques
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={quickCheck}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <Zap className="h-4 w-4 mr-2" />
                Test rapide
              </Button>
              <Button
                onClick={refresh}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {report && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Statut global */}
              <div className="flex items-center gap-3">
                {getStatusIcon(report.overallStatus)}
                <div>
                  <div className="font-medium capitalize">
                    {report.overallStatus === 'healthy' ? 'Excellent' :
                     report.overallStatus === 'degraded' ? 'Dégradé' : 'Critique'}
                  </div>
                  <div className="text-sm text-gray-500">Statut global</div>
                </div>
              </div>

              {/* APIs fonctionnelles */}
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">{healthyCount}/{totalCount}</div>
                  <div className="text-sm text-gray-500">APIs fonctionnelles</div>
                </div>
              </div>

              {/* Temps de réponse moyen */}
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">{averageResponseTime}ms</div>
                  <div className="text-sm text-gray-500">Temps moyen</div>
                </div>
              </div>

              {/* Dernière mise à jour */}
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium">
                    {lastUpdate?.toLocaleTimeString() || '--:--:--'}
                  </div>
                  <div className="text-sm text-gray-500">Dernière màj</div>
                </div>
              </div>
            </div>
          )}

          {/* Barre de progression */}
          {report && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Disponibilité globale</span>
                <span className="text-sm font-medium">
                  {Math.round((healthyCount / totalCount) * 100)}%
                </span>
              </div>
              <Progress 
                value={(healthyCount / totalCount) * 100} 
                className="h-2"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Détail des APIs */}
      {report && (
        <>
          {/* APIs en erreur (priorité) */}
          {failedApis.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  APIs en erreur ({failedApis.length})
                </CardTitle>
                <CardDescription>
                  Ces APIs nécessitent une attention immédiate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {failedApis.map((api) => (
                    <ApiStatusCard key={api.name} api={api} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* APIs fonctionnelles */}
          {healthyApis.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  APIs fonctionnelles ({healthyApis.length})
                </CardTitle>
                <CardDescription>
                  Ces APIs fonctionnent correctement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {healthyApis.map((api) => (
                    <ApiStatusCard key={api.name} api={api} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {isLoading && !report && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Vérification des APIs en cours...</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApiStatusDashboard;