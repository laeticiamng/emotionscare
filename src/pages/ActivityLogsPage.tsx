// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle,
  Info,
  Shield,
  Clock,
  Monitor,
  Smartphone,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  severity: 'info' | 'warning' | 'error' | 'success';
  metadata?: Record<string, any>;
}

interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'login_failure' | 'suspicious_activity' | 'data_breach_attempt' | 'unauthorized_access';
  userId?: string;
  ipAddress: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  location?: string;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    
    return matchesSearch && matchesAction && matchesSeverity;
  });

  const exportLogs = () => {
    const csvContent = [
      'Horodatage,Utilisateur,Action,Ressource,Détails,IP,Succès',
      ...filteredLogs.map(log => 
        `${log.timestamp},${log.userName},${log.action},${log.resource},${log.details},${log.ipAddress},${log.success}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Logs exportés avec succès');
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('Mobile') || userAgent.includes('iPhone')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" className="mb-4 gap-2" asChild>
          <Link to="/settings" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Retour
          </Link>
        </Button>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Logs d'Activité & Sécurité
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Surveillance complète des activités utilisateurs et événements de sécurité pour la conformité RGPD.
          </p>
        </div>

        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList>
            <TabsTrigger value="activity">Activité Utilisateurs</TabsTrigger>
            <TabsTrigger value="security">Événements Sécurité</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Logs d'activité */}
          <TabsContent value="activity" className="space-y-6">
            {/* Filtres */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Filtres & Recherche</span>
                  <Button onClick={exportLogs} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter CSV
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={filterAction} onValueChange={setFilterAction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les actions</SelectItem>
                      <SelectItem value="LOGIN">Connexion</SelectItem>
                      <SelectItem value="LOGOUT">Déconnexion</SelectItem>
                      <SelectItem value="DATA_EXPORT">Export données</SelectItem>
                      <SelectItem value="DATA_DELETE">Suppression</SelectItem>
                      <SelectItem value="SETTINGS_CHANGE">Modification</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sévérité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Succès</SelectItem>
                      <SelectItem value="warning">Avertissement</SelectItem>
                      <SelectItem value="error">Erreur</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Aujourd'hui</SelectItem>
                      <SelectItem value="week">Cette semaine</SelectItem>
                      <SelectItem value="month">Ce mois</SelectItem>
                      <SelectItem value="quarter">Ce trimestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Liste des logs */}
            <Card>
              <CardHeader>
                <CardTitle>Activités Récentes</CardTitle>
                <CardDescription>
                  {filteredLogs.length} événements trouvés
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredLogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Aucun log d'activité disponible</p>
                ) : (
                <div className="space-y-3">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getSeverityIcon(log.severity)}
                            <span className="font-medium">{log.userName}</span>
                            <Badge variant="outline">{log.action}</Badge>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              {getDeviceIcon(log.userAgent)}
                              <span className="text-xs">{log.ipAddress}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{log.details}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(log.timestamp)}
                            </span>
                            <span>Ressource: {log.resource}</span>
                          </div>
                        </div>
                        <Badge variant={log.success ? 'default' : 'destructive'}>
                          {log.success ? 'Succès' : 'Échec'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Événements de sécurité */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Événements de Sécurité
                </CardTitle>
                <CardDescription>
                  Surveillance des tentatives d'intrusion et activités suspectes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {securityEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Aucun événement de sécurité</p>
                ) : (
                <div className="space-y-4">
                  {securityEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge 
                              variant={
                                event.severity === 'critical' ? 'destructive' :
                                event.severity === 'high' ? 'destructive' :
                                event.severity === 'medium' ? 'default' : 'secondary'
                              }
                            >
                              {event.severity.toUpperCase()}
                            </Badge>
                            <span className="font-medium capitalize">
                              {event.type.replace('_', ' ')}
                            </span>
                            <Badge 
                              variant={
                                event.status === 'resolved' ? 'default' :
                                event.status === 'investigating' ? 'secondary' : 'outline'
                              }
                            >
                              {event.status}
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(event.timestamp)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {event.ipAddress}
                            </span>
                            {event.location && (
                              <span>📍 {event.location}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Connexions Aujourd'hui</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-muted-foreground">—</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Exports RGPD</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-muted-foreground">—</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Événements Sécurité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-muted-foreground">—</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Taux de Conformité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-muted-foreground">—</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Actions Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune donnée analytique disponible
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}