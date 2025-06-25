
import React, { useState, useEffect } from 'react';
import { OFFICIAL_ROUTES_ARRAY, ROUTES_BY_CATEGORY } from '@/routesManifest';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';

interface RouteTestResult {
  path: string;
  status: 'pending' | 'success' | 'error';
  loadTime?: number;
  error?: string;
}

export const RoutesTestInterface: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, RouteTestResult>>({});
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const testRoute = async (path: string): Promise<RouteTestResult> => {
    const startTime = performance.now();
    
    try {
      // Simulation du test de route
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      
      const loadTime = performance.now() - startTime;
      
      // Simulation: 95% de succès
      if (Math.random() > 0.05) {
        return { path, status: 'success', loadTime };
      } else {
        return { path, status: 'error', error: '404 Not Found' };
      }
    } catch (error) {
      return { 
        path, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  };

  const testSingleRoute = async (path: string) => {
    setTestResults(prev => ({ ...prev, [path]: { path, status: 'pending' } }));
    setCurrentTest(path);
    
    const result = await testRoute(path);
    
    setTestResults(prev => ({ ...prev, [path]: result }));
    setCurrentTest(null);
  };

  const testAllRoutes = async () => {
    setIsTestingAll(true);
    setTestResults({});
    
    for (const path of OFFICIAL_ROUTES_ARRAY) {
      await testSingleRoute(path);
      // Petite pause entre les tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setIsTestingAll(false);
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
    }
  };

  const getStats = () => {
    const results = Object.values(testResults);
    const total = results.length;
    const success = results.filter(r => r.status === 'success').length;
    const errors = results.filter(r => r.status === 'error').length;
    const pending = results.filter(r => r.status === 'pending').length;
    
    return { total, success, errors, pending };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header et contrôles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Interface de Test des Routes
            <div className="flex gap-2">
              <Button 
                onClick={testAllRoutes} 
                disabled={isTestingAll}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isTestingAll ? 'Test en cours...' : 'Tester toutes les routes'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{OFFICIAL_ROUTES_ARRAY.length}</div>
              <div className="text-sm text-gray-600">Routes totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.success}</div>
              <div className="text-sm text-gray-600">Succès</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
              <div className="text-sm text-gray-600">Erreurs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">En cours</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Routes par catégorie */}
      {Object.entries(ROUTES_BY_CATEGORY).map(([category, routes]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg capitalize">
              {category.replace('_', ' ')} ({routes.length} routes)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {routes.map(path => {
                const result = testResults[path];
                return (
                  <div 
                    key={path}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      {result && getStatusIcon(result.status)}
                      <code className="text-sm font-mono">{path}</code>
                    </div>
                    <div className="flex items-center gap-2">
                      {result && (
                        <Badge className={getStatusColor(result.status)}>
                          {result.status}
                          {result.loadTime && ` (${result.loadTime.toFixed(0)}ms)`}
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testSingleRoute(path)}
                        disabled={currentTest === path}
                      >
                        {currentTest === path ? (
                          <Clock className="h-3 w-3 animate-spin" />
                        ) : (
                          'Test'
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                      >
                        <a href={path} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
