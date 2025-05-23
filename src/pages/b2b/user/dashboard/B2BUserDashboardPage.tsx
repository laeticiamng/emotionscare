
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, Users, MessageSquare, BarChart2, TrendingUp } from 'lucide-react';
import LoadingAnimation from '@/components/ui/loading-animation';
import { supabase } from '@/integrations/supabase/client';

const B2BUserDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    scansThisWeek: 0,
    lastScanScore: null as number | null,
    teamMembers: 0,
    upcomingEvents: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Load emotion scans from the last week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { data: scans } = await supabase
        .from('emotion_results')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', weekAgo.toISOString())
        .order('date', { ascending: false });

      const scansThisWeek = scans?.length || 0;
      const lastScanScore = scans?.[0]?.score || null;

      setStats({
        scansThisWeek,
        lastScanScore,
        teamMembers: 12, // Mock data
        upcomingEvents: 3 // Mock data
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
        <LoadingAnimation size="large" text="Chargement de votre tableau de bord..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto max-w-7xl">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord Collaborateur</h1>
            <p className="text-muted-foreground">
              Bonjour {user?.user_metadata?.name || user?.email} 👋
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
              <CardTitle className="text-sm font-medium">Scans cette semaine</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scansThisWeek}</div>
              <p className="text-xs text-muted-foreground">
                +2 par rapport à la semaine dernière
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dernier score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.lastScanScore ? Math.round(stats.lastScanScore * 100) : '--'}%
              </div>
              <p className="text-xs text-muted-foreground">
                Score de bien-être
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Équipe</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.teamMembers}</div>
              <p className="text-xs text-muted-foreground">
                Membres actifs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Événements</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">
                À venir cette semaine
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Scanner mes émotions
              </CardTitle>
              <CardDescription>
                Analysez votre état émotionnel du moment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/b2b/user/scan')} className="w-full">
                Commencer un scan
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Agenda
              </CardTitle>
              <CardDescription>
                Consultez vos événements et rendez-vous
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/b2b/user/calendar')} className="w-full" variant="outline">
                Voir l'agenda
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Espace social
              </CardTitle>
              <CardDescription>
                Connectez-vous avec votre équipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/b2b/user/social')} className="w-full" variant="outline">
                Accéder au social
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Scan émotionnel</p>
                    <p className="text-sm text-muted-foreground">Il y a 2 heures</p>
                  </div>
                  <div className="text-green-600 font-semibold">85%</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Participation équipe</p>
                    <p className="text-sm text-muted-foreground">Hier</p>
                  </div>
                  <div className="text-blue-600 font-semibold">✓</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Session bien-être</p>
                    <p className="text-sm text-muted-foreground">Il y a 3 jours</p>
                  </div>
                  <div className="text-purple-600 font-semibold">45min</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages équipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">Marie Dupont</p>
                  <p className="text-sm text-muted-foreground">
                    "Super session de méditation aujourd'hui ! 🧘‍♀️"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Il y a 1 heure</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">Thomas Martin</p>
                  <p className="text-sm text-muted-foreground">
                    "Quelqu'un pour une pause café ? ☕"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Il y a 3 heures</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/b2b/user/chat')} 
                className="w-full mt-4" 
                variant="outline"
              >
                Voir tous les messages
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BUserDashboardPage;
