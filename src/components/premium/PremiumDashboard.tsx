/**
 * 📊 PREMIUM DASHBOARD
 * Tableau de bord unifié et intelligent pour EmotionsCare
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Brain, 
  Heart, 
  Music,
  Users,
  Calendar,
  Award,
  Target,
  Activity,
  Sparkles,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  Bell,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UnifiedEmotionAnalyzer } from './UnifiedEmotionAnalyzer';
import { UnifiedMusicTherapy } from './UnifiedMusicTherapy';
import { useAccessibility } from '@/hooks/useAccessibility';

interface PremiumDashboardProps {
  userRole?: 'consumer' | 'employee' | 'manager' | 'admin';
  showEmotionCenter?: boolean;
  showMusicTherapy?: boolean;
  showAnalytics?: boolean;
  showGamification?: boolean;
  customWidgets?: React.ReactNode[];
}

interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  trend: number;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

interface EmotionTrend {
  date: string;
  emotion: string;
  intensity: number;
  activities: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  icon: React.ComponentType<any>;
  earned: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const DASHBOARD_VARIANTS = {
  consumer: {
    title: 'Votre Bien-être Personnel',
    subtitle: 'Suivez et améliorez votre santé émotionnelle',
    primaryColor: 'blue'
  },
  employee: {
    title: 'Bien-être Professionnel',
    subtitle: 'Optimisez votre performance et votre équilibre',
    primaryColor: 'green'
  },
  manager: {
    title: 'Vue d\'équipe',
    subtitle: 'Pilotez le bien-être de votre équipe',
    primaryColor: 'purple'
  },
  admin: {
    title: 'Administration Globale',
    subtitle: 'Gérez la plateforme et les utilisateurs',
    primaryColor: 'red'
  }
};

const TIME_RANGES = [
  { value: '7d', label: 'Cette semaine' },
  { value: '30d', label: 'Ce mois' },
  { value: '90d', label: 'Ce trimestre' },
  { value: '365d', label: 'Cette année' }
];

export const PremiumDashboard: React.FC<PremiumDashboardProps> = ({
  userRole = 'consumer',
  showEmotionCenter = true,
  showMusicTherapy = true,
  showAnalytics = true,
  showGamification = true,
  customWidgets = []
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { announce } = useAccessibility();

  const dashboardConfig = DASHBOARD_VARIANTS[userRole];

  // Mock data - En production, ces données viendraient des hooks/services
  const metrics: DashboardMetric[] = useMemo(() => [
    {
      id: 'wellbeing',
      title: 'Score de Bien-être',
      value: '8.7',
      trend: 12,
      icon: Heart,
      color: 'text-red-500',
      description: 'Votre score moyen de bien-être émotionnel'
    },
    {
      id: 'emotions',
      title: 'Émotions Analysées',
      value: 142,
      trend: 8,
      icon: Brain,
      color: 'text-blue-500',
      description: 'Nombre d\'analyses émotionnelles ce mois'
    },
    {
      id: 'music_sessions',
      title: 'Sessions Musicales',
      value: 28,
      trend: 15,
      icon: Music,
      color: 'text-purple-500',
      description: 'Sessions de musicothérapie complétées'
    },
    {
      id: 'streak',
      title: 'Série Actuelle',
      value: '12 jours',
      trend: 20,
      icon: Award,
      color: 'text-yellow-500',
      description: 'Jours consécutifs d\'utilisation'
    }
  ], []);

  const emotionTrends: EmotionTrend[] = useMemo(() => [
    { date: '2024-01-01', emotion: 'happy', intensity: 0.8, activities: ['music', 'journal'] },
    { date: '2024-01-02', emotion: 'calm', intensity: 0.7, activities: ['breathing', 'music'] },
    { date: '2024-01-03', emotion: 'motivated', intensity: 0.9, activities: ['coaching', 'exercise'] }
  ], []);

  const achievements: Achievement[] = useMemo(() => [
    {
      id: 'first_scan',
      title: 'Premier Scan',
      description: 'Réalisez votre première analyse émotionnelle',
      progress: 1,
      target: 1,
      icon: Brain,
      earned: true,
      rarity: 'common'
    },
    {
      id: 'music_lover',
      title: 'Mélomane',
      description: 'Écoutez 50 pistes de musicothérapie',
      progress: 28,
      target: 50,
      icon: Music,
      earned: false,
      rarity: 'rare'
    },
    {
      id: 'streak_master',
      title: 'Maître de la Constance',
      description: 'Maintenez une série de 30 jours',
      progress: 12,
      target: 30,
      icon: Award,
      earned: false,
      rarity: 'epic'
    }
  ], []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    announce('Actualisation des données en cours', 'polite');
    
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsRefreshing(false);
    announce('Données actualisées', 'assertive');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    announce(`Onglet ${value} sélectionné`, 'polite');
  };

  const rarityColors = {
    common: 'bg-gray-500/20 text-gray-700 border-gray-500/30',
    rare: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
    epic: 'bg-purple-500/20 text-purple-700 border-purple-500/30',
    legendary: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{dashboardConfig.title}</h1>
          <p className="text-muted-foreground">{dashboardConfig.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    +{metric.trend}% ce mois
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="emotions">Émotions</TabsTrigger>
          <TabsTrigger value="wellness">Bien-être</TabsTrigger>
          <TabsTrigger value="achievements">Réussites</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Emotion Center */}
            {showEmotionCenter && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-500" />
                    Centre Émotionnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UnifiedEmotionAnalyzer 
                    compact={true}
                    showRecommendations={false}
                  />
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Brain className="h-4 w-4 mr-2" />
                  Nouvelle analyse émotionnelle
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Music className="h-4 w-4 mr-2" />
                  Session de musicothérapie
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Planifier un objectif
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Partager avec mon équipe
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Music Therapy Widget */}
          {showMusicTherapy && (
            <UnifiedMusicTherapy 
              compact={true}
              showQueue={false}
              showRecommendations={true}
            />
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                Activité Récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emotionTrends.slice(0, 5).map((trend, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{trend.emotion}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Intensité: {Math.round(trend.intensity * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Activités: {trend.activities.join(', ')}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(trend.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emotions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <UnifiedEmotionAnalyzer showRecommendations={true} />
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Tendances Émotionnelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['happy', 'calm', 'motivated', 'focused'].map((emotion, index) => (
                      <div key={emotion} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{emotion}</span>
                          <span>{85 - index * 10}%</span>
                        </div>
                        <Progress value={85 - index * 10} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Insights IA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <p className="font-medium text-blue-900 dark:text-blue-100">Tendance positive</p>
                      <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
                        Votre bien-être s'améliore de 12% ce mois
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="font-medium text-green-900 dark:text-green-100">Recommandation</p>
                      <p className="text-green-700 dark:text-green-300 text-xs mt-1">
                        Continuez vos sessions de musicothérapie
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="wellness" className="space-y-6">
          {showMusicTherapy && (
            <UnifiedMusicTherapy showVisualizer={true} showQueue={true} />
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          {showGamification && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                const progressPercent = (achievement.progress / achievement.target) * 100;
                
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className={achievement.earned ? 'ring-2 ring-primary' : ''}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Icon className={`h-6 w-6 ${achievement.earned ? 'text-primary' : 'text-muted-foreground'}`} />
                          <Badge 
                            variant="outline" 
                            className={rarityColors[achievement.rarity]}
                          >
                            {achievement.rarity}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progression</span>
                            <span>{achievement.progress}/{achievement.target}</span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </div>
                        
                        {achievement.earned && (
                          <Badge className="w-full justify-center">
                            <Award className="h-3 w-3 mr-1" />
                            Obtenu!
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Custom Widgets */}
      {customWidgets.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Widgets Personnalisés</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {customWidgets.map((widget, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {widget}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};