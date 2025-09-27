
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Heart, Clock, Star, Shuffle } from 'lucide-react';

interface MusicRecommendation {
  id: string;
  title: string;
  artist: string;
  duration: number;
  mood: string;
  genre: string;
  reason: string;
  isFavorite?: boolean;
}

interface EnhancedMusicRecommendationsProps {
  currentMood?: string;
  className?: string;
}

const EnhancedMusicRecommendations: React.FC<EnhancedMusicRecommendationsProps> = ({
  currentMood = 'calm',
  className = ''
}) => {
  const [recommendations, setRecommendations] = useState<MusicRecommendation[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Simulate AI-generated recommendations based on mood
    const mockRecommendations: MusicRecommendation[] = [
      {
        id: '1',
        title: 'Sérénité Matinale',
        artist: 'Ambient Dreams',
        duration: 240,
        mood: currentMood,
        genre: 'Ambient',
        reason: 'Idéal pour votre état actuel de calme'
      },
      {
        id: '2',
        title: 'Focus Flow',
        artist: 'Concentration Collective',
        duration: 300,
        mood: currentMood,
        genre: 'Lo-fi',
        reason: 'Aide à maintenir la concentration'
      },
      {
        id: '3',
        title: 'Énergie Positive',
        artist: 'Motivation Music',
        duration: 180,
        mood: 'energetic',
        genre: 'Upbeat',
        reason: 'Pour booster votre énergie'
      }
    ];
    setRecommendations(mockRecommendations);
  }, [currentMood]);

  const toggleFavorite = (trackId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(trackId)) {
        newFavorites.delete(trackId);
      } else {
        newFavorites.add(trackId);
      }
      return newFavorites;
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recommandations IA</span>
          <Button variant="ghost" size="sm">
            <Shuffle className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((track) => (
          <div key={track.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20"
            >
              <Play className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{track.title}</h4>
              <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
              <p className="text-xs text-muted-foreground mt-1">{track.reason}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {track.genre}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(track.duration)}
                </span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFavorite(track.id)}
              className={favorites.has(track.id) ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}
            >
              <Heart className={`h-4 w-4 ${favorites.has(track.id) ? 'fill-current' : ''}`} />
            </Button>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Historique d'écoute</span>
            <Button variant="link" size="sm">Voir tout</Button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">Vous avez écouté 12h cette semaine</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedMusicRecommendations;
