/**
 * Page dédiée au monitoring des APIs
 * Accessible via l'interface d'administration
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsContent as TabsPanel, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Server, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';
import ApiStatusDashboard from '@/components/monitoring/ApiStatusDashboard';
import { useApiMonitoring } from '@/hooks/useApiMonitoring';

const ApiMonitoringPage: React.FC = () => {
  const {
    report,
    isLoading,
    refresh,
    quickCheck,
    healthyApis,
    failedApis,
    averageResponseTime,
    lastUpdate
  } = useApiMonitoring();

  const exportReport = () => {
    if (!report) return;
    
    const reportData = {
      timestamp: report.timestamp,
      overallStatus: report.overallStatus,
      summary: report.summary,
      detailedResults: report.apis.map(api => ({
        name: api.name,
        status: api.isConnected ? 'OK' : 'FAILED',
        responseTime: api.responseTime,
        error: api.error,
        lastChecked: api.lastChecked
      }))
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-monitoring-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            Monitoring des APIs
          </h1>
          <p className="text-gray-600 mt-2">
            Surveillance en temps réel de l'état de toutes les APIs critiques d'EmotionsCare
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={exportReport}
            variant="outline"
            disabled={!report}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          
          <Button
            onClick={quickCheck}
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Test rapide
          </Button>
        </div>
      </div>

      {/* Métriques rapides */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Statut global</p>
                  <p className="text-2xl font-bold capitalize">
                    {report.overallStatus === 'healthy' ? 'Excellent' :
                     report.overallStatus === 'degraded' ? 'Dégradé' : 'Critique'}
                  </p>
                </div>
                {report.overallStatus === 'healthy' ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : report.overallStatus === 'degraded' ? (
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">APIs disponibles</p>
                  <p className="text-2xl font-bold">
                    {report.summary.healthy}/{report.summary.total}
                  </p>
                </div>
                <Server className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-2">
                <Badge variant={report.summary.failed === 0 ? 'default' : 'destructive'}>
                  {Math.round((report.summary.healthy / report.summary.total) * 100)}% disponibilité
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Temps de réponse</p>
                  <p className="text-2xl font-bold">{averageResponseTime}ms</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-2">
                <Badge variant={averageResponseTime < 1000 ? 'default' : 'secondary'}>
                  {averageResponseTime < 500 ? 'Excellent' :
                   averageResponseTime < 1000 ? 'Bon' :
                   averageResponseTime < 2000 ? 'Moyen' : 'Lent'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dernière vérification</p>
                  <p className="text-lg font-semibold">
                    {lastUpdate?.toLocaleTimeString() || 'Jamais'}
                  </p>
                </div>
                <RefreshCw className="h-8 w-8 text-gray-500" />
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">
                  {lastUpdate ? `il y a ${Math.round((Date.now() - lastUpdate.getTime()) / 1000)}s` : ''}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs principales */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">
            <Activity className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alertes ({failedApis.length})
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <ApiStatusDashboard />
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Alertes actives
              </CardTitle>
              <CardDescription>
                APIs en panne ou présentant des problèmes de performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {failedApis.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-600">
                    Aucune alerte active
                  </h3>
                  <p className="text-gray-600">
                    Toutes les APIs fonctionnent correctement
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {failedApis.map((api) => (
                    <div key={api.name} className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-red-800">{api.name}</h4>
                        <Badge variant="destructive">ERREUR</Badge>
                      </div>
                      <p className="text-red-700 text-sm mb-2">{api.error}</p>
                      <div className="flex justify-between text-xs text-red-600">
                        <span>Temps de réponse: {Math.round(api.responseTime)}ms</span>
                        <span>Dernière vérif: {api.lastChecked.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration du monitoring</CardTitle>
              <CardDescription>
                Paramètres de surveillance et d'alertes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Monitoring automatique
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Le monitoring s'exécute automatiquement toutes les 30 secondes.
                    Les alertes sont affichées en temps réel via des notifications toast.
                  </p>
                </div>
                
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Tests de connectivité
                  </h4>
                  <p className="text-green-700 text-sm">
                    Chaque API est testée individuellement avec des timeouts appropriés.
                    Les temps de réponse et erreurs sont enregistrés pour analyse.
                  </p>
                </div>
                
                <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                  <h4 className="font-semibold text-purple-800 mb-2">
                    Export des rapports
                  </h4>
                  <p className="text-purple-700 text-sm">
                    Les rapports peuvent être exportés au format JSON pour analyse externe
                    ou intégration avec des systèmes de monitoring tiers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiMonitoringPage;