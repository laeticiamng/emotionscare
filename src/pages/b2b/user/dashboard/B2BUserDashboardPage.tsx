
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Heart, 
  TrendingUp, 
  Calendar, 
  Music, 
  BookOpen, 
  Scan,
  Bot,
  Activity,
  Building,
  Target,
  Award,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

interface B2BDashboardStats {
  personalScore: number;
  teamRanking: number;
  totalScans: number;
  journalEntries: number;
  teamConnections: number;
  weeklyGoals: number;
}

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<B2BDashboardStats>({
    personalScore: 78,
    teamRanking: 3,
    totalScans: 0,
    journalEntries: 0,
    teamConnections: 12,
    weeklyGoals: 75
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const [emotionsResult, journalResult, profileResult] = await Promise.all([
        supabase.from('emotions').select('*').eq('user_id', user.id),
        supabase.from('journal_entries').select('*').eq('user_id', user.id),
        supabase.from('profiles').select('*').eq('id', user.id).single()
      ]);

      const emotionsCount = emotionsResult.data?.length || 0;
      const journalCount = journalResult.data?.length || 0;

      setStats(prev => ({
        ...prev,
        totalScans: emotionsCount,
        journalEntries: journalCount
      }));

      // Activité récente
      const recentEmotions = emotionsResult.data?.slice(-3) || [];
      const recentJournal = journalResult.data?.slice(-3) || [];
      
      const activity = [
        ...recentEmotions.map(e => ({
          type: 'emotion',
          title: 'Scan émotionnel',
          description: `Score: ${e.score || 'N/A'}`,
          time: new Date(e.date).toLocaleDateString(),
          icon: Scan
        })),
        ...recentJournal.map(j => ({
          type: 'journal',
          title: 'Entrée journal',
          description: j.content.substring(0, 50) + '...',
          time: new Date(j.date).toLocaleDateString(),
          icon: BookOpen
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      toast.error('Erreur lors du chargement du tableau de bord');
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Scanner mes émotions',
      description: 'Analysez votre état émotionnel',
      icon: Scan,
      color: 'bg-blue-500',
      path: '/scan'
    },
    {
      title: 'Coach IA',
      description: 'Conseils personnalisés',
      icon: Bot,
      color: 'bg-green-500',
      path: '/coach'
    },
    {
      title: 'Musique thérapie',
      description: 'Relaxation musicale',
      icon: Music,
      color: 'bg-purple-500',
      path: '/music'
    },
    {
      title: 'Journal personnel',
      description: 'Notes privées',
      icon: BookOpen,
      color: 'bg-orange-500',
      path: '/journal'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Espace Collaborateur 👨‍💼
          </h1>
          <p className="text-muted-foreground">
            Bonjour {user?.user_metadata?.name || user?.email?.split('@')[0]}, voici votre tableau de bord professionnel
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">
            <Building className="h-3 w-3 mr-1" />
            {user?.user_metadata?.company || 'Entreprise'}
          </Badge>
          <Badge variant="secondary">
            Collaborateur
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score personnel</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.personalScore}/100</div>
            <Progress value={stats.personalScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classement équipe</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{stats.teamRanking}</div>
            <p className="text-xs text-muted-foreground">
              sur {stats.teamConnections} collaborateurs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scans réalisés</CardTitle>
            <Scan className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScans}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 3)} cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Objectifs hebdo</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weeklyGoals}%</div>
            <Progress value={stats.weeklyGoals} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accédez rapidement à vos outils bien-être
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto flex flex-col items-center gap-2 p-4"
                onClick={() => navigate(action.path)}
              >
                <div className={`p-2 rounded-full ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team & Activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Votre équipe</CardTitle>
            <CardDescription>
              Bien-être collectif de votre équipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Bien-être moyen équipe</span>
                <span className="text-sm font-medium">82%</span>
              </div>
              <Progress value={82} />
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.teamConnections}</div>
                  <div className="text-xs text-muted-foreground">Collaborateurs actifs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">#{stats.teamRanking}</div>
                  <div className="text-xs text-muted-foreground">Votre position</div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                <Users className="h-4 w-4 mr-2" />
                Voir le tableau d'équipe
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>
              Vos dernières interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-full">
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Aucune activité récente
                </p>
                <p className="text-xs text-muted-foreground">
                  Commencez par scanner vos émotions !
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BUserDashboardPage;
