import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
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

const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    timestamp: '2024-01-20T15:30:00Z',
    userId: 'user_123',
    userName: 'Marie Dupont',
    action: 'LOGIN',
    resource: 'Application',
    details: 'Connexion utilisateur réussie',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    success: true,
    severity: 'success'
  },
  {
    id: '2',
    timestamp: '2024-01-20T15:25:00Z',
    userId: 'user_456',
    userName: 'Jean Martin',
    action: 'DATA_EXPORT',
    resource: 'Données personnelles',
    details: 'Export RGPD des données utilisateur demandé',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    success: true,
    severity: 'info'
  },
  {
    id: '3',
    timestamp: '2024-01-20T15:20:00Z',
    userId: 'user_789',
    userName: 'Sophie Leblanc',
    action: 'LOGIN_FAILED',
    resource: 'Application',
    details: 'Tentative de connexion échouée - mot de passe incorrect',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
    success: false,
    severity: 'warning'
  },
  {
    id: '4',
    timestamp: '2024-01-20T15:15:00Z',
    userId: 'admin_001',
    userName: 'Administrateur',
    action: 'USER_DELETE',
    resource: 'Compte utilisateur',
    details: 'Suppression compte utilisateur sur demande RGPD',
    ipAddress: '192.168.1.200',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    success: true,
    severity: 'warning'
  }
];

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: '1',
    timestamp: '2024-01-20T16:00:00Z',
    type: 'suspicious_activity',
    userId: 'user_unknown',
    ipAddress: '45.123.456.789',
    severity: 'high',
    description: 'Tentatives de connexion multiples depuis une IP suspecte',
    status: 'investigating',
    location: 'Inconnu'
  },
  {
    id: '2',
    timestamp: '2024-01-20T14:30:00Z',
    type: 'login_failure',
    ipAddress: '192.168.1.150',
    severity: 'medium',
    description: '5 tentatives de connexion échouées consécutives',
    status: 'resolved',
    location: 'France'
  }
];

export default function ActivityLogsPage() {
  const [logs, _setLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [securityEvents, _setSecurityEvents] = useState<SecurityEvent[]>(mockSecurityEvents);
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
                  <div className="text-2xl font-bold">247</div>
                  <div className="text-xs text-muted-foreground">+12% vs hier</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Exports RGPD</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <div className="text-xs text-muted-foreground">Ce mois</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Événements Sécurité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">5</div>
                  <div className="text-xs text-muted-foreground">Dernières 24h</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Taux de Conformité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">98.2%</div>
                  <div className="text-xs text-muted-foreground">RGPD</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Actions Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: 'Connexion', count: 1247, percentage: 45 },
                    { action: 'Analyse émotionnelle', count: 892, percentage: 32 },
                    { action: 'Export données', count: 234, percentage: 8 },
                    { action: 'Modification profil', count: 156, percentage: 6 },
                    { action: 'Déconnexion', count: 145, percentage: 5 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.action}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}