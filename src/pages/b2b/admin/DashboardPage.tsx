
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Users, 
  BarChart3, 
  Settings, 
  AlertTriangle, 
  TrendingUp, 
  Shield,
  Bell,
  Calendar,
  FileText,
  Activity,
  Eye,
  UserCheck,
  UserX,
  Database,
  Download
} from 'lucide-react';

const B2BAdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const globalStats = {
    totalUsers: 247,
    activeUsers: 189,
    newUsers: 12,
    avgWellbeing: 7.3,
    alertsCount: 5,
    completedSessions: 1834
  };

  const teamStats = [
    { name: 'Équipe Marketing', members: 15, active: 12, avgMood: 7.8, alerts: 1 },
    { name: 'Équipe Développement', members: 22, active: 18, avgMood: 7.2, alerts: 2 },
    { name: 'Équipe RH', members: 8, active: 7, avgMood: 8.1, alerts: 0 },
    { name: 'Équipe Ventes', members: 25, active: 20, avgMood: 6.9, alerts: 2 },
  ];

  const recentActivities = [
    { user: 'Marie Dupont', action: 'Session VR complétée', time: '2h', mood: 8 },
    { user: 'Jean Martin', action: 'Journal émotionnel', time: '4h', mood: 7 },
    { user: 'Sophie Bernard', action: 'Scan émotionnel', time: '6h', mood: 6 },
    { user: 'Pierre Durand', action: 'Musicothérapie', time: '8h', mood: 8 },
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-slate-700" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrateur</h1>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Administrateur
              </Badge>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {globalStats.alertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {globalStats.alertsCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord admin 👨‍💼</h2>
          <p className="text-gray-600">Vue d'ensemble du bien-être de votre organisation</p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisateurs totaux</p>
                  <p className="text-2xl font-bold text-blue-600">{globalStats.totalUsers}</p>
                  <p className="text-xs text-green-600">+{globalStats.newUsers} nouveaux</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisateurs actifs</p>
                  <p className="text-2xl font-bold text-green-600">{globalStats.activeUsers}</p>
                  <p className="text-xs text-gray-500">
                    {Math.round((globalStats.activeUsers / globalStats.totalUsers) * 100)}% du total
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bien-être moyen</p>
                  <p className="text-2xl font-bold text-purple-600">{globalStats.avgWellbeing}/10</p>
                  <p className="text-xs text-purple-600">+0.3 ce mois</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Alertes actives</p>
                  <p className="text-2xl font-bold text-red-600">{globalStats.alertsCount}</p>
                  <p className="text-xs text-red-600">Nécessitent attention</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="teams">Équipes</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Activité récente
                  </CardTitle>
                  <CardDescription>Dernières sessions des utilisateurs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.user}</p>
                          <p className="text-xs text-gray-500">{activity.action} - Il y a {activity.time}</p>
                        </div>
                        <Badge variant="secondary">
                          {activity.mood}/10
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Alertes de bien-être
                  </CardTitle>
                  <CardDescription>Utilisateurs nécessitant une attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="p-2 bg-red-100 rounded-full">
                        <UserX className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Sarah Wilson</p>
                        <p className="text-xs text-red-600">Score de bien-être en baisse (4/10)</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Contacter
                      </Button>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="p-2 bg-orange-100 rounded-full">
                        <UserX className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Marc Dubois</p>
                        <p className="text-xs text-orange-600">Inactif depuis 7 jours</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Rappeler
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Aperçu des équipes</CardTitle>
                <CardDescription>Performance et bien-être par équipe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamStats.map((team, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{team.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={team.alerts > 0 ? "destructive" : "secondary"}>
                            {team.alerts} alertes
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Détails
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Membres</p>
                          <p className="font-medium">{team.active}/{team.members} actifs</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Humeur moyenne</p>
                          <p className="font-medium">{team.avgMood}/10</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Taux d'activité</p>
                          <p className="font-medium">{Math.round((team.active / team.members) * 100)}%</p>
                        </div>
                      </div>
                      <Progress 
                        value={(team.active / team.members) * 100} 
                        className="mt-2 h-2" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Statistiques d'utilisation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Sessions terminées</span>
                      <span className="font-bold">{globalStats.completedSessions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Temps moyen par session</span>
                      <span className="font-bold">12 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Fonctionnalité la plus utilisée</span>
                      <span className="font-bold">Scanner émotionnel</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Tendances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Évolution bien-être</span>
                      <Badge variant="secondary" className="text-green-600">+5.2%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Engagement utilisateur</span>
                      <Badge variant="secondary" className="text-blue-600">+12.8%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Satisfaction globale</span>
                      <Badge variant="secondary" className="text-purple-600">8.4/10</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Exports et rapports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Rapport mensuel
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Données anonymisées
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Export complet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres d'administration</CardTitle>
                <CardDescription>Configuration de la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Gestion des utilisateurs
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuration système
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Sécurité et permissions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Sauvegarde des données
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
