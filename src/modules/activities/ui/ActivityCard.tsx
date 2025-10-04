/**
 * Carte d'activité
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Clock, TrendingUp } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelect: () => void;
}

export const ActivityCard = ({
  activity,
  isFavorite,
  onToggleFavorite,
  onSelect
}: ActivityCardProps) => {
  const categoryColors: Record<string, string> = {
    relaxation: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    physical: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    creative: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    social: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    mindfulness: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    nature: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
  };

  const difficultyColors: Record<string, string> = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  const IconComponent = activity.icon ? (Icons as any)[activity.icon] : Icons.Activity;

  return (
    <Card className="relative hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
            <CardTitle className="text-lg">{activity.title}</CardTitle>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleFavorite}
            className="h-8 w-8 p-0"
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{activity.description}</p>

        <div className="flex flex-wrap gap-2">
          <Badge className={categoryColors[activity.category]}>
            {activity.category}
          </Badge>
          <Badge className={difficultyColors[activity.difficulty]}>
            {activity.difficulty}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            {activity.duration_minutes} min
          </Badge>
        </div>

        {activity.benefits.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Bénéfices
            </p>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              {activity.benefits.slice(0, 3).map((benefit, i) => (
                <li key={i}>• {benefit}</li>
              ))}
            </ul>
          </div>
        )}

        <Button onClick={onSelect} className="w-full">
          Commencer
        </Button>
      </CardContent>
    </Card>
  );
};
