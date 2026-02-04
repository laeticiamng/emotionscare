/**
 * EmotionTrendsChart - Graphique de tendances émotionnelles
 * Visualise l'évolution des émotions sur une période
 */

import React, { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import type { EmotionTrend } from '../index';

interface EmotionTrendsChartProps {
  trends: EmotionTrend[];
  period?: '7d' | '14d' | '30d' | '90d';
  onPeriodChange?: (period: string) => void;
  showStability?: boolean;
  highlightEmotion?: string;
}

const EMOTION_COLORS: Record<string, string> = {
  joy: 'hsl(var(--chart-1))',
  sadness: 'hsl(var(--chart-2))',
  anger: 'hsl(var(--destructive))',
  fear: 'hsl(var(--chart-4))',
  surprise: 'hsl(var(--chart-5))',
  disgust: 'hsl(var(--chart-3))',
  neutral: 'hsl(var(--muted-foreground))',
};

const PERIODS = [
  { value: '7d', label: '7 jours' },
  { value: '14d', label: '14 jours' },
  { value: '30d', label: '30 jours' },
  { value: '90d', label: '3 mois' },
];

export const EmotionTrendsChart = memo<EmotionTrendsChartProps>(({
  trends,
  period = '7d',
  onPeriodChange,
  showStability = true,
  highlightEmotion
}) => {
  // Calculer les statistiques globales
  const stats = useMemo(() => {
    if (trends.length === 0) return null;

    const totalSessions = trends.reduce((sum, t) => sum + t.session_count, 0);
    const avgStability = trends.reduce((sum, t) => sum + t.mood_stability, 0) / trends.length;
    
    // Émotion dominante globale
    const emotionCounts: Record<string, number> = {};
    trends.forEach(t => {
      emotionCounts[t.dominant_emotion] = (emotionCounts[t.dominant_emotion] || 0) + 1;
    });
    const dominantEmotion = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral';

    // Tendance (comparaison première vs dernière moitié)
    const midPoint = Math.floor(trends.length / 2);
    const firstHalf = trends.slice(0, midPoint);
    const secondHalf = trends.slice(midPoint);

    const avgFirst = firstHalf.reduce((sum, t) => sum + (t.average_scores.joy || 0), 0) / (firstHalf.length || 1);
    const avgSecond = secondHalf.reduce((sum, t) => sum + (t.average_scores.joy || 0), 0) / (secondHalf.length || 1);
    const trendDirection = avgSecond > avgFirst + 5 ? 'up' : avgSecond < avgFirst - 5 ? 'down' : 'stable';

    return {
      totalSessions,
      avgStability: Math.round(avgStability),
      dominantEmotion,
      trendDirection,
      trendValue: Math.abs(Math.round(avgSecond - avgFirst)),
    };
  }, [trends]);

  // Trouver le max pour normaliser
  const maxValue = useMemo(() => {
    let max = 0;
    trends.forEach(t => {
      Object.values(t.average_scores).forEach(score => {
        if (score > max) max = score;
      });
    });
    return max || 100;
  }, [trends]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  if (trends.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <BarChart3 className="h-12 w-12 mb-3 opacity-50" />
          <p className="text-sm font-medium">Aucune donnée disponible</p>
          <p className="text-xs">Effectuez des scans émotionnels pour voir vos tendances</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Tendances Émotionnelles
            </CardTitle>
            <CardDescription>Évolution de votre bien-être sur la période</CardDescription>
          </div>
          
          {/* Sélecteur de période */}
          {onPeriodChange && (
            <div className="flex gap-1">
              {PERIODS.map((p) => (
                <Button
                  key={p.value}
                  variant={period === p.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onPeriodChange(p.value)}
                  className="text-xs h-7"
                >
                  {p.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Statistiques résumées */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-6 p-3 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalSessions}</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold capitalize">
                {stats.dominantEmotion === 'joy' ? '😊' : 
                 stats.dominantEmotion === 'sadness' ? '😢' : 
                 stats.dominantEmotion === 'anger' ? '😠' : 
                 stats.dominantEmotion === 'fear' ? '😨' : '😐'}
              </div>
              <div className="text-xs text-muted-foreground">Dominante</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold flex items-center justify-center gap-1">
                {stats.trendDirection === 'up' && <TrendingUp className="h-5 w-5 text-green-500" />}
                {stats.trendDirection === 'down' && <TrendingDown className="h-5 w-5 text-destructive" />}
                {stats.trendDirection === 'stable' && <Minus className="h-5 w-5 text-muted-foreground" />}
                {stats.trendValue > 0 && <span className="text-sm">{stats.trendValue}%</span>}
              </div>
              <div className="text-xs text-muted-foreground">Tendance</div>
            </div>
            {showStability && (
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.avgStability}%</div>
                <div className="text-xs text-muted-foreground">Stabilité</div>
              </div>
            )}
          </div>
        )}

        {/* Graphique en barres */}
        <div className="space-y-1">
          {trends.map((trend) => {
            // Top 3 émotions pour ce jour
            const topEmotions = Object.entries(trend.average_scores)
              .filter(([, score]) => score > 0)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3);

            return (
              <div key={trend.date} className="flex items-center gap-3">
                {/* Date */}
                <div className="w-16 text-xs text-muted-foreground text-right shrink-0">
                  {formatDate(trend.date)}
                </div>
                
                {/* Barres d'émotions empilées */}
                <div className="flex-1 flex gap-0.5 h-8 rounded overflow-hidden bg-muted/30">
                  {topEmotions.map(([emotion, score]) => (
                    <div
                      key={emotion}
                      className={`
                        transition-all relative group
                        ${highlightEmotion && highlightEmotion !== emotion ? 'opacity-30' : ''}
                      `}
                      style={{
                        width: `${(score / maxValue) * 100}%`,
                        backgroundColor: EMOTION_COLORS[emotion] || EMOTION_COLORS.neutral,
                      }}
                      title={`${emotion}: ${Math.round(score)}%`}
                    >
                      {score > 15 && (
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white/90">
                          {Math.round(score)}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Sessions du jour */}
                <div className="w-8 text-center shrink-0">
                  <Badge variant="outline" className="text-xs h-5 px-1">
                    {trend.session_count}
                  </Badge>
                </div>

                {/* Stabilité */}
                {showStability && (
                  <div className="w-12 text-right text-xs text-muted-foreground shrink-0">
                    {trend.mood_stability}%
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Légende */}
        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          {Object.entries(EMOTION_COLORS).slice(0, 6).map(([emotion, color]) => (
            <button
              key={emotion}
              className={`
                flex items-center gap-1.5 text-xs px-2 py-1 rounded-full transition-all
                ${highlightEmotion === emotion ? 'ring-2 ring-primary' : 'hover:bg-muted'}
              `}
            >
              <div 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: color }} 
              />
              <span className="capitalize">{emotion}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

EmotionTrendsChart.displayName = 'EmotionTrendsChart';

export default EmotionTrendsChart;
