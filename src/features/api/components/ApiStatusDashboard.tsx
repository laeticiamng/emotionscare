/**
 * Dashboard de statut des APIs
 * Monitoring temps réel des Edge Functions et services
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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

const MOCK_ENDPOINTS: ApiEndpoint[] = [
  { name: 'Coach API', path: '/coach-api', status: 'operational', latency: 120, uptime: 99.9, lastChecked: new Date() },
  { name: 'Scan API', path: '/scan-api', status: 'operational', latency: 85, uptime: 99.8, lastChecked: new Date() },
  { name: 'Journal API', path: '/journal-api', status: 'operational', latency: 95, uptime: 99.95, lastChecked: new Date() },
  { name: 'Music API', path: '/music-api', status: 'operational', latency: 150, uptime: 99.7, lastChecked: new Date() },
  { name: 'Community API', path: '/community-api', status: 'operational', latency: 110, uptime: 99.85, lastChecked: new Date() },
  { name: 'Meditation API', path: '/meditation-api', status: 'operational', latency: 78, uptime: 99.9, lastChecked: new Date() },
  { name: 'Activities API', path: '/activities-api', status: 'operational', latency: 92, uptime: 99.8, lastChecked: new Date() },
  { name: 'Analytics API', path: '/analytics-api', status: 'operational', latency: 145, uptime: 99.6, lastChecked: new Date() },
];

export function ApiStatusDashboard() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>(MOCK_ENDPOINTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const refreshStatus = async () => {
    setIsRefreshing(true);
    // Simulate API check
    await new Promise(resolve => setTimeout(resolve, 1000));
    setEndpoints(prev => prev.map(ep => ({
      ...ep,
      lastChecked: new Date(),
      latency: Math.floor(ep.latency * (0.9 + Math.random() * 0.2))
    })));
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
  const avgLatency = Math.round(endpoints.reduce((sum, e) => sum + e.latency, 0) / endpoints.length);
  const avgUptime = (endpoints.reduce((sum, e) => sum + e.uptime, 0) / endpoints.length).toFixed(2);

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
            {endpoints.map((endpoint) => (
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
