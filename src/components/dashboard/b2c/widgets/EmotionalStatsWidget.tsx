
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, TrendingUp, Calendar, Award } from 'lucide-react';

export const EmotionalStatsWidget: React.FC = () => {
  const stats = [
    { label: 'Score Bien-être', value: 78, icon: Heart, color: 'text-red-500' },
    { label: 'Progression', value: 12, icon: TrendingUp, color: 'text-green-500', suffix: '%' },
    { label: 'Séries', value: 7, icon: Calendar, color: 'text-blue-500', suffix: ' jours' },
    { label: 'Badges', value: 15, icon: Award, color: 'text-purple-500' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Statistiques Émotionnelles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
              <span className="text-sm font-bold">
                {stat.value}{stat.suffix || ''}
              </span>
            </div>
            {index === 0 && (
              <Progress value={stat.value} className="h-2" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
