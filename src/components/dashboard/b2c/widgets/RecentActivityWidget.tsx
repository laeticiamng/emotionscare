// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Music, MessageCircle, Book } from 'lucide-react';

export const RecentActivityWidget: React.FC = () => {
  const activities = [
    {
      type: 'scan',
      title: 'Scan émotionnel complété',
      time: 'Il y a 2h',
      score: 'Calme - 78%',
      icon: Activity,
      color: 'text-blue-500'
    },
    {
      type: 'music',
      title: 'Session musicothérapie',
      time: 'Il y a 5h',
      score: '25 min',
      icon: Music,
      color: 'text-purple-500'
    },
    {
      type: 'journal',
      title: 'Entrée journal',
      time: 'Hier',
      score: 'Réflexion positive',
      icon: Book,
      color: 'text-orange-500'
    },
    {
      type: 'coach',
      title: 'Chat avec IA Coach',
      time: 'Il y a 2 jours',
      score: 'Conseils stress',
      icon: MessageCircle,
      color: 'text-green-500'
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité Récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                  <Badge variant="secondary" className="text-xs">
                    {activity.score}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
