// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Sparkles, Music, Heart, Zap, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Recommendation {
  id: string;
  title: string;
  artist: string;
  matchScore: number;
  reason: string;
  mood: string;
}

const AIRecommendationEngine: React.FC = () => {
  const [energyLevel, setEnergyLevel] = useState(50);
  const [moodFocus, setMoodFocus] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: '1',
      title: 'Calm Waters',
      artist: 'Ambient Dreams',
      matchScore: 95,
      reason: 'Basé sur votre humeur actuelle',
      mood: 'relaxation'
    },
    {
      id: '2',
      title: 'Morning Light',
      artist: 'Peaceful Sounds',
      matchScore: 88,
      reason: 'Similaire à vos favoris',
      mood: 'focus'
    },
    {
      id: '3',
      title: 'Deep Focus',
      artist: 'Concentration Music',
      matchScore: 82,
      reason: 'Idéal pour votre moment',
      mood: 'productivity'
    }
  ]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      relaxation: 'bg-blue-500/20 text-blue-400',
      focus: 'bg-purple-500/20 text-purple-400',
      productivity: 'bg-green-500/20 text-green-400',
      energy: 'bg-orange-500/20 text-orange-400',
      calm: 'bg-cyan-500/20 text-cyan-400'
    };
    return colors[mood] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Contrôles IA */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Paramètres de recommandation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Niveau d'énergie
              </label>
              <span className="text-sm text-muted-foreground">{energyLevel}%</span>
            </div>
            <Slider
              value={[energyLevel]}
              onValueChange={(v) => setEnergyLevel(v[0])}
              max={100}
              step={1}
              className="w-full"
              aria-label="Niveau d'énergie"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Focus émotionnel
              </label>
              <span className="text-sm text-muted-foreground">{moodFocus}%</span>
            </div>
            <Slider
              value={[moodFocus]}
              onValueChange={(v) => setMoodFocus(v[0])}
              max={100}
              step={1}
              className="w-full"
              aria-label="Focus émotionnel"
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            className="w-full"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Générer des recommandations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Liste des recommandations */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Recommandations personnalisées
        </h3>
        
        {recommendations.map((rec) => (
          <Card 
            key={rec.id} 
            className="hover:bg-accent/50 transition-colors cursor-pointer group"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium truncate">{rec.title}</h4>
                    <Badge className={cn("text-xs", getMoodColor(rec.mood))}>
                      {rec.mood}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {rec.artist}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {rec.reason}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Badge variant="secondary" className="font-mono">
                    {rec.matchScore}%
                  </Badge>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      aria-label="J'aime"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      aria-label="Je n'aime pas"
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendationEngine;
