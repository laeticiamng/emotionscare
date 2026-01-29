/**
 * PatternCard - Affiche un pattern émotionnel détecté
 */

import React, { memo } from 'react';
import { TrendingUp, Clock, Calendar, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { EmotionPattern } from '../types';

interface PatternCardProps {
  pattern: EmotionPattern;
  className?: string;
}

const FREQUENCY_LABELS: Record<EmotionPattern['frequency'], string> = {
  daily: 'Quotidien',
  weekly: 'Hebdomadaire',
  monthly: 'Mensuel',
};

const TIME_LABELS: Record<NonNullable<EmotionPattern['time_of_day']>, string> = {
  morning: 'Matin',
  afternoon: 'Après-midi',
  evening: 'Soir',
  night: 'Nuit',
};

const DAY_LABELS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const PatternCard: React.FC<PatternCardProps> = memo(({ pattern, className }) => {
  const confidencePercent = Math.round(pattern.confidence * 100);

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h4 className="font-semibold text-sm">{pattern.name}</h4>
          </div>
          <Badge variant="outline" className="text-xs">
            {FREQUENCY_LABELS[pattern.frequency]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{pattern.description}</p>

        {/* Emotions involved */}
        <div className="flex flex-wrap gap-1">
          {pattern.emotions.map((emotion) => (
            <Badge key={emotion} variant="secondary" className="text-xs">
              {emotion}
            </Badge>
          ))}
        </div>

        {/* Time context */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {pattern.time_of_day && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {TIME_LABELS[pattern.time_of_day]}
            </div>
          )}
          {pattern.day_of_week && pattern.day_of_week.length > 0 && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {pattern.day_of_week.map((d) => DAY_LABELS[d]).join(', ')}
            </div>
          )}
        </div>

        {/* Triggers */}
        {pattern.triggers.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3" />
              Déclencheurs
            </div>
            <div className="flex flex-wrap gap-1">
              {pattern.triggers.slice(0, 3).map((trigger) => (
                <Badge key={trigger} variant="outline" className="text-xs">
                  {trigger}
                </Badge>
              ))}
              {pattern.triggers.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{pattern.triggers.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Confidence */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Confiance</span>
            <span className="font-medium">{confidencePercent}%</span>
          </div>
          <Progress value={confidencePercent} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
});

PatternCard.displayName = 'PatternCard';

export default PatternCard;
