
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Users, 
  BarChart3, 
  Settings, 
  Activity, 
  AlertTriangle,
  TrendingUp,
  Building,
  Clock,
  UserCheck
} from 'lucide-react';
import LoadingAnimation from '@/components/ui/loading-animation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const B2BAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 45,
    activeUsers: 38,
    avgWellbeingScore: 72,
    alertsCount: 3,
    lastUpdate: new Date().toLocaleDateString('fr-FR')
  });

  const [organizationData, setOrganizationData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      
      // Simuler le chargement des données admin
      setTimeout(() => {
        const mockOrgData = [
          { date: '01/12', users: 42, active: 35, wellbeing: 68 },
          { date: '02/12', users: 43, active: 36, wellbeing: 70 },
          { date: '03/12', users: 44, active: 37, wellbeing: 69 },
          { date: '04/12', users: 45, active: 38, wellbeing: 72 },
          { date: '05/12', users: 45, active: 39, wellbeing: 74 },
          { date: '06/12', users: 46, active: 38, wellbeing: 71 },
          { date: '07/12', users: 45, active: 38, wellbeing: 72 }
        ];

        const mockDeptData = [
          { name: 'Marketing', value: 12, color: '#8884d8' },
          { name: 'Tech', value: 18, color: '#82ca9d' },
          { name: 'Sales', value: 8, color: '#ffc658' },
          { name: 'Support', value: 7, color: '#ff7300' }
        ];

        const mockAlerts = [
          { id: 1, user: 'Marie D.', department: 'Marketing', level: 'medium', message: 'Score en baisse cette semaine' },
          { id: 2, user: 'Thomas L.', department: 'Tech', level: 'high', message: 'Stress élevé détecté' },
          { id: 3, user: 'Sarah M.', department: 'Sales', level: 'low', message: 'Absence prolongée' }
        ];

        setOrganizationData(mockOrgData);
        setDepartmentData(mockDeptData);
        setAlertsData(mockAlerts);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Erreur lors du chargement admin:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données d'administration",
        variant: "error"
      });
      setIsLoading(false);
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement du tableau de bord administrateur..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Administration EmotionsCare</h1>
          <p className="text-muted-foreground">
            Tableau de bord administrateur - {user?.name || 'Administrateur'}
          </p>
        </div>
        <Badge variant="default" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Administrateur
        </Badge>
      </div>

      {/* Admin Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total utilisateurs</p>
                <p className="text-2xl font-bold">{adminStats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +3 nouveaux ce mois
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilisateurs actifs</p>
                <p className="text-2xl font-bold">{adminStats.activeUsers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <Activity className="h-4 w-4 mr-1" />
              {Math.round((adminStats.activeUsers / adminStats.totalUsers) * 100)}% taux d'activité
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Score moyen</p>
                <p className="text-2xl font-bold">{adminStats.avgWellbeingScore}/100</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +4 points ce mois
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alertes actives</p>
                <p className="text-2xl font-bold">{adminStats.alertsCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm">
                Voir les alertes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution de l'organisation</CardTitle>
                <CardDescription>Utilisateurs actifs et score de bien-être</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={organizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="active" stroke="#8884d8" name="Utilisateurs actifs" />
                    <Line type="monotone" dataKey="wellbeing" stroke="#82ca9d" name="Score bien-être" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par département</CardTitle>
                <CardDescription>Distribution des utilisateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>Administrer les comptes et permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Interface de gestion des utilisateurs</p>
                <Button>Gérer les utilisateurs</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyses avancées</CardTitle>
              <CardDescription>Rapports détaillés et insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Analyses et rapports détaillés</p>
                <Button>Générer un rapport</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alertes et notifications</CardTitle>
              <CardDescription>Surveillance du bien-être des équipes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertsData.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.level)}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{alert.user} - {alert.department}</p>
                        <p className="text-sm">{alert.message}</p>
                      </div>
                      <Badge variant="outline">{alert.level}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres d'administration</CardTitle>
              <CardDescription>Configuration et préférences système</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Paramètres et configuration</p>
                <Button>Accéder aux paramètres</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BAdminDashboardPage;
