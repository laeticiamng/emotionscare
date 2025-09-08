/**
 * 🧠 EMOTION INSIGHTS OPTIMIZED
 * Composant optimisé pour les insights émotionnels
 */

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Heart, 
  Lightbulb,
  BarChart3,
  Activity,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface EmotionData {
  emotion: string;
  confidence: number;
  timestamp: string;
  context?: string;
}

interface InsightData {
  id: string;
  type: 'trend' | 'pattern' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  value?: number;
  trend?: 'up' | 'down' | 'stable';
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
}

interface EmotionInsightsProps {
  emotions: EmotionData[];
  insights: InsightData[];
  timeRange?: '7d' | '30d' | '90d';
  showTrends?: boolean;
  showRecommendations?: boolean;
  compact?: boolean;
}

const INSIGHT_ICONS = {
  trend: TrendingUp,
  pattern: BarChart3,
  recommendation: Lightbulb,
  achievement: Sparkles
};

const PRIORITY_COLORS = {
  low: 'bg-blue-50 text-blue-700 border-blue-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  high: 'bg-red-50 text-red-700 border-red-200'
};

export const EmotionInsights: React.FC<EmotionInsightsProps> = memo(({
  emotions,
  insights,
  timeRange = '30d',
  showTrends = true,
  showRecommendations = true,
  compact = false
}) => {
  const emotionStats = useMemo(() => {
    if (!emotions.length) return null;

    const emotionCounts = emotions.reduce((acc, { emotion }) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalEmotions = emotions.length;
    const mostCommon = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([emotion, count]) => ({
        emotion,
        count,
        percentage: Math.round((count / totalEmotions) * 100)
      }));

    const averageConfidence = emotions.reduce((sum, { confidence }) => sum + confidence, 0) / totalEmotions;

    return {
      total: totalEmotions,
      mostCommon,
      averageConfidence: Math.round(averageConfidence * 100)
    };
  }, [emotions]);

  const prioritizedInsights = useMemo(() => {
    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [insights]);

  const filteredInsights = useMemo(() => {
    if (!showRecommendations) {
      return prioritizedInsights.filter(insight => insight.type !== 'recommendation');
    }
    return prioritizedInsights;
  }, [prioritizedInsights, showRecommendations]);

  if (!emotionStats && !insights.length) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center text-muted-foreground">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Aucune donnée émotionnelle disponible</p>
            <p className="text-sm">Commencez par analyser vos émotions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${compact ? 'space-y-3' : ''}`}>
      {/* Emotion Statistics */}
      {emotionStats && (
        <Card>
          <CardHeader className={compact ? 'pb-3' : ''}>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Statistiques Émotionnelles
              <Badge variant="secondary">{timeRange}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{emotionStats.total}</div>
                <div className="text-sm text-muted-foreground">Analyses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{emotionStats.averageConfidence}%</div>
                <div className="text-sm text-muted-foreground">Confiance moy.</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{emotionStats.mostCommon.length}</div>
                <div className="text-sm text-muted-foreground">Émotions types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {emotionStats.mostCommon[0]?.percentage || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Dominante</div>
              </div>
            </div>

            {showTrends && emotionStats.mostCommon.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Émotions principales</h4>
                {emotionStats.mostCommon.map(({ emotion, count, percentage }, index) => (
                  <div key={emotion} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{emotion}</span>
                      <span>{count} fois ({percentage}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      {filteredInsights.length > 0 && (
        <Card>
          <CardHeader className={compact ? 'pb-3' : ''}>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              Insights IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredInsights.slice(0, compact ? 3 : 6).map((insight, index) => {
                const Icon = INSIGHT_ICONS[insight.type];
                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg border ${PRIORITY_COLORS[insight.priority]}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{insight.title}</h4>
                          {insight.trend && (
                            <div className="flex-shrink-0">
                              {insight.trend === 'up' ? (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              ) : insight.trend === 'down' ? (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                              ) : (
                                <div className="w-3 h-3 bg-gray-400 rounded-full" />
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-xs opacity-80">{insight.description}</p>
                        {insight.value !== undefined && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              {insight.value}%
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions based on insights */}
      {filteredInsights.some(i => i.actionable) && (
        <Card>
          <CardHeader className={compact ? 'pb-3' : ''}>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Actions Recommandées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredInsights
                .filter(insight => insight.actionable)
                .slice(0, 3)
                .map((insight, index) => (
                  <motion.button
                    key={insight.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full text-left p-3 rounded-lg border border-muted hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-medium text-sm">{insight.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Cliquez pour commencer
                    </div>
                  </motion.button>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

EmotionInsights.displayName = 'EmotionInsights';