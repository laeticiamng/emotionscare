
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowRight, Star } from 'lucide-react';

export const RecommendationsWidget: React.FC = () => {
  const recommendations = [
    {
      title: 'Session de respiration',
      description: 'Basé sur votre niveau de stress actuel',
      type: 'Respiration',
      priority: 'high',
      action: 'Commencer'
    },
    {
      title: 'Playlist Relaxation',
      description: 'Musique adaptée à votre humeur',
      type: 'Musique',
      priority: 'medium',
      action: 'Écouter'
    },
    {
      title: 'Écriture créative',
      description: 'Exercice pour libérer vos pensées',
      type: 'Journal',
      priority: 'low',
      action: 'Écrire'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          Recommandations IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, index) => (
          <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm">{rec.title}</h4>
              <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                {rec.type}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{rec.description}</p>
            <Button size="sm" variant="outline" className="w-full">
              {rec.action}
              <ArrowRight className="h-3 w-3 ml-2" />
            </Button>
          </div>
        ))}
        
        <div className="flex items-center justify-center pt-2">
          <Star className="h-4 w-4 text-yellow-500 mr-1" />
          <span className="text-xs text-muted-foreground">
            Recommandations mises à jour en temps réel
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
