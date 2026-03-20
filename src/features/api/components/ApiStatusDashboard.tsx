/**
 * Dashboard de statut des APIs
 * Monitoring temps réel des Edge Functions et services
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Zap,
  Server
} from 'lucide-react';

interface ApiEndpoint {
  name: string;
  path: string;
  status: 'operational' | 'degraded' | 'down';
  latency: number;
  uptime: number;
  lastChecked: Date;
}

export function ApiStatusDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Fetch API endpoints status from Supabase
  const {
    data: endpoints = [],
    isLoading,
    error,
    refetch,
  } = useQuery<ApiEndpoint[]>({
    queryKey: ['api_endpoints'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_endpoints')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        name: row.name ?? '',
        path: row.path ?? '',
        status: row.status ?? 'operational',
        latency: row.latency ?? 0,
        uptime: row.uptime ?? 0,
        lastChecked: new Date(row.last_checked ?? row.updated_at ?? Date.now()),
      }));
    },
    refetchInterval: 60000, // Auto-refresh every 60s
  });

  const refreshStatus = async () => {
    setIsRefreshing(true);
    await refetch();
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: ApiEndpoint['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'down':
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: ApiEndpoint['status']) => {
    switch (status) {
      case 'operational':
        return <Badge variant="default" className="bg-success/20 text-success">Opérationnel</Badge>;
      case 'degraded':
        return <Badge variant="secondary" className="bg-warning/20 text-warning">Dégradé</Badge>;
      case 'down':
        return <Badge variant="destructive">Indisponible</Badge>;
    }
  };

  const operationalCount = endpoints.filter(e => e.status === 'operational').length;
  const avgLatency = endpoints.length > 0
    ? Math.round(endpoints.reduce((sum, e) => sum + e.latency, 0) / endpoints.length)
    : 0;
  const avgUptime = endpoints.length > 0
    ? (endpoints.reduce((sum, e) => sum + e.uptime, 0) / endpoints.length).toFixed(2)
    : '0.00';

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center" role="alert">
          <AlertTriangle className="h-8 w-8 mx-auto text-red-500 mb-2" />
          <p className="text-sm text-red-500">Erreur lors du chargement du statut des APIs</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader className="pb-2"><Skeleton className="h-4 w-24" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-20" /></CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full" />)}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Server className="h-4 w-4" />
              Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationalCount}/{endpoints.length}</div>
            <p className="text-xs text-muted-foreground">opérationnels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Latence Moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgLatency}ms</div>
            <p className="text-xs text-muted-foreground">temps de réponse</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Uptime Moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgUptime}%</div>
            <p className="text-xs text-muted-foreground">30 derniers jours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Dernière Vérif.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
            <p className="text-xs text-muted-foreground">mise à jour</p>
          </CardContent>
        </Card>
      </div>

      {/* Endpoints List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Statut des APIs
              </CardTitle>
              <CardDescription>
                Monitoring temps réel des Edge Functions EmotionsCare
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshStatus}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {endpoints.length === 0 ? (
              <div className="text-center py-6">
                <Server className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium">Aucun endpoint configuré</p>
                <p className="text-sm text-muted-foreground mt-1">Les endpoints API apparaîtront ici.</p>
              </div>
            ) : endpoints.map((endpoint) => (
              <div 
                key={endpoint.path}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(endpoint.status)}
                  <div>
                    <div className="font-medium">{endpoint.name}</div>
                    <div className="text-sm text-muted-foreground">{endpoint.path}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-medium">{endpoint.latency}ms</div>
                    <div className="text-xs text-muted-foreground">latence</div>
                  </div>
                  
                  <div className="text-right w-20">
                    <div className="text-sm font-medium">{endpoint.uptime}%</div>
                    <Progress value={endpoint.uptime} className="h-1 mt-1" />
                  </div>

                  {getStatusBadge(endpoint.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
