import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  Users, 
  Calendar,
  Activity,
  Zap,
  Heart,
  Eye,
  Download,
  RefreshCw,
  Filter,
  BarChart3,
  PieChart as PieIcon,
  LineChartIcon,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';

// Services et hooks
import { generateAnalyticsInsights } from '@/lib/ai/analytics-service';
import { useReporting } from '@/contexts/ReportingContext';

interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  description: string;
}

interface EmotionAnalytics {
  emotion: string;
  value: number;
  change: number;
  color: string;
  sessions: number;
}

interface TimeSeriesData {
  timestamp: string;
  overall: number;
  joy: number;
  calm: number;
  energy: number;
  stress: number;
  focus: number;
}

interface UserSegment {
  segment: string;
  users: number;
  averageScore: number;
  engagement: number;
  color: string;
}

interface InsightCard {
  type: 'success' | 'warning' | 'info' | 'danger';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
}

const EnhancedAnalyticsDashboard: React.FC = () => {
  const { stats, chartData, isLoading, loadData } = useReporting();
  const [timeRange, setTimeRange] = useState<'1w' | '1m' | '3m' | '6m'>('1m');
  const [selectedView, setSelectedView] = useState<'overview' | 'emotions' | 'users' | 'predictions'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [realTimeMode, setRealTimeMode] = useState(false);

  // Génération de données analytiques avancées
  const generateAdvancedMetrics = (): DashboardMetric[] => [
    {
      id: 'total_sessions',
      title: 'Sessions Totales',
      value: '1,247',
      change: 12.5,
      trend: 'up',
      icon: <Activity className="h-4 w-4" />,
      description: 'Sessions émotionnelles enregistrées ce mois'
    },
    {
      id: 'active_users',
      title: 'Utilisateurs Actifs',
      value: '342',
      change: 8.2,
      trend: 'up',
      icon: <Users className="h-4 w-4" />,
      description: 'Utilisateurs ayant une session dans les 7 derniers jours'
    },
    {
      id: 'engagement_rate',
      title: 'Taux d\'Engagement',
      value: '73%',
      change: -2.1,
      trend: 'down',
      icon: <Heart className="h-4 w-4" />,
      description: 'Pourcentage d\'utilisateurs revenant régulièrement'
    },
    {
      id: 'avg_wellbeing',
      title: 'Bien-être Moyen',
      value: '7.3',
      change: 5.7,
      trend: 'up',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Score moyen de bien-être sur 10'
    },
    {
      id: 'prediction_accuracy',
      title: 'Précision IA',
      value: '87%',
      change: 3.2,
      trend: 'up',
      icon: <Brain className="h-4 w-4" />,
      description: 'Précision des prédictions émotionnelles'
    },
    {
      id: 'risk_alerts',
      title: 'Alertes Risque',
      value: '12',
      change: -25.0,
      trend: 'up',
      icon: <AlertCircle className="h-4 w-4" />,
      description: 'Utilisateurs identifiés comme à risque'
    }
  ];

  const generateEmotionAnalytics = (): EmotionAnalytics[] => [
    { emotion: 'Joie', value: 7.8, change: 12.3, color: '#F59E0B', sessions: 423 },
    { emotion: 'Calme', value: 7.2, change: 8.7, color: '#10B981', sessions: 387 },
    { emotion: 'Énergie', value: 6.9, change: -2.1, color: '#3B82F6', sessions: 301 },
    { emotion: 'Concentration', value: 6.5, change: 15.4, color: '#8B5CF6', sessions: 276 },
    { emotion: 'Stress', value: 4.2, change: -18.9, color: '#EF4444', sessions: 198 },
    { emotion: 'Anxiété', value: 3.8, change: -22.1, color: '#F97316', sessions: 156 }
  ];

  const generateTimeSeriesData = (): TimeSeriesData[] => {
    const data: TimeSeriesData[] = [];
    const now = new Date();
    const days = timeRange === '1w' ? 7 : timeRange === '1m' ? 30 : timeRange === '3m' ? 90 : 180;

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Simulation de patterns réalistes
      const dayOfWeek = date.getDay();
      const baseScore = 6 + Math.sin((dayOfWeek / 7) * Math.PI * 2) * 1.5;
      
      data.push({
        timestamp: date.toISOString().split('T')[0],
        overall: baseScore + (Math.random() - 0.5) * 2,
        joy: baseScore * 1.1 + (Math.random() - 0.5) * 1.5,
        calm: baseScore * 0.9 + (Math.random() - 0.5) * 1.2,
        energy: baseScore * 1.2 + (Math.random() - 0.5) * 2,
        stress: Math.max(0, 8 - baseScore + (Math.random() - 0.5) * 2),
        focus: baseScore * 0.95 + (Math.random() - 0.5) * 1.8
      });
    }

    return data;
  };

  const generateUserSegments = (): UserSegment[] => [
    { segment: 'Très Engagés', users: 89, averageScore: 8.2, engagement: 95, color: '#10B981' },
    { segment: 'Engagés', users: 134, averageScore: 7.4, engagement: 78, color: '#3B82F6' },
    { segment: 'Modérés', users: 87, averageScore: 6.1, engagement: 52, color: '#F59E0B' },
    { segment: 'À Risque', users: 32, averageScore: 4.8, engagement: 28, color: '#EF4444' }
  ];

  const generateInsights = async () => {
    const mockData = {
      sessions: generateTimeSeriesData(),
      emotions: generateEmotionAnalytics(),
      users: generateUserSegments()
    };

    try {
      const aiInsights = await generateAnalyticsInsights(mockData, 'monthly');
      
      const insightCards: InsightCard[] = [
        {
          type: 'success',
          title: 'Amélioration du bien-être',
          description: 'Le score de bien-être général a augmenté de 12% ce mois',
          actionable: false,
          priority: 'medium'
        },
        {
          type: 'warning',
          title: 'Baisse d\'engagement le weekend',
          description: 'L\'engagement diminue de 35% les weekends',
          actionable: true,
          priority: 'high'
        },
        {
          type: 'info',
          title: 'Pattern saisonnier détecté',
          description: 'Les scores sont 15% plus élevés en milieu de semaine',
          actionable: true,
          priority: 'low'
        }
      ];

      setInsights(insightCards);
    } catch (error) {
      logger.error('Erreur génération insights', { error }, 'ANALYTICS');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await generateInsights();
    loadData(timeRange);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  useEffect(() => {
    generateInsights();
    loadData(timeRange);
  }, [timeRange]);

  // Simulation temps réel
  useEffect(() => {
    if (!realTimeMode) return;
    
    const interval = setInterval(() => {
      // Simulation de mise à jour temps réel
      generateInsights();
    }, 5000);

    return () => clearInterval(interval);
  }, [realTimeMode]);

  const metrics = generateAdvancedMetrics();
  const emotionData = generateEmotionAnalytics();
  const timeSeriesData = generateTimeSeriesData();
  const userSegments = generateUserSegments();

  const getMetricIcon = (trend: string, change: number) => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <Activity className="h-3 w-3 text-blue-500" />;
  };

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'danger': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec contrôles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Analyse avancée des données émotionnelles</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange as any}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1w">7 jours</SelectItem>
              <SelectItem value="1m">30 jours</SelectItem>
              <SelectItem value="3m">3 mois</SelectItem>
              <SelectItem value="6m">6 mois</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRealTimeMode(!realTimeMode)}
            className={cn(realTimeMode && "bg-green-100 text-green-800")}
          >
            {realTimeMode ? <Zap className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {realTimeMode ? "Live" : "Static"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {metric.icon}
                  <span className="text-xs font-medium text-muted-foreground">
                    {metric.title}
                  </span>
                </div>
                {getMetricIcon(metric.trend, metric.change)}
              </div>
              <div className="mt-2">
                <div className="text-xl font-bold">{metric.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className={cn(
                    "text-xs font-medium",
                    metric.change > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                  </span>
                  <span className="text-xs text-muted-foreground">vs période précédente</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights IA */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Insights IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className={cn(
                  "p-4 border-l-4 rounded-r-lg",
                  getInsightTypeColor(insight.type)
                )}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'}>
                        {insight.priority}
                      </Badge>
                      {insight.actionable && (
                        <Button size="sm" variant="outline">Action</Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Onglets d'analyse */}
      <Tabs value={selectedView} onValueChange={setSelectedView as any}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="emotions" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Émotions
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Prédictions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tendances temporelles */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution Temporelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeSeriesData}>
                      <defs>
                        <linearGradient id="overallGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="overall" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1} 
                        fill="url(#overallGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Répartition émotionnelle */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition Émotionnelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={emotionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ emotion, value }) => `${emotion}: ${value.toFixed(1)}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {emotionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="emotions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scores par émotion */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Analyse Multi-Émotionnelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="joy" stroke="#F59E0B" strokeWidth={2} />
                      <Line type="monotone" dataKey="calm" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="energy" stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="stress" stroke="#EF4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques émotions */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {emotionData.map((emotion, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{emotion.emotion}</span>
                      <Badge style={{ backgroundColor: emotion.color, color: 'white' }}>
                        {emotion.value.toFixed(1)}
                      </Badge>
                    </div>
                    <Progress value={emotion.value * 10} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{emotion.sessions} sessions</span>
                      <span className={cn(
                        emotion.change > 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {emotion.change > 0 ? '+' : ''}{emotion.change.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Segments utilisateurs */}
            <Card>
              <CardHeader>
                <CardTitle>Segmentation Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userSegments.map((segment, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{segment.segment}</span>
                        <Badge style={{ backgroundColor: segment.color, color: 'white' }}>
                          {segment.users} users
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Score moyen:</span>
                          <div className="font-medium">{segment.averageScore.toFixed(1)}/10</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Engagement:</span>
                          <div className="font-medium">{segment.engagement}%</div>
                        </div>
                      </div>
                      <Progress value={segment.engagement} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Graphique radar */}
            <Card>
              <CardHeader>
                <CardTitle>Profil Émotionnel Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={emotionData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="emotion" />
                      <PolarRadiusAxis />
                      <Radar
                        name="Score"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Prédictions IA (Bientôt disponible)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Module de Prédiction IA</h3>
                <p className="text-muted-foreground mb-4">
                  Algorithmes d'apprentissage automatique pour prédire les tendances émotionnelles
                </p>
                <Button>Configurer les Prédictions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;