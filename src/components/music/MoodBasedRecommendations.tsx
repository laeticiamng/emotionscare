
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface MoodBasedRecommendationsProps {
  mood?: string;
  className?: string;
  intensity?: number;
  standalone?: boolean;
}

const MoodBasedRecommendations: React.FC<MoodBasedRecommendationsProps> = ({ 
  mood = 'calm',
  className = '',
  intensity = 0.5,
  standalone = false
}) => {
  // We'll ensure this function always returns a JSX.Element
  const renderRecommendation = (): JSX.Element => {
    switch (mood) {
      case 'calm':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Musique apaisante pour favoriser la concentration et la sérénité.
            </p>
            <Button size="sm" className="gap-2">
              <Play className="h-4 w-4" /> Écouter la playlist
            </Button>
          </div>
        );
      case 'stressed':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Sons relaxants pour réduire l'anxiété et retrouver le calme.
            </p>
            <Button size="sm" className="gap-2">
              <Play className="h-4 w-4" /> Écouter la playlist
            </Button>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Musique personnalisée pour accompagner votre humeur.
            </p>
            <Button size="sm" className="gap-2">
              <Play className="h-4 w-4" /> Explorer les playlists
            </Button>
          </div>
        );
    }
  };

  // Return proper JSX here to avoid "objects are not valid as React child" error
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recommandations musicales</CardTitle>
      </CardHeader>
      <CardContent>
        {renderRecommendation()}
      </CardContent>
    </Card>
  );
};

export default MoodBasedRecommendations;
