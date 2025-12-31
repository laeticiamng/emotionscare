/**
 * ScanInsightsPanel - Affiche les insights émotionnels générés par l'IA
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Lightbulb, TrendingUp, Brain, AlertTriangle, Trophy, 
  ChevronRight, X, RefreshCw, Loader2 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useScanHistory } from '@/hooks/useScanHistory';
import { emotionInsightsGenerator, EmotionInsight } from '@/lib/scan/insightsGenerator';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const insightTypeConfig: Record<EmotionInsight['type'], { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  pattern: { icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  trend: { icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  recommendation: { icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  warning: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
  achievement: { icon: Trophy, color: 'text-green-500', bg: 'bg-green-500/10' }
};

const priorityColors: Record<EmotionInsight['priority'], string> = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
};

export const ScanInsightsPanel: React.FC = () => {
  const { user } = useAuth();
  const { data: history = [] } = useScanHistory(50);
  const navigate = useNavigate();
  const [insights, setInsights] = useState<EmotionInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Générer les insights
  useEffect(() => {
    if (!user || history.length === 0) {
      setIsLoading(false);
      return;
    }

    const generateInsights = async () => {
      setIsLoading(true);
      try {
        await emotionInsightsGenerator.initialize(user.id);

        // Préparer le contexte
        const recentScans = history.map(s => ({
          id: s.id,
          valence: s.valence,
          arousal: s.arousal,
          emotion: (s as any).emotion || 'neutre',
          source: s.source,
          timestamp: s.created_at
        }));

        const weeklyScans = recentScans.filter(s => {
          const scanDate = new Date(s.timestamp);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return scanDate >= weekAgo;
        });

        const monthlyScans = recentScans.filter(s => {
          const scanDate = new Date(s.timestamp);
          const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          return scanDate >= monthAgo;
        });

        const weeklyAvgValence = weeklyScans.reduce((a, s) => a + s.valence, 0) / (weeklyScans.length || 1);
        const weeklyAvgArousal = weeklyScans.reduce((a, s) => a + s.arousal, 0) / (weeklyScans.length || 1);
        const monthlyAvgValence = monthlyScans.reduce((a, s) => a + s.valence, 0) / (monthlyScans.length || 1);
        const monthlyAvgArousal = monthlyScans.reduce((a, s) => a + s.arousal, 0) / (monthlyScans.length || 1);

        const emotionCounts: Record<string, number> = {};
        recentScans.forEach(s => {
          emotionCounts[s.emotion] = (emotionCounts[s.emotion] || 0) + 1;
        });
        const topEmotions = Object.entries(emotionCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([e]) => e);

        // Calculer le trend
        const recentWeekAvg = weeklyScans.slice(0, 7).reduce((a, s) => a + s.valence, 0) / (weeklyScans.slice(0, 7).length || 1);
        const previousWeekAvg = weeklyScans.slice(7, 14).reduce((a, s) => a + s.valence, 0) / (weeklyScans.slice(7, 14).length || 1);
        const trend = recentWeekAvg > previousWeekAvg + 5 ? 'up' : recentWeekAvg < previousWeekAvg - 5 ? 'down' : 'stable';

        // Calculer le streak
        const sortedDates = [...new Set(monthlyScans.map(s => new Date(s.timestamp).toDateString()))].sort();
        let streakDays = 0;
        const today = new Date().toDateString();
        for (let i = sortedDates.length - 1; i >= 0; i--) {
          const expected = new Date(Date.now() - (sortedDates.length - 1 - i) * 24 * 60 * 60 * 1000).toDateString();
          if (sortedDates[i] === expected || i === sortedDates.length - 1) {
            streakDays++;
          } else {
            break;
          }
        }

        const context = {
          recentScans,
          weeklyStats: {
            avgValence: weeklyAvgValence,
            avgArousal: weeklyAvgArousal,
            scanCount: weeklyScans.length,
            topEmotions,
            trend: trend as 'up' | 'down' | 'stable'
          },
          monthlyStats: {
            avgValence: monthlyAvgValence,
            avgArousal: monthlyAvgArousal,
            scanCount: monthlyScans.length,
            streakDays,
            bestDay: '',
            worstDay: ''
          }
        };

        const newInsights = await emotionInsightsGenerator.generateInsights(context);
        setInsights(newInsights.slice(0, 10));
      } catch (error) {
        console.error('Error generating insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateInsights();
  }, [user, history]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Force regeneration
    if (user) {
      await emotionInsightsGenerator.initialize(user.id);
    }
    setIsRefreshing(false);
  };

  const handleDismiss = async (id: string) => {
    await emotionInsightsGenerator.dismissInsight(id);
    setInsights(prev => prev.filter(i => i.id !== id));
  };

  const handleAction = (insight: EmotionInsight) => {
    if (insight.action?.path) {
      navigate(insight.action.path);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0 && history.length < 5) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Insights personnalisés
          </CardTitle>
          <CardDescription>
            Continuez vos scans pour débloquer des insights
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Effectuez au moins 5 scans pour recevoir des insights personnalisés sur votre bien-être émotionnel.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Insights personnalisés
            </CardTitle>
            <CardDescription>
              {insights.length} insight{insights.length > 1 ? 's' : ''} basé{insights.length > 1 ? 's' : ''} sur vos scans
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <AnimatePresence mode="popLayout">
            <div className="space-y-3">
              {insights.map((insight, index) => {
                const config = insightTypeConfig[insight.type];
                const Icon = config.icon;

                return (
                  <motion.div
                    key={insight.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-lg border p-4 ${config.bg} transition-all hover:shadow-sm`}
                  >
                    <div className="flex gap-3">
                      <div className={`flex-shrink-0 mt-0.5 ${config.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm">{insight.title}</h4>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Badge 
                              variant="secondary" 
                              className={`text-[10px] px-1.5 py-0 ${priorityColors[insight.priority]}`}
                            >
                              {insight.priority === 'high' ? 'Important' : insight.priority === 'medium' ? 'Suggéré' : 'Info'}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => handleDismiss(insight.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {insight.description}
                        </p>
                        {insight.actionable && insight.action && (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 mt-2 text-xs gap-1"
                            onClick={() => handleAction(insight)}
                          >
                            {insight.action.label}
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ScanInsightsPanel;
