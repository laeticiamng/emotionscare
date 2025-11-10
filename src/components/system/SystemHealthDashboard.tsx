import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { 
  Activity, 
  Database, 
  Cloud, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'down' | 'checking';
  responseTime?: number;
  lastCheck: Date;
  details?: string;
  critical: boolean;
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'down';
  checks: HealthCheck[];
  score: number;
  lastUpdate: Date;
}

/**
 * Dashboard de santé système avec vérification automatique toutes les 5 minutes
 * Vérifie les tables, Edge Functions et dépendances critiques
 */
export const SystemHealthDashboard: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth>({
    overall: 'checking' as any,
    checks: [],
    score: 0,
    lastUpdate: new Date(),
  });
  const [isChecking, setIsChecking] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  /**
   * Vérifie la santé d'une table Supabase
   */
  const checkTable = async (tableName: string, critical: boolean = true): Promise<HealthCheck> => {
    const startTime = Date.now();
    
    try {
      const { error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
        .limit(1);
      
      const responseTime = Date.now() - startTime;
      
      if (error) {
        return {
          name: `Table: ${tableName}`,
          status: 'down',
          responseTime,
          lastCheck: new Date(),
          details: error.message,
          critical,
        };
      }
      
      return {
        name: `Table: ${tableName}`,
        status: responseTime > 1000 ? 'degraded' : 'healthy',
        responseTime,
        lastCheck: new Date(),
        details: `${count || 0} enregistrements`,
        critical,
      };
    } catch (error: any) {
      return {
        name: `Table: ${tableName}`,
        status: 'down',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        details: error.message,
        critical,
      };
    }
  };

  /**
   * Vérifie la santé d'une Edge Function
   */
  const checkEdgeFunction = async (
    functionName: string, 
    path: string = '',
    critical: boolean = true
  ): Promise<HealthCheck> => {
    const startTime = Date.now();
    const fullPath = path ? `${functionName}/${path}` : functionName;
    
    try {
      const { error } = await supabase.functions.invoke(fullPath, {
        body: {},
      });
      
      const responseTime = Date.now() - startTime;
      
      // Certaines fonctions peuvent retourner des erreurs attendues (ex: pas de données)
      // On considère ça comme "sain" si le code d'erreur n'est pas critique
      const isHealthy = !error || error.message?.includes('not found') || error.message?.includes('no audit');
      
      return {
        name: `Edge Function: ${fullPath}`,
        status: isHealthy ? (responseTime > 5000 ? 'degraded' : 'healthy') : 'down',
        responseTime,
        lastCheck: new Date(),
        details: error?.message || 'Opérationnel',
        critical,
      };
    } catch (error: any) {
      return {
        name: `Edge Function: ${fullPath}`,
        status: 'down',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        details: error.message,
        critical,
      };
    }
  };

  /**
   * Vérifie la connexion Supabase générale
   */
  const checkSupabaseConnection = async (): Promise<HealthCheck> => {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.auth.getSession();
      const responseTime = Date.now() - startTime;
      
      if (error) {
        return {
          name: 'Connexion Supabase',
          status: 'down',
          responseTime,
          lastCheck: new Date(),
          details: error.message,
          critical: true,
        };
      }
      
      return {
        name: 'Connexion Supabase',
        status: responseTime > 500 ? 'degraded' : 'healthy',
        responseTime,
        lastCheck: new Date(),
        details: data.session ? 'Authentifié' : 'Session publique',
        critical: true,
      };
    } catch (error: any) {
      return {
        name: 'Connexion Supabase',
        status: 'down',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        details: error.message,
        critical: true,
      };
    }
  };

  /**
   * Vérifie localStorage
   */
  const checkLocalStorage = (): HealthCheck => {
    const startTime = Date.now();
    
    try {
      const testKey = 'health-check-test';
      localStorage.setItem(testKey, 'ok');
      const value = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      const responseTime = Date.now() - startTime;
      
      return {
        name: 'LocalStorage',
        status: value === 'ok' ? 'healthy' : 'down',
        responseTime,
        lastCheck: new Date(),
        details: 'Accessible',
        critical: false,
      };
    } catch (error: any) {
      return {
        name: 'LocalStorage',
        status: 'down',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        details: error.message,
        critical: false,
      };
    }
  };

  /**
   * Exécute tous les checks de santé
   */
  const runHealthChecks = useCallback(async () => {
    setIsChecking(true);
    
    try {
      // Vérifications parallèles pour performance
      const checks = await Promise.all([
        // Connexion de base
        checkSupabaseConnection(),
        checkLocalStorage(),
        
        // Tables critiques RGPD
        checkTable('privacy_policies', true),
        checkTable('policy_acceptances', true),
        checkTable('policy_changes', false),
        checkTable('profiles', true),
        checkTable('clinical_optins', false),
        
        // Edge Functions critiques
        checkEdgeFunction('compliance-audit', 'latest', true),
        checkEdgeFunction('compliance-audit', 'history', false),
        checkEdgeFunction('gdpr-alert-detector', '', true),
        checkEdgeFunction('dsar-handler', '', true),
        
        // Edge Functions secondaires
        checkEdgeFunction('health-check', '', false),
        checkEdgeFunction('gdpr-compliance-score', '', false),
      ]);
      
      // Calculer le score de santé global
      const totalChecks = checks.length;
      const healthyChecks = checks.filter(c => c.status === 'healthy').length;
      const degradedChecks = checks.filter(c => c.status === 'degraded').length;
      const criticalDown = checks.filter(c => c.critical && c.status === 'down').length;
      
      const score = Math.round((healthyChecks + degradedChecks * 0.5) / totalChecks * 100);
      
      // Déterminer le statut global
      let overall: 'healthy' | 'degraded' | 'down' = 'healthy';
      if (criticalDown > 0) {
        overall = 'down';
      } else if (degradedChecks > 0 || checks.some(c => c.status === 'down' && !c.critical)) {
        overall = 'degraded';
      }
      
      setHealth({
        overall,
        checks,
        score,
        lastUpdate: new Date(),
      });
    } catch (error) {
      console.error('Erreur lors des checks de santé:', error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Auto-refresh toutes les 5 minutes
  useEffect(() => {
    runHealthChecks();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        runHealthChecks();
      }, 5 * 60 * 1000); // 5 minutes
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, runHealthChecks]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5" />;
      case 'degraded': return <AlertTriangle className="h-5 w-5" />;
      case 'down': return <XCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5 animate-pulse" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      healthy: { label: 'Opérationnel', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
      degraded: { label: 'Dégradé', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
      down: { label: 'Hors ligne', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
      checking: { label: 'Vérification...', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    };
    const variant = variants[status] || variants.checking;
    return <Badge variant="outline" className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Santé du Système
          </h2>
          <p className="text-sm text-muted-foreground">
            Vérification automatique toutes les 5 minutes • Dernière mise à jour:{' '}
            {format(health.lastUpdate, 'HH:mm:ss', { locale: fr })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Zap className={`h-4 w-4 mr-2 ${autoRefresh ? 'text-primary' : ''}`} />
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={runHealthChecks}
            disabled={isChecking}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Score global */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Statut Global
                {getStatusBadge(health.overall)}
              </CardTitle>
              <CardDescription>
                Score de santé du système : {health.score}%
              </CardDescription>
            </div>
            <div className={`text-5xl font-bold ${getStatusColor(health.overall)}`}>
              {health.score}%
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={health.score} className="h-3" />
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-500">
                {health.checks.filter(c => c.status === 'healthy').length}
              </div>
              <div className="text-xs text-muted-foreground">Opérationnels</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">
                {health.checks.filter(c => c.status === 'degraded').length}
              </div>
              <div className="text-xs text-muted-foreground">Dégradés</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">
                {health.checks.filter(c => c.status === 'down').length}
              </div>
              <div className="text-xs text-muted-foreground">Hors ligne</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Détails des checks */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Tables */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Tables Supabase
            </CardTitle>
            <CardDescription>État des tables critiques</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {health.checks
              .filter(check => check.name.startsWith('Table:'))
              .map((check, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={getStatusColor(check.status)}>
                      {getStatusIcon(check.status)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{check.name.replace('Table: ', '')}</div>
                      <div className="text-xs text-muted-foreground">{check.details}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono">{check.responseTime}ms</div>
                    {check.critical && (
                      <Badge variant="outline" className="text-xs mt-1">Critique</Badge>
                    )}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Edge Functions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Edge Functions
            </CardTitle>
            <CardDescription>État des fonctions RGPD</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {health.checks
              .filter(check => check.name.startsWith('Edge Function:'))
              .map((check, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={getStatusColor(check.status)}>
                      {getStatusIcon(check.status)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{check.name.replace('Edge Function: ', '')}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {check.details}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono">{check.responseTime}ms</div>
                    {check.critical && (
                      <Badge variant="outline" className="text-xs mt-1">Critique</Badge>
                    )}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Dépendances système */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Dépendances Système
            </CardTitle>
            <CardDescription>Connexions et stockage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {health.checks
              .filter(check => !check.name.startsWith('Table:') && !check.name.startsWith('Edge Function:'))
              .map((check, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={getStatusColor(check.status)}>
                      {getStatusIcon(check.status)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{check.name}</div>
                      <div className="text-xs text-muted-foreground">{check.details}</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono">{check.responseTime}ms</div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemHealthDashboard;
