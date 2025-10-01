// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Star, Target, Zap } from 'lucide-react';

export const WeeklyInsightsWidget: React.FC = () => {
  const insights = [
    {
      type: 'positive',
      title: 'Excellente semaine !',
      description: 'Votre bien-être s\'améliore de 15% cette semaine',
      icon: Star,
      color: 'bg-green-100 text-green-800'
    },
    {
      type: 'recommendation',
      title: 'Conseil personnalisé',
      description: 'Essayez la méditation le matin pour plus de sérénité',
      icon: Lightbulb,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      type: 'goal',
      title: 'Objectif atteint',
      description: '7 scans émotionnels cette semaine - Bravo !',
      icon: Target,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      type: 'streak',
      title: 'Série de 12 jours',
      description: 'Continuez votre routine quotidienne',
      icon: Zap,
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights de la Semaine</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
            <div className={`p-2 rounded-full ${insight.color}`}>
              <insight.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{insight.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {insight.type}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
