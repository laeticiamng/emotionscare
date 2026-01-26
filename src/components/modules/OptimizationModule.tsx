// @ts-nocheck
import React, { useState } from 'react';
import { useOptimization } from '@/providers/OptimizationProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gauge, Zap, Database, Globe, MemoryStick, 
  Clock, TrendingUp, AlertTriangle, CheckCircle,
  RefreshCw, Settings, BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

export const OptimizationModule: React.FC = () => {
  const {
    performanceScore,
    cacheStats,
    webVitals,
    optimizationsEnabled,
    toggleOptimizations,
    preloadResources,
    clearCache
  } = useOptimization();

  const [isPreloading, setIsPreloading] = useState(false);
  const [lastOptimization, setLastOptimization] = useState<Date | null>(null);

  const handlePreloadResources = async () => {
    setIsPreloading(true);
    try {
      await preloadResources();
      toast.success('Ressources préchargées avec succès');
      setLastOptimization(new Date());
    } catch (error) {
      toast.error('Erreur lors du préchargement');
    } finally {
      setIsPreloading(false);
    }
  };

  const handleClearCache = () => {
    clearCache();
    toast.success('Cache vidé');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Bon';
    if (score >= 60) return 'Moyen';
    if (score >= 40) return 'Faible';
    return 'Critique';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Optimisation & Performance</h1>
            <p className="text-muted-foreground">
              Surveillance et optimisation en temps réel de l'application
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Optimisations:</span>
          <Switch
            checked={optimizationsEnabled}
            onCheckedChange={toggleOptimizations}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Score global */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Score Global</p>
                <p className={`text-2xl font-bold ${getScoreColor(performanceScore)}`}>
                  {performanceScore}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getScoreLabel(performanceScore)}
                </p>
              </div>
              <Gauge className={`h-8 w-8 ${getScoreColor(performanceScore)}`} />
            </div>
            <Progress value={performanceScore} className="mt-3" />
          </CardContent>
        </Card>

        {/* Cache */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cache</p>
                <p className="text-2xl font-bold">{cacheStats.size || 0}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(cacheStats.hitRate || 0)}% hits
                </p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={cacheStats.hitRate || 0} className="mt-3" />
          </CardContent>
        </Card>

        {/* Mémoire */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mémoire</p>
                <p className="text-2xl font-bold">
                  {formatBytes((cacheStats.memory || 0) * 1024)}
                </p>
                <p className="text-xs text-muted-foreground">Cache utilisé</p>
              </div>
              <MemoryStick className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        {/* Statut */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Statut</p>
                <div className="flex items-center gap-2">
                  {optimizationsEnabled ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  )}
                  <span className="font-medium">
                    {optimizationsEnabled ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
              <Settings className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Métriques
          </TabsTrigger>
          <TabsTrigger value="cache" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Cache
          </TabsTrigger>
          <TabsTrigger value="actions" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Actions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Web Vitals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Web Vitals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* First Contentful Paint */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>First Contentful Paint</span>
                    <span className={webVitals.fcp && webVitals.fcp > 1500 ? 'text-red-600' : 'text-green-600'}>
                      {webVitals.fcp ? `${Math.round(webVitals.fcp)}ms` : 'N/A'}
                    </span>
                  </div>
                  <Progress 
                    value={webVitals.fcp ? Math.min((webVitals.fcp / 1500) * 100, 100) : 0} 
                    className="h-2" 
                  />
                </div>

                {/* Largest Contentful Paint */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Largest Contentful Paint</span>
                    <span className={webVitals.lcp && webVitals.lcp > 2500 ? 'text-red-600' : 'text-green-600'}>
                      {webVitals.lcp ? `${Math.round(webVitals.lcp)}ms` : 'N/A'}
                    </span>
                  </div>
                  <Progress 
                    value={webVitals.lcp ? Math.min((webVitals.lcp / 2500) * 100, 100) : 0} 
                    className="h-2" 
                  />
                </div>

                {/* Cumulative Layout Shift */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cumulative Layout Shift</span>
                    <span className={webVitals.cls && webVitals.cls > 0.1 ? 'text-red-600' : 'text-green-600'}>
                      {webVitals.cls ? webVitals.cls.toFixed(3) : 'N/A'}
                    </span>
                  </div>
                  <Progress 
                    value={webVitals.cls ? Math.min((webVitals.cls / 0.1) * 100, 100) : 0} 
                    className="h-2" 
                  />
                </div>

                {/* First Input Delay */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>First Input Delay</span>
                    <span className={webVitals.fid && webVitals.fid > 100 ? 'text-red-600' : 'text-green-600'}>
                      {webVitals.fid ? `${Math.round(webVitals.fid)}ms` : 'N/A'}
                    </span>
                  </div>
                  <Progress 
                    value={webVitals.fid ? Math.min((webVitals.fid / 100) * 100, 100) : 0} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recommandations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recommandations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {performanceScore < 60 && (
                    <div className="flex gap-3 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-900">Performance critique</p>
                        <p className="text-sm text-red-700">
                          Activez les optimisations et videz le cache
                        </p>
                      </div>
                    </div>
                  )}

                  {webVitals.lcp && webVitals.lcp > 2500 && (
                    <div className="flex gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900">Chargement lent</p>
                        <p className="text-sm text-yellow-700">
                          Préchargez les ressources critiques
                        </p>
                      </div>
                    </div>
                  )}

                  {cacheStats.hitRate < 50 && (
                    <div className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                      <Database className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Cache inefficace</p>
                        <p className="text-sm text-blue-700">
                          Taux de succès faible du cache
                        </p>
                      </div>
                    </div>
                  )}

                  {performanceScore >= 80 && (
                    <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">Excellente performance</p>
                        <p className="text-sm text-green-700">
                          Votre application fonctionne de manière optimale
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cache" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques du Cache</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{cacheStats.size || 0}</div>
                  <div className="text-sm text-muted-foreground">Éléments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{cacheStats.hits || 0}</div>
                  <div className="text-sm text-muted-foreground">Succès</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{cacheStats.misses || 0}</div>
                  <div className="text-sm text-muted-foreground">Échecs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatBytes((cacheStats.memory || 0) * 1024)}
                  </div>
                  <div className="text-sm text-muted-foreground">Mémoire</div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Taux de succès</span>
                  <span className="text-sm">{Math.round(cacheStats.hitRate || 0)}%</span>
                </div>
                <Progress value={cacheStats.hitRate || 0} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions d'Optimisation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handlePreloadResources}
                  disabled={isPreloading}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isPreloading ? 'animate-spin' : ''}`} />
                  {isPreloading ? 'Préchargement...' : 'Précharger les ressources'}
                </Button>

                <Button
                  onClick={handleClearCache}
                  variant="outline"
                  className="w-full"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Vider le cache
                </Button>

                <Button
                  onClick={toggleOptimizations}
                  variant={optimizationsEnabled ? "destructive" : "default"}
                  className="w-full"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {optimizationsEnabled ? 'Désactiver' : 'Activer'} les optimisations
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historique</CardTitle>
              </CardHeader>
              <CardContent>
                {lastOptimization ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Dernière optimisation:
                    </p>
                    <p className="font-medium">
                      {lastOptimization.toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aucune optimisation récente
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};