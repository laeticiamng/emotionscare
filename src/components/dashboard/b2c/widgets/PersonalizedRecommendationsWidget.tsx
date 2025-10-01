// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Music, Book, Sparkles } from 'lucide-react';

export const PersonalizedRecommendationsWidget: React.FC = () => {
  const recommendations = [
    {
      id: 1,
      type: 'exercise',
      title: 'Exercice de respiration',
      description: 'Technique 4-7-8 pour réduire le stress',
      duration: '5 min',
      difficulty: 'Facile',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      id: 2,
      type: 'music',
      title: 'Playlist Sérénité',
      description: 'Musique adaptée à votre humeur actuelle',
      duration: '30 min',
      difficulty: 'Relaxant',
      icon: Music,
      color: 'text-purple-500'
    },
    {
      id: 3,
      type: 'journal',
      title: 'Écriture gratitude',
      description: 'Notez 3 choses positives de votre journée',
      duration: '10 min',
      difficulty: 'Simple',
      icon: Book,
      color: 'text-orange-500'
    },
    {
      id: 4,
      type: 'mindfulness',
      title: 'Méditation guidée',
      description: 'Session personnalisée selon vos besoins',
      duration: '15 min',
      difficulty: 'Intermédiaire',
      icon: Brain,
      color: 'text-blue-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Recommandations IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec) => (
          <div key={rec.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className={`p-2 rounded-full bg-muted ${rec.color}`}>
              <rec.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{rec.title}</h4>
              <p className="text-xs text-muted-foreground truncate">{rec.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {rec.duration}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {rec.difficulty}
                </Badge>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Essayer
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
