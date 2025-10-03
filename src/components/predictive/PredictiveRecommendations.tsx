
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PredictiveRecommendationsProps {
  maxRecommendations?: number;
  showControls?: boolean;
  className?: string;
}

const PredictiveRecommendations: React.FC<PredictiveRecommendationsProps> = ({
  maxRecommendations = 3,
  showControls = true,
  className
}) => {
  const recommendations = [
    {
      id: '1',
      title: 'Méditation guidée recommandée',
      description: 'Basée sur vos tendances émotionnelles récentes',
      icon: Brain
    },
    {
      id: '2',
      title: 'Playlist pour concentration',
      description: 'Optimale pour votre période de travail actuelle',
      icon: Brain
    },
    {
      id: '3',
      title: 'Rappel de pause',
      description: 'Une pause courte pourrait améliorer votre productivité',
      icon: Brain
    }
  ];
  
  const displayRecommendations = recommendations.slice(0, maxRecommendations);
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-primary/5 pb-3">
        <CardTitle className="flex items-center text-lg">
          <Brain className="h-5 w-5 mr-2 text-primary" />
          Recommandations personnalisées
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {displayRecommendations.map(rec => (
            <div key={rec.id} className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <h4 className="font-medium">{rec.title}</h4>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
            </div>
          ))}
        </div>
        
        {showControls && (
          <div className="mt-4 flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Basé sur votre profil émotionnel</p>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              Voir tout
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictiveRecommendations;
