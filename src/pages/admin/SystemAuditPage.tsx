
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Filter, AlertTriangle, CheckCircle, Clock, Shield, Database, Server, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: 'success' | 'warning' | 'error';
  details: string;
  ip: string;
}

interface ComplianceItem {
  id: string;
  name: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  description: string;
  lastCheck: string;
  score: number;
}

const SystemAuditPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [auditData, setAuditData] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const complianceChecks: ComplianceItem[] = [
    {
      id: '1',
      name: 'RGPD - Protection des données',
      status: 'compliant',
      description: 'Conformité au Règlement Général sur la Protection des Données',
      lastCheck: '2024-01-15 09:00',
      score: 98
    },
    {
      id: '2',
      name: 'ISO 27001 - Sécurité informatique',
      status: 'compliant',
      description: 'Norme internationale de sécurité de l\'information',
      lastCheck: '2024-01-14 15:30',
      score: 95
    },
    {
      id: '3',
      name: 'HDS - Hébergement de données de santé',
      status: 'partial',
      description: 'Certification pour l\'hébergement de données de santé',
      lastCheck: '2024-01-13 11:15',
      score: 87
    },
    {
      id: '4',
      name: 'Accessibilité WCAG 2.1',
      status: 'partial',
      description: 'Conformité aux standards d\'accessibilité web',
      lastCheck: '2024-01-12 14:45',
      score: 79
    }
  ];

  // Simulation de données d'audit
  useEffect(() => {
    const generateAuditLogs = (): AuditLog[] => {
      const actions = [
        'Connexion utilisateur',
        'Modification profil',
        'Export données',
        'Suppression compte',
        'Accès admin',
        'Sauvegarde système',
        'Mise à jour sécurité'
      ];
      
      const resources = [
        'Users',
        'Profiles',
        'Data',
        'System',
        'Security',
        'Backup',
        'Settings'
      ];

      const statuses: ('success' | 'warning' | 'error')[] = ['success', 'success', 'success', 'warning', 'error'];
      
      return Array.from({ length: 50 }, (_, i) => ({
        id: (i + 1).toString(),
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        user: `user${Math.floor(Math.random() * 100) + 1}`,
        action: actions[Math.floor(Math.random() * actions.length)],
        resource: resources[Math.floor(Math.random() * resources.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        details: 'Action effectuée avec succès',
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`
      }));
    };

    setTimeout(() => {
      setAuditData(generateAuditLogs());
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredLogs = auditData.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || log.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 border-green-200';
      case 'partial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'non-compliant': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportAuditReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Timestamp,User,Action,Resource,Status,IP,Details\n" +
      filteredLogs.map(log => 
        `${log.timestamp},${log.user},${log.action},${log.resource},${log.status},${log.ip},"${log.details}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Search className="w-8 h-8 text-blue-600" />
              Audit Système
            </h1>
            <p className="text-muted-foreground mt-2">
              Surveillance et conformité de la plateforme EmotionsCare
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportAuditReport}>
              <Download className="w-4 h-4 mr-2" />
              Exporter le rapport
            </Button>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Système opérationnel
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Événements surveillés', value: '2,847', icon: Database, color: 'text-blue-600' },
            { label: 'Alertes de sécurité', value: '12', icon: Shield, color: 'text-red-600' },
            { label: 'Utilisateurs actifs', value: '1,234', icon: Users, color: 'text-green-600' },
            { label: 'Disponibilité système', value: '99.8%', icon: Server, color: 'text-purple-600' }
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="logs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="logs">Journaux d'audit</TabsTrigger>
            <TabsTrigger value="compliance">Conformité</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Rechercher dans les logs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <select 
                      className="px-3 py-2 border rounded-md"
                      value={selectedTimeRange}
                      onChange={(e) => setSelectedTimeRange(e.target.value)}
                    >
                      <option value="1h">Dernière heure</option>
                      <option value="24h">Dernières 24h</option>
                      <option value="7d">7 derniers jours</option>
                      <option value="30d">30 derniers jours</option>
                    </select>
                    
                    <select 
                      className="px-3 py-2 border rounded-md"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="success">Succès</option>
                      <option value="warning">Avertissement</option>
                      <option value="error">Erreur</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audit Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Journaux d'événements ({filteredLogs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredLogs.map((log) => (
                      <div key={log.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                        {getStatusIcon(log.status)}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2 text-sm">
                          <span className="font-mono text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                          <span className="font-medium">{log.user}</span>
                          <span>{log.action}</span>
                          <span className="text-muted-foreground">{log.resource}</span>
                          <span className="text-xs text-muted-foreground">{log.ip}</span>
                        </div>
                        <Badge variant="outline" className={
                          log.status === 'success' ? 'border-green-500 text-green-700' :
                          log.status === 'warning' ? 'border-yellow-500 text-yellow-700' :
                          'border-red-500 text-red-700'
                        }>
                          {log.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complianceChecks.map((check) => (
                <Card key={check.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{check.name}</CardTitle>
                      <Badge className={getStatusColor(check.status)}>
                        {check.status === 'compliant' ? 'Conforme' : 
                         check.status === 'partial' ? 'Partiellement conforme' : 'Non conforme'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm">{check.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Score de conformité</span>
                        <span className="font-medium">{check.score}%</span>
                      </div>
                      <Progress value={check.score} className="h-2" />
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Dernière vérification : {check.lastCheck}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Authentification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Connexions réussies</span>
                      <span className="font-medium text-green-600">98.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tentatives échouées</span>
                      <span className="font-medium text-red-600">1.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">2FA activé</span>
                      <span className="font-medium text-blue-600">89%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    Chiffrement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Données en transit</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">TLS 1.3</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Données au repos</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">AES-256</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Clés rotées</span>
                      <span className="font-medium text-green-600">✓</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Incidents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Aujourd'hui</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cette semaine</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Ce mois</span>
                      <span className="font-medium">5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Temps de réponse</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>API principale</span>
                        <span className="font-medium">95ms</span>
                      </div>
                      <Progress value={15} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Base de données</span>
                        <span className="font-medium">12ms</span>
                      </div>
                      <Progress value={8} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Interface utilisateur</span>
                        <span className="font-medium">1.2s</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Utilisation des ressources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CPU</span>
                        <span className="font-medium">34%</span>
                      </div>
                      <Progress value={34} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Mémoire</span>
                        <span className="font-medium">67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Stockage</span>
                        <span className="font-medium">23%</span>
                      </div>
                      <Progress value={23} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemAuditPage;
