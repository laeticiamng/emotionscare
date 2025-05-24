
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Heart, 
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface AnalyticsData {
  wellbeingTrends: Array<{
    month: string;
    score: number;
    change: number;
  }>;
  departmentStats: Array<{
    department: string;
    score: number;
    users: number;
    engagement: number;
  }>;
  usageMetrics: {
    totalScans: number;
    activeUsers: number;
    avgSessionTime: number;
    retentionRate: number;
  };
}

const B2BAdminAnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    wellbeingTrends: [],
    departmentStats: [],
    usageMetrics: {
      totalScans: 0,
      activeUsers: 0,
      avgSessionTime: 0,
      retentionRate: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod, selectedDepartment]);

  const loadAnalyticsData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Charger les données analytics depuis Supabase
      const [emotionsResult, profilesResult] = await Promise.all([
        supabase.from('emotions').select('*'),
        supabase.from('profiles').select('*')
      ]);

      const emotions = emotionsResult.data || [];
      const profiles = profilesResult.data || [];

      // Calculer les métriques d'usage
      const totalScans = emotions.length;
      const activeUsers = profiles.filter(p => p.role === 'b2b_user').length;

      // Simuler des données de tendances
      const wellbeingTrends = [
        { month: 'Jan', score: 72, change: 5 },
        { month: 'Fév', score: 75, change: 3 },
        { month: 'Mar', score: 78, change: 4 },
        { month: 'Avr', score: 76, change: -2 },
        { month: 'Mai', score: 80, change: 5 },
        { month: 'Jun', score: 82, change: 3 }
      ];

      // Simuler des stats par département
      const departmentStats = [
        { department: 'IT', score: 78, users: 12, engagement: 85 },
        { department: 'Marketing', score: 82, users: 8, engagement: 92 },
        { department: 'Ventes', score: 75, users: 15, engagement: 78 },
        { department: 'RH', score: 85, users: 5, engagement: 95 },
        { department: 'Finance', score: 73, users: 7, engagement: 72 }
      ];

      setAnalyticsData({
        wellbeingTrends,
        departmentStats,
        usageMetrics: {
          totalScans,
          activeUsers,
          avgSessionTime: 12, // minutes
          retentionRate: 78 // pourcentage
        }
      });

    } catch (error) {
      console.error('Erreur chargement analytics:', error);
      toast.error('Erreur lors du chargement des analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    // Simuler l'export de données
    toast.success('Rapport téléchargé avec succès');
  };

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
            Analytics & Rapports 📊
          </h1>
          <p className="text-muted-foreground">
            Analyse détaillée du bien-être de votre organisation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres d'analyse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Période</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Département</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Ventes</SelectItem>
                  <SelectItem value="hr">RH</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total scans émotionnels</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.usageMetrics.totalScans}</div>
            <p className="text-xs text-muted-foreground">
              +15% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.usageMetrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Taux d'engagement: {analyticsData.usageMetrics.retentionRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps de session moyen</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.usageMetrics.avgSessionTime} min</div>
            <p className="text-xs text-muted-foreground">
              +2 min par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score bien-être moyen</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78/100</div>
            <Progress value={78} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Wellbeing Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution du bien-être</CardTitle>
            <CardDescription>
              Tendances sur les 6 derniers mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.wellbeingTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium w-8">{trend.month}</span>
                    <Progress value={trend.score} className="w-32" />
                    <span className="text-sm">{trend.score}/100</span>
                  </div>
                  <Badge variant={trend.change > 0 ? "default" : "destructive"}>
                    {trend.change > 0 ? '+' : ''}{trend.change}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance par département</CardTitle>
            <CardDescription>
              Scores et engagement par équipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.departmentStats.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{dept.department}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{dept.users} users</span>
                      <Badge variant="outline">{dept.score}/100</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Bien-être</div>
                      <Progress value={dept.score} className="mt-1" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Engagement</div>
                      <Progress value={dept.engagement} className="mt-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights et recommandations</CardTitle>
          <CardDescription>
            Analyses automatiques et suggestions d'amélioration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  Tendance positive
                </span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Le score de bien-être global a augmenté de 5% ce mois-ci. 
                L'équipe Marketing montre des résultats exceptionnels.
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800 dark:text-blue-200">
                  Recommandation
                </span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Organiser des sessions de bien-être pour l'équipe Finance qui présente 
                un score plus faible que la moyenne.
              </p>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800 dark:text-orange-200">
                  Attention requise
                </span>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                2 collaborateurs présentent des scores critiques et pourraient bénéficier 
                d'un accompagnement personnalisé.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminAnalyticsPage;
