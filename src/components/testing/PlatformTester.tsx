import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertCircle, Play, Download } from 'lucide-react';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';

interface TestResult {
  route: string;
  status: 'success' | 'error' | 'warning';
  loadTime: number;
  errors: string[];
  warnings: string[];
  screenshot?: string;
}

export const PlatformTester: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState('');

  const testRoute = useCallback(async (route: string): Promise<TestResult> => {
    const startTime = performance.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Simuler navigation vers la route
      const testUrl = `${window.location.origin}${route}`;
      
      // Test de base : essayer de charger la route
      const response = await fetch(testUrl, { method: 'HEAD' });
      
      if (!response.ok) {
        errors.push(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Tester les éléments essentiels via DOM
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = testUrl;
      document.body.appendChild(iframe);

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout: Page took too long to load'));
        }, 10000);

        iframe.onload = () => {
          clearTimeout(timeout);
          try {
            const doc = iframe.contentDocument;
            if (!doc) {
              warnings.push('Cannot access iframe content (CORS)');
              resolve(true);
              return;
            }

            // Vérifier les éléments de base
            const main = doc.querySelector('main[data-testid="page-root"]');
            if (!main) {
              errors.push('Missing main[data-testid="page-root"] element');
            }

            const errorElements = doc.querySelectorAll('[data-testid*="error"]');
            if (errorElements.length > 0) {
              errors.push(`Found ${errorElements.length} error elements`);
            }

            // Vérifier le titre
            if (!doc.title || doc.title.includes('404')) {
              warnings.push('Missing or invalid page title');
            }

            // Vérifier les liens cassés
            const links = doc.querySelectorAll('a[href]');
            links.forEach((link) => {
              const href = link.getAttribute('href');
              if (href?.includes('undefined') || href?.includes('null')) {
                warnings.push(`Broken link detected: ${href}`);
              }
            });

            resolve(true);
          } catch (e) {
            warnings.push(`DOM inspection error: ${e.message}`);
            resolve(true);
          }
        };

        iframe.onerror = () => {
          clearTimeout(timeout);
          errors.push('Failed to load iframe');
          resolve(true);
        };
      });

      document.body.removeChild(iframe);

    } catch (error) {
      errors.push(`Test error: ${error.message}`);
    }

    const loadTime = performance.now() - startTime;
    const status = errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'success';

    return {
      route,
      status,
      loadTime,
      errors,
      warnings
    };
  }, []);

  const runFullTest = useCallback(async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);

    const routes = Object.values(UNIFIED_ROUTES);
    const totalRoutes = routes.length;

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      setCurrentTest(route);
      setProgress((i / totalRoutes) * 100);

      const result = await testRoute(route);
      setResults(prev => [...prev, result]);

      // Pause courte pour éviter de surcharger
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setProgress(100);
    setCurrentTest('');
    setIsRunning(false);
  }, [testRoute]);

  const generateReport = useCallback(() => {
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    const warningCount = results.filter(r => r.status === 'warning').length;
    const avgLoadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / results.length;

    const report = {
      summary: {
        total: results.length,
        success: successCount,
        errors: errorCount,
        warnings: warningCount,
        avgLoadTime: Math.round(avgLoadTime)
      },
      details: results,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `platform-test-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const warningCount = results.filter(r => r.status === 'warning').length;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Testeur Automatisé de Plateforme - EmotionsCare
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={runFullTest} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Test en cours...' : 'Lancer le test complet'}
            </Button>
            {results.length > 0 && (
              <Button 
                onClick={generateReport} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Télécharger le rapport
              </Button>
            )}
          </div>

          {isRunning && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Test en cours: {currentTest} ({Math.round(progress)}%)
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold text-green-500">{successCount}</p>
                      <p className="text-sm text-muted-foreground">Succès</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-2xl font-bold text-red-500">{errorCount}</p>
                      <p className="text-sm text-muted-foreground">Erreurs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold text-yellow-500">{warningCount}</p>
                      <p className="text-sm text-muted-foreground">Avertissements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div>
                    <p className="text-2xl font-bold">{results.length}</p>
                    <p className="text-sm text-muted-foreground">Routes testées</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats détaillés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <span className="font-mono text-sm">{result.route}</span>
                    <Badge variant={result.status === 'success' ? 'default' : result.status === 'error' ? 'destructive' : 'secondary'}>
                      {result.loadTime.toFixed(0)}ms
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    {result.errors.length > 0 && (
                      <Badge variant="destructive">{result.errors.length} erreurs</Badge>
                    )}
                    {result.warnings.length > 0 && (
                      <Badge variant="secondary">{result.warnings.length} avertissements</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {results.some(r => r.errors.length > 0 || r.warnings.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Détails des problèmes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.filter(r => r.errors.length > 0 || r.warnings.length > 0).map((result, index) => (
                <div key={index} className="border-l-4 border-l-red-500 pl-4">
                  <h4 className="font-medium">{result.route}</h4>
                  {result.errors.map((error, i) => (
                    <p key={i} className="text-sm text-red-600">❌ {error}</p>
                  ))}
                  {result.warnings.map((warning, i) => (
                    <p key={i} className="text-sm text-yellow-600">⚠️ {warning}</p>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};