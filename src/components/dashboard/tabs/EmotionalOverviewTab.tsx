// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Heart,
  TrendingUp,
  TrendingDown,
  Brain,
  Smile,
  Frown,
  Meh,
  Activity,
  Calendar,
  Clock,
  Target,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface EmotionalOverviewTabProps {
  className?: string;
}

interface EmotionData {
  name: string;
  value: number;
  color: string;
  trend: number;
}

interface DailyMood {
  date: string;
  wellbeing: number;
  stress: number;
  energy: number;
}

const mockEmotionDistribution: EmotionData[] = [
  { name: 'Joie', value: 35, color: '#22c55e', trend: 5 },
  { name: 'Calme', value: 25, color: '#3b82f6', trend: 3 },
  { name: 'Motivation', value: 20, color: '#f59e0b', trend: -2 },
  { name: 'Stress', value: 12, color: '#ef4444', trend: -4 },
  { name: 'Fatigue', value: 8, color: '#6b7280', trend: -1 },
];

const mockDailyMood: DailyMood[] = [
  { date: 'Lun', wellbeing: 72, stress: 35, energy: 68 },
  { date: 'Mar', wellbeing: 78, stress: 28, energy: 75 },
  { date: 'Mer', wellbeing: 75, stress: 32, energy: 70 },
  { date: 'Jeu', wellbeing: 82, stress: 25, energy: 78 },
  { date: 'Ven', wellbeing: 85, stress: 20, energy: 82 },
  { date: 'Sam', wellbeing: 88, stress: 15, energy: 85 },
  { date: 'Dim', wellbeing: 80, stress: 22, energy: 75 },
];

const mockInsights = [
  {
    type: 'positive',
    title: 'Amélioration du bien-être',
    description: 'Votre score de bien-être a augmenté de 12% cette semaine',
    icon: TrendingUp,
  },
  {
    type: 'warning',
    title: 'Pics de stress détectés',
    description: 'Stress élevé détecté les mercredis - pensez à planifier des pauses',
    icon: AlertCircle,
  },
  {
    type: 'info',
    title: 'Meilleur moment de la journée',
    description: 'Votre énergie est optimale entre 10h et 14h',
    icon: Clock,
  },
];

const EmotionalOverviewTab: React.FC<EmotionalOverviewTabProps> = ({ className }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const averageWellbeing = useMemo(() => {
    return Math.round(
      mockDailyMood.reduce((sum, day) => sum + day.wellbeing, 0) / mockDailyMood.length
    );
  }, []);

  const averageStress = useMemo(() => {
    return Math.round(
      mockDailyMood.reduce((sum, day) => sum + day.stress, 0) / mockDailyMood.length
    );
  }, []);

  const dominantEmotion = useMemo(() => {
    return mockEmotionDistribution.reduce((prev, current) =>
      prev.value > current.value ? prev : current
    );
  }, []);

  const getMoodIcon = (score: number) => {
    if (score >= 75) return <Smile className="h-5 w-5 text-green-500" />;
    if (score >= 50) return <Meh className="h-5 w-5 text-yellow-500" />;
    return <Frown className="h-5 w-5 text-red-500" />;
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bien-être moyen</p>
                  <p className="text-3xl font-bold text-green-600">{averageWellbeing}%</p>
                </div>
                {getMoodIcon(averageWellbeing)}
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+8% vs semaine dernière</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Niveau de stress</p>
                  <p className="text-3xl font-bold text-red-600">{averageStress}%</p>
                </div>
                <Activity className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <TrendingDown className="h-4 w-4" />
                <span>-12% vs semaine dernière</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Émotion dominante</p>
                  <p className="text-2xl font-bold" style={{ color: dominantEmotion.color }}>
                    {dominantEmotion.name}
                  </p>
                </div>
                <Heart className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <span>{dominantEmotion.value}% du temps</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scans cette semaine</p>
                  <p className="text-3xl font-bold text-purple-600">14</p>
                </div>
                <Brain className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-purple-600">
                <Target className="h-4 w-4" />
                <span>Objectif: 21 scans</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Evolution Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Évolution émotionnelle
                </CardTitle>
                <CardDescription>Bien-être, stress et énergie sur 7 jours</CardDescription>
              </div>
              <div className="flex gap-1">
                {(['week', 'month', 'year'] as const).map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period === 'week' ? '7J' : period === 'month' ? '30J' : '1A'}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={mockDailyMood}>
                <defs>
                  <linearGradient id="colorWellbeing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="wellbeing"
                  name="Bien-être"
                  stroke="#22c55e"
                  fill="url(#colorWellbeing)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="stress"
                  name="Stress"
                  stroke="#ef4444"
                  fill="url(#colorStress)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  name="Énergie"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Emotion Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Distribution émotionnelle
            </CardTitle>
            <CardDescription>Répartition de vos émotions cette semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={mockEmotionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {mockEmotionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {mockEmotionDistribution.map((emotion) => (
                <div
                  key={emotion.name}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: emotion.color }}
                    />
                    <span className="text-sm">{emotion.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{emotion.value}%</span>
                    {emotion.trend > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Insights personnalisés
          </CardTitle>
          <CardDescription>Recommandations basées sur vos données</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  insight.type === 'positive'
                    ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900'
                    : insight.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-900'
                    : 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div>
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" className="flex-1 min-w-[200px]">
          <Calendar className="h-4 w-4 mr-2" />
          Voir l'historique complet
        </Button>
        <Button variant="outline" className="flex-1 min-w-[200px]">
          <Target className="h-4 w-4 mr-2" />
          Définir des objectifs
        </Button>
        <Button className="flex-1 min-w-[200px]">
          <Brain className="h-4 w-4 mr-2" />
          Nouveau scan
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default EmotionalOverviewTab;
