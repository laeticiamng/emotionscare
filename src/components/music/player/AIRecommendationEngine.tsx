import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Heart, Clock, Zap } from 'lucide-react';
import { useMusicCompat } from '@/hooks/useMusicCompat';
import { MusicTrack, MusicPlaylist } from '@/types/music';

interface AIRecommendation {
  id: string;
  type: 'mood' | 'activity' | 'time' | 'energy' | 'discovery';
  title: string;
  description: string;
  tracks: MusicTrack[];
  confidence: number;
  reason: string;
}

interface AIRecommendationEngineProps {
  className?: string;
}

const AIRecommendationEngine: React.FC<AIRecommendationEngineProps> = ({ className }) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    preferredGenres: ['ambient', 'electronic', 'classical'],
    energyLevel: 'medium',
    moodHistory: ['calm', 'focused', 'relaxed'],
    timeContext: 'evening'
  });
  
  const music = useMusicCompat();
  const { currentTrack, playlist } = music.state;

  // Simulation d'IA générant des recommandations
  const generateAIRecommendations = async () => {
    setIsGenerating(true);
    
    // Simulation d'un délai d'API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockRecommendations: AIRecommendation[] = [
      {
        id: '1',
        type: 'mood',
        title: 'Détente Nocturne',
        description: 'Musique apaisante basée sur votre historique d\'écoute du soir',
        tracks: [
          {
            id: 'ai-1',
            title: 'Midnight Reflections',
            artist: 'AI Composer',
            duration: 240,
            url: '/sounds/ambient-calm.mp3',
            emotion: 'calm'
          },
          {
            id: 'ai-2', 
            title: 'Gentle Waves',
            artist: 'Neural Symphony',
            duration: 300,
            url: '/sounds/ambient-calm.mp3',
            emotion: 'peaceful'
          }
        ],
        confidence: 0.92,
        reason: 'Basé sur vos habitudes d\'écoute entre 20h et 22h'
      },
      {
        id: '2',
        type: 'energy',
        title: 'Boost de Productivité',
        description: 'Rythmes optimaux pour maintenir la concentration',
        tracks: [
          {
            id: 'ai-3',
            title: 'Focus Flow',
            artist: 'Productivity AI',
            duration: 180,
            url: '/sounds/ambient-calm.mp3',
            emotion: 'focused'
          }
        ],
        confidence: 0.87,
        reason: 'Tempo et fréquences optimisées pour la concentration'
      },
      {
        id: '3',
        type: 'discovery',
        title: 'Nouvelle Découverte',
        description: 'Artistes émergents dans vos genres préférés',
        tracks: [
          {
            id: 'ai-4',
            title: 'Quantum Harmony',
            artist: 'Echo Chamber',
            duration: 270,
            url: '/sounds/ambient-calm.mp3',
            emotion: 'curious'
          }
        ],
        confidence: 0.78,
        reason: 'Analyse de similarité avec vos morceaux favoris'
      }
    ];
    
    setRecommendations(mockRecommendations);
    setIsGenerating(false);
  };

  useEffect(() => {
    generateAIRecommendations();
  }, [currentTrack]);

  const getTypeIcon = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'mood': return Heart;
      case 'activity': return TrendingUp;
      case 'time': return Clock;
      case 'energy': return Zap;
      case 'discovery': return Sparkles;
      default: return Sparkles;
    }
  };

  const getTypeColor = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'mood': return 'bg-pink-500/10 text-pink-600 border-pink-200';
      case 'activity': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'time': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'energy': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'discovery': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Recommandations IA
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateAIRecommendations}
          disabled={isGenerating}
        >
          {isGenerating ? 'Génération...' : 'Actualiser'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isGenerating ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          recommendations.map((rec) => {
            const Icon = getTypeIcon(rec.type);
            return (
              <div key={rec.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <h4 className="font-medium">{rec.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={getTypeColor(rec.type)}
                    >
                      {rec.type}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round(rec.confidence * 100)}% confiance
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">{rec.description}</p>
                
                <div className="text-xs text-muted-foreground italic">
                  💡 {rec.reason}
                </div>
                
                <div className="space-y-2">
                  {rec.tracks.slice(0, 2).map((track) => (
                    <div key={track.id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">{track.title}</span>
                        <span className="text-muted-foreground ml-2">- {track.artist}</span>
                      </div>
                      <Button size="sm" variant="ghost">
                        Écouter
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
        
        {/* Préférences utilisateur */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h5 className="font-medium mb-2">Vos préférences détectées</h5>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Genres favoris:</span>
              <div className="flex gap-1 mt-1">
                {userPreferences.preferredGenres.map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Contexte actuel:</span>
              <span className="ml-2 capitalize">{userPreferences.timeContext} • {userPreferences.energyLevel} énergie</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendationEngine;
