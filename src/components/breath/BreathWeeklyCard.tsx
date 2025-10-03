import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wind, Activity, Brain, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BreathWeeklyCardProps {
  weekStart: string;
  coherenceAvg?: number;
  hrvStressIdx?: number;
  mindfulnessAvg?: number;
  relaxIdx?: number;
  mvpaWeek?: number;
  moodScore?: number;
  className?: string;
}

/**
 * Affiche les métriques hebdomadaires de respiration et cohérence cardiaque
 */
export const BreathWeeklyCard: React.FC<BreathWeeklyCardProps> = ({
  weekStart,
  coherenceAvg,
  hrvStressIdx,
  mindfulnessAvg,
  relaxIdx,
  mvpaWeek,
  moodScore,
  className = '',
}) => {
  const weekDate = new Date(weekStart);
  const formattedWeek = format(weekDate, "'Semaine du' d MMMM yyyy", { locale: fr });
  
  const getCoherenceLevel = (score?: number) => {
    if (!score) return { label: 'N/A', color: 'bg-muted text-muted-foreground' };
    if (score >= 80) return { label: 'Excellente', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    if (score >= 60) return { label: 'Bonne', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
    if (score >= 40) return { label: 'Modérée', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
    return { label: 'Faible', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' };
  };

  const coherenceLevel = getCoherenceLevel(coherenceAvg);

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wind className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>Métriques Breath</span>
          </CardTitle>
          <Badge variant="secondary" className={coherenceLevel.color}>
            {coherenceLevel.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{formattedWeek}</p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Coherence & HRV */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              <p className="text-xs font-medium text-muted-foreground">Cohérence</p>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {coherenceAvg ? `${coherenceAvg.toFixed(1)}%` : 'N/A'}
            </p>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              <p className="text-xs font-medium text-muted-foreground">HRV Stress</p>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {hrvStressIdx ? `${hrvStressIdx.toFixed(1)}` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Mindfulness & Relaxation */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              <p className="text-xs font-medium text-muted-foreground">Pleine conscience</p>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {mindfulnessAvg ? `${mindfulnessAvg.toFixed(1)}` : 'N/A'}
            </p>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Wind className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              <p className="text-xs font-medium text-muted-foreground">Relaxation</p>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {relaxIdx ? `${relaxIdx.toFixed(1)}` : 'N/A'}
            </p>
          </div>
        </div>

        {/* MVPA & Mood */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">Activité physique</p>
              <p className="text-sm font-semibold text-foreground">
                {mvpaWeek ? `${mvpaWeek} min` : 'N/A'}
              </p>
            </div>
          </div>
          
          {moodScore !== undefined && moodScore !== null && (
            <div className="text-right">
              <p className="text-xs font-medium text-muted-foreground">Humeur</p>
              <p className="text-sm font-semibold text-foreground">
                {moodScore.toFixed(1)}/10
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
