
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, BarChart2, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import LoadingAnimation from '@/components/ui/loading-animation';
import { supabase } from '@/integrations/supabase/client';

const B2BAdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    avgWellbeingScore: 0,
    alertsCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Load organization stats
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'b2b_user');

      if (error) throw error;

      // Calculate recent emotion results for wellbeing score
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { data: recentScans } = await supabase
        .from('emotion_results')
        .select('score')
        .gte('date', weekAgo.toISOString());

      const avgScore = recentScans?.length 
        ? recentScans.reduce((sum, scan) => sum + scan.score, 0) / recentScans.length
        : 0;

      setStats({
        totalUsers: profiles?.length || 0,
        activeUsers: Math.floor((profiles?.length || 0) * 0.7), // Mock active users
        avgWellbeingScore: Math.round(avgScore * 100),
        alertsCount: 2 // Mock alerts
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation size="large" text="Chargement du tableau de bord administrateur..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto max-w-7xl">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord Administrateur</h1>
            <p className="text-muted-foreground">
              Gestion de l'organisation - {user?.user_metadata?.name || user?.email}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Déconnexion
          </Button>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs totaux</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +5 ce mois-ci
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% du total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score bien-être moyen</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgWellbeingScore}%</div>
              <p className="text-xs text-muted-foreground">
                Cette semaine
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertes</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.alertsCount}</div>
              <p className="text-xs text-muted-foreground">
                Nécessitent attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Gestion des utilisateurs
              </CardTitle>
              <CardDescription>
                Administrez les comptes et permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/b2b/admin/users')} className="w-full">
                Gérer les utilisateurs
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Équipes
              </CardTitle>
              <CardDescription>
                Organisez vos équipes et départements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/b2b/admin/teams')} className="w-full" variant="outline">
                Gérer les équipes
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                Rapports
              </CardTitle>
              <CardDescription>
                Analysez les données de bien-être
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/b2b/admin/reports')} className="w-full" variant="outline">
                Voir les rapports
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Analytics and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Tendances bien-être
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800">Équipe Marketing</p>
                    <p className="text-sm text-green-600">Score moyen: 82%</p>
                  </div>
                  <div className="text-green-600">↗️</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-800">Équipe Tech</p>
                    <p className="text-sm text-yellow-600">Score moyen: 68%</p>
                  </div>
                  <div className="text-yellow-600">→</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-800">Équipe Ventes</p>
                    <p className="text-sm text-red-600">Score moyen: 55%</p>
                  </div>
                  <div className="text-red-600">↘️</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Alertes et notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                  <p className="font-medium text-red-800">Attention requise</p>
                  <p className="text-sm text-red-600">
                    3 employés avec scores de bien-être faibles cette semaine
                  </p>
                  <p className="text-xs text-red-500 mt-1">Il y a 2 heures</p>
                </div>
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <p className="font-medium text-yellow-800">Formation recommandée</p>
                  <p className="text-sm text-yellow-600">
                    Session gestion du stress suggérée pour l'équipe Ventes
                  </p>
                  <p className="text-xs text-yellow-500 mt-1">Il y a 4 heures</p>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Voir toutes les alertes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
