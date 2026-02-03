/**
 * DiagnosticsPanel - Panneau de diagnostics dev-only
 * Affiche les informations système pour le débogage
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Bug, 
  User, 
  Server, 
  Wifi, 
  WifiOff, 
  Clock, 
  ChevronDown,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface DiagnosticsData {
  auth: {
    userId: string | null;
    email: string | null;
    isAuthenticated: boolean;
    sessionExpiry: string | null;
  };
  environment: {
    mode: string;
    supabaseUrl: string;
    buildTime: string;
  };
  network: {
    online: boolean;
    latency: number | null;
    lastApiCall: string | null;
    lastApiError: string | null;
  };
  performance: {
    memoryUsage: string | null;
    loadTime: number;
  };
}

export const DiagnosticsPanel: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [diagnostics, setDiagnostics] = useState<DiagnosticsData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Only show in development
  if (import.meta.env.PROD) return null;

  const runDiagnostics = async () => {
    setIsRefreshing(true);
    
    // Measure API latency
    const startTime = performance.now();
    let latency: number | null = null;
    let lastError: string | null = null;
    
    try {
      await supabase.from('profiles').select('count').limit(1);
      latency = Math.round(performance.now() - startTime);
    } catch (error) {
      lastError = (error as Error).message;
    }

    // Get session info
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;

    // Memory usage (if available)
    let memoryUsage: string | null = null;
    if ('memory' in performance) {
      const memory = (performance as unknown as { memory: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
      const limitMB = Math.round(memory.jsHeapSizeLimit / 1048576);
      memoryUsage = `${usedMB}MB / ${limitMB}MB`;
    }

    setDiagnostics({
      auth: {
        userId: user?.id || null,
        email: user?.email || null,
        isAuthenticated,
        sessionExpiry: session?.expires_at 
          ? new Date(session.expires_at * 1000).toLocaleString() 
          : null,
      },
      environment: {
        mode: import.meta.env.MODE,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL?.slice(0, 30) + '...',
        buildTime: new Date().toISOString(),
      },
      network: {
        online: navigator.onLine,
        latency,
        lastApiCall: new Date().toLocaleTimeString(),
        lastApiError: lastError,
      },
      performance: {
        memoryUsage,
        loadTime: Math.round(performance.now()),
      },
    });

    setIsRefreshing(false);
  };

  useEffect(() => {
    if (isOpen && !diagnostics) {
      runDiagnostics();
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'gap-2 bg-background/80 backdrop-blur-sm shadow-lg',
              isOpen && 'rounded-b-none'
            )}
          >
            <Bug className="h-4 w-4" />
            Diagnostics
            <ChevronDown className={cn(
              'h-4 w-4 transition-transform',
              isOpen && 'rotate-180'
            )} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <Card className="w-80 rounded-t-none border-t-0 shadow-lg">
            <CardHeader className="py-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Système</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={runDiagnostics}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn(
                  'h-3 w-3',
                  isRefreshing && 'animate-spin'
                )} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {diagnostics ? (
                <>
                  {/* Auth */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-medium">
                      <User className="h-3 w-3" />
                      Auth
                    </div>
                    <div className="pl-5 space-y-1 text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Status</span>
                        <Badge 
                          variant={diagnostics.auth.isAuthenticated ? 'default' : 'destructive'}
                          className="h-4 text-[10px]"
                        >
                          {diagnostics.auth.isAuthenticated ? 'Connecté' : 'Déconnecté'}
                        </Badge>
                      </div>
                      {diagnostics.auth.userId && (
                        <div className="flex justify-between">
                          <span>User ID</span>
                          <span className="font-mono">{diagnostics.auth.userId.slice(0, 8)}...</span>
                        </div>
                      )}
                      {diagnostics.auth.sessionExpiry && (
                        <div className="flex justify-between">
                          <span>Expiration</span>
                          <span>{diagnostics.auth.sessionExpiry}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Environment */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-medium">
                      <Server className="h-3 w-3" />
                      Environnement
                    </div>
                    <div className="pl-5 space-y-1 text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Mode</span>
                        <Badge variant="outline" className="h-4 text-[10px]">
                          {diagnostics.environment.mode}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Supabase</span>
                        <span className="font-mono truncate max-w-[120px]">
                          {diagnostics.environment.supabaseUrl}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Network */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-medium">
                      {diagnostics.network.online ? (
                        <Wifi className="h-3 w-3 text-success" />
                      ) : (
                        <WifiOff className="h-3 w-3 text-destructive" />
                      )}
                      Réseau
                    </div>
                    <div className="pl-5 space-y-1 text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Status</span>
                        <Badge 
                          variant={diagnostics.network.online ? 'default' : 'destructive'}
                          className="h-4 text-[10px]"
                        >
                          {diagnostics.network.online ? 'En ligne' : 'Hors ligne'}
                        </Badge>
                      </div>
                      {diagnostics.network.latency && (
                        <div className="flex justify-between">
                          <span>Latence API</span>
                          <span className={cn(
                            diagnostics.network.latency > 500 ? 'text-warning' : 'text-success'
                          )}>
                            {diagnostics.network.latency}ms
                          </span>
                        </div>
                      )}
                      {diagnostics.network.lastApiError && (
                        <div className="flex items-start gap-1 text-destructive">
                          <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span className="truncate">{diagnostics.network.lastApiError}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-medium">
                      <Clock className="h-3 w-3" />
                      Performance
                    </div>
                    <div className="pl-5 space-y-1 text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Load Time</span>
                        <span>{diagnostics.performance.loadTime}ms</span>
                      </div>
                      {diagnostics.performance.memoryUsage && (
                        <div className="flex justify-between">
                          <span>Mémoire</span>
                          <span>{diagnostics.performance.memoryUsage}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center py-4">
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Chargement...
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default DiagnosticsPanel;
