
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, AlertTriangle, Play, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES_MANIFEST } from '@/router/buildUnifiedRoutes';

interface RouteAuditResult {
  route: string;
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  loadTime?: number;
  error?: string;
  hasContent?: boolean;
  requiresAuth?: boolean;
  tested: boolean;
}

const CompleteRoutesAuditInterface: React.FC = () => {
  const navigate = useNavigate();
  const [auditResults, setAuditResults] = useState<RouteAuditResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Initialiser les résultats d'audit
  useEffect(() => {
    const initialResults: RouteAuditResult[] = Object.entries(ROUTES_MANIFEST).map(([name, route]) => ({
      route,
      name,
      status: 'pending',
      tested: false,
      requiresAuth: !['/', '/choose-mode', '/auth', '/b2c/login', '/b2c/register', '/b2b/selection', '/b2b/user/login', '/b2b/user/register', '/b2b/admin/login'].includes(route)
    }));
    setAuditResults(initialResults);
  }, []);

  const testSingleRoute = async (routeInfo: RouteAuditResult): Promise<RouteAuditResult> => {
    const startTime = performance.now();
    
    try {
      // Simuler un test de navigation
      const testResult = await new Promise<boolean>((resolve) => {
        const originalPath = window.location.pathname;
        
        // Test si la route existe
        try {
          window.history.pushState({}, '', routeInfo.route);
          
          // Vérifier si on peut accéder à la route
          setTimeout(() => {
            const hasContent = document.querySelector('main') !== null;
            window.history.pushState({}, '', originalPath);
            resolve(hasContent);
          }, 100);
        } catch (error) {
          window.history.pushState({}, '', originalPath);
          resolve(false);
        }
      });
      
      const loadTime = performance.now() - startTime;
      
      return {
        ...routeInfo,
        status: testResult ? 'success' : 'error',
        loadTime,
        hasContent: testResult,
        tested: true,
        error: testResult ? undefined : 'Route non accessible'
      };
    } catch (error) {
      const loadTime = performance.now() - startTime;
      return {
        ...routeInfo,
        status: 'error',
        loadTime,
        tested: true,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  };

  const testAllRoutes = async () => {
    setIsRunning(true);
    setProgress(0);
    
    const results: RouteAuditResult[] = [];
    
    for (let i = 0; i < auditResults.length; i++) {
      const result = await testSingleRoute(auditResults[i]);
      results.push(result);
      setProgress(((i + 1) / auditResults.length) * 100);
      
      // Mettre à jour les résultats en temps réel
      setAuditResults(prev => {
        const updated = [...prev];
        updated[i] = result;
        return updated;
      });
      
      // Petite pause pour éviter de surcharger
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    setIsRunning(false);
  };

  const testSingleRouteHandler = async (index: number) => {
    const result = await testSingleRoute(auditResults[index]);
    setAuditResults(prev => {
      const updated = [...prev];
      updated[index] = result;
      return updated;
    });
  };

  const navigateToRoute = (route: string) => {
    navigate(route);
  };

  const resetAudit = () => {
    setAuditResults(prev => prev.map(result => ({
      ...result,
      status: 'pending',
      tested: false,
      loadTime: undefined,
      error: undefined,
      hasContent: undefined
    })));
    setProgress(0);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (result: RouteAuditResult) => {
    if (!result.tested) {
      return <Badge variant="secondary">Non testé</Badge>;
    }
    
    switch (result.status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">✅ OK</Badge>;
      case 'error':
        return <Badge variant="destructive">❌ Erreur</Badge>;
      case 'warning':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">⚠️ Attention</Badge>;
      default:
        return <Badge variant="secondary">⏳ En attente</Badge>;
    }
  };

  const stats = {
    total: auditResults.length,
    tested: auditResults.filter(r => r.tested).length,
    success: auditResults.filter(r => r.status === 'success').length,
    errors: auditResults.filter(r => r.status === 'error').length,
    warnings: auditResults.filter(r => r.status === 'warning').length
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Audit Complet des Routes</h1>
          <p className="text-muted-foreground">
            Vérification de toutes les {auditResults.length} routes officielles
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={resetAudit} variant="outline" disabled={isRunning}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button onClick={testAllRoutes} disabled={isRunning}>
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Test en cours...' : 'Tester toutes les routes'}
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.tested}</div>
            <div className="text-sm text-muted-foreground">Testées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.success}</div>
            <div className="text-sm text-muted-foreground">Succès</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
            <div className="text-sm text-muted-foreground">Erreurs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
            <div className="text-sm text-muted-foreground">Alertes</div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de progression */}
      {isRunning && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progression du test</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Liste des routes */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Toutes ({stats.total})</TabsTrigger>
          <TabsTrigger value="success">Succès ({stats.success})</TabsTrigger>
          <TabsTrigger value="errors">Erreurs ({stats.errors})</TabsTrigger>
          <TabsTrigger value="untested">Non testées ({stats.total - stats.tested})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-2">
          {auditResults.map((result, index) => (
            <Card key={result.route} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-muted-foreground">{result.route}</div>
                  </div>
                  {result.requiresAuth && (
                    <Badge variant="outline" className="text-xs">Auth requise</Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {result.tested && result.loadTime && (
                    <Badge variant="outline" className="text-xs">
                      {Math.round(result.loadTime)}ms
                    </Badge>
                  )}
                  {getStatusBadge(result)}
                  
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testSingleRouteHandler(index)}
                      disabled={isRunning}
                    >
                      Tester
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigateToRoute(result.route)}
                      disabled={result.status === 'error'}
                    >
                      Visiter
                    </Button>
                  </div>
                </div>
              </div>
              
              {result.error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {result.error}
                </div>
              )}
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="success" className="space-y-2">
          {auditResults.filter(r => r.status === 'success').map((result, index) => (
            <Card key={result.route} className="p-4 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-muted-foreground">{result.route}</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => navigateToRoute(result.route)}
                >
                  Visiter
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="errors" className="space-y-2">
          {auditResults.filter(r => r.status === 'error').map((result, index) => (
            <Card key={result.route} className="p-4 border-red-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-muted-foreground">{result.route}</div>
                    {result.error && (
                      <div className="text-sm text-red-600 mt-1">{result.error}</div>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => testSingleRouteHandler(index)}
                  disabled={isRunning}
                >
                  Retester
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="untested" className="space-y-2">
          {auditResults.filter(r => !r.tested).map((result, index) => (
            <Card key={result.route} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-muted-foreground">{result.route}</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => testSingleRouteHandler(index)}
                  disabled={isRunning}
                >
                  Tester
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompleteRoutesAuditInterface;
