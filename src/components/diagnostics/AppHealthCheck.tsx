import React, { useEffect, useState, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Activity, Database, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { logger } from '@/lib/logger';

interface HealthCheck {
  name: string;
  status: 'ok' | 'error' | 'warning';
  message: string;
  details?: string;
  category: 'system' | 'database' | 'security' | 'performance';
  latency?: number;
}

interface SystemMetrics {
  totalChecks: number;
  passedChecks: number;
  warningChecks: number;
  failedChecks: number;
  avgLatency: number;
}

const AppHealthCheck: React.FC = memo(() => {
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runHealthChecks = useCallback(async () => {
    setIsLoading(true);
    const healthChecks: HealthCheck[] = [];
    const startTime = performance.now();

    // Check React rendering
    healthChecks.push({
      name: 'React Rendering',
      status: 'ok',
      message: 'Composants React montés correctement',
      category: 'system',
      latency: Math.round(performance.now() - startTime),
    });

    // Check Supabase connection with latency
    try {
      const supabaseStart = performance.now();
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.auth.getSession();
      const supabaseLatency = Math.round(performance.now() - supabaseStart);
      
      if (error) {
        healthChecks.push({
          name: 'Connexion Supabase',
          status: 'warning',
          message: 'Problème de connexion Supabase',
          details: error.message,
          category: 'database',
          latency: supabaseLatency,
        });
      } else {
        healthChecks.push({
          name: 'Connexion Supabase',
          status: 'ok',
          message: `Connecté (${supabaseLatency}ms)`,
          category: 'database',
          latency: supabaseLatency,
        });
      }

      // Check database query
      const dbStart = performance.now();
      const { error: dbError } = await supabase.from('profiles').select('id').limit(1);
      const dbLatency = Math.round(performance.now() - dbStart);
      
      healthChecks.push({
        name: 'Requêtes Database',
        status: dbError ? 'warning' : 'ok',
        message: dbError ? 'Erreur requête DB' : `Opérationnel (${dbLatency}ms)`,
        details: dbError?.message,
        category: 'database',
        latency: dbLatency,
      });
    } catch (error) {
      healthChecks.push({
        name: 'Connexion Supabase',
        status: 'error',
        message: 'Échec connexion Supabase',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        category: 'database',
      });
    }

    // Check Router
    try {
      const currentPath = window.location.pathname;
      healthChecks.push({
        name: 'Router',
        status: 'ok',
        message: `Route active: ${currentPath}`,
        category: 'system',
      });
    } catch (error) {
      healthChecks.push({
        name: 'Router',
        status: 'error',
        message: 'Erreur Router',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        category: 'system',
      });
    }

    // Check LocalStorage
    try {
      const testKey = '__health_check_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      healthChecks.push({
        name: 'LocalStorage',
        status: 'ok',
        message: 'Stockage local disponible',
        category: 'system',
      });
    } catch {
      healthChecks.push({
        name: 'LocalStorage',
        status: 'warning',
        message: 'LocalStorage indisponible',
        category: 'system',
      });
    }

    // Check HTTPS
    healthChecks.push({
      name: 'Connexion Sécurisée',
      status: window.location.protocol === 'https:' ? 'ok' : 'warning',
      message: window.location.protocol === 'https:' ? 'HTTPS actif' : 'HTTP non sécurisé',
      category: 'security',
    });

    // Check Service Worker
    healthChecks.push({
      name: 'Service Worker',
      status: 'serviceWorker' in navigator ? 'ok' : 'warning',
      message: 'serviceWorker' in navigator ? 'PWA disponible' : 'PWA non supporté',
      category: 'performance',
    });

    // Check Memory (if available)
    if ('memory' in performance) {
      const memory = (performance as unknown as { memory: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
      const usagePercent = Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100);
      
      healthChecks.push({
        name: 'Mémoire',
        status: usagePercent < 70 ? 'ok' : usagePercent < 90 ? 'warning' : 'error',
        message: `${usedMB}MB / ${limitMB}MB (${usagePercent}%)`,
        category: 'performance',
      });
    }

    // Calculate metrics
    const passed = healthChecks.filter(c => c.status === 'ok').length;
    const warnings = healthChecks.filter(c => c.status === 'warning').length;
    const failed = healthChecks.filter(c => c.status === 'error').length;
    const latencies = healthChecks.filter(c => c.latency).map(c => c.latency!);
    const avgLatency = latencies.length > 0 
      ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      : 0;

    setMetrics({
      totalChecks: healthChecks.length,
      passedChecks: passed,
      warningChecks: warnings,
      failedChecks: failed,
      avgLatency,
    });

    setChecks(healthChecks);
    setLastRun(new Date());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    runHealthChecks();
  }, [runHealthChecks]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-5 w-5 text-success" aria-hidden="true" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-warning" aria-hidden="true" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" aria-hidden="true" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" aria-hidden="true" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system':
        return <Activity className="h-4 w-4" aria-hidden="true" />;
      case 'database':
        return <Database className="h-4 w-4" aria-hidden="true" />;
      case 'security':
        return <Shield className="h-4 w-4" aria-hidden="true" />;
      case 'performance':
        return <Zap className="h-4 w-4" aria-hidden="true" />;
      default:
        return null;
    }
  };

  const healthScore = metrics 
    ? Math.round((metrics.passedChecks / metrics.totalChecks) * 100)
    : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" aria-hidden="true" />
            Diagnostic en cours...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={33} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Vérification des systèmes...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Diagnostic Système
              <Badge 
                variant={healthScore >= 80 ? 'default' : healthScore >= 50 ? 'secondary' : 'destructive'}
              >
                {healthScore}%
              </Badge>
            </CardTitle>
            <CardDescription>
              {lastRun && `Dernière vérification: ${lastRun.toLocaleTimeString()}`}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runHealthChecks}
            aria-label="Relancer le diagnostic"
          >
            <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
            Relancer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metrics Summary */}
        {metrics && (
          <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{metrics.passedChecks}</div>
              <div className="text-xs text-muted-foreground">OK</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{metrics.warningChecks}</div>
              <div className="text-xs text-muted-foreground">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{metrics.failedChecks}</div>
              <div className="text-xs text-muted-foreground">Erreurs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{metrics.avgLatency}ms</div>
              <div className="text-xs text-muted-foreground">Latence moy.</div>
            </div>
          </div>
        )}

        {/* Health Checks List */}
        <div className="space-y-2">
          {checks.map((check, index) => (
            <div 
              key={index} 
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              {getStatusIcon(check.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{check.name}</h4>
                  <span className="text-muted-foreground">
                    {getCategoryIcon(check.category)}
                  </span>
                  {check.latency && (
                    <Badge variant="outline" className="text-xs">
                      {check.latency}ms
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{check.message}</p>
                {check.details && (
                  <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-x-auto">
                    {check.details}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

AppHealthCheck.displayName = 'AppHealthCheck';

export default AppHealthCheck;
