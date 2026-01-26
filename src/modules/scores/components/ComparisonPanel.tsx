/**
 * ComparisonPanel - Comparaison entre périodes
 */
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, TrendingDown, Minus, Calendar, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { UserScore } from '../types';

interface ComparisonPanelProps {
  scores: UserScore[];
}

type PeriodType = 'week' | '2weeks' | 'month' | 'quarter';

const PERIOD_OPTIONS: { value: PeriodType; label: string; weeks: number }[] = [
  { value: 'week', label: '1 semaine', weeks: 1 },
  { value: '2weeks', label: '2 semaines', weeks: 2 },
  { value: 'month', label: '1 mois', weeks: 4 },
  { value: 'quarter', label: '3 mois', weeks: 12 },
];

export default function ComparisonPanel({ scores }: ComparisonPanelProps) {
  const [periodType, setPeriodType] = useState<PeriodType>('month');

  const comparison = useMemo(() => {
    const period = PERIOD_OPTIONS.find(p => p.value === periodType);
    if (!period || scores.length < period.weeks * 2) {
      return null;
    }

    const currentPeriod = scores.slice(0, period.weeks);
    const previousPeriod = scores.slice(period.weeks, period.weeks * 2);

    if (currentPeriod.length === 0 || previousPeriod.length === 0) {
      return null;
    }

    const calcAvg = (arr: UserScore[], key: keyof UserScore) => 
      arr.reduce((sum, s) => sum + (Number(s[key]) || 0), 0) / arr.length;

    const currentEmotional = calcAvg(currentPeriod, 'emotional_score');
    const previousEmotional = calcAvg(previousPeriod, 'emotional_score');
    const currentWellbeing = calcAvg(currentPeriod, 'wellbeing_score');
    const previousWellbeing = calcAvg(previousPeriod, 'wellbeing_score');
    const currentEngagement = calcAvg(currentPeriod, 'engagement_score');
    const previousEngagement = calcAvg(previousPeriod, 'engagement_score');

    const currentOverall = (currentEmotional + currentWellbeing + currentEngagement) / 3;
    const previousOverall = (previousEmotional + previousWellbeing + previousEngagement) / 3;

    return {
      emotional: {
        current: Math.round(currentEmotional),
        previous: Math.round(previousEmotional),
        change: Math.round(currentEmotional - previousEmotional),
        percentChange: previousEmotional > 0 
          ? Math.round(((currentEmotional - previousEmotional) / previousEmotional) * 100) 
          : 0
      },
      wellbeing: {
        current: Math.round(currentWellbeing),
        previous: Math.round(previousWellbeing),
        change: Math.round(currentWellbeing - previousWellbeing),
        percentChange: previousWellbeing > 0 
          ? Math.round(((currentWellbeing - previousWellbeing) / previousWellbeing) * 100) 
          : 0
      },
      engagement: {
        current: Math.round(currentEngagement),
        previous: Math.round(previousEngagement),
        change: Math.round(currentEngagement - previousEngagement),
        percentChange: previousEngagement > 0 
          ? Math.round(((currentEngagement - previousEngagement) / previousEngagement) * 100) 
          : 0
      },
      overall: {
        current: Math.round(currentOverall),
        previous: Math.round(previousOverall),
        change: Math.round(currentOverall - previousOverall),
        percentChange: previousOverall > 0 
          ? Math.round(((currentOverall - previousOverall) / previousOverall) * 100) 
          : 0
      },
      periodLabel: period.label
    };
  }, [scores, periodType]);

  const renderComparison = (
    label: string,
    data: { current: number; previous: number; change: number; percentChange: number },
    color: string
  ) => {
    const trend = data.change > 0 ? 'up' : data.change < 0 ? 'down' : 'stable';
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const trendColor = trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg bg-muted/30"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium">{label}</span>
          <div className={cn("flex items-center gap-1 text-sm font-semibold", trendColor)}>
            <TrendIcon className="h-4 w-4" />
            {data.change > 0 ? '+' : ''}{data.change}
            <span className="text-xs text-muted-foreground">({data.percentChange > 0 ? '+' : ''}{data.percentChange}%)</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Previous */}
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Avant</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-muted-foreground">{data.previous}</span>
              <Progress value={data.previous} className="flex-1 h-2 bg-muted" />
            </div>
          </div>
          
          {/* Arrow */}
          <ArrowRight className={cn("h-5 w-5", trendColor)} />
          
          {/* Current */}
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Maintenant</p>
            <div className="flex items-center gap-2">
              <span className={cn("text-xl font-bold", color)}>{data.current}</span>
              <Progress value={data.current} className={cn("flex-1 h-2", color.replace('text-', 'bg-'))} />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Comparaison
            </CardTitle>
            <CardDescription>Comparez votre progression entre périodes</CardDescription>
          </div>
          <Select value={periodType} onValueChange={(v) => setPeriodType(v as PeriodType)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map(p => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {!comparison ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Pas assez de données pour comparer</p>
            <p className="text-sm">Continuez à utiliser l'app pour générer des comparaisons</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">
                Comparaison sur {comparison.periodLabel}
              </p>
            </div>
            
            {renderComparison('Score Global', comparison.overall, 'text-primary')}
            {renderComparison('Émotionnel', comparison.emotional, 'text-rose-500')}
            {renderComparison('Bien-être', comparison.wellbeing, 'text-teal-500')}
            {renderComparison('Engagement', comparison.engagement, 'text-violet-500')}
            
            {/* Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={cn(
                "p-4 rounded-lg text-center mt-6",
                comparison.overall.change > 0 ? "bg-emerald-500/10" : 
                comparison.overall.change < 0 ? "bg-red-500/10" : "bg-muted/30"
              )}
            >
              {comparison.overall.change > 5 ? (
                <p className="text-emerald-600 font-medium">
                  🚀 Excellente progression ! Vous vous améliorez de {comparison.overall.percentChange}%
                </p>
              ) : comparison.overall.change > 0 ? (
                <p className="text-emerald-600 font-medium">
                  📈 Bonne progression ! Continuez sur cette lancée.
                </p>
              ) : comparison.overall.change < -5 ? (
                <p className="text-amber-600 font-medium">
                  💪 Période difficile ? N'hésitez pas à explorer nos modules de bien-être.
                </p>
              ) : comparison.overall.change < 0 ? (
                <p className="text-amber-600 font-medium">
                  🌱 Léger recul, mais chaque jour est une nouvelle chance !
                </p>
              ) : (
                <p className="text-muted-foreground font-medium">
                  ⚖️ Stabilité parfaite. Votre équilibre est maintenu.
                </p>
              )}
            </motion.div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
