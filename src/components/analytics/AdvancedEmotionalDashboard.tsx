/**
 * Dashboard d'Analyse Émotionnelle Avancée
 *
 * Visualisations et insights enrichis pour l'analyse émotionnelle
 *
 * @module AdvancedEmotionalDashboard
 * @version 1.0.0
 * @created 2025-11-14
 */

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  Sparkles,
  Calendar,
  Clock,
  Heart,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════

export interface EmotionDataPoint {
  timestamp: Date;
  emotion: string;
  score: number;
  valence?: number;
  arousal?: number;
  source: 'text' | 'voice' | 'camera' | 'emoji';
}

export interface EmotionalPattern {
  id: string;
  type: 'recurring' | 'seasonal' | 'contextual' | 'triggered';
  emotion: string;
  frequency: number;
  confidence: number;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek?: string;
  context?: string;
  description: string;
}

export interface EmotionalInsight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'neutral' | 'warning' | 'tip';
  category: 'trend' | 'pattern' | 'suggestion' | 'achievement';
  confidence: number;
  actionable?: {
    label: string;
    action: () => void;
  };
}

export interface EmotionalTrend {
  emotion: string;
  change: number; // pourcentage de changement
  direction: 'up' | 'down' | 'stable';
  periodComparison: 'week' | 'month' | 'year';
}

