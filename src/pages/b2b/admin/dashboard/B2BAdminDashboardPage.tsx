
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, BarChart3, Settings, UserPlus, Shield, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const B2BAdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTeams: 0,
    pendingInvites: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      
      // Charger les statistiques depuis Supabase
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'b2c');

      const { data: invitations } = await supabase
        .from('invitations')
        .select('*')
        .eq('status', 'pending');

      setStats({
        totalUsers: profiles?.length || 0,
        activeUsers: profiles?.filter(p => p.created_at && new Date(p.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length || 0,
        totalTeams: Math.floor((profiles?.length || 0) / 5), // Estimation
        pendingInvites: invitations?.length || 0
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const quickActions = [
    {
      title: 'Inviter des utilisateurs',
      description: 'Ajouter de nouveaux collaborateurs',
      icon: UserPlus,
      action: () => navigate('/b2b/admin/users'),
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Gérer les équipes',
      description: 'Organiser vos équipes',
      icon: Users,
      action: () => navigate('/b2b/admin/teams'),
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Analyses sociales',
      description: 'Voir les interactions',
      icon: Activity,
      action: () => navigate('/b2b/admin/social-cocoon'),
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto max-w-7xl">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Administration EmotionsCare
            </h1>
            <p className="text-muted-foreground mt-1">
              Bienvenue, {user?.user_metadata?.name || user?.email}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Déconnexion
          </Button>
        </header>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+12% ce mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">30 derniers jours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Équipes</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalTeams}</div>
              <p className="text-xs text-muted-foreground">Équipes actives</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Invitations en attente</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.pendingInvites}</div>
              <p className="text-xs text-muted-foreground">À traiter</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={action.action}>
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color} mb-4`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Activité récente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Activité récente
            </CardTitle>
            <CardDescription>Dernières actions dans votre organisation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Nouvel utilisateur inscrit</p>
                  <p className="text-sm text-muted-foreground">marie.dubois@entreprise.com - il y a 2 heures</p>
                </div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  Nouveau
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Équipe "Marketing" créée</p>
                  <p className="text-sm text-muted-foreground">5 membres ajoutés - il y a 1 jour</p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  Équipe
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Scan émotionnel collectif</p>
                  <p className="text-sm text-muted-foreground">12 participants - il y a 3 jours</p>
                </div>
                <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                  Activité
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
