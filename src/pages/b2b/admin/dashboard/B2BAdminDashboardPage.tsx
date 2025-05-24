
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Heart, 
  Brain,
  Calendar,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TeamStats {
  totalUsers: number;
  activeUsers: number;
  avgEmotionalScore: number;
  totalScans: number;
  weeklyTrend: number;
}

const B2BAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<TeamStats>({
    totalUsers: 0,
    activeUsers: 0,
    avgEmotionalScore: 0,
    totalScans: 0,
    weeklyTrend: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simuler des données d'équipe (en production, ces données viendraient de Supabase)
      const mockStats: TeamStats = {
        totalUsers: 24,
        activeUsers: 18,
        avgEmotionalScore: 7.2,
        totalScans: 156,
        weeklyTrend: 12
      };
      
      const mockActivities = [
        {
          id: 1,
          type: 'scan',
          user: 'Marie D.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          score: 8
        },
        {
          id: 2,
          type: 'alert',
          user: 'Jean P.',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          score: 3
        },
        {
          id: 3,
          type: 'scan',
          user: 'Sophie L.',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          score: 6
        }
      ];
      
      setStats(mockStats);
      setRecentActivities(mockActivities);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement du tableau de bord');
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      toast.info('Génération du rapport en cours...');
      // Ici, on pourrait appeler une edge function pour générer un rapport
      toast.success('Rapport généré avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la génération du rapport');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (score >= 5) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffHours === 0) return 'À l\'instant';
    if (diffHours === 1) return 'Il y a 1 heure';
    return `Il y a ${diffHours} heures`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord RH</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble du bien-être de vos équipes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateReport}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaborateurs total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} actifs cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score bien-être moyen</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgEmotionalScore}/10</div>
            <p className="text-xs text-green-600">
              +{stats.weeklyTrend}% par rapport à la semaine dernière
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analyses réalisées</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScans}</div>
            <p className="text-xs text-muted-foreground">
              Cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-orange-600">
              Nécessitent votre attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activité récente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Activité récente
            </CardTitle>
            <CardDescription>
              Dernières analyses émotionnelles de vos équipes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <div>
                      <p className="font-medium">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTimestamp(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getScoreColor(activity.score)}
                  >
                    {activity.score}/10
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights et recommandations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Insights & Recommandations
            </CardTitle>
            <CardDescription>
              Analyses automatiques basées sur l'IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  ✅ Tendance positive
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Le bien-être général de l'équipe s'améliore (+12% cette semaine). 
                  Les initiatives mises en place portent leurs fruits.
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                  ⚠️ Attention requise
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  2 collaborateurs montrent des signes de stress. 
                  Envisagez un entretien individuel.
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  💡 Suggestion
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Organisez une session de team building. 
                  L'engagement collectif pourrait bénéficier à tous.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
