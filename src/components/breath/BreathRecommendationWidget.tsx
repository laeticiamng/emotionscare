import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wind, Clock, Zap, Heart, Sun, Moon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBreathSessions } from '@/hooks/useBreathSessions';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  pattern: string;
  duration: number;
  icon: React.ReactNode;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

interface BreathRecommendationWidgetProps {
  onStartSession?: (pattern: string, duration: number) => void;
  className?: string;
}

export const BreathRecommendationWidget: React.FC<BreathRecommendationWidgetProps> = ({
  onStartSession,
  className,
}) => {
  const { stats, sessions } = useBreathSessions();

  const recommendations = useMemo((): Recommendation[] => {
    const hour = new Date().getHours();
    const isMorning = hour >= 6 && hour < 12;
    const isAfternoon = hour >= 12 && hour < 18;
    const isEvening = hour >= 18 || hour < 6;

    const recs: Recommendation[] = [];

    // Time-based recommendations
    if (isMorning) {
      recs.push({
        id: 'morning-energy',
        title: 'Réveil Énergisant',
        description: 'Commence ta journée avec énergie',
        pattern: '4-2-4',
        duration: 180,
        icon: <Sun className="h-5 w-5 text-warning" />,
        reason: 'Idéal le matin pour booster ton énergie',
        priority: 'high',
      });
    }

    if (isAfternoon) {
      recs.push({
        id: 'focus-boost',
        title: 'Focus Boost',
        description: 'Retrouve ta concentration',
        pattern: '5-5',
        duration: 300,
        icon: <Zap className="h-5 w-5 text-info" />,
        reason: 'Parfait pour regagner en focus après le déjeuner',
        priority: 'high',
      });
    }

    if (isEvening) {
      recs.push({
        id: 'evening-calm',
        title: 'Détente du Soir',
        description: 'Prépare-toi à une nuit paisible',
        pattern: '4-6-8',
        duration: 420,
        icon: <Moon className="h-5 w-5 text-primary" />,
        reason: 'Relaxation profonde pour bien dormir',
        priority: 'high',
      });
    }

    // Stats-based recommendations
    if (stats.currentStreak === 0 && stats.totalSessions > 0) {
      recs.push({
        id: 'restart-streak',
        title: 'Relance ta Série',
        description: 'Une session courte pour reprendre',
        pattern: '5-5',
        duration: 180,
        icon: <Sparkles className="h-5 w-5 text-warning" />,
        reason: 'Tu avais une série, reprends-la !',
        priority: 'high',
      });
    }

    if (stats.weeklyMinutes < 30) {
      recs.push({
        id: 'weekly-goal',
        title: 'Objectif Hebdo',
        description: 'Contribue à ton objectif de la semaine',
        pattern: '5-5',
        duration: 300,
        icon: <Heart className="h-5 w-5 text-destructive" />,
        reason: `Seulement ${stats.weeklyMinutes} min cette semaine`,
        priority: 'medium',
      });
    }

    // Pattern variety
    const recentPatterns = sessions.slice(0, 5).map(s => s.pattern);
    const usedPatterns = new Set(recentPatterns);
    
    if (!usedPatterns.has('4-6-8')) {
      recs.push({
        id: 'try-relaxation',
        title: 'Essaie 4-6-8',
        description: 'Technique de relaxation profonde',
        pattern: '4-6-8',
        duration: 300,
        icon: <Wind className="h-5 w-5 text-success" />,
        reason: 'Tu n\'as pas essayé ce pattern récemment',
        priority: 'low',
      });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]).slice(0, 3);
  }, [stats, sessions]);

  const handleStart = (rec: Recommendation) => {
    onStartSession?.(rec.pattern, rec.duration);
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className={cn('border-border/50 bg-card/40', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Recommandations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map(rec => (
          <div
            key={rec.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex-shrink-0 p-2 rounded-lg bg-background/50">
              {rec.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-foreground text-sm">{rec.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {rec.pattern}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>
              <p className="text-xs text-primary/80 mt-1">{rec.reason}</p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleStart(rec)}
              className="flex-shrink-0"
            >
              <Clock className="h-3 w-3 mr-1" />
              {Math.round(rec.duration / 60)}min
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BreathRecommendationWidget;
