/**
 * Panel d'insights et patterns SEUIL
 * Affiche les tendances et recommandations personnalisées
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Calendar,
  Sparkles,
  Target,
  AlertCircle
} from 'lucide-react';
import { useSeuilStats } from '../hooks/useSeuilStats';
import type { SeuilPattern } from '../hooks/useSeuilStats';

interface SeuilInsightsPanelProps {
  compact?: boolean;
}

export const SeuilInsightsPanel: React.FC<SeuilInsightsPanelProps> = memo(({ compact = false }) => {
  const { data: stats, isLoading } = useSeuilStats();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="h-32" />
      </Card>
    );
  }

  if (!stats || stats.totalEvents < 3) {
    return (
      <Card className="border-dashed bg-muted/20">
        <CardContent className="p-6 text-center">
          <Lightbulb className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Continue à utiliser SEUIL pour débloquer des insights personnalisés.
            <br />
          <span className="text-xs">Encore {3 - (stats?.totalEvents || 0)} session(s)</span>
          </p>
        </CardContent>
      </Card>
    );
  }

  const insights = generateInsights(stats);

  if (compact) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{insights[0]?.title}</p>
              <p className="text-xs text-muted-foreground">{insights[0]?.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Insights personnalisés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.map((insight, idx) => (
            <InsightItem key={idx} insight={insight} delay={idx * 0.1} />
          ))}
        </CardContent>
      </Card>

      {/* Patterns détectés */}
      {stats.patterns.length > 0 && (
        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-500" />
              Patterns détectés
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.patterns.map((pattern, idx) => (
              <PatternCard key={idx} pattern={pattern} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommandation principale */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm mb-1">Conseil du moment</p>
              <p className="text-sm text-muted-foreground">
                {getPersonalizedTip(stats)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

SeuilInsightsPanel.displayName = 'SeuilInsightsPanel';

interface Insight {
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'positive' | 'neutral' | 'attention';
}

function generateInsights(stats: NonNullable<ReturnType<typeof useSeuilStats>['data']>): Insight[] {
  const insights: Insight[] = [];

  // Trend insight
  if (stats.lastWeekComparison.change !== 0) {
    const improving = stats.lastWeekComparison.change < 0;
    insights.push({
      title: improving ? 'Tendance positive' : 'Attention à toi',
      description: improving 
        ? `Ton niveau moyen a baissé de ${Math.abs(stats.lastWeekComparison.change).toFixed(0)}% cette semaine.`
        : `Ton niveau moyen a augmenté de ${stats.lastWeekComparison.change.toFixed(0)}% cette semaine.`,
      icon: improving ? <TrendingDown className="w-4 h-4 text-emerald-500" /> : <TrendingUp className="w-4 h-4 text-amber-500" />,
      type: improving ? 'positive' : 'attention',
    });
  }

  // Streak insight
  if (stats.currentStreak >= 3) {
    insights.push({
      title: `${stats.currentStreak} jours consécutifs`,
      description: 'Tu maintiens une pratique régulière d\'auto-observation.',
      icon: <Calendar className="w-4 h-4 text-primary" />,
      type: 'positive',
    });
  }

  // Time pattern
  if (stats.mostCommonTime) {
    insights.push({
      title: 'Moment récurrent',
      description: `Tu utilises souvent SEUIL ${stats.mostCommonTime.toLowerCase()}.`,
      icon: <Clock className="w-4 h-4 text-indigo-500" />,
      type: 'neutral',
    });
  }

  // Completion rate
  if (stats.completionRate >= 80) {
    insights.push({
      title: 'Engagement fort',
      description: `${Math.round(stats.completionRate)}% de tes sessions sont complétées.`,
      icon: <Target className="w-4 h-4 text-emerald-500" />,
      type: 'positive',
    });
  } else if (stats.completionRate < 50 && stats.totalEvents >= 5) {
    insights.push({
      title: 'Sessions incomplètes',
      description: 'Essaie de terminer les sessions pour un meilleur suivi.',
      icon: <AlertCircle className="w-4 h-4 text-amber-500" />,
      type: 'attention',
    });
  }

  return insights.slice(0, 4);
}

function getPersonalizedTip(stats: NonNullable<ReturnType<typeof useSeuilStats>['data']>): string {
  const tips: string[] = [];

  if (stats.zoneDistribution.critical > stats.zoneDistribution.low) {
    tips.push('Tu sembles souvent atteindre des zones critiques. Essaie d\'utiliser SEUIL plus tôt dans la journée.');
  }
  
  if (stats.completionRate < 60) {
    tips.push('Prendre le temps de compléter les sessions t\'aidera à mieux comprendre tes patterns.');
  }

  if (stats.currentStreak === 0 && stats.longestStreak > 3) {
    tips.push('Tu as déjà maintenu une série de ' + stats.longestStreak + ' jours. Tu peux y revenir.');
  }

  if (stats.averageLevel > 60) {
    tips.push('Ton niveau moyen est élevé. Pense à utiliser SEUIL dès les premiers signes de tension.');
  }

  if (tips.length === 0) {
    tips.push('Continue d\'écouter tes signaux. L\'auto-observation régulière est la clé.');
  }

  return tips[0];
}

const InsightItem: React.FC<{ insight: Insight; delay: number }> = memo(({ insight, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className={`flex items-start gap-3 p-3 rounded-lg ${
      insight.type === 'positive' ? 'bg-emerald-500/10' :
      insight.type === 'attention' ? 'bg-amber-500/10' :
      'bg-muted/50'
    }`}
  >
    <div className="mt-0.5">{insight.icon}</div>
    <div>
      <p className="text-sm font-medium">{insight.title}</p>
      <p className="text-xs text-muted-foreground">{insight.description}</p>
    </div>
  </motion.div>
));

InsightItem.displayName = 'InsightItem';

const PatternCard: React.FC<{ pattern: SeuilPattern }> = memo(({ pattern }) => (
  <div className="flex items-start gap-2 p-2 rounded bg-muted/30">
    <span className="text-sm">
      {pattern.type === 'improvement' ? '🌿' : 
       pattern.type === 'time' ? '⏰' : 
       pattern.type === 'day' ? '📅' : '📊'}
    </span>
    <p className="text-xs text-muted-foreground">{pattern.description}</p>
    {pattern.confidence && pattern.confidence > 0.8 && (
      <Badge variant="outline" className="ml-auto text-xs">Fiable</Badge>
    )}
  </div>
));

PatternCard.displayName = 'PatternCard';

export default SeuilInsightsPanel;
