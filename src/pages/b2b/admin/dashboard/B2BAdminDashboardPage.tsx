
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart, UserPlus, Users, Brain, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart as ReChart,
  Line,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Sample data - this would normally come from your database
const emotionData = [
  { name: 'Lun', score: 65 },
  { name: 'Mar', score: 59 },
  { name: 'Mer', score: 80 },
  { name: 'Jeu', score: 81 },
  { name: 'Ven', score: 56 },
  { name: 'Sam', score: 75 },
  { name: 'Dim', score: 85 },
];

const departmentData = [
  { name: 'RH', value: 78 },
  { name: 'Tech', value: 62 },
  { name: 'Marketing', value: 71 },
  { name: 'Finance', value: 56 },
  { name: 'Opérations', value: 68 },
];

const issuesData = [
  { name: 'Stress', value: 35 },
  { name: 'Conflits', value: 20 },
  { name: 'Surcharge', value: 25 },
  { name: 'Communication', value: 15 },
  { name: 'Autre', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const B2BAdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [companyStats, setCompanyStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    averageScore: 0,
    scanCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCompanyStats();
  }, []);

  const fetchCompanyStats = async () => {
    try {
      setIsLoading(true);
      
      // In a real application, this would be a call to your backend
      // Simulating API response with mock data
      setTimeout(() => {
        setCompanyStats({
          totalUsers: 87,
          activeUsers: 62,
          averageScore: 72,
          scanCount: 243,
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Erreur lors du chargement des statistiques');
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="container mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord Administrateur</h1>
            <p className="text-muted-foreground">
              Bienvenue, {user?.user_metadata?.name || user?.email}
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/b2b/admin/users')}>
              <UserPlus className="mr-2 h-4 w-4" />
              Gérer les utilisateurs
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : companyStats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +12% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : companyStats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((companyStats.activeUsers / companyStats.totalUsers) * 100) || 0}% du total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : companyStats.averageScore}/100</div>
              <p className="text-xs text-muted-foreground">
                +3 points en 1 semaine
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Analyses Réalisées</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : companyStats.scanCount}</div>
              <p className="text-xs text-muted-foreground">
                +18% ce mois-ci
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Départements
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Problématiques
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Score émotionnel moyen</CardTitle>
                  <CardDescription>
                    Évolution sur les 7 derniers jours
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <ReChart data={emotionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </ReChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Activité utilisateurs</CardTitle>
                  <CardDescription>
                    Nombre d'analyses par jour
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <ReBarChart data={emotionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" name="Analyses" fill="#82ca9d" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="departments">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Score par département</CardTitle>
                  <CardDescription>
                    Bien-être moyen par service
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <ReBarChart
                      data={departmentData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Score" fill="#8884d8" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Points d'action</CardTitle>
                  <CardDescription>
                    Recommandations par département
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">RH (78/100)</h3>
                      <p className="text-sm text-muted-foreground">
                        Bon niveau général. Continuer les initiatives de bien-être.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Tech (62/100)</h3>
                      <p className="text-sm text-muted-foreground">
                        Attention à la charge de travail. Suggérer des pauses plus régulières.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Marketing (71/100)</h3>
                      <p className="text-sm text-muted-foreground">
                        Niveau correct. Améliorer la communication des objectifs.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Finance (56/100)</h3>
                      <p className="text-sm text-muted-foreground">
                        Alerte - niveau bas. Organiser des sessions de gestion du stress.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Opérations (68/100)</h3>
                      <p className="text-sm text-muted-foreground">
                        Niveau moyen. Revoir l'équilibre charge/ressources.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="issues">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Problématiques identifiées</CardTitle>
                  <CardDescription>
                    Proportion des facteurs de stress signalés
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 flex items-center justify-center">
                  <div className="w-[300px] h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={issuesData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {issuesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Plan d'action</CardTitle>
                  <CardDescription>
                    Solutions recommandées pour les problématiques principales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md border-l-4 border-blue-500">
                      <h3 className="font-medium">Stress (35%)</h3>
                      <p className="text-sm text-muted-foreground">
                        Mettre en place des sessions de gestion du stress et de mindfulness.
                        Revoir l'équilibre charge de travail / ressources.
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md border-l-4 border-green-500">
                      <h3 className="font-medium">Surcharge de travail (25%)</h3>
                      <p className="text-sm text-muted-foreground">
                        Audit de la charge de travail par équipe. Envisager des recrutements 
                        supplémentaires ou une réallocation des tâches.
                      </p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-md border-l-4 border-yellow-500">
                      <h3 className="font-medium">Conflits d'équipe (20%)</h3>
                      <p className="text-sm text-muted-foreground">
                        Organiser des ateliers de team building et de communication non-violente.
                        Formation des managers à la médiation.
                      </p>
                    </div>
                    <Button className="w-full">Télécharger le rapport complet</Button>
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

export default B2BAdminDashboardPage;
