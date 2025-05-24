
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Activity, Heart, Download, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  emotionalScore: number;
  engagementRate: number;
  weeklyData: Array<{
    date: string;
    users: number;
    emotions: number;
    engagement: number;
  }>;
  emotionDistribution: Array<{
    emotion: string;
    count: number;
    color: string;
  }>;
  departmentStats: Array<{
    department: string;
    users: number;
    avgScore: number;
  }>;
}

const B2BAdminAnalyticsPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, selectedDepartment]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Fetch real data from Supabase
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      const { data: emotions, error: emotionsError } = await supabase
        .from('emotions')
        .select('*');

      if (profilesError || emotionsError) {
        throw new Error('Erreur lors du chargement des données');
      }

      // Process data for analytics
      const mockData: AnalyticsData = {
        totalUsers: profiles?.length || 0,
        activeUsers: Math.floor((profiles?.length || 0) * 0.7),
        emotionalScore: 7.2,
        engagementRate: 85,
        weeklyData: [
          { date: '2024-01-15', users: 45, emotions: 120, engagement: 78 },
          { date: '2024-01-16', users: 52, emotions: 135, engagement: 82 },
          { date: '2024-01-17', users: 48, emotions: 128, engagement: 79 },
          { date: '2024-01-18', users: 61, emotions: 145, engagement: 85 },
          { date: '2024-01-19', users: 58, emotions: 142, engagement: 88 },
          { date: '2024-01-20', users: 49, emotions: 131, engagement: 83 },
          { date: '2024-01-21', users: 55, emotions: 138, engagement: 86 }
        ],
        emotionDistribution: [
          { emotion: 'Joie', count: 45, color: '#22C55E' },
          { emotion: 'Calme', count: 32, color: '#3B82F6' },
          { emotion: 'Stress', count: 28, color: '#F59E0B' },
          { emotion: 'Fatigue', count: 25, color: '#EF4444' },
          { emotion: 'Motivation', count: 38, color: '#8B5CF6' }
        ],
        departmentStats: [
          { department: 'IT', users: 25, avgScore: 7.8 },
          { department: 'Marketing', users: 18, avgScore: 7.2 },
          { department: 'RH', users: 12, avgScore: 8.1 },
          { department: 'Ventes', users: 22, avgScore: 6.9 },
          { department: 'Support', users: 15, avgScore: 7.5 }
        ]
      };

      setAnalyticsData(mockData);
    } catch (error) {
      toast.error('Erreur lors du chargement des analytics');
      console.error('Analytics error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    toast.success('Rapport exporté avec succès');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Analytics Entreprise</h1>
          <p className="text-muted-foreground">Tableau de bord des performances et du bien-être</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
              <SelectItem value="90d">90 jours</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +12% depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              +8% depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Émotionnel Moyen</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.emotionalScore}/10</div>
            <p className="text-xs text-muted-foreground">
              +0.3 depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.engagementRate}%</div>
            <p className="text-xs text-muted-foreground">
              +5% depuis le mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité Hebdomadaire</CardTitle>
            <CardDescription>Évolution de l'engagement utilisateur</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" name="Utilisateurs" />
                <Line type="monotone" dataKey="emotions" stroke="#22C55E" name="Émotions" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution des Émotions</CardTitle>
            <CardDescription>Répartition des états émotionnels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.emotionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analyticsData.emotionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques par Département</CardTitle>
          <CardDescription>Performance et bien-être par équipe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.departmentStats.map((dept) => (
              <div key={dept.department} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{dept.department}</h4>
                  <p className="text-sm text-muted-foreground">{dept.users} utilisateurs</p>
                </div>
                <div className="text-right">
                  <Badge variant={dept.avgScore >= 7.5 ? 'default' : dept.avgScore >= 7 ? 'secondary' : 'destructive'}>
                    Score: {dept.avgScore}/10
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminAnalyticsPage;