interface AdvancedEmotionalDashboardProps {
  data: EmotionDataPoint[];
  patterns?: EmotionalPattern[];
  insights?: EmotionalInsight[];
  className?: string;
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

const calculateEmotionDistribution = (data: EmotionDataPoint[]) => {
  const distribution: Record<string, number> = {};

  data.forEach(point => {
    distribution[point.emotion] = (distribution[point.emotion] || 0) + 1;
  });

  const total = data.length;

  return Object.entries(distribution)
    .map(([emotion, count]) => ({
      emotion,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);
};

const calculateAverageMood = (data: EmotionDataPoint[]) => {
  if (data.length === 0) return 0;

  const totalValence = data.reduce((sum, point) => sum + (point.valence || 0), 0);
  return Math.round((totalValence / data.length) * 10) / 10;
};

const calculateEmotionalVariability = (data: EmotionDataPoint[]) => {
  if (data.length === 0) return 0;

  const scores = data.map(d => d.score);
  const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  return Math.round(stdDev * 10) / 10;
};

const detectTrends = (data: EmotionDataPoint[]): EmotionalTrend[] => {
  // Grouper par émotion
  const emotionGroups: Record<string, EmotionDataPoint[]> = {};

  data.forEach(point => {
    if (!emotionGroups[point.emotion]) {
      emotionGroups[point.emotion] = [];
    }
    emotionGroups[point.emotion].push(point);
  });

  // Calculer les tendances
  return Object.entries(emotionGroups).map(([emotion, points]) => {
    const sortedPoints = [...points].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    if (sortedPoints.length < 2) {
      return { emotion, change: 0, direction: 'stable' as const, periodComparison: 'week' as const };
    }

    // Comparer première moitié vs deuxième moitié
    const midpoint = Math.floor(sortedPoints.length / 2);
    const firstHalf = sortedPoints.slice(0, midpoint);
    const secondHalf = sortedPoints.slice(midpoint);

    const firstAvg = firstHalf.reduce((sum, p) => sum + p.score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, p) => sum + p.score, 0) / secondHalf.length;

    const change = ((secondAvg - firstAvg) / firstAvg) * 100;
    const direction = Math.abs(change) < 5 ? 'stable' : (change > 0 ? 'up' : 'down');

    return {
      emotion,
      change: Math.round(change),
      direction,
      periodComparison: 'week' as const,
    };
  });
};

const generateInsights = (data: EmotionDataPoint[], trends: EmotionalTrend[]): EmotionalInsight[] => {
  const insights: EmotionalInsight[] = [];

  // Insight sur la tendance globale
  const avgMood = calculateAverageMood(data);

  if (avgMood > 0.5) {
    insights.push({
      id: 'positive-trend',
      title: 'Tendance Positive Détectée 🎉',
      description: `Votre humeur moyenne est de ${avgMood.toFixed(1)}/10, ce qui est excellent ! Continuez sur cette lancée.`,
      type: 'positive',
      category: 'trend',
      confidence: 0.9,
    });
  } else if (avgMood < -0.2) {
    insights.push({
      id: 'support-needed',
      title: 'Besoin de Soutien ?',
      description: 'Nous avons remarqué des émotions difficiles récemment. Explorez nos ressources de bien-être.',
      type: 'warning',
      category: 'suggestion',
      confidence: 0.85,
    });
  }

  // Insight sur l'émotion dominante
  const distribution = calculateEmotionDistribution(data);
  if (distribution.length > 0) {
    const dominant = distribution[0];

    insights.push({
      id: 'dominant-emotion',
      title: `${dominant.emotion} Domine Vos Émotions`,
      description: `${dominant.percentage.toFixed(1)}% de vos entrées récentes reflètent ${dominant.emotion}.`,
      type: 'neutral',
      category: 'pattern',
      confidence: 0.95,
    });
  }

  // Insight sur la variabilité
  const variability = calculateEmotionalVariability(data);

  if (variability > 2) {
    insights.push({
      id: 'high-variability',
      title: 'Émotions Fluctuantes',
      description: 'Vos émotions varient beaucoup. La méditation pourrait vous aider à trouver plus de stabilité.',
      type: 'tip',
      category: 'suggestion',
      confidence: 0.75,
    });
  } else if (variability < 0.5) {
    insights.push({
      id: 'stable-emotions',
      title: 'Équilibre Émotionnel Stable',
      description: 'Félicitations ! Vous maintenez une belle stabilité émotionnelle.',
      type: 'positive',
      category: 'achievement',
      confidence: 0.9,
    });
  }

  // Insight sur les tendances positives
  const positiveTrends = trends.filter(t => t.direction === 'up' && t.change > 20);

  if (positiveTrends.length > 0) {
    insights.push({
      id: 'positive-trends',
      title: 'Progression Remarquable !',
      description: `${positiveTrends.length} émotion(s) en forte hausse. Vous êtes sur la bonne voie !`,
      type: 'positive',
      category: 'trend',
      confidence: 0.88,
    });
  }

  return insights;
};

// ═══════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════

export const AdvancedEmotionalDashboard: React.FC<AdvancedEmotionalDashboardProps> = ({
  data,
  patterns = [],
  insights: providedInsights,
  className,
}) => {
  // Calculer les métriques
  const metrics = useMemo(() => {
    const distribution = calculateEmotionDistribution(data);
    const avgMood = calculateAverageMood(data);
    const variability = calculateEmotionalVariability(data);
    const trends = detectTrends(data);
    const insights = providedInsights || generateInsights(data, trends);

    return {
      distribution,
      avgMood,
      variability,
      trends,
      insights,
      totalDataPoints: data.length,
    };
  }, [data, providedInsights]);

  // Couleurs pour les émotions
  const emotionColors: Record<string, string> = {
    joy: '#FFD700',
    happiness: '#FFD700',
    sadness: '#4169E1',
    anger: '#DC143C',
    fear: '#9370DB',
    disgust: '#8B4513',
    surprise: '#FF69B4',
    neutral: '#808080',
    contentment: '#90EE90',
    excitement: '#FF6347',
  };

  const insightTypeIcons = {
    positive: Sparkles,
    neutral: Activity,
    warning: TrendingUp,
    tip: Brain,
  };

  const insightTypeColors = {
    positive: 'border-green-300 bg-green-50',
    neutral: 'border-blue-300 bg-blue-50',
    warning: 'border-orange-300 bg-orange-50',
    tip: 'border-purple-300 bg-purple-50',
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* En-tête avec métriques clés */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Humeur Moyenne</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="text-3xl font-bold">
                {metrics.avgMood > 0 ? '+' : ''}{metrics.avgMood.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.avgMood > 0.5 ? 'Très positif' : metrics.avgMood > 0 ? 'Positif' : metrics.avgMood > -0.5 ? 'Neutre' : 'Négatif'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Variabilité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <span className="text-3xl font-bold">{metrics.variability.toFixed(1)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.variability < 1 ? 'Très stable' : metrics.variability < 2 ? 'Stable' : 'Fluctuant'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Entrées Totales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <span className="text-3xl font-bold">{metrics.totalDataPoints}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Analyses émotionnelles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Insights Générés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="text-3xl font-bold">{metrics.insights.length}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Recommandations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs pour différentes vues */}
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">
            <Brain className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="distribution">
            <PieChart className="h-4 w-4 mr-2" />
            Distribution
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="h-4 w-4 mr-2" />
            Tendances
          </TabsTrigger>
          <TabsTrigger value="patterns">
            <Zap className="h-4 w-4 mr-2" />
            Patterns
          </TabsTrigger>
        </TabsList>

        {/* TAB: Insights */}
        <TabsContent value="insights" className="space-y-4">
          {metrics.insights.map((insight, index) => {
            const Icon = insightTypeIcons[insight.type];

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn('border-2', insightTypeColors[insight.type])}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <Icon className="h-6 w-6 mt-1" />
                      <div className="flex-1">
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <CardDescription className="mt-1">{insight.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(insight.confidence * 100)}% confiance
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}

          {metrics.insights.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Pas assez de données pour générer des insights.</p>
                <p className="text-sm">Continuez à enregistrer vos émotions !</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TAB: Distribution */}
        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribution des Émotions</CardTitle>
              <CardDescription>Répartition de vos émotions récentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.distribution.map((item, index) => {
                  const color = emotionColors[item.emotion.toLowerCase()] || '#808080';

                  return (
                    <div key={item.emotion} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium capitalize">{item.emotion}</span>
                        <span className="text-muted-foreground">
                          {item.count} ({item.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Tendances */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendances Émotionnelles</CardTitle>
              <CardDescription>Évolution de vos émotions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.trends.map((trend) => {
                  const Icon = trend.direction === 'up' ? TrendingUp :
                    trend.direction === 'down' ? TrendingUp :
                      Activity;

                  const colorClass = trend.direction === 'up' ? 'text-green-600' :
                    trend.direction === 'down' ? 'text-red-600' :
                      'text-gray-600';

                  return (
                    <div
                      key={trend.emotion}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn('h-5 w-5', colorClass)} />
                        <div>
                          <p className="font-medium capitalize">{trend.emotion}</p>
                          <p className="text-xs text-muted-foreground">
                            Comparé à la semaine dernière
                          </p>
                        </div>
                      </div>
                      <Badge variant={trend.direction === 'up' ? 'default' : trend.direction === 'down' ? 'destructive' : 'secondary'}>
                        {trend.change > 0 ? '+' : ''}{trend.change}%
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Patterns */}
        <TabsContent value="patterns" className="space-y-4">
          {patterns.length > 0 ? (
            patterns.map((pattern) => (
              <Card key={pattern.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base capitalize">{pattern.emotion}</CardTitle>
                    <Badge>{pattern.type}</Badge>
                  </div>
                  <CardDescription>{pattern.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm">
                    {pattern.timeOfDay && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="capitalize">{pattern.timeOfDay}</span>
                      </div>
                    )}
                    {pattern.dayOfWeek && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{pattern.dayOfWeek}</span>
                      </div>
                    )}
                    <div className="ml-auto text-muted-foreground">
                      {Math.round(pattern.confidence * 100)}% confiance
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun pattern détecté pour l'instant.</p>
                <p className="text-sm">Continuez à enregistrer vos émotions régulièrement !</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedEmotionalDashboard;
