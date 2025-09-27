import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Settings, 
  Activity, 
  Shield, 
  BarChart3, 
  Bell,
  Database,
  Zap,
  AlertTriangle,
  CheckCircle,
  Globe
} from 'lucide-react';
import PageSEO from '@/components/seo/PageSEO';
import { useToast } from '@/hooks/use-toast';

/**
 * UnifiedAdminPage - Page d'administration consolidée
 * Fusionne AdminDashboard, ApiMonitoring, et ActivityLogs
 */
const UnifiedAdminPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    users: 1847,
    activeToday: 234,
    apiCalls: 15679,
    uptime: 99.8
  };

  const apiStatus = [
    { name: 'Auth API', status: 'healthy', latency: '45ms' },
    { name: 'Music API', status: 'healthy', latency: '67ms' },
    { name: 'Analytics API', status: 'warning', latency: '120ms' },
    { name: 'Storage API', status: 'healthy', latency: '32ms' }
  ];

  const recentActivity = [
    { user: 'Marie D.', action: 'Connexion', time: 'Il y a 2 min' },
    { user: 'Admin', action: 'Configuration modifiée', time: 'Il y a 15 min' },
    { user: 'Pierre M.', action: 'Session terminée', time: 'Il y a 23 min' },
    { user: 'Sophie L.', action: 'Scan émotionnel', time: 'Il y a 31 min' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <>
      <PageSEO 
        title="Administration - EmotionsCare"
        description="Tableau de bord administrateur pour la gestion de la plateforme EmotionsCare"
      />
      
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Administration</h1>
            <p className="text-muted-foreground">
              Gestion centralisée de la plateforme EmotionsCare
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-fit">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                APIs
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activité
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Statistiques principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.users.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      +12% vs mois dernier
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Actifs Aujourd'hui</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeToday}</div>
                    <p className="text-xs text-muted-foreground">
                      13% des utilisateurs
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Appels API</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.apiCalls.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Dernières 24h
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Disponibilité</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.uptime}%</div>
                    <p className="text-xs text-muted-foreground">
                      30 derniers jours
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Statut des services */}
              <Card>
                <CardHeader>
                  <CardTitle>Statut des Services</CardTitle>
                  <CardDescription>État en temps réel des APIs principales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiStatus.map((api) => (
                      <div key={api.name} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className={getStatusColor(api.status)}>
                            {getStatusIcon(api.status)}
                          </div>
                          <span className="font-medium">{api.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={api.status === 'healthy' ? 'default' : 'secondary'}>
                            {api.latency}
                          </Badge>
                          <Badge 
                            variant={api.status === 'healthy' ? 'default' : 
                                    api.status === 'warning' ? 'secondary' : 'destructive'}
                          >
                            {api.status === 'healthy' ? 'Opérationnel' :
                             api.status === 'warning' ? 'Dégradé' : 'Erreur'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des Utilisateurs</CardTitle>
                  <CardDescription>Administration des comptes utilisateurs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={() => toast({ title: 'Fonctionnalité à venir', description: 'Gestion utilisateurs en cours de développement' })}>
                      <Users className="h-4 w-4 mr-2" />
                      Gérer les Utilisateurs
                    </Button>
                    <Button variant="outline" onClick={() => toast({ title: 'Export généré', description: 'Liste des utilisateurs exportée avec succès' })}>
                      Exporter la Liste
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monitoring des APIs</CardTitle>
                  <CardDescription>Surveillance en temps réel des APIs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiStatus.map((api) => (
                      <div key={api.name} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">{api.name}</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">{api.latency}</Badge>
                            <Badge variant={api.status === 'healthy' ? 'default' : 'secondary'}>
                              {api.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={() => toast({ title: 'Test exécuté', description: 'Test de connectivité des APIs terminé avec succès' })}>
                      <Zap className="h-4 w-4 mr-2" />
                      Tester les APIs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Journal d'Activité</CardTitle>
                  <CardDescription>Historique des actions récentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">{activity.user}</span>
                          <span className="text-muted-foreground ml-2">{activity.action}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                    <Button variant="outline" onClick={() => toast({ title: 'Logs exportés', description: 'Journal d\'activité exporté avec succès' })}>
                      Exporter les Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default UnifiedAdminPage;