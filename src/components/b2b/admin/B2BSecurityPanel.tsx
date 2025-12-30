/**
 * B2BSecurityPanel - Panneau de sécurité et audit pour admin B2B
 * Logs d'audit, sessions actives, alertes de sécurité
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, Activity, AlertTriangle, Lock, Users, 
  Clock, Monitor, Globe, RefreshCw, Download,
  CheckCircle, XCircle, Eye
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AuditLog {
  id: string;
  event: string;
  actor_id: string;
  target: string;
  summary: string;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
}

interface ActiveSession {
  id: string;
  user_email: string;
  device: string;
  location: string;
  last_active: string;
  is_current: boolean;
}

interface SecurityAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  created_at: string;
  resolved: boolean;
}

export const B2BSecurityPanel: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  // Mock data pour les logs d'audit
  const auditLogs: AuditLog[] = [
    {
      id: '1',
      event: 'user.login',
      actor_id: 'user-1',
      target: 'auth.session',
      summary: 'Connexion réussie depuis Paris',
      created_at: new Date().toISOString(),
      ip_address: '192.168.1.1',
    },
    {
      id: '2',
      event: 'settings.update',
      actor_id: 'admin-1',
      target: 'org.settings',
      summary: 'Mise à jour des paramètres de sécurité',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      ip_address: '192.168.1.2',
    },
    {
      id: '3',
      event: 'report.export',
      actor_id: 'manager-1',
      target: 'report.wellness',
      summary: 'Export du rapport de bien-être Q4',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      ip_address: '192.168.1.3',
    },
    {
      id: '4',
      event: 'user.invite',
      actor_id: 'admin-1',
      target: 'user.new',
      summary: 'Invitation envoyée à nouveau@email.com',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      ip_address: '192.168.1.2',
    },
  ];

  const activeSessions: ActiveSession[] = [
    {
      id: '1',
      user_email: 'admin@org.com',
      device: 'Chrome sur macOS',
      location: 'Paris, France',
      last_active: new Date().toISOString(),
      is_current: true,
    },
    {
      id: '2',
      user_email: 'manager@org.com',
      device: 'Safari sur iOS',
      location: 'Lyon, France',
      last_active: new Date(Date.now() - 1800000).toISOString(),
      is_current: false,
    },
    {
      id: '3',
      user_email: 'user@org.com',
      device: 'Firefox sur Windows',
      location: 'Bordeaux, France',
      last_active: new Date(Date.now() - 3600000).toISOString(),
      is_current: false,
    },
  ];

  const securityAlerts: SecurityAlert[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Tentatives de connexion multiples',
      description: '5 tentatives échouées depuis une IP inconnue',
      created_at: new Date(Date.now() - 1800000).toISOString(),
      resolved: false,
    },
    {
      id: '2',
      type: 'info',
      title: 'Mise à jour de sécurité appliquée',
      description: 'Le système a été mis à jour avec les derniers correctifs',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      resolved: true,
    },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getEventIcon = (event: string) => {
    if (event.includes('login')) return <Lock className="h-4 w-4" />;
    if (event.includes('update')) return <RefreshCw className="h-4 w-4" />;
    if (event.includes('export')) return <Download className="h-4 w-4" />;
    if (event.includes('invite')) return <Users className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const getAlertVariant = (type: string) => {
    if (type === 'critical') return 'destructive';
    if (type === 'warning') return 'default';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Sécurité & Audit
          </h2>
          <p className="text-muted-foreground">
            Surveillance et contrôle de la sécurité de votre organisation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter logs
          </Button>
        </div>
      </div>

      {/* Stats de sécurité */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">98%</p>
                <p className="text-xs text-muted-foreground">Score sécurité</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeSessions.length}</p>
                <p className="text-xs text-muted-foreground">Sessions actives</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{securityAlerts.filter(a => !a.resolved).length}</p>
                <p className="text-xs text-muted-foreground">Alertes actives</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{auditLogs.length}</p>
                <p className="text-xs text-muted-foreground">Actions (24h)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit" className="gap-2">
            <Activity className="h-4 w-4" />
            Journal d'audit
          </TabsTrigger>
          <TabsTrigger value="sessions" className="gap-2">
            <Monitor className="h-4 w-4" />
            Sessions actives
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alertes
          </TabsTrigger>
        </TabsList>

        {/* Journal d'audit */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Historique des actions</CardTitle>
              <CardDescription>Toutes les actions sensibles sont enregistrées</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        {getEventIcon(log.event)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{log.summary}</span>
                          <Badge variant="outline" className="text-xs">
                            {log.event}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(log.created_at), 'PPp', { locale: fr })}
                          </span>
                          {log.ip_address && (
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {log.ip_address}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions actives */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Sessions en cours</CardTitle>
              <CardDescription>Utilisateurs connectés à votre organisation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Monitor className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{session.user_email}</span>
                          {session.is_current && (
                            <Badge variant="default" className="text-xs">Session actuelle</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {session.device} • {session.location}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          Dernière activité: {format(new Date(session.last_active), 'PPp', { locale: fr })}
                        </div>
                      </div>
                    </div>
                    {!session.is_current && (
                      <Button variant="outline" size="sm" className="text-destructive">
                        <XCircle className="h-4 w-4 mr-2" />
                        Révoquer
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alertes */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alertes de sécurité</CardTitle>
              <CardDescription>Événements nécessitant votre attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border ${
                      alert.resolved ? 'border-border bg-muted/30' : 'border-yellow-500/50 bg-yellow-500/5'
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      alert.type === 'critical' ? 'bg-destructive/10' :
                      alert.type === 'warning' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
                    }`}>
                      <AlertTriangle className={`h-4 w-4 ${
                        alert.type === 'critical' ? 'text-destructive' :
                        alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{alert.title}</span>
                        <Badge variant={getAlertVariant(alert.type) as any}>
                          {alert.type}
                        </Badge>
                        {alert.resolved && (
                          <Badge variant="outline" className="text-green-600">
                            Résolu
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(alert.created_at), 'PPp', { locale: fr })}
                      </p>
                    </div>
                    {!alert.resolved && (
                      <Button variant="outline" size="sm">
                        Résoudre
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BSecurityPanel;
